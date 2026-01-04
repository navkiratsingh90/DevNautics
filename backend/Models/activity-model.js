import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
	description : {
		type : String,
		required : true,
	},
	file : {
		type : String,
	},
	tags: {
		type: [String],
		default: []
	},	
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},	
	likes : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		}
	],
	comments: [
    {
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }
  ]
},{timestamps : true})

export default mongoose.model("Activity", activitySchema);