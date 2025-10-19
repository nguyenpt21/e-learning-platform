import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import User from "../models/user.js";
import Course from "../models/course.js";
import Section from "../models/section.js";
import Lecture from "../models/lecture.js";
import Quiz from "../models/quiz.js";

dotenv.config();

const seedDemoData = async () => {
    try {
        await connectDB();

        // 🧹 Xoá dữ liệu cũ (nếu cần)
        await Promise.all([
            User.deleteMany({}),
            Course.deleteMany({}),
            Section.deleteMany({}),
            Lecture.deleteMany({}),
            Quiz.deleteMany({}),
        ]);

        // 👩‍🏫 Instructor
        const instructor = await User.create({
            firstName: "Alice",
            lastName: "Nguyen",
            username: "alice123",
            email: "alice@example.com",
            password: "hashedpassword123",
            role: "instructor",
            major: "Computer Science",
            biography: `
        <p>Alice Nguyen is a software engineer and instructor with over 8 years of experience in full-stack web development. 
        She has worked at several international tech companies, focusing on frontend frameworks like React, Vue, and backend 
        systems built with Node.js and Express.</p>

        <p>Her passion lies in simplifying complex technical concepts and helping students gain the confidence to build 
        real-world applications. Alice has also mentored over 5,000 students through her online coding courses and live workshops.</p>

        <p>When not teaching, she enjoys exploring new JavaScript libraries, contributing to open-source projects, and drinking coffee 
        while reading about UX design trends.</p>
      `,
            profilePicture: {
                url: "https://randomuser.me/api/portraits/women/44.jpg",
                public_id: "instructors/alice_nguyen_44",
            },
        });

        // ======================================================
        // 🧠 COURSE 1: React for Beginners
        // ======================================================
        const course1 = await Course.create({
            title: "React for Beginners",
            thumbnail: { url: "https://example.com/thumbs/react-course.jpg" },
            subtitle: "Build modern web apps with React from scratch",
            description: `
                <h2>Welcome to React for Beginners</h2>
                <p>This course provides a <strong>hands-on guide</strong> to learning React fundamentals, hooks, and project building.</p>
                <p>By the end, you'll understand how to structure React apps and manage state effectively using modern tools.</p>
                <ul>
                    <li>Understand React Components & Props</li>
                    <li>Master React Hooks like <code>useState</code> and <code>useEffect</code></li>
                    <li>Build and deploy a complete React project</li>
                </ul>
            `,
            learningOutcomes: [
                "Understand components and props",
                "Learn React hooks effectively",
                "Build a complete React project",
                "Use state management properly",
            ],
            requirements: ["Basic HTML", "CSS", "JavaScript knowledge"],
            intendedLearners: ["Frontend beginners", "Web developers starting with React"],
            instructor: instructor._id,
            language: "English",
            level: "Beginner",
            category: "Web Development",
            subcategory: "Frontend",
            isFree: false,
            isPublished: true,
            price: 209000,
            averageRating: 4.6,
        });

        const sectionTitles1 = [
            "Getting Started with React",
            "React Components and Props",
            "React Hooks Deep Dive",
        ];

        const sectionDocs1 = [];

        for (let i = 0; i < sectionTitles1.length; i++) {
            const section = await Section.create({
                course: course1._id,
                title: sectionTitles1[i],
                order: i + 1,
            });

            const curriculumItems = [];

            // 3 video lectures + 1 article + 1 quiz
            for (let j = 1; j <= 3; j++) {
                const lecture = await Lecture.create({
                    courseId: course1._id,
                    sectionId: section._id,
                    title: `${sectionTitles1[i]} - Video ${j}`,
                    type: "video",
                    description: `Learn about ${sectionTitles1[i]} - Part ${j}`,
                    content: {
                        videoUrl: `https://example.com/videos/react_${i + 1}_${j}.mp4`,
                        duration: 300 + j * 60,
                    },
                    resources: [
                        {
                            fileUrl: `https://example.com/resources/react_${i + 1}_${j}.pdf`,
                            title: `Lecture ${j} slides`,
                        },
                    ],
                });

                curriculumItems.push({
                    order: j,
                    itemId: lecture._id,
                    itemType: "Lecture",
                });
            }

            // 📝 Article Lecture
            const articleLecture = await Lecture.create({
                courseId: course1._id,
                sectionId: section._id,
                title: `${sectionTitles1[i]} - Reading Material`,
                type: "article",
                description: `In-depth reading about ${sectionTitles1[i]}`,
                content: {
                    text: `
            <h2>Understanding ${sectionTitles1[i]}</h2>
            <p>This article explains the core ideas behind ${sectionTitles1[i]} in React.</p>
            <ul>
              <li>Key principles</li>
              <li>Common mistakes</li>
              <li>Best practices</li>
            </ul>
            <p><strong>Tip:</strong> Practice by writing small components!</p>
          `,
                    duration: 60
                },
            });

            curriculumItems.push({
                order: 4,
                itemId: articleLecture._id,
                itemType: "Lecture",
            });

            // 🧩 Quiz
            const quiz = await Quiz.create({
                courseId: course1._id,
                sectionId: section._id,
                title: `${sectionTitles1[i]} Quiz`,
                description: `Test your knowledge of ${sectionTitles1[i]}`,
                questions: [
                    {
                        questionText: "What is JSX in React?",
                        options: [
                            { optionText: "A syntax extension for JavaScript", optionExplanation: "Correct!" },
                            { optionText: "A CSS preprocessor" },
                        ],
                        correctAnswerIndex: 0,
                    },
                    {
                        questionText: "Which hook is used to manage component state?",
                        options: [
                            { optionText: "useState()", optionExplanation: "Correct!" },
                            { optionText: "useEffect()" },
                        ],
                        correctAnswerIndex: 0,
                    },
                ],
            });

            curriculumItems.push({
                order: 5,
                itemId: quiz._id,
                itemType: "Quiz",
            });

            section.curriculumItems = curriculumItems;
            await section.save();
            sectionDocs1.push(section);
        }

        course1.sections = sectionDocs1.map((s) => s._id);
        await course1.save();

        // ======================================================
        // ⚙️ COURSE 2: Advanced Node.js
        // ======================================================
        const course2 = await Course.create({
            title: "Advanced Node.js",
            thumbnail: { url: "https://example.com/thumbs/node-course.jpg" },
            subtitle: "Master advanced backend concepts with Node.js",
            description: `
                <h2>Take Your Node.js Skills to the Next Level</h2>
                <p>This course dives deep into <strong>streams, clustering, events</strong>, and other advanced Node.js features.</p>
                <p>You'll learn how to build scalable systems that handle heavy traffic with confidence.</p>
                <ul>
                    <li>Understand Streams & Event Emitters</li>
                    <li>Implement clustering and load balancing</li>
                    <li>Optimize Node.js for performance</li>
                </ul>
            `,
            learningOutcomes: [
                "Work with streams and buffers",
                "Implement clustering and load balancing",
                "Build scalable REST APIs",
                "Handle performance optimization",
            ],
            requirements: ["Intermediate JavaScript", "Basic Node.js knowledge"],
            intendedLearners: ["Backend developers", "Full-stack developers"],
            instructor: instructor._id,
            language: "English",
            level: "Advanced",
            category: "Web Development",
            subcategory: "Backend",
            isFree: false,
            isPublished: true,
            price: 409000,
            averageRating: 4.8,
        });

        const sectionTitles2 = [
            "Node.js Fundamentals Refresher",
            "Working with Streams & Events",
            "Scaling Node.js Applications",
        ];

        const sectionDocs2 = [];

        for (let i = 0; i < sectionTitles2.length; i++) {
            const section = await Section.create({
                course: course2._id,
                title: sectionTitles2[i],
                order: i + 1,
            });

            const curriculumItems = [];

            // 3 video + 1 article + 1 quiz
            for (let j = 1; j <= 3; j++) {
                const lecture = await Lecture.create({
                    courseId: course2._id,
                    sectionId: section._id,
                    title: `${sectionTitles2[i]} - Video ${j}`,
                    type: "video",
                    description: `Advanced topic on ${sectionTitles2[i]} part ${j}`,
                    content: {
                        videoUrl: `https://example.com/videos/node_${i + 1}_${j}.mp4`,
                        duration: 400 + j * 60,
                    },
                    resources: [
                        {
                            fileUrl: `https://example.com/resources/node_${i + 1}_${j}.pdf`,
                            title: `Lecture ${j} materials`,
                        },
                    ],
                });

                curriculumItems.push({
                    order: j,
                    itemId: lecture._id,
                    itemType: "Lecture",
                });
            }

            // 📝 Article Lecture
            const articleLecture = await Lecture.create({
                courseId: course2._id,
                sectionId: section._id,
                title: `${sectionTitles2[i]} - Deep Dive Article`,
                type: "article",
                description: `An in-depth exploration of ${sectionTitles2[i]}`,
                content: {
                    text: `
            <h2>${sectionTitles2[i]}</h2>
            <p>In this article, we’ll discuss internal Node.js mechanisms related to ${sectionTitles2[i]}.</p>
            <p>You’ll learn how the <code>EventEmitter</code> works and how streams handle backpressure.</p>
            <h3>Best Practices</h3>
            <ul>
              <li>Use async/await for clarity</li>
              <li>Handle errors gracefully</li>
              <li>Avoid blocking the event loop</li>
            </ul>
          `,
                    duration: 60
                },
            });

            curriculumItems.push({
                order: 4,
                itemId: articleLecture._id,
                itemType: "Lecture",
            });

            // 🧩 Quiz
            const quiz = await Quiz.create({
                courseId: course2._id,
                sectionId: section._id,
                title: `${sectionTitles2[i]} Quiz`,
                description: `Check your understanding of ${sectionTitles2[i]}`,
                questions: [
                    {
                        questionText: "What is a stream in Node.js?",
                        options: [
                            { optionText: "A way of handling data flow efficiently", optionExplanation: "Correct!" },
                            { optionText: "A built-in HTTP module" },
                        ],
                        correctAnswerIndex: 0,
                    },
                    {
                        questionText: "Which module provides clustering in Node.js?",
                        options: [
                            { optionText: "cluster", optionExplanation: "Correct!" },
                            { optionText: "child_process" },
                        ],
                        correctAnswerIndex: 0,
                    },
                ],
            });

            curriculumItems.push({
                order: 5,
                itemId: quiz._id,
                itemType: "Quiz",
            });

            section.curriculumItems = curriculumItems;
            await section.save();
            sectionDocs2.push(section);
        }

        course2.sections = sectionDocs2.map((s) => s._id);
        await course2.save();

        console.log("✅ Demo data (with instructor bio & articles) seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    }
};

seedDemoData();