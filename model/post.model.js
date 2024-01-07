import mongoose from "mongoose";

export const postSchema = new mongoose.Schema(
  {
    desc: {
      type: String,
      required: [true, "Please provide a description"],
    },
    photo: {
      type: String,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId], // Define as an array of ObjectId values.
      default: [], // Set a default value as an empty array.
    },
    comments: [
      {
        text: {
          type: String,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    location: {
      type: String,
    },
    friendTags: {
      type: [mongoose.Schema.Types.ObjectId], // Define as an array of ObjectId values.
      default: [], // Set a default value as an empty array.
    },
    sharewithgroups: {
      type: [mongoose.Schema.Types.ObjectId], // Define as an array of ObjectId values.
      default: [], // Set a default value as an empty array.
    },
    sharewithpages: {
      type: [mongoose.Schema.Types.ObjectId], // Define as an array of ObjectId values.
      default: [], // Set a default value as an empty array.
    },
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Post", postSchema);
