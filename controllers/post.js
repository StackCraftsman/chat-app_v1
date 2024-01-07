import express from 'express';
import Post from '../model/post.model.js'; 
import asyncHandler from "express-async-handler"
import mongoose from "mongoose";


const makePost = asyncHandler(async (req, res) => {
    const { desc, photo, location, friendTags, sharewithgroups, sharewithpages } = req.body;
    const userId = mongoose.Types.ObjectId(req.params.user_id);
  
    // Create an object with only the fields that are present in the request body
    const postFields = {
      desc,
      photo,
      postedBy: userId,
      location,
    };
  
    // Add optional fields if they are present
    if (friendTags) postFields.friendTags = friendTags;
    if (sharewithgroups) postFields.sharewithgroups = sharewithgroups;
    if (sharewithpages) postFields.sharewithpages = sharewithpages;
  
    const newPost = new Post(postFields);
  
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  });
  


// @desc    Get all posts for a user
// @route   GET /api/posts
// @access  Private
const getPostsForUser = asyncHandler(async (req, res) => {
    const userId = mongoose.Types.ObjectId(req.params.user_id);
    const posts = await Post.find({ postedBy: userId }).populate('postedBy', 'username');
  
    res.status(200).json(posts);
  });
  
  // @desc    Get a specific post for a user
  // @route   GET /api/posts/:postId
  // @access  Private
  const getPostForUser = asyncHandler(async (req, res) => {
    // const userId = mongoose.Types.ObjectId(req.params.user_id);
    const postId = mongoose.Types.ObjectId(req.params.post_id);
  
    const post = await Post.findOne({ _id: postId }).populate('postedBy', 'username');
  
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
    } else {
      res.status(200).json(post);
    }
  });
  
  // @desc    Delete a specific post for a user
  // @route   DELETE /api/posts/:postId
  // @access  Private
  const deletePostForUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;
  
    const post = await Post.findOne({ _id: postId, postedBy: userId });
  
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
    } else {
      await post.remove();
      res.status(204).json({ success: 'Post deleted successfully' });
    }
  });
  

  const toggleLikeToPost = asyncHandler(async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.params.user_id);
      const postId = mongoose.Types.ObjectId(req.params.post_id);
  
      const post = await Post.findById(postId);
  
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
      } else {
        const indexOfUser = post.likes.indexOf(userId);
  
        if (indexOfUser !== -1) {
          // User has already liked the post, unlike it
          post.likes.splice(indexOfUser, 1);
        } else {
          // User has not liked the post, add the like
          post.likes.push(userId);
        }
  
        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


  const addCommentToPost = asyncHandler(async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.params.user_id);
      const postId = mongoose.Types.ObjectId(req.params.post_id);
      const { text } = req.body;
  
      if (!text) {
        return res.status(400).json({ error: "Comment text is required." });
      }
  
      const comment = {
        text,
        userId,
      };
  
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment } },
        { new: true }
      );
  
      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found." });
      }
  
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
    



export { getPostsForUser, getPostForUser, deletePostForUser, addCommentToPost, toggleLikeToPost, makePost };

