// seedFull.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./db.js"; // your db connect helper
import User from "../models/user.js";
import Course from "../models/course.js";
import Section from "../models/section.js";
import Lecture from "../models/lecture.js";
import Quiz from "../models/quiz.js";
import Submission from "../models/submission.js";
import Order from "../models/order.js";
import Progress from "../models/progress.js";
import CourseProgress from "../models/course-progress.js";

dotenv.config();

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLongArticle(courseTitle, sectionTitle) {
    // tạo ~600-800 chữ HTML (React-Quill friendly)
    const para = `<p>${courseTitle} — ${sectionTitle}: This article explains in-depth concepts, practical tips, examples, and best practices. It is designed to provide learners with a clear understanding of the core ideas, step-by-step guidance, and recommended exercises. We describe the rationale behind each technique, common pitfalls to avoid, and how to apply the knowledge in real projects.</p>`;
    let text = `<h2>${sectionTitle} — Deep Dive</h2>`;
    for (let i = 0; i < 8; i++) {
        text += para;
    }
    text += `<p><strong>Summary:</strong> By practicing the examples and following the structured approach described above, you will be able to consolidate knowledge and apply it confidently in real-world tasks.</p>`;
    return text;
}

async function seed() {
    try {
        await connectDB();
        console.log("Connected to DB for seeding...");

        // Clear collections (safe)
        await Promise.all([
            User.deleteMany({}),
            Course.deleteMany({}),
            Section.deleteMany({}),
            Lecture.deleteMany({}),
            Quiz.deleteMany({}),
            Submission.deleteMany({}),
            Order.deleteMany({}),
            Progress.deleteMany({}),
            CourseProgress.deleteMany({}),
        ]);
        console.log("Cleared existing collections.");

        // Create users: instructor + learner
        const instructor = await User.create({
            firstName: "Alice",
            lastName: "Nguyen",
            username: "alice_instructor",
            email: "alice.instructor@example.com",
            password: "hashedpassword", // in prod use hashed password
            role: "instructor",
            major: "Computer Science",
            biography: `<p>Alice is a senior software engineer and instructor with 10 years experience building web apps.</p>`
        });

        const learner = await User.create({
            firstName: "Linh",
            lastName: "Pham",
            username: "linh_student",
            email: "linh.student@example.com",
            password: "hashedpassword",
            role: "user",
            major: "Information Technology",
            biography: `<p>Linh is a motivated learner who enjoys building full-stack projects.</p>`
        });

        // Two real YouTube video links (public)
        const youtubeSamples = [
            "https://www.youtube.com/watch?v=Ke90Tje7VS0", // React tutorial by Traversy/Net Ninja etc.
            "https://www.youtube.com/watch?v=3JluqTojuME", // Node.js tutorial
            "https://www.youtube.com/watch?v=DLX62G4lc44", // JS tutorial
            "https://www.youtube.com/watch?v=Z1ktxiqyiLA", // Another
        ];

        // Course templates
        const coursesInfo = [
            {
                title: "React Fundamentals 2025",
                subtitle: "Master React hooks, components & building real projects",
                description: `<h2>React Fundamentals</h2><p>Learn React from scratch with practical examples and projects.</p>`,
                category: "Web Development",
                subcategory: "React",
                language: "English",
                level: "Beginner",
                isFree: false,
                price: 199000,
                averageRating: 4.7,
            },
            {
                title: "Advanced Node.js & Architecture",
                subtitle: "Build scalable backend systems with Node.js",
                description: `<h2>Advanced Node.js</h2><p>Deep dive into streams, clustering, and performance.</p>`,
                category: "Web Development",
                subcategory: "Backend",
                language: "English",
                level: "Advanced",
                isFree: false,
                price: 259000,
                averageRating: 4.8,
            }
        ];

        const createdCourses = [];
        for (const info of coursesInfo) {
            const c = await Course.create({
                ...info,
                instructor: instructor._id,
                thumbnail: { url: "https://picsum.photos/seed/" + encodeURIComponent(info.title) + "/640/360" },
                learningOutcomes: ["Understand core concepts", "Build projects", "Apply best practices"],
                requirements: ["Basic programming knowledge"],
                intendedLearners: ["Developers", "Students"],
                isPublished: true,
            });
            createdCourses.push(c);
        }

        // For each course create 5 sections, each section 6+ curriculum items
        for (const course of createdCourses) {
            const sectionIds = [];
            for (let s = 1; s <= 5; s++) {
                const section = await Section.create({
                    course: course._id,
                    title: `Section ${s}: ${course.title} - Topic ${s}`,
                    order: s,
                });

                const curriculumItems = [];
                let order = 1;

                // create 2 video lectures
                for (let v = 1; v <= 2; v++) {
                    const duration = randomInt(240, 720); // seconds
                    const lecture = await Lecture.create({
                        courseId: course._id,
                        sectionId: section._id,
                        title: `${section.title} - Video Lecture ${v}`,
                        type: "video",
                        description: `Video explaining ${section.title}, part ${v}`,
                        content: {
                            videoUrl: youtubeSamples[(s + v) % youtubeSamples.length],
                            duration,
                        },
                        resources: [],
                    });

                    curriculumItems.push({
                        order: order++,
                        itemId: lecture._id,
                        itemType: "Lecture",
                    });
                }

                // create 3 article lectures (each >=500 words)
                for (let a = 1; a <= 3; a++) {
                    const articleText = generateLongArticle(course.title, section.title + ` Article ${a}`);
                    const article = await Lecture.create({
                        courseId: course._id,
                        sectionId: section._id,
                        title: `${section.title} - Article ${a}`,
                        type: "article",
                        description: `In-depth article ${a} for ${section.title}`,
                        content: {
                            text: articleText,
                            duration: 0,
                        },
                        resources: [],
                    });

                    curriculumItems.push({
                        order: order++,
                        itemId: article._id,
                        itemType: "Lecture",
                    });
                }

                // create 1 quiz with >=5 questions
                const questions = [];
                for (let q = 1; q <= 5; q++) {
                    const opts = [
                        { optionText: `Option A for q${q}` },
                        { optionText: `Option B for q${q}` },
                        { optionText: `Option C for q${q}` },
                        { optionText: `Option D for q${q}` },
                    ];
                    const correct = randomInt(0, 3);
                    questions.push({
                        questionText: `Question ${q} for ${section.title}: choose the best option.`,
                        options: opts,
                        correctAnswerIndex: correct,
                        relatedLecture: null,
                    });
                }

                const quiz = await Quiz.create({
                    courseId: course._id,
                    sectionId: section._id,
                    title: `${section.title} - Quiz`,
                    description: `Quiz for ${section.title}`,
                    questions,
                });

                curriculumItems.push({
                    order: order++,
                    itemId: quiz._id,
                    itemType: "Quiz",
                });

                // ensure we have at least 6 items (we have 2 videos +3 articles +1 quiz =6)
                section.curriculumItems = curriculumItems;
                await section.save();
                sectionIds.push(section._id);
            }

            // attach sections to course
            course.sections = sectionIds;
            await course.save();
        }

        // Create Orders: learner buys both courses
        for (const course of createdCourses) {
            await Order.create({
                userId: learner._id,
                courseId: course._id,
                isPaid: true,
                totalPrice: course.price,
                paymentMethod: "card",
            });
        }

        // Create Submissions for quizzes & Progress entries
        // For every quiz in DB, create a submission by learner with random answers and score, then create Progress entry
        const quizzes = await Quiz.find({});
        for (const quiz of quizzes) {
            // generate answers
            const answers = quiz.questions.map((q) => {
                const chosen = randomInt(0, q.options.length - 1);
                return {
                    questionId: q._id,
                    selectedOptionIndex: chosen,
                    isTrue: chosen === q.correctAnswerIndex,
                };
            });
            const correctCount = answers.filter(a => a.isTrue).length;
            const score = Math.round((correctCount / quiz.questions.length) * 100);

            const submission = await Submission.create({
                userId: learner._id,
                quizId: quiz._id,
                answers,
                score,
            });

            // create progress for quiz (completed)
            // find section id from quiz.document
            const sectionId = quiz.sectionId;
            await Progress.create({
                userId: learner._id,
                courseId: quiz.courseId,
                sectionId,
                itemId: quiz._id,
                itemType: "Quiz",
                watchedSeconds: 0,
                totalSeconds: 0,
                progressPercent: 100,
                submissionId: submission._id,
                isCompleted: true,
            });
        }

        // For lecture items (video/article) create Progress (some completed, some partial)
        const lectures = await Lecture.find({});
        for (const lec of lectures) {
            const isVideo = lec.type === "video";
            let watchedSeconds = 0;
            let totalSeconds = lec.content?.duration || 0;
            let progressPercent = 0;
            let isCompleted = false;

            if (isVideo) {
                // simulate user watched between 0 and full duration
                watchedSeconds = Math.min(totalSeconds, randomInt(Math.floor(totalSeconds * 0.3), totalSeconds));
                progressPercent = totalSeconds === 0 ? 0 : Math.round((watchedSeconds / totalSeconds) * 100);
                isCompleted = progressPercent >= 95;
            } else {
                // article: simulate some read fully, some partially
                const readFully = Math.random() > 0.5;
                progressPercent = readFully ? 100 : randomInt(10, 90);
                isCompleted = progressPercent >= 95;
                watchedSeconds = 0;
                totalSeconds = 0;
            }

            await Progress.create({
                userId: learner._id,
                courseId: lec.courseId,
                sectionId: lec.sectionId,
                itemId: lec._id,
                itemType: "Lecture",
                watchedSeconds,
                totalSeconds,
                progressPercent,
                isCompleted,
            });
        }

        // Compute CourseProgress per user+course
        for (const course of createdCourses) {
            // count total items: sum of sections' curriculumItems length
            const sections = await Section.find({ course: course._id });
            let totalItems = 0;
            for (const sec of sections) totalItems += sec.curriculumItems.length;

            const completedItems = await Progress.countDocuments({
                userId: learner._id,
                courseId: course._id,
                isCompleted: true,
            });

            const percentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
            const isCompleted = percentage >= 100;

            await CourseProgress.create({
                userId: learner._id,
                courseId: course._id,
                totalItems,
                completedItems,
                percentage,
                isCompleted,
            });
        }

        console.log("✅ Seeding complete. Inserted:");
        console.log(`- Users: 2 (instructor + learner)`);
        console.log(`- Courses: ${createdCourses.length}`);
        console.log(`- Sections, Lectures, Quizzes, Submissions, Orders, Progress, CourseProgress`);
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seed();