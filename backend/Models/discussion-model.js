import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  totalMembers: {
    type: Number,
    required: true,
  },
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},	
	joinedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  unreadMessages: {
    type: Number,
    default: 0,
  },
  profilePic: {
    type: String, // Emoji or URL
  },
  about: {
    type: String,
  },
  onlineMembers: {
    type: Number,
    default: 0,
  },
  topics: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

export default mongoose.model("discussion", discussionSchema);
