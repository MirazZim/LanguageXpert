import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, //exclude current user
                { _id: { $nin: currentUser.friends } }, // exclude current user's friends
                { isOnboarded: true },
            ],
        });

        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function sendFriendRequest(req, res){
    try {
        const myId = req.user.id;
        const {id:recipientId} = req.params;

        //prevent sending request to yourself
        if(myId === recipientId){
            return res.status(400).json({message:"You cannot send a friend request to yourself"});
        }

        //check if recipient exists
        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message:"Recipient not found"});
        }

        //check if you are already friends with this user
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({message:"You are already friends with this user"});
        }

        //check if you have already sent a friend request to this user
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });

        if (existingRequest) {
            return res.status(400).json({message:"Friend request already sent"});
        }


        //create a new friend request
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json({friendRequest});
    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}