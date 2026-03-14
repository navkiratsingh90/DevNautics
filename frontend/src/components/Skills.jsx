import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleTheme } from "../Features/ThemeSlice";
import { Pencil } from "lucide-react";
import { getUserProfile, updateSkills } from "../services/userApis";
import { useParams } from "react-router";

const skillIcons = {
  react: "⚛️",
  javascript: "📜",
  js: "📜",
  typescript: "🔷",
  ts: "🔷",
  node: "🟢",
  nodejs: "🟢",
  python: "🐍",
  html: "🌐",
  css: "🎨",
  tailwind: "💨",
  tailwindcss: "💨",
  git: "📝",
  docker: "🐳",
  aws: "☁️",
  mongodb: "🍃",
  postgresql: "🐘",
  sql: "🗄️",
  graphql: "📊",
  vue: "🟢",
  angular: "🅰️",
  java: "☕",
  csharp: "🎯",
  php: "🐘",
  ruby: "💎",
  swift: "🐦",
  kotlin: "🅺",
  go: "🐹",
  rust: "⚙️",
  flutter: "🦋",
  firebase: "🔥",
  redux: "🔄",
  nextjs: "⏭️",
  express: "🚂",
  django: "🎸",
  flask: "🌶️",
  spring: "🍃",
  mysql: "🐬",
  redis: "🧠",
  kubernetes: "☸️",
  jenkins: "🤖",
  figma: "🎨",
  sketch: "🎨",
  photoshop: "🖼️",
  illustrator: "🎨",
  xd: "✨",
};

const getSkillIcon = (skill) => {
  const normalized = skill.toLowerCase().trim();
  return skillIcons[normalized] || "📦"; // default box emoji
};

const SkillsPage = () => {
  const {id} = useParams()
  const darkMode = useSelector((state) => state.Theme.darkMode);
  const [activeCategory, setActiveCategory] = useState("frontend");
  // const user = useSelector((state) => state.Auth.user);
  const [user,setUser] = useState(null)
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    skill: "",
    action: "add",
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const dispatch = useDispatch();

  // console.log(user.skills);

  const handleCurrentCategory = (category) => {
    setActiveCategory(category);
    const skills = user.skills[category] || [];
    setSelectedSkills(skills);
  };

  const handleUpdateSkills = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.skill) return;
    const res = await updateSkills(formData);
    console.log(res);
    setShowSkillModal(false);
    setFormData({ category: "", skill: "", action: "add" });
  };
  const getUserSkills = async () => {
    const res = await getUserProfile(id);
    setUser(res.user)
    console.log(res);
  }
  useEffect(() => {
    getUserSkills()
  },[])
  if (!user) return <div>Loading...</div>
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
            <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
              Skills & Expertise
            </h1>
            <p className={`mt-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              My technical proficiencies and abilities
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

        {/* Category Navigation */}
        <div className={`rounded-xl p-4 mb-8 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md relative`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
              Skill Categories
            </h2>
            <button
              onClick={() => setShowSkillModal(true)}
              className={`p-2 rounded-lg transition ${
                darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              <Pencil size={18} />
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {Object.keys(user.skills).map((category) => (
              <button
                key={category}
                onClick={() => handleCurrentCategory(category)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeCategory === category
                    ? `${
                        darkMode ? "bg-blue-700 text-white" : "bg-blue-600 text-white"
                      } shadow-inner`
                    : `${
                        darkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedSkills.length === 0 ? (
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No skills listed</p>
          ) : (
            selectedSkills.map((skill, index) => (
              <div
                key={index}
                className={`rounded-xl shadow-lg overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="p-6">
                  <div className="flex gap-4 items-center">
                    <span className="w-8">
                  <img  src={`https://cdn.simpleicons.org/${skill}`} />
                  </span>
                    <h3 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {skill}
                    </h3>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Skill Update Modal */}
        {showSkillModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className={`w-full max-w-md rounded-xl p-6 shadow-xl ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Update Skills
              </h3>

              <form onSubmit={handleUpdateSkills} className="space-y-4">
                {/* Category */}
                <div>
                  <label className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full mt-1 p-2 rounded-lg outline-none ${
                      darkMode
                        ? "bg-gray-700 text-white border border-gray-600"
                        : "bg-gray-100 text-gray-800 border border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select category</option>
                    {Object.keys(user.skills).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Skill */}
                <div>
                  <label className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Skill
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React"
                    value={formData.skill}
                    onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                    className={`w-full mt-1 p-2 rounded-lg outline-none ${
                      darkMode
                        ? "bg-gray-700 text-white border border-gray-600"
                        : "bg-gray-100 text-gray-800 border border-gray-300"
                    }`}
                    required
                  />
                </div>

                {/* Action */}
                <div>
                  <label className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Action
                  </label>
                  <select
                    value={formData.action}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    className={`w-full mt-1 p-2 rounded-lg outline-none ${
                      darkMode
                        ? "bg-gray-700 text-white border border-gray-600"
                        : "bg-gray-100 text-gray-800 border border-gray-300"
                    }`}
                  >
                    <option value="add">Add</option>
                    <option value="remove">Remove</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSkillModal(false)}
                    className={`px-4 py-2 rounded-lg ${
                      darkMode ? "bg-gray-600 text-white" : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsPage;