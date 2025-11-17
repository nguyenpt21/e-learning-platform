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
        if (!course.isPublished) {
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
        const query = q.trim();
        const matchedCourses = await Course.find({
            isPublished: true, // chỉ gợi ý khóa học đã publish
            $or: [
                { title: { $regex: query, $options: "i" } },
                { subtitle: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
                { subcategory: { $regex: query, $options: "i" } },
            ],
        })
            .select("title subtitle category subcategory thumbnail instructor")
            .limit(10)
            .populate("instructor", "firstName lastName");

        const courses = matchedCourses.map((c) => ({
            _id: c._id,
            title: c.title,
            instructor:
                `${c.instructor?.firstName || ""} ${c.instructor?.lastName || ""}`.trim() ||
                "Unknown Instructor",
            thumbnail: c.thumbnail?.url || null,
            category: c.category || null,
            subcategory: c.subcategory || null,
        }));
        res.status(200).json(courses);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const getSearchCourseResults = async (req, res) => {
    try {
        const {
            q,
            courseDuration,
            level,
            category,
            subcategory,
            language,
            isFree,
            minPrice,
            maxPrice,
            averageRating,
            sort,
            page,
            limit,
        } = req.query;

        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit) || 6;
        const skip = (pageNumber - 1) * pageSize;

        let filter = {};
        if (q && q.trim().length > 0) {
            const keyword = q.trim();
            filter.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { subtitle: { $regex: keyword, $options: "i" } },
                { category: { $regex: keyword, $options: "i" } },
                { subcategory: { $regex: keyword, $options: "i" } },
            ];
        }

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
        if (category) filter.category = { $in: category.split(",") };
        if (subcategory) filter.subcategory = { $in: subcategory.split(",") };
        if (language) filter.language = { $in: language.split(",") };
        if (isFree) filter.isFree = isFree === "true";
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }
        if (averageRating) {
            filter.averageRating = { $gte: parseFloat(averageRating) };
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

        const courses = await Course.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(pageSize)
            .populate("sections");

        const totalCourses = await Course.countDocuments(filter);

        res.status(200).json({
            query: q || "",
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

export {
    getCourseById,
    getCourses,
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseInfo,
    processCourse,
};
