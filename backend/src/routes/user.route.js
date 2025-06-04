import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { acceptFriendRequest, getMyFriends, getOutgoingFriendRequests, getPendingFriendRequests, getRecommendedUsers, rejectFriendRequest, sendFriendRequest } from "../controllers/user.controller.js";

const router = express.Router();


//apply protected route middleware to all routes
router.use(protectedRoute)

router.get("/",  getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.put("/friend-request/:id/reject", rejectFriendRequest);

router.get("/friend-requests", getPendingFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);




export default router;
