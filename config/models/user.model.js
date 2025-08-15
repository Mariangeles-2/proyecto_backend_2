import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true,
        index: true
    },
    age: {
        type: Number,
        required: false
    },
    email:{
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: () => !this.githubId
    },
    githubId: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true } );

export const User = mongoose.model('User', userSchema);
