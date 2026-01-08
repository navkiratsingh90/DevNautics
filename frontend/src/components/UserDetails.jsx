import React, { useState } from "react";
import { Pencil } from "lucide-react";
import PopupForm from "./PopupUserForm";
import { useDispatch, useSelector } from "react-redux";
import { handleTheme } from "../Features/ThemeSlice";


const UserProfile = () => {
  const [isConnected, setIsConnected] = useState(false);
  // const [darkMode, setDarkMode] = useState(false);
  const user = useSelector((state) => state.Auth.user)
  const userId = useSelector((state) => state.Auth.userId)
  const [isOpen,setIsOpen] = useState(false)
  const darkMode = useSelector((state) => state.Theme.darkMode)
  const dispatch = useDispatch()

  return (
    <>
 {isOpen && (
  <PopupForm open={isOpen} onOpenChange={setIsOpen} />
)}


    <div
      className={`min-h-screen  transition-colors duration-300 ${
        darkMode
          ? "bg-[var(--color-darkBlue)]"
          : "bg-[var(--color-white)]"
      }`}
    >
      <div className={`max-w-5xl mx-auto px-4 bg-[var(--color-darkBlue)] sm:px-6  py-6 ${darkMode ? "bg-[var(--color-darkBlue)]" : "bg-[var(--color-white)]"}`}>
        {/* Header with dark mode toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1
            className={`text-2xl sm:text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            User Profile
          </h1>
          <button
            onClick={() => dispatch(handleTheme())}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-blue-800 text-yellow-300"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Main Profile Card */}
        <div
          className={`rounded-2xl shadow-lg overflow-hidden transition-colors duration-300 {darkMode ? "bg-[var(--color-darkBlue)]" : "bg-[var(--color-white)]"}`}
        >
          {/* Profile Banner */}
          <div className="h-24 sm:h-32 bg-gradient-to-r from-blue-500 to-blue-700"></div>

          {/* Profile Content */}
          <div className="px-4 sm:px-8 pb-8 relative">
            {/* Avatar */}
            <div className="flex justify-center -mt-12 sm:-mt-16 mb-4">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-3xl sm:text-5xl font-bold">
                    AJ
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 border-2 sm:border-4 border-white"></div>
              </div>
            </div>

            {/* Name and Title */}
            <div className="absolute top-16 sm:top-20 right-4 cursor-pointer">
              <Pencil onClick={() => setIsOpen(prev => !prev)} className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-center mb-6">
              <h2
                className={`text-2xl sm:text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {user.username}
              </h2>
              <p className="text-blue-600 text-base sm:text-lg">
                Senior Frontend Developer
              </p>
            </div>

            {/* Connection Button */}
            <div className="flex justify-center mb-8">
              <button
                className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full transition-all duration-300 font-medium text-sm sm:text-base ${
                  user._id == userId || user.connnectedUsers.contains(userId)
                    ? `${
                        darkMode
                          ? "bg-green-900 text-green-200"
                          : "bg-green-100 text-green-700"
                      } shadow-inner`
                    : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
                onClick={() => setIsConnected(!isConnected)}
              >
                {user._id == userId || user.connnectedUsers.contains(userId) ? "Connected" : "Connect +"}
              </button>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h3
                className={`text-base sm:text-lg font-semibold mb-3 text-center ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {["React", "TypeScript", "Node.js", "UI/UX"].map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                      darkMode
                        ? "bg-blue-900 text-blue-200"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid  grid-cols-3 gap-2 sm:gap-4 mb-8">
              {[
                { value: user.connectedUsers.length, label: "Connections" },
                { value: user.activityPosted.length, label: "Posts" },
                { value: user.projects.length, label: "Projects" }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`text-center p-3 sm:p-4 rounded-xl ${
                    darkMode ? "bg-gray-700" : "bg-blue-50"
                  }`}
                >
                  <div
                    className={`text-lg sm:text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={`text-xs sm:text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Portfolio and About */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Portfolio */}
              <div
                className={`p-4 sm:p-5 rounded-xl ${
                  darkMode ? "bg-gray-700" : "bg-blue-50"
                }`}
              >
                <h3
                  className={`font-semibold text-base sm:text-lg mb-3 flex items-center gap-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Portfolio
                </h3>
                <a
                  href="https://alexjohnson.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
                >
                  alexjohnson.dev
                </a>
              </div>

              {/* About */}
              <div
                className={`p-4 sm:p-5 rounded-xl ${
                  darkMode ? "bg-gray-700" : "bg-blue-50"
                }`}
              >
                <h3
                  className={`font-semibold text-base sm:text-lg mb-3 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  About
                </h3>
                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {user.about}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div
          className={`rounded-2xl shadow-lg p-4 sm:p-6 mt-6 sm:mt-8 transition-colors duration-300 {darkMode ? "bg-[var(--color-darkBlue)]" : "bg-[var(--color-white)]"}`}
        >
          <h2
            className={`text-lg sm:text-xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[user.email, "Phone", "Location", "Social Profiles"].map(
              (info, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-blue-50"
                  }`}
                >
                  <span
                    className={`text-sm sm:text-base ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {info}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className={`rounded-2xl shadow-lg p-4 sm:p-6 mt-6 sm:mt-8 transition-colors duration-300 {darkMode ? "bg-[var(--color-darkBlue)]" : "bg-[var(--color-white)]"}`}
        >
          <h2
            className={`text-lg sm:text-xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Recent Activity
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl ${
                  darkMode ? "bg-gray-700" : "bg-blue-50"
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm sm:text-base font-bold">
                    AJ
                  </span>
                </div>
                <div>
                  <p
                    className={`text-sm sm:text-base ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="font-semibold">Alex Johnson</span> did
                    something
                  </p>
                  <p
                    className={`mt-1 text-xs sm:text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Activity details here
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    2 hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserProfile;

