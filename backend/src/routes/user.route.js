import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { acceptFriendRequest, getMyFriends, getPendingFriendRequests, getRecommendedUsers, sendFriendRequest } from "../controllers/user.controller.js";

const router = express.Router();


//apply protected route middleware to all routes
router.use(protectedRoute)

router.get("/",  getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getPendingFriendRequests);




export default router;
