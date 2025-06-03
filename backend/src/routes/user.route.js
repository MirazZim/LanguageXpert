import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getMyFriends, getRecommendedUsers } from "../controllers/user.controller.js";

const router = express.Router();


//apply protected route middleware to all routes
router.use(protectedRoute)

router.get("/",  getRecommendedUsers);
router.get("/friends", getMyFriends);

export default router;
