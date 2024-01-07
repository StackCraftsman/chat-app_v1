// Import the functions above
import {addCommentToPost, toggleLikeToPost, makePost, getPostsForUser, getPostForUser } from '../controllers/post.js';
import { Router } from "express";

const post_router = Router();

// Add routes for user posts



post_router.post('/create-post/:user_id', makePost);
post_router.get('/get-posts/:user_id', getPostsForUser);
post_router.get('/get-post/:user_id/:post_id', getPostForUser);

post_router.post('/comment/:user_id/:post_id', addCommentToPost);
post_router.get('/like/:user_id/:post_id',  toggleLikeToPost);

export default post_router;