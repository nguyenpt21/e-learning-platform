import mongoose from "mongoose";
import Course from "../models/course.js";
import User from "../models/user.js";
import Lecture from "../models/lecture.js";
import cloudinary from "../config/cloudinary.js";
import Section from "../models/section.js";
import Quiz from "../models/quiz.js";
import { ObjectId } from "mongodb";

import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import VideoConversion from "../models/videoConvertion.js";

const lambda = new LambdaClient({
    region: process.env.AWS_REGION || "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("sections.sectionId").lean();

        if (!course) return res.status(404).json({ message: "Course not found" });
        if (course.status !== "published") {
            return res.status(403).json({ message: "Course is not published" });
        }

        const lectureIds = [];
        const quizIds = [];
        course.sections.forEach(({ sectionId }) => {
            sectionId?.curriculumItems?.forEach(({ itemType, itemId }) => {
                if (itemType === "Lecture") lectureIds.push(itemId);
                else if (itemType === "Quiz") quizIds.push(itemId);
            });
        });
        const [lectures, quizzes] = await Promise.all([
            Lecture.find({ _id: { $in: lectureIds } }).lean(),
            Quiz.find({ _id: { $in: quizIds } }).lean(),
        ]);

        const lectureMap = Object.fromEntries(lectures.map((l) => [l._id.toString(), l]));
        const quizMap = Object.fromEntries(quizzes.map((q) => [q._id.toString(), q]));

        const sections = course.sections
            .filter((s) => s.sectionId)
            .map(({ sectionId, order }) => ({
                ...sectionId,
                order,
                curriculumItems:
                    sectionId.curriculumItems
                        ?.map(({ itemType, itemId }) => {
                            const itemData =
                                itemType === "Lecture"
                                    ? lectureMap[itemId.toString()]
                                    : quizMap[itemId.toString()];
                            if (!itemData) return null;
                            return {
                                itemType,
                                ...itemData,
                            };
                        })
                        .filter(Boolean) || [],
            }));

        res.status(200).json({ ...course, sections });
    } catch (error) {
        console.error("getCourseById error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getCourseInfo = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) return res.status(404).json({ message: "Course not found" });

        res.status(200).json(course);
    } catch (error) {
        console.error("getCourseById error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const createCourse = async (req, res) => {
    try {
        // const instructorId = req.user._id;
        const { title, category } = req.body;

        const course = await Course.create({
            title,
            category,
        });
        res.status(201).json(course);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const fields = [
            "learningOutcomes",
            "requirements",
            "intendedLearners",
            "title",
            "subtitle",
            "description",
            "language",
            "level",
            "category",
            "subcategory",
            "price",
            "isPublished",
            "thumbnail",
            "promoVideo",
            "sections",
        ];
        const updateData = {};
        fields.forEach((key) => {
            if (req.body[key] !== undefined) {
                updateData[key] = req.body[key];
            }
        });

        if (updateData.price !== undefined) {
            updateData.isFree = updateData.price > 0 ? false : true;
        }
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
            new: true,
        });
        res.status(200).json(updatedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("sections");
        if (!course) return res.status(404).json({ message: "Course not found" });
        for (const section of course.sections) {
            for (const item of section.curriculumItems) {
                if (item.itemType === "Lecture") {
                    await Lecture.findByIdAndDelete(item.itemId);
                } else if (item.itemType === "Quiz") {
                    await Quiz.findByIdAndDelete(item.itemId);
                }
            }
            await Section.findByIdAndDelete(section._id);
        }
        if (course.thumbnail?.public_id) {
            await cloudinary.uploader.destroy(course.thumbnail.public_id);
        }
        await Course.findByIdAndDelete(courseId);
        res.status(200).json({ message: "Course and associated content deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const checkCoursePublishRequirements = async (course) => {
    const errors = [];

    if (!course.title || course.title.trim() === "") {
        errors.push("Tiêu đề khóa học là bắt buộc");
    }

    if (!course.description || course.description.replace(/<(.|\n)*?>/g, "").trim() === "") {
        errors.push("Mô tả khóa học là bắt buộc");
    }

    if (!course.level) {
        errors.push("Cấp độ khóa học là bắt buộc");
    }

    if (!course.category || course.category.trim() === "") {
        errors.push("Danh mục khóa học là bắt buộc");
    }

    if (!course.learningOutcomes || course.learningOutcomes.length < 4) {
        errors.push("Cần ít nhất 4 mục tiêu học tập");
    } else {
        const validOutcomes = course.learningOutcomes.filter(
            (outcome) => outcome && outcome.trim() !== ""
        );
        if (validOutcomes.length < 4) {
            errors.push("Cần ít nhất 4 mục tiêu học tập hợp lệ");
        }
    }

    if (!course.requirements || course.requirements.length < 1) {
        errors.push("Cần ít nhất 1 yêu cầu cho khóa học");
    } else {
        const validRequirements = course.requirements.filter((req) => req && req.trim() !== "");
        if (validRequirements.length < 1) {
            errors.push("Cần ít nhất 1 yêu cầu hợp lệ cho khóa học");
        }
    }

    if (!course.intendedLearners || course.intendedLearners.length < 1) {
        errors.push("Cần ít nhất 1 đối tượng học viên");
    } else {
        const validLearners = course.intendedLearners.filter(
            (learner) => learner && learner.trim() !== ""
        );
        if (validLearners.length < 1) {
            errors.push("Cần ít nhất 1 đối tượng học viên hợp lệ");
        }
    }

    if (!course.sections || course.sections.length === 0) {
        errors.push("Khóa học cần có ít nhất 1 chương");
    } else {
        for (const section of course.sections) {
            const sectionDetail = await Section.findById(section.sectionId);
            if (
                !sectionDetail ||
                !sectionDetail.curriculumItems ||
                sectionDetail.curriculumItems.length === 0
            ) {
                errors.push(
                    `Chương ${section.order}: "${
                        sectionDetail?.title || section.sectionId
                    }" cần có ít nhất 1 bài học hoặc quiz`
                );
                break;
            }
        }
    }

    const hasVideo = await checkHasAtLeastOneVideo(course);
    if (!hasVideo) {
        errors.push("Khóa học cần có ít nhất 1 video bài giảng");
    }

    if (course.isFree === false && (!course.price || course.price <= 0)) {
        errors.push("Khóa học trả phí cần có giá hợp lệ");
    }

    return {
        isValid: errors.length === 0,
        errors: errors,
    };
};


const checkHasAtLeastOneVideo = async (courseId) => {
    const result = await Section.aggregate([
        { $match: { course: new ObjectId(courseId) } },
        { $unwind: "$curriculumItems" },
        { $match: { "curriculumItems.itemType": "Lecture" } },
        {
            $lookup: {
                from: "lectures",
                localField: "curriculumItems.itemId",
                foreignField: "_id",
                as: "lecture",
            },
        },
        { $unwind: "$lecture" },
        {
            $match: {
                "lecture.type": "video",
                "lecture.content.publicURL": { $exists: true, $ne: null },
            },
        },
        { $limit: 1 },
    ]);

    return result.length > 0;
};

const getAllVideoS3KeysByCourse = async (courseId) => {
    try {
        const result = await Section.aggregate([
            { $match: { course: new ObjectId(courseId) } },
            { $unwind: "$curriculumItems" },
            { $match: { "curriculumItems.itemType": "Lecture" } },
            {
                $lookup: {
                    from: "lectures",
                    localField: "curriculumItems.itemId",
                    foreignField: "_id",
                    as: "lecture",
                },
            },
            { $unwind: "$lecture" },
            {
                $match: {
                    "lecture.type": "video",
                    "lecture.content.s3Key": { $exists: true, $nin: [null, ""] },
                    "lecture.content.hlsURL": { $exists: false },
                },
            },
            {
                $project: {
                    _id: 0,
                    s3Key: "$lecture.content.s3Key",
                },
            },
        ]);

        return result.map((r) => r.s3Key);
    } catch (error) {
        console.error("Lỗi khi lấy S3 keys:", error);
        return null;
    }
};

const processCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId).populate("sections.sectionId");

        if (!course) {
            return res.json({
                success: false,
                message: "Không tìm thấy khóa học",
            });
        }

        const checkResult = await checkCoursePublishRequirements(course);

        if (!checkResult.isValid) {
            return res.json({
                success: false,
                message: "Không thể phát hành khóa học",
                errors: checkResult.errors,
            });
        }

        const s3Keys = await getAllVideoS3KeysByCourse(courseId);

        if (s3Keys.length === 0) {
            course.status = "published";
            await course.save();

            return res.json({
                success: true,
                message: "Khóa học đã được phát hành thành công",
            });
        }

        const videoConversion = await VideoConversion.create({
            courseId: courseId,
            s3Keys: s3Keys,
            totalVideos: s3Keys.length,
            processedVideos: 0,
        });

        const payload = {
            s3Keys: s3Keys,
            bucket: process.env.AWS_S3_BUCKET_NAME,
            outputPrefix: "hls-output",
            jobId: videoConversion._id,
        };


        const command = new InvokeCommand({
            FunctionName: process.env.LAMBDA_FUNCTION_NAME || "video-hls-orchestrator",
            InvocationType: "RequestResponse",
            Payload: JSON.stringify(payload),
        });

        const lambdaResponse = await lambda.send(command);

        const responsePayload = JSON.parse(Buffer.from(lambdaResponse.Payload).toString());

        if (responsePayload.statusCode !== 200) {
            throw new Error(`Lambda failed: ${responsePayload.body}`);
        }

        course.status = "processing";
        await course.save();

        return res.json({
            success: true,
            state: "processing",
            message: "Các video trong khóa học đang được xử lý",
        });

    } catch (error) {
        console.error("Lỗi khi phát hành khóa học:", error);
        return res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi phát hành khóa học",
        });
    }
};

