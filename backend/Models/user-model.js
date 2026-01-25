import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10

const educationSchema = new mongoose.Schema({
  schoolName: { type: String, required: true },
  degree: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String }
});
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  file : {type : String},
  techStack: [String],
  role: { type: String },
  duration: { type: String },
  githubLink: { type: String },
  liveLink: { type: String },
});


const workExperienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  duration: { type: String, required: true },
  role: { type: String },
  description: { type: String },
  location: { type: String }
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    about: { type: String, default: "" },

    verificationCode: String,
    verificationExpiry: Date,

    education: [educationSchema],
    workExperience: [workExperienceSchema],

    skills: {
      frontend: [String],
      backend: [String],
      tools: [String],
      frameworks: [String],
      libraries: [String],
      languages: [String],
    },
    projects: [projectSchema],

    activityPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
    projectCollaborations: [{ type: mongoose.Schema.Types.ObjectId, ref: "projectCollab" }],
    activeProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "projectFlow" }],

    totalPendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    connectedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    challengesAttended: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
    totalPoints: { type: Number, default: 0 },
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