
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // ✅ Required for __dirname
import connectDb from "./utils/db.js";

dotenv.config();
const app = express();

// ✅ Fix for __dirname in ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Example of importing routes (uncomment when routes ready)
import activityRouter from './routes/activity-router.js'
import authRouter from './routes/auth-router.js'
import userRouter from './routes/user-router.js'
import discussionRouter from './routes/discussion-router.js'
import collabSpaceRouter from './routes/projectCollab-router.js'

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter)
app.use("/api/activity", activityRouter)
app.use("/api/discussion", discussionRouter);
app.use("/api/collab", collabSpaceRouter)

// ✅ Serve React frontend build (for production)
// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get('/*splat', (_, res) => {
//   res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// });


// ✅ Start server after connecting to MongoDB
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

connectDb()
  .then(() => {
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log("✅ MongoDB connected successfully");
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  });


// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import path from "path";
// import connectDb from "./Utils/db.js";

// const app = express();
// dotenv.config();



// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(cors({ 
//   origin: 'http://localhost:5173', 
//   credentials: true 
// }));

// // API Routes
// // const authRouter = require('./Routes/authRouter');

// // app.use('/api/auth', authRouter);

// // Serve React frontend (production)

// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get('/*splat', (_, res) => {
//   res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// });

// // Start server after DB connection
// connectDb()
//   .then(() => {
//     const PORT = process.env.PORT ;
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//       console.log('MongoDB connected');
//     });
//   })
//   .catch((err) => {
//     console.error('DB connection error:', err);
//     process.exit(1);
//   });