const getCourses = async (req, res) => {
    try {
        const { sort, search, category, level, isPublished, isFree } = req.query;

        let sortOption = {};
        switch (sort) {
            case "newest":
                sortOption = { createdAt: -1 };
                break;
            case "oldest":
                sortOption = { createdAt: 1 };
                break;
            case "A-Z":
                sortOption = { title: 1 };
                break;
            case "Z-A":
                sortOption = { title: -1 };
                break;
            default:
                sortOption = {};
        }

        const filter = {};
        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }
        if (category) {
            filter.category = category;
        }
        if (level) {
            filter.level = level;
        }
        if (isPublished !== undefined) {
            filter.isPublished = isPublished === "true";
        }
        if (isFree !== undefined) {
            filter.isFree = isFree === "true";
        }

        const courses = await Course.find(filter).sort(sortOption);

        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const {
            courseDuration,
            level,
            category,
            subcategory,
            language,
            isFree,
            minPrice,
            maxPrice,
            avarageRating,
            sort,
            page,
            limit,
        } = req.query;

        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit) || 6;
        const skip = (pageNumber - 1) * pageSize;

        let filter = { isPublished: true };
        if (courseDuration) {
            const durations = courseDuration.split(",");
            const durationFilters = durations
                .map((d) => {
                    switch (d.trim()) {
                        case "0-3":
                            return { courseDuration: { $gte: 0, $lte: 3 } };
                        case "3-6":
                            return { courseDuration: { $gte: 3, $lte: 6 } };
                        case "6-17":
                            return { courseDuration: { $gte: 6, $lte: 17 } };
                        case "17-more":
                            return { courseDuration: { $gte: 17 } };
                        default:
                            return null;
                    }
                })
                .filter(Boolean);
            if (durationFilters.length > 0) {
                filter.$or = durationFilters;
            }
        }
        if (level) {
            const levelArr = level.split(",");
            if (!levelArr.includes("All Level")) {
                filter.level = { $in: levelArr };
            }
        }
        if (category) {
            filter.category = { $in: category.split(",") };
        }
        if (subcategory) {
            filter.subcategory = { $in: subcategory.split(",") };
        }
        if (language) {
            filter.language = { $in: language.split(",") };
        }
        if (isFree) {
            filter.isFree = isFree === "true";
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }
        if (avarageRating) {
            filter.averageRating = { $gte: parseFloat(avarageRating) };
        }

        let sortOption = {};
        if (sort) {
            switch (sort) {
                case "newest":
                    sortOption = { createdAt: -1 };
                    break;
                case "oldest":
                    sortOption = { createdAt: 1 };
                    break;
                case "priceLowToHigh":
                    sortOption = { price: 1 };
                    break;
                case "priceHighToLow":
                    sortOption = { price: -1 };
                    break;
                case "ratingHighToLow":
                    sortOption = { averageRating: -1 };
                    break;
                case "A-Z":
                    sortOption = { title: 1 };
                    break;
                case "Z-A":
                    sortOption = { title: -1 };
                    break;
                default:
                    sortOption = {};
            }
        }
        const courses = await Course.find(filter).sort(sortOption).skip(skip).limit(pageSize);

        const totalCourses = await Course.countDocuments(filter);

        res.status(200).json({
            totalCourses,
            totalPages: Math.ceil(totalCourses / pageSize),
            currentPage: pageNumber,
            pageSize,
            data: courses,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getSearchCourseSuggestion = async (req, res) => {
    try {
        const { q } = req.query;
        const normalizedQuery = (q || "").trim().toLowerCase();
        if (!q) return res.json({ keywords: [], courses: [] });

        const coursePipeline = [
            {
                $search: {
                    index: "course_search",
                    text: {
                        query: normalizedQuery,
                        path: [
                            "title", "subtitle", "description",
                            "category", "subcategory"
                        ],
                        fuzzy: {},
                    },
                },
            },
            {
                $match: { status: "published" },
            },
            {
                $limit: 4,
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    thumbnail: 1,
                    language: 1,
                    level: 1,
                    category: 1,
                    subcategory: 1,
                },
            },
        ];

        const keywordPipeline = [
            {
                $search: {
                    index: "course_search",
                    text: {
                        query: normalizedQuery,
                        path: [
                            "title", "subtitle", "description", "learningOutcomes",
                            "intendedLearners", "category", "subcategory", "requirements"
                        ],
                        fuzzy: {},
                    },
                },
            },
            {
                $match: { status: "published" },
            },
            {
                $limit: 10,
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    subtitle: 1,
                    category: 1,
                    subcategory: 1,
                },
            },
        ];

        const [courseResults, keywordResults] = await Promise.all([
            Course.aggregate(coursePipeline),
            Course.aggregate(keywordPipeline)
        ]);

        const keywordSet = new Set();
        keywordSet.add(normalizedQuery);
        keywordResults.forEach(item => {

            if (item.category && item.category.toLowerCase().includes(normalizedQuery)) {
                keywordSet.add(item.category.toLowerCase());
            }

            if (item.subcategory && item.subcategory.toLowerCase().includes(normalizedQuery)) {
                keywordSet.add(item.subcategory.toLowerCase());
            }

            const normalizedTitle = item.title.toLowerCase();
            if (normalizedTitle.startsWith(normalizedQuery)) {
                keywordSet.add(course.title.toLowerCase());
            }

        })
        const keywords = Array.from(keywordSet).slice(0, 6);

        res.status(200).json({
            keywords: keywords,
            courses: courseResults
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const getSearchCourseResults = async (req, res) => {
    try {
        const {
            q, courseDuration, level,
            category, language, selectedPrices,
            sort, page, limit,
        } = req.query;
        const normalizedQuery = (q || "").trim().toLowerCase();

        let matchStage = [];
        if (q) {
            matchStage = [
                {
                    $search: {
                        index: "course_search",
                        text: {
                            query: normalizedQuery,
                            path: [
                                "title", "subtitle", "description", "learningOutcomes",
                                "intendedLearners", "category", "subcategory", "requirements"
                            ],
                            fuzzy: {},
                        },
                    },
                },
                {
                    $match: { status: "published" },
                },
            ];
        }

        let filterStage = { $match: {} };

        if (selectedPrices) {
            const prices = selectedPrices.split(",");
            const priceFilters = [];
            prices.forEach(p => {
                switch (p) {
                    case "free":
                        priceFilters.push({ isFree: true });
                        break;
                    case "paid":
                        priceFilters.push({ isFree: false });
                        break;
                    case "under-300k":
                        priceFilters.push({ price: { $lte: 300000 } });
                        break;
                    case "300k-500k":
                        priceFilters.push({ price: { $gte: 300000, $lte: 500000 } });
                        break;
                    default:
                        break;
                }
            });

            if (priceFilters.length > 0) {
                filterStage.$match.$or = priceFilters;
            }
        }
        if (category) filterStage.$match.category = { $in: category.split(",") };
        if (language) filterStage.$match.language = { $in: language.split(",") };
        if (level) filterStage.$match.level = { $in: level.split(",") }

        if (courseDuration) {
            switch (courseDuration) {
                case "0-3": {
                    filterStage.$match.courseDuration = { $gte: 0, $lte: 3 };
                    break;
                }
                case "3-6": {
                    filterStage.$match.courseDuration = { $gte: 3, $lte: 6 };
                    break;
                }
                case "6-17": {
                    filterStage.$match.courseDuration = { $gte: 6, $lte: 17 };
                    break;
                }
                case "17-more": {
                    filterStage.$match.courseDuration = { $gte: 17 };
                    break;
                }
                default:
                    break;
            }
        }

        const sortOptions = {
            default: [
                { $addFields: { score: { $meta: "searchScore" } } },
                { $sort: { score: -1 } },
            ],
            new: [{ $sort: { createdAt: -1 } }],
            rating: [{ $sort: { averageRating: -1 } }],
            priceUp: [{ $sort: { price: 1 } }],
            priceDown: [{ $sort: { price: -1 } }],
        };
        const sortStage = sortOptions[sort] || sortOptions.relevance;

        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit) || 6;
        1;
        const skip = (pageNumber - 1) * pageSize;
        const pipeline = [
            ...matchStage,
            filterStage,
            ...sortStage,
            {
                $facet: {
                    results: [
                        { $skip: skip },
                        { $limit: pageSize },
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                subtitle: 1,
                                thumbnail: 1,
                                description: 1,
                                category: 1,
                                subcategory: 1,
                                level: 1,
                                language: 1,
                                learningOutcomes: 1,
                                price: 1,
                                averageRating: 1,
                                courseDuration: 1,
                                updatedAt: 1,
                            },
                        },
                    ],
                    totalCount: [
                        { $count: "total" }
                    ]
                }
            }
        ];

        const aggResult = await Course.aggregate(pipeline);

        const results = aggResult[0].results;
        const totalCourse = aggResult[0].totalCount[0]?.total || 0;
        const totalPage = Math.ceil(totalCourse / pageSize);

        res.status(200).json({
            results,
            totalCourse,
            totalPage,
            currentPage: pageNumber,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" });
    }
}


export {
    getCourseById,
    getCourses,
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseInfo,
    processCourse,
    getSearchCourseSuggestion,
    getSearchCourseResults
};
