import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    thumbnail: {
        url: { type: String, default: "" },
        public_id: { type: String, default: "" }
    },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    learningOutcomes: [{ 
        type: String, default: [] 
    }],
    requirements: [{ 
        type: String, default: [] 
    }],
    intendedLearners: [{ 
        type: String, default: [] 
    }],
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    language: { type: String, default: "English" },
    level: { 
        type: String, 
        enum: ["Beginner", "Intermediate", "Advanced", "All Level"], 
        default: "All Level" 
    },
    category: { type: String, default: "" },
    subcategory: { type: String, default: "" },
    isFree: { type: Boolean },
    isPublished: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    sections: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Section" 
    }],
    // courseDuration: { type: Number, default: 0 },
    // totalCurriculumItems: { type: Number, default: 0 },
}, { timestamps: true });

const Course = mongoose.model("Course", CourseSchema);
export default Course;