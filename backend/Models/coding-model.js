import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true
    },
    expectedOutput: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    description: {
      type: String,
      required: true
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true
    },

    tags: [
      {
        type: String,
        index: true
      }
    ],

    constraints: {
      type: String
    },

    sampleTestCases: {
      type: [testCaseSchema],
      required: true
    },

    hiddenTestCases: {
      type: [testCaseSchema],
      required: true,
      select: false // 🔐 never return in API response
    },

    timeLimit: {
      type: Number, // milliseconds
      default: 1000
    },

    memoryLimit: {
      type: Number, // MB
      default: 256
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Question", questionSchema);
