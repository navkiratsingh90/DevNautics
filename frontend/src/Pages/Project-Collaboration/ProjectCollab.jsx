import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Link } from 'react-router';
import { createProjectCollab, getAllProjects } from '../../services/collabApis';

const ProjectCollabPage = () => {
  const darkMode = useSelector(state => state.Theme.darkMode);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [data,setData] = useState(null)

  // Filter and sort states
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    requirements: "all",
    searchQuery: ""
  });
  
  const [sortBy, setSortBy] = useState("dateNewest");

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    problemStatement: "",
    category: "AI/ML",
    techStackUsed: "",
    status: "Looking for team members",
    requirements: "",
    totalTeamSize: "",
    createdBy: "",
    contact: "",
    imageUrl: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    const project = {
      id: projects.length + 1,
      title: newProject.title,
      description: newProject.description,
      problemStatement: newProject.problemStatement,
      category: newProject.category,
      techStack: newProject.techStack.split(',').map(tech => tech.trim()),
      status: newProject.status,
      requirements: newProject.requirements.split(',').map(req => req.trim()),
      membersNeeded: parseInt(newProject.membersNeeded),
      currentTeamMembers: [],
      postedBy: newProject.postedBy,
      datePosted: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      contact: newProject.contact,
      imageUrl: newProject.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    };
    
    // setProjects([project, ...projects]);
    setShowCreateModal(false);
    setNewProject({
      title: "",
      description: "",
      problemStatement: "",
      category: "AI/ML",
      techStack: "",
      status: "Looking for team members",
      requirements: "",
      membersNeeded: "",
      postedBy: "",
      contact: "",
      imageUrl: ""
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    console.log(filters);
    fetchProjects()
  };

  const clearAllFilters = () => {
    setFilters({
      category: "all",
      status: "all",
      requirements: "all",
      searchQuery: ""
    });
    setSortBy("dateNewest");
  };

  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     weekday: 'long',
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   });
  // };

  // const getStatusColor = (status) => {
  //   const colors = {
  //     "Looking for team members": "bg-green-500",
  //     "In progress": "bg-blue-500",
  //     "Completed": "bg-gray-500"
  //   };
  //   return colors[status] || "bg-gray-500";
  // };

  const getCategoryColor = (category) => {
    const colors = {
      "AI/ML": "bg-purple-500",
      "Web Dev": "bg-blue-500",
      "Blockchain": "bg-orange-500",
      "IoT": "bg-green-500",
      "App Dev": "bg-red-500"
    };
    return colors[category] || "bg-gray-500";
  };
  const buildFilters = (filters) => {
    const cleaned = {};
  
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== "all" &&
        value !== "" &&
        value !== null &&
        value !== undefined
      ) {
        cleaned[key] = value;
      }
    });
  
    return cleaned;
  };
  const fetchProjects = async () => {
    try {
      const res = await getAllProjects({
        page: 1,
        limit: 10,
        filters: buildFilters(filters),
        sort: "createdAt",
        order: "desc",
      });
      
      console.log(res.data.data);
      setData(res.data.data)
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };
  useEffect(() => {
  
    fetchProjects();
  }, []);
  
  if (!data) return <div>Loading...</div>
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Project Collaboration</h1>
            <p className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Find your next project team and build amazing things together</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className={`px-6 py-3 rounded-lg ${darkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              Create Project
            </button>
          </div>
        </header>

        <div className="flex gap-8">
          {/* Fixed Sidebar Filters */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-6 space-y-6">
              <div className={`rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Filters & Sort</h2>
                  <button 
                    onClick={clearAllFilters}
                    className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Search Projects
                    </label>
                    <input
                      type="text"
                      value={filters.searchQuery}
                      onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                      placeholder="Search by title, description, tech..."
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  
                  {/* Category Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    >
                      <option value="all">All Categories</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Web Dev">Web Development</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="IoT">IoT</option>
                      <option value="App Dev">App Development</option>
                    </select>
                  </div>
                  
                  {/* Status Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange("status", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    >
                      <option value="all">All Status</option>
                      <option value="Looking for team members">Looking for Members</option>
                      <option value="In progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  
                  {/* Requirements Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Roles Needed
                    </label>
                    <select
                      value={filters.requirements}
                      onChange={(e) => handleFilterChange("requirements", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    >
                      <option value="all">All Roles</option>
                      <option value="Frontend Dev">Frontend Developer</option>
                      <option value="Backend Dev">Backend Developer</option>
                      <option value="ML Engineer">ML Engineer</option>
                      <option value="Blockchain Dev">Blockchain Developer</option>
                      <option value="Mobile Dev">Mobile Developer</option>
                      <option value="Designer">UI/UX Designer</option>
                      <option value="IoT Engineer">IoT Engineer</option>
                    </select>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    >
                      <option value="dateNewest">Newest First</option>
                      <option value="dateOldest">Oldest First</option>
                      <option value="titleAZ">Title: A-Z</option>
                      <option value="titleZA">Title: Z-A</option>
                      <option value="membersNeeded">Most Members Needed</option>
                    </select>
                  </div>
                </div>
                
                {/* Active Filters Display */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Active Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {filters.category !== "all" && (
                      <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                        Category: {filters.category}
                      </span>
                    )}
                    {filters.status !== "all" && (
                      <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                        Status: {filters.status}
                      </span>
                    )}
                    {filters.requirements !== "all" && (
                      <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
                        Role: {filters.requirements}
                      </span>
                    )}
                    {filters.searchQuery && (
                      <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'}`}>
                        Search: "{filters.searchQuery}"
                      </span>
                    )}
                    {filters.category === "all" && filters.status === "all" && filters.requirements === "all" && !filters.searchQuery && (
                      <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No active filters
                      </span>
                    )}
                  </div>
                </div>

                {/* Results Count */}
                <div className={`mt-4 pt-4 border-t border-gray-700 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="text-2xl font-bold text-blue-500">{data.length}</div>
                  <div className="text-sm">projects found</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Projects List */}
          <div className="flex-1 min-w-0">
            {/* Projects List - Horizontal Layout */}
            <div className="space-y-6">
              {data.map(project => (
                <div 
                  key={project._id}
                  onClick={() => setSelectedProject(project)}
                  className={`rounded-2xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* Project Image */}
                      <div className="flex-shrink-0 w-48 h-32">
                        <img 
                          src={project.file}
                          // alt={project.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Project Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                         
                          <div className="text-right">
                            
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Posted {project.createdAt.toString().slice(0,11)}
                            </div>
                          </div>
                        </div>

                        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {project.title}
                        </h3>
                        
                        <p className={`mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-4 mb-4">
                          

                          <div>
                            <h4 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Roles Needed</h4>
                            <div className="flex flex-wrap gap-1">
                              {project.rolesLookingFor.map((req, index) => (
                                <span 
                                  key={index}
                                  className={`px-2 py-1 rounded text-xs ${
                                    darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {project.currentTeamMembers.length} team members
                              </span>
                            </div>
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Posted by: {project.createdBy.username}
                            </span>
                          </div>
                          <Link to={`/project-collaboration/${project._id}`}><button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle join project logic
                            }}
                            className={`px-6 py-2 rounded-lg font-semibold ${
                              darkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            View Project
                          </button></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {data.length === 0 && (
              <div className={`rounded-2xl p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>No Projects Found</h2>
                <p className={`mb-8 max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {data.length === 0 
                    ? "There are no projects available at the moment. Be the first to create a project!"
                    : "No projects match your current filters. Try adjusting your search criteria."
                  }
                </p>
                {data.length === 0 ? (
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className={`px-6 py-3 rounded-lg ${darkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    Create Your First Project
                  </button>
                ) : (
                  <button 
                    onClick={clearAllFilters}
                    className={`px-6 py-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      
      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6 border-b border-gray-700">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Create New Project</h2>
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fill in the details for your project</p>
            </div>
            
            <form onSubmit={handleCreateProject} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Project Title */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Project Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newProject.title}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="AI Health Tracker"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={newProject.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    <option>AI/ML</option>
                    <option>Web Dev</option>
                    <option>Blockchain</option>
                    <option>IoT</option>
                    <option>App Dev</option>
                  </select>
                </div>

                {/* Tech Stack */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tech Stack
                  </label>
                  <input
                    type="text"
                    name="techStack"
                    value={newProject.techStack}
                    onChange={handleInputChange}
                    placeholder="React, Node, MongoDB"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Project Status
                  </label>
                  <select
                    name="status"
                    value={newProject.status}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    <option name = "Open">Open</option>
                    <option name = "In Progress">In Progress</option>
                    <option name = "On Hold">On Hold</option>
                    <option name = "Completed">Completed</option>
                    <option name = "Closed">Closed</option>
                  </select>
                </div>

                {/* Roles Needed */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Roles Needed
                  </label>
                  <input
                    type="text"
                    name="requirements"
                    value={newProject.requirements}
                    onChange={handleInputChange}
                    placeholder="Frontend Dev, ML Engineer"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>

                {/* Members Needed */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Members Needed
                  </label>
                  <input
                    type="number"
                    name="membersNeeded"
                    value={newProject.membersNeeded}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>

                {/* Posted By */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="postedBy"
                    value={newProject.postedBy}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Contact (Email / Discord)
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={newProject.contact}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Project Description
                </label>
                <textarea
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="Brief overview of your project"
                />
              </div>

              {/* Problem Statement */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Problem Statement
                </label>
                <textarea
                  name="problemStatement"
                  value={newProject.problemStatement}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`px-5 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg font-semibold ${
                    darkMode
                      ? 'bg-blue-700 hover:bg-blue-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Create Project
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCollabPage;