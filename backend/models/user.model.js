import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: string,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        }
    ],

    profileImg: {
        type: string,
        default: "",
    },
    coverImg: {
        type: string,
        default:"",
    },
    bio: {
        type: string,
        default:"",
    },
    link: {
        type:string,
        default: "",
    }
}, {timestamps: true});