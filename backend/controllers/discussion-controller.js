import Discussion from "../models/discussion-model.js";
import mongoose from "mongoose";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import User from "../models/user-model.js";

export const createDiscussion = async (req, res) => {
    try {
        const { groupName, about, topics } = req.body;
        const creatorId = req.user.userID || req.user._id;

        if (!groupName || !creatorId) {
            return res.status(400).json({ msg: "Missing required fields." });
        }
        let fileUrl = null;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const uploadRes = await cloudinary.uploader.upload(fileUri.content);
            fileUrl = uploadRes.secure_url;
          }

        const newDiscussion = await Discussion.create({
            groupName,
            createdBy: creatorId,
            joinedMembers: [ creatorId ],
            admins: [ creatorId ],
            about: about || "",
            file: fileUrl ,
            topics: topics || [],
        });

        return res.status(201).json({
            msg: "Discussion created successfully.",
            discussion: newDiscussion,
        });
    } catch (error) {
        console.error("Error creating discussion:", error);
        return res
            .status(500)
            .json({ msg: "Internal server error.", error: error.message });
    }
};

export const getDiscussions = async (req, res) => {
    try {
        const userId = req.user.userID || req.user._id;

        if (!userId) {
            return res.status(400).json({ msg: "Unauthorized access." });
        }

        const discussions = await Discussion.find({
            $or: [{ joinedMembers: userId }, { createdBy: userId }],
        })
            .populate("createdBy", "name email")
            .populate("admins.username", "name email")
            .populate("joinedMembers", "name email");

        return res.status(200).json({ discussions });
    } catch (error) {
        console.error("Error fetching discussions:", error);
        return res
            .status(500)
            .json({ msg: "Internal server error.", error: error.message });
    }
};

export const editDiscussion = async (req, res) => {
    try {
        const { discussionId, about , groupName} = req.body;
        // console.log(discussionId);
        const userId = req.user.userID || req.user._id;

        if (!discussionId || !userId) {
            return res.status(400).json({ msg: "Missing required fields." });
        }

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ msg: "Discussion not found." });
        }

        const isAdmin = discussion.admins.some(
            (admin) => admin.toString() === userId.toString()
        );
        const isCreator = discussion.createdBy.toString() === userId.toString();

        if (!isAdmin && !isCreator) {
            return res
                .status(403)
                .json({
                    msg: "You are not authorized to edit this discussion.",
                });
        }

        if (about !== undefined) discussion.about = about;
        if (groupName !== undefined) discussion.groupName = groupName
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const uploadRes = await cloudinary.uploader.upload(
                fileUri.content,
                // { folder: "discussion_profiles" }
            );
            discussion.file = uploadRes.secure_url
        }


        const updated = await discussion.save();

        return res.status(200).json({
            msg: "Discussion updated successfully.",
            discussion: updated,
        });
    } catch (error) {
        console.error("Error editing discussion:", error);
        return res
            .status(500)
            .json({ msg: "Internal server error.", error: error.message });
    }
};

export const deleteDiscussion = async (req, res) => {
    try {
        const { discussionId } = req.body;
        const userId = req.user?.userID;

        if (!discussionId || !userId) {
            return res.status(400).json({ msg: "Missing required fields." });
        }

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ msg: "Discussion not found." });
        }
        const isAdmin = discussion.admins.some(
            (admin) => admin.username.toString() === userId.toString()
        );

        const isCreator = discussion.createdBy.toString() === userId.toString();

        if (!isCreator || !isAdmin) {
            return res
                .status(403)
                .json({ msg: "Only the creator can delete this discussion." });
        }

        await Discussion.findByIdAndDelete(discussionId);

        return res
            .status(200)
            .json({ msg: "Discussion deleted successfully." });
    } catch (error) {
        console.error("Error deleting discussion:", error);
        return res
            .status(500)
            .json({ msg: "Internal server error.", error: error.message });
    }
};

export const giveAdminRole = async (req, res) => {
    try {
        const { discussionId, userIdToMakeAdmin } = req.body;
        const requesterId =req.user.userID || req.user._id;

        if (!discussionId || !userIdToMakeAdmin || !requesterId) {
            return res.status(400).json({ msg: "Missing required fields." });
        }

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ msg: "Discussion not found." });
        }

        const isRequesterAdmin =
            discussion.admins.some(
                (a) => a.toString() === requesterId.toString()
            ) || discussion.createdBy.toString() === requesterId.toString();

        if (!isRequesterAdmin) {
            return res
                .status(403)
                .json({ msg: "You are not authorized to assign admin roles." });
        }

        const isMember = discussion.joinedMembers.some(
            (m) => m.toString() === userIdToMakeAdmin.toString()
        );
        if (!isMember) {
            return res
                .status(400)
                .json({ msg: "User must be a member to become admin." });
        }

        const alreadyAdmin = discussion.admins.some(
            (a) => a.toString() === userIdToMakeAdmin.toString()
        );
        if (alreadyAdmin) {
            let idx = null;
            for (let i=0;i<discussion.admins.length;i++){
                if (discussion.admins[i] == userIdToMakeAdmin){
                    idx = i;
                    break;
                } 
            }
            // const idx = discussion.admins.findIndex(userIdToMakeAdmin.toString());
            discussion.admins.splice(idx,1);
            await discussion.save();
            return res.status(200).json({ msg: "user removed from admin position", discussion });
        }

        discussion.admins.push(userIdToMakeAdmin );
        await discussion.save();

        return res
            .status(200)
            .json({ msg: "Admin role assigned successfully.", discussion });
    } catch (error) {
        console.error("Error assigning admin role:", error);
        return res
            .status(500)
            .json({ msg: "Internal server error.", error: error.message });
    }
};

export const requestToJoinDiscussion = async (req, res) => {
    try {
        const { discussionId } = req.body;
        const requesterId =req.user.userID || req.user._id;

        if (!discussionId || !requesterId) {
            return res.status(400).json({ msg: "Missing required fields." });
        }

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ msg: "Discussion not found." });
        }

        const isMember = discussion.joinedMembers.some(
            (m) => m.toString() === requesterId.toString()
        );
        if (isMember) {
            return res
                .status(400)
                .json({ msg: "You are already a member of this discussion." });
        }

        const alreadyRequested = discussion.pendingRequests.some(
            (r) => r.toString() === requesterId.toString()
        );
        if (alreadyRequested) {
            return res
                .status(400)
                .json({
                    msg: "You have already requested to join this discussion.",
                });
        }

        discussion.pendingRequests.push( requesterId );
        await discussion.save();

        return res
            .status(200)
            .json({ msg: "Join request sent successfully.", discussion });
    } catch (error) {
        console.error("Error requesting to join discussion:", error);
        return res
            .status(500)
            .json({ msg: "Internal server error.", error: error.message });
    }
};

export const acceptUserInDiscussion = async (req, res) => {
    try {
        const { discussionId, userId } = req.body;
        const adminId = req.user.userID || req.user._id;

        if (!discussionId || !userId)
            return res.status(400).json({ msg: "Missing required fields" });

        const discussion = await Discussion.findById(discussionId);
        if (!discussion)
            return res.status(404).json({ msg: "Discussion not found" });

        if (!discussion.admins.includes(adminId))
            return res
                .status(403)
                .json({ msg: "Only admins can accept users" });

        if (!discussion.pendingRequests.includes(userId))
            return res
                .status(400)
                .json({ msg: "User has not requested to join" });

        discussion.pendingRequests = discussion.pendingRequests.filter(
            (id) => id.toString() !== userId.toString()
        );

        if (!discussion.joinedMembers.includes(userId))
            discussion.joinedMembers.push(userId);

        await discussion.save();

        await User.findByIdAndUpdate(userId, {
            $addToSet: { joinedDiscussions: discussionId },
        });

        res.status(200).json({ msg: "User accepted successfully", discussion });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

export const leaveDiscussion = async (req, res) => {
    try {
        const { discussionId } = req.body;
        const userId = req.user.userID || req.user._id;

        if (!discussionId || !userId) {
            return res.status(400).json({ msg: "Missing required fields." });
        }

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ msg: "Discussion not found." });
        }

        const isMember = discussion.joinedMembers.some(
            (m) => m.toString() === userId.toString()
        );
        if (!isMember) {
            return res
                .status(400)
                .json({ msg: "You are not a member of this discussion." });
        }
        if (!discussion.admins.includes(adminId))
            return res
                .status(403)
                .json({ msg: "Only admins can accept users" });

        discussion.joinedMembers = discussion.joinedMembers.filter(
            (m) => m.toString() !== userId.toString()
        );

        discussion.admins = discussion.admins.filter(
            (a) => a.toString() !== userId.toString()
        );

        await discussion.save();

        return res
            .status(200)
            .json({ msg: "You have left the discussion.", discussion });
    } catch (error) {
        console.error("Error leaving discussion:", error);
        return res
            .status(500)
            .json({ msg: "Internal server error.", error: error.message });
    }
};

export const rejectJoinRequest = async (req, res) => {
    try {
        const { discussionId, userId } = req.body;
        const adminId =  req.user.userID || req.user._id;

        if (!discussionId || !userId || !adminId) {
            return res.status(400).json({ msg: "Missing required fields." });
        }

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ msg: "Discussion not found." });
        }

        const isAdmin =
            discussion.admins.some(
                (a) => a.toString() === adminId.toString()
            ) || discussion.createdBy.toString() === adminId.toString();

        if (!isAdmin) {
            return res
                .status(403)
                .json({ msg: "Only admins can reject join requests." });
        }

        const requestIndex = discussion.pendingRequests.findIndex(
            (r) => r.toString() === userId.toString()
        );
        if (requestIndex === -1) {
            return res
                .status(400)
                .json({ msg: "No pending request from this user." });
        }

        discussion.pendingRequests.splice(requestIndex, 1);
        await discussion.save();

        return res
            .status(200)
            .json({ msg: "Join request rejected.", discussion });
    } catch (error) {
        console.error("Error rejecting join request:", error);
        return res
            .status(500)
            .json({ msg: "Internal server error.", error: error.message });
    }
};



// all tested now just left to implement on frontend