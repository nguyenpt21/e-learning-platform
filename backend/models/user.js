import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
        url: { type: String, default: "" },
        public_id: { type: String, default: "" }
    },
    major: { type: String, default: "" },
    biography : { type: String, default: "" },
    role: { type: String, enum: ["user", "instructor"], default: "user" },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;