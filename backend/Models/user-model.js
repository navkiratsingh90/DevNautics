import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SALT_ROUNDS = 10

const educationSchema = new mongoose.Schema({
    schoolName: { 
			type: String, 
			required: true 
		},
    duration: { 
			type: String, 
			required: true 
		},
    information: { 
			type: String 
		},
});

const workExperienceSchema = new mongoose.Schema({
    companyName: { 
			type: String, 
			required: true 
		},
    duration: { 
			type: String, 
			required: true 
		},
    role: { 
			type: String 
		},
    description: { 
			type: String 
		},
});

const skillsSchema = new mongoose.Schema({
    frontend: [{ 
			type: String 
		}],
    backend: [{ 
			type: String 
		}],
    tools: [{ 
			type: String 
		}],
    frameworks: [{ 
			type: String 
		}],
    libraries: [{ 
			type: String 
		}],
    languages: [{ 
			type: String 
		}],
});

const userSchema = new mongoose.Schema(
{
	username: { 
		type: String, 
		required: true, 
		trim: true 
	},
	password : {
		type : String,
		required : true
	},
	about: { 
		type: String, 
		default: "" 
	},
	email: { 
		type: String, 
		required: true, 
		unique: true 
	},

	verificationCode: { type: String },
	verificationExpiry: { type: Date },

	education: [educationSchema],
	workExperience: [workExperienceSchema],
	skills: skillsSchema,

	activityPosted: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Activity",
		},
	],
	projectCollaborations: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "projectCollab",
		},
	],
	activeProjects : [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "projectFlow",
		},
	],

	totalPendingRequests: [
		{ type: mongoose.Schema.Types.ObjectId, 
			ref: "User" },
	],
	challengesAttended : [
		{
			type : mongoose.Schema.Types.ObjectId ,
			ref : "Challenge"
		}
	],
	totalPoints : {
		type : Number,
		default : 0,
	},
	connectedUsers: [
		{ 
			type: mongoose.Schema.Types.ObjectId,
			ref: "User" 
		}
	],
},
{ timestamps: true }
);
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const hashed = await bcrypt.hash(this.password, SALT_ROUNDS);
    this.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.generateToken = async function() {
  return jwt.sign(
    {
      userID: this._id.toString(),
      email: this.email,
      username: this.username
    },
    process.env.JWT_TOKEN,
    {
      expiresIn: '30d'
    }
  );
};
const User = mongoose.model("User", userSchema);
export default User;