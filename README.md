# 🌐 DevNautics — Developer Community & Collaboration Platform

<div align="center">

![DevNautics Banner](https://img.shields.io/badge/DevNautics-Developer%20Community%20Platform-0f172a?style=for-the-badge&logo=dev.to)

**Where developers connect, collaborate, compete, and grow — together.**  
A full-stack MERN platform built for the modern developer ecosystem.

[![React](https://img.shields.io/badge/React.js-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Storage-3448C5?style=flat-square&logo=cloudinary)](https://cloudinary.com/)
[![Judge0](https://img.shields.io/badge/Judge0-Code%20Execution-FF6B6B?style=flat-square)](https://judge0.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#) · [Documentation](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**DevNautics** (formerly DevConnect) is a full-stack, community-driven platform purpose-built for developers. It bridges the gap between learning, networking, and building — offering a single destination where developers can create profiles, join discussion groups, collaborate on real-world projects, compete in daily coding challenges, and communicate via real-time chat.

Think of it as **LinkedIn + Discord + LeetCode** — designed specifically for the developer community, with a focus on collaboration and growth rather than passive consumption.

> **"Not just another social network. A complete ecosystem built by developers, for developers."**

---

## ✨ Features

### 👤 Developer Profiles
- Build a rich, personalized developer profile
- Showcase skills, tech stack, bio, and open-source contributions
- Profile visibility across communities, projects, and events
- Avatar upload with secure Cloudinary storage

### 💬 Discussion Groups & Communities
- Create or join topic-based developer communities
- Post threads, reply to discussions, and share knowledge
- Manage communities with admin/moderator controls
- Leave or archive groups at any time

### 📅 Events & Hackathons
- Discover and get invited to developer events
- Supports hackathons, coding contests, and meetups
- Event detail pages with RSVP and participant tracking
- Email invitations and reminders powered by Nodemailer

### 🚀 Collaborative Projects
- Post project ideas and recruit team members
- Form teams, assign roles, and contribute together
- Project pages with description, tech stack, and member list
- Visibility into open vs. closed projects

### 🏆 Daily Coding Faceoffs
- Solve a new coding challenge every day
- Real-time competitive leaderboard
- Multi-language code execution powered by **Judge0 API**
- Submissions evaluated on correctness and performance

### 💬 Real-Time Chat
- Direct messaging between developers
- Group chat within communities and project teams
- Instant delivery via **Socket.IO** WebSockets
- Typing indicators and online presence status

### ☁️ Cloud Media Storage
- Upload profile pictures, project assets, and documents
- Powered by **Cloudinary** for fast, secure media delivery
- Automatic format optimization and CDN distribution

### 📧 Email System
- Account verification on registration
- Event invitation and reminder emails
- Password reset and security alerts
- Powered by **Nodemailer** with SMTP support

---

## 🧠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js 18 | Component-based UI with hooks |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **Backend** | Node.js + Express.js | RESTful API server |
| **Database** | MongoDB Atlas | NoSQL document storage |
| **ODM** | Mongoose | Schema modeling and validation |
| **Real-Time** | Socket.IO | Live chat and presence system |
| **Media Storage** | Cloudinary | Image/file upload and CDN delivery |
| **Email** | Nodemailer | Transactional email delivery |
| **Code Execution** | Judge0 API | Secure multi-language code runner |
| **Auth** | JWT + bcrypt | Secure token-based authentication |
| **Deployment** | Vercel + Render | Frontend and backend hosting |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      DEVNAUTICS PLATFORM                         │
├──────────────────────────────────────────────────────────────────┤
│                    REACT.JS FRONTEND (SPA)                       │
│     Profiles │ Communities │ Projects │ Events │ Chat │ Coding   │
└──────────────────────────┬───────────────────────────────────────┘
                           │ REST API + WebSockets
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│               NODE.JS + EXPRESS.JS BACKEND                       │
│     Auth Middleware │ JWT Validation │ Route Handlers            │
└──────┬───────────────────┬──────────────────┬────────────────────┘
       │                   │                  │
       ▼                   ▼                  ▼
┌─────────────┐   ┌─────────────────┐  ┌─────────────────────┐
│  MongoDB    │   │  Socket.IO      │  │  External Services  │
│  Atlas      │   │  Server         │  │  ─ Cloudinary       │
│  (Primary   │   │  (Real-Time     │  │  ─ Nodemailer       │
│   Store)    │   │   Chat/Events)  │  │  ─ Judge0 API       │
└─────────────┘   └─────────────────┘  └─────────────────────┘
```

### Data Flow — Daily Coding Faceoff
```
User writes code in the browser editor
    │
    ▼
Frontend sends code + language to Express API
    │
    ▼
Backend calls Judge0 API with code and test cases
    │
    ▼
Judge0 executes code in a secure sandbox
    │
    ▼
Results (pass/fail, runtime, memory) returned
    │
    ▼
Submission stored in MongoDB → Leaderboard updated
```


---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.x
- **npm** or **yarn**
- **MongoDB** (Atlas cluster or local)
- A **Cloudinary** account
- A **Judge0** API key (RapidAPI)
- An SMTP email provider (Gmail, Resend, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/navkiratsingh90/devconnect.git
   cd devconnect
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**
   ```bash
   # In the server/ directory
   cp .env.example .env
   # Fill in all values (see Environment Variables section)
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 — Backend
   cd server
   npm run dev

   # Terminal 2 — Frontend
   cd client
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server/` directory:

```env
# ─── App ───────────────────────────────────────────────────────
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# ─── MongoDB ───────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/devnautics

# ─── JWT Auth ──────────────────────────────────────────────────
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# ─── Cloudinary ────────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ─── Nodemailer (SMTP) ─────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=DevNautics <noreply@devnautics.com>

# ─── Judge0 API ────────────────────────────────────────────────
JUDGE0_API_KEY=your_rapidapi_key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
```

---

## 🤝 Contributing

Contributions are what make open-source communities thrive. Any contributions you make are **greatly appreciated**.

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

Please follow the existing code structure, write clear commit messages, and keep PRs focused on a single feature or fix.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

## 🙌 Acknowledgements

- [Socket.IO](https://socket.io/) — Real-time bidirectional communication
- [Judge0](https://judge0.com/) — Open-source code execution system
- [Cloudinary](https://cloudinary.com/) — Media management platform
- [Nodemailer](https://nodemailer.com/) — Node.js email sending library
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud database service
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework

---

<div align="center">

Built with ❤️ by **[Your Name]**

⭐ Star this repo if DevNautics helped you!

</div>
