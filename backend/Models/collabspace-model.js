import mongoose from "mongoose";

const projectCollabSchema = new mongoose.Schema({
	title : {
		type : String,
		required : true
	},
	description : {
		type : String,
		required : true
	},
	status : {
		type : String,
		required : true,
	},
	problemStatement : {
		type : String,
	},
	futureScope : {
		type : String,
	},
	rolesLookingFor : {
		type : [String],
		required : true,
	},
	techStackUsed : {
		type : [String],
		required : true,
	},
	totalTeamSize : {
		type : Number,
		required : true,
	},
	currentTeamMembers: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true
			},
			roleAssigned: {
				type: String,
				required: true
			}
		}
	]
,	
	createdBy : {
		type : mongoose.Schema.Types.ObjectId,
		ref : "User"
	},
	pendingRequests: [
			{ 
				type: mongoose.Schema.Types.ObjectId, 
				ref: 'User' 
			},
			
	]
	
},{ timestamps : true})

export default mongoose.model('projectCollab', projectCollabSchema);