import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { commentOnPost, deletePost, createPost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', protectRoute, createPost)
//router.post('/like', protectRoute, likeUnlikePost)
router.post('/comment/:id', protectRoute, commentOnPost)
router.delete('/:id',protectRoute,deletePost)

export default router;