import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleTheme } from "../Features/ThemeSlice";
import { getUserProfile } from "../services/userApis";
import { useParams } from "react-router";

const ProjectsPage = () => {
  const { id } = useParams();
  const darkMode = useSelector((state) => state.Theme.darkMode);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    githubLink: "",
    liveLink: "",
    technologies: "",
    collaborators: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getUserWorkEx = async () => {
    const res = await getUserProfile(id);
    setUser(res.user);
    console.log(res);
  };

  useEffect(() => {
    getUserWorkEx();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[var(--color-darkBlue)]" : "bg-[var(--color-white)]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Projects Portfolio
            </h1>
            <p
              className={`mt-1 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              Showcase of my development work and collaborations
            </p>
          </div>
          <button
            onClick={() => dispatch(handleTheme())}
            className={`p-3 rounded-full ${
              darkMode ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800"
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
        </header>

        {/* Projects List (vertical) */}
        <div className="space-y-6 mb-12">
          {user.projects.map((project) => (
            <div
              key={project._id}
              className={`flex flex-col md:flex-row rounded-xl shadow-lg overflow-hidden ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              {/* Image Section */}
              <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                <img
                  src={project.file}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Section */}
              <div className="p-6 md:w-2/3 flex-1">
                {/* Project Header */}
                <div className="flex justify-between items-start mb-4">
                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {project.name}
                  </h2>
                  <div className="flex space-x-2">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full ${
                        darkMode
                          ? "bg-gray-700 text-white hover:bg-gray-600"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full ${
                        darkMode
                          ? "bg-blue-700 text-white hover:bg-blue-600"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Project Description */}
                <p
                  className={`mb-4 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="mb-4">
                  <h3
                    className={`font-semibold mb-2 ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm ${
                          darkMode
                            ? "bg-blue-900 text-blue-200"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Footer */}
                <div
                  className={`mt-4 pt-3 border-t ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  } text-sm font-medium flex justify-between items-center`}
                >
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    Project #{project._id}
                  </span>
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center hover:underline ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    Live Demo
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Project Button (now at the bottom) */}
        <div className="flex justify-center">
          <div
            onClick={() => setShowForm(true)}
            className={`cursor-pointer border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 ${
              darkMode
                ? "border-blue-700 hover:bg-blue-900/20"
                : "border-blue-400 hover:bg-blue-50"
            }`}
            style={{ width: "100%", maxWidth: "500px" }}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                darkMode ? "bg-blue-800" : "bg-blue-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-8 w-8 ${
                  darkMode ? "text-blue-300" : "text-blue-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3
              className={`text-xl font-semibold ${
                darkMode ? "text-blue-300" : "text-blue-600"
              }`}
            >
              Add New Project
            </h3>
            <p
              className={`mt-1 text-center ${
                darkMode ? "text-blue-400" : "text-blue-500"
              }`}
            >
              Click here to add a new project to your portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Add Project Modal (unchanged) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl shadow-lg w-full max-w-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <h2
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Add New Project
              </h2>
              <p
                className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Fill in your project details
              </p>
            </div>

            {/* Form */}
            <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Title */}
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>

              {/* Tech Stack */}
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, MongoDB"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>

              {/* Role */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  <option value="">Select Role</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Jan 2024 – Mar 2024"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>

              {/* GitHub */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  GitHub Link
                </label>
                <input
                  type="url"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>

              {/* Live Link */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Live Project Link
                </label>
                <input
                  type="url"
                  name="liveLink"
                  value={formData.liveLink}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;