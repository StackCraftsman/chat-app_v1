import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please provide your first name"],
    },
    lastName: {
        type: String,
        required: [true, "Please provide your last name"],
    },
    email: {
        type: String,
        // required: [true, "Please provide your email"],
        unique: [true, "Email Already Exists, Try Login"],
        lowercase: true,
        trim: true,
        max: 50,
    },
    phoneNumber: {
        type: String,
        unique: [true, "Phone Number Already Exists"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    address: {
        type: String,
    },   
    website: {
        type: String,
    },
    nickname: {
        type: String,
        required: [true, "Please enter your nickname"],
        min: 3,
        max: 20,
        unique: [true, "Nickname Already Exists"], 
    },   
    country: {
        type: String,
        required: [true, "Please enter your country"],
    },
    city: {
        type: String,
        required: [true, "Please enter your city"],
    },
    gender: {
        type: String,
        required: [true, "Please enter your gender"],
    },
    relationshipstatus: {
        type: String,
        required: [true, "Please enter your relationship status"],
    },
    education: {
        type: String,
        required: [true, "Please enter your education"],
    },
    job: {
        type: String,
    },
    purpose: {
        type: String,
        required: [true, "Please enter your purpose"],
    },
    interest: {
        type: String,
        required: [true, "Please enter your interest"],
    },
    dateOfBirth: {
        year: {
            type: String,
            required: [true, "Please enter your year"],
        },
        month: {
            type: String,
            required: [true, "Please enter your month"],
        },
        date: {
            type: String,
            required: [true, "Please enter your date"],
        },
    },
    aboutyourself: {
        type: String,
        min: 3,
        max: 200,
        required: [true, "Please enter your about yourself"],
    },
    coverPhoto: {
        type: String,
        default: "",
    },
    profilePhoto: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    followRequests: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },

    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    friends: {
        type: Array,
        default: [],
    },

    verifiedWith: {
        type: String,
        required: [true, "Required"],
    },

}, { timestamps: true })

export default mongoose.model.Users || mongoose.model("User", UserSchema);