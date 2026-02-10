import mongoose from "mongoose";

const projectCollabSchema = new mongoose.Schema({
	title : {
		type : String,
		required : true
	},
	// file : {
	// 	type : String,
	// 	required : true
	// },
	description : {
		type : String,
		required : true
	},
	status : {
		type : String,
		enum : [ "Open",
			"In Progress",
			"On Hold",
			"Completed",
			"Closed"],
		default : "Open"
	},
	problemStatement : {
		type : String,
	},
	Category : {
		type: String,
		required : true
	},
	futureScope : {
		type : String
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
	currentTeamMembers: {
		type: [
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
		],
		default: []
	},	
	createdBy : {
		type : mongoose.Schema.Types.ObjectId,
		ref : "User"
	},
	pendingRequests: {
		type : [
			{ 
				type: mongoose.Schema.Types.ObjectId, 
				ref: 'User' 
			},
			
	],
	default : []
}
	
},{ timestamps : true})

export default mongoose.model('projectCollab', projectCollabSchema);