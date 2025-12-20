import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
      index: true,
    },

    code: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
      enum: [
        "c",
        "cpp",
        "java",
        "python",
        "javascript",
        "go",
      ],
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Running",
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
        "Runtime Error",
        "Compilation Error",
      ],
      default: "Pending",
      index: true,
    },

    passed: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    executionTime: {
      type: Number, // ms
    },

    memory: {
      type: Number, // KB or MB
    },

    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.model("Submission", submissionSchema);
