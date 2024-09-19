import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getSuggestedUsers, followUnfollowUser, getUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile) //:username is a dynamic value.
router.get("/suggested", protectRoute, getSuggestedUsers)
router.post("/follow/:id", protectRoute, followUnfollowUser)
//router.post("/update", protectRoute, updateUserProfile)

export default router;