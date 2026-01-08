import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleTheme } from "../Features/ThemeSlice";

const ProjectsPage = () => {
 const darkMode = useSelector((state) => state.Theme.darkMode)
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch()
  const user = useSelector((state) => state.Auth.user)
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with React frontend, Node.js backend, and MongoDB database. Features user authentication, payment processing, and admin dashboard.",
      githubLink: "https://github.com/username/ecommerce-platform",
      liveLink: "https://ecommerce-demo.example.com",
      screenshot: "🛒",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "JWT"],
      collaborators: [
        {
          name: "Alex Johnson",
          role: "Frontend Developer",
          avatar: "AJ",
          contributions: [
            "Implemented product catalog UI",
            "Designed shopping cart functionality",
            "Created responsive product pages"
          ]
        },
        {
          name: "Sarah Chen",
          role: "Backend Developer",
          avatar: "SC",
          contributions: [
            "Built RESTful API endpoints",
            "Implemented payment processing",
            "Set up database schema"
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Task Management App",
      description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      githubLink: "https://github.com/username/task-manager",
      liveLink: "https://tasks.example.com",
      screenshot: "📋",
      technologies: ["React", "Firebase", "Tailwind CSS", "DnD"],
      collaborators: [
        {
          name: "Mike Thompson",
          role: "UI/UX Designer",
          avatar: "MT",
          contributions: [
            "Designed user interface",
            "Created component library",
            "Optimized user experience flows"
          ]
        },
        {
          name: "Emily Rodriguez",
          role: "Full Stack Developer",
          avatar: "ER",
          contributions: [
            "Implemented real-time updates",
            "Set up user authentication",
            "Deployed to production"
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Health & Fitness Tracker",
      description: "A mobile-first web application for tracking workouts, nutrition, and health metrics with data visualization and progress reports.",
      githubLink: "https://github.com/username/fitness-tracker",
      liveLink: "https://fitlife.example.com",
      screenshot: "💪",
      technologies: ["React Native", "GraphQL", "Chart.js", "Firebase"],
      collaborators: [
        {
          name: "David Kim",
          role: "Mobile Developer",
          avatar: "DK",
          contributions: [
            "Built cross-platform mobile app",
            "Implemented health data tracking",
            "Optimized performance for low-end devices"
          ]
        }
      ]
    }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    githubLink: "",
    liveLink: "",
    technologies: "",
    collaborators: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      id: projects.length + 1,
      name: formData.name,
      description: formData.description,
      githubLink: formData.githubLink,
      liveLink: formData.liveLink,
      screenshot: "🚀",
      technologies: formData.technologies.split(',').map(t => t.trim()),
      collaborators: [
        {
          name: "You",
          role: "Project Owner",
          avatar: "YO",
          contributions: formData.collaborators.split(',').map(c => c.trim())
        }
      ]
    };
    
    setProjects([newProject, ...projects]);
    setFormData({
      name: "",
      description: "",
      githubLink: "",
      liveLink: "",
      technologies: "",
      collaborators: ""
    });
    setShowForm(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[var(--color-darkBlue)]' : 'bg-[var(--color-white)]'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Projects Portfolio</h1>
            <p className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Showcase of my development work and collaborations</p>
          </div>
          <button
            onClick={() => dispatch(handleTheme())}
            className={`p-3 rounded-full ${darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </header>

  

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.projects.map(project => (
            <div key={project.id} className={`rounded-xl shadow-lg overflow-hidden flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Project Screenshot/Icon */}
              <div className="rounded-lg overflow-hidden mb-4">
                        <img 
                          src={project.file} 
                          alt="Post media" 
                          className="w-full h-auto object-cover max-h-96"
                        />
                      </div>
              
              <div className="p-6 flex-1">
                {/* Project Header */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{project.name}</h2>
                  <div className="flex space-x-2">
                    <a 
                      href={project.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a 
                      href={project.liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full ${darkMode ? 'bg-blue-700 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
                
                {/* Project Description */}
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{project.description}</p>
                
                {/* Technologies */}
                <div className="mb-4">
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, idx) => (
                      <span 
                        key={idx} 
                        className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Collaborators */}
                {/* <div>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Collaborators</h3>
                  <div className="space-y-3">
                    {project.collaborators.map((collab, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-2">
                            <span className="text-white text-xs font-bold">{collab.avatar}</span>
                          </div>
                          <div>
                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{collab.name}</h4>
                            <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>{collab.role}</p>
                          </div>
                        </div>
                        <ul className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1`}>
                          {collab.contributions.map((contribution, cIdx) => (
                            <li key={cIdx} className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-0.5`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {contribution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
              
              {/* Project Footer */}
              <div className={`px-6 py-3 ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} text-sm font-medium flex justify-between items-center`}>
                <span>Project #{project._id}</span>
                <a 
                  href={project.liveLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:underline"
                >
                  Live Demo
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
        {/* Add Project Button */}
        <div className="mb-12 flex justify-center">
          <div 
            onClick={() => setShowForm(true)}
            className={`cursor-pointer border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 ${
              darkMode ? 'border-blue-700 hover:bg-blue-900/20' : 'border-blue-400 hover:bg-blue-50'
            }`}
            style={{ width: '100%', maxWidth: '500px' }}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              darkMode ? 'bg-blue-800' : 'bg-blue-100'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Add New Project</h3>
            <p className={`mt-1 text-center ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>
              Click here to add a new project to your portfolio
            </p>
          </div>
        </div>
      {/* Add Project Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className={`rounded-2xl shadow-lg w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Add New Project
            </h2>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Fill in your project details
            </p>
          </div>
      
          {/* Form */}
          <form
  onSubmit={handleSubmit}
  className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
>

      
            {/* Project Title */}
<div className="md:col-span-2">

              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
            </div>
      
           {/* Description */}
<div className="md:col-span-2">

              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
            </div>
      
            {/* Tech Stack */}
           {/* Tech Stack */}
<div className="md:col-span-2">

              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Tech Stack (comma separated)
              </label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                placeholder="React, Node.js, MongoDB"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
            </div>
      
            {/* Role */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
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
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Jan 2024 – Mar 2024"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
            </div>
      
            {/* GitHub */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                GitHub Link
              </label>
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
            </div>
      
            {/* Live Link */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Live Project Link
              </label>
              <input
                type="url"
                name="liveLink"
                value={formData.liveLink}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
            </div>
      
            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end gap-3 pt-6">

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={`px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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