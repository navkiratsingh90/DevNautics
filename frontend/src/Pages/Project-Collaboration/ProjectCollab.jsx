import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Link } from 'react-router';
import { createProjectCollab, getAllProjects } from '../../services/collabApis';

const ProjectCollabPage = () => {
  const darkMode = useSelector(state => state.Theme.darkMode);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "AI Code Assistant",
      description: "An intelligent code completion tool that uses machine learning to suggest code snippets and detect bugs in real-time. The project aims to help developers write better code faster.",
      problemStatement: "Developers often waste time on repetitive coding tasks and debugging. This tool will automate code suggestions and error detection.",
      category: "AI/ML",
      techStack: ["Python", "TensorFlow", "React", "Node.js", "MongoDB"],
      status: "Looking for team members",
      requirements: ["ML Engineer", "Frontend Dev", "Backend Dev"],
      membersNeeded: 3,
      currentTeamMembers: [
        { name: "Alex Chen", email: "alex@example.com", role: "Project Lead", avatar: "alex" },
        { name: "Sarah Kim", email: "sarah@example.com", role: "UI/UX Designer", avatar: "sarah" }
      ],
      postedBy: "Alex Chen",
      datePosted: "2024-01-15",
      lastUpdated: "2024-01-20",
      contact: "alex@example.com",
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      title: "Decentralized Voting System",
      description: "A blockchain-based voting platform that ensures transparency and security in electoral processes using smart contracts.",
      problemStatement: "Traditional voting systems lack transparency and are vulnerable to fraud. Blockchain can provide immutable, transparent records.",
      category: "Blockchain",
      techStack: ["Solidity", "Web3.js", "React", "Ethereum", "IPFS"],
      status: "In progress",
      requirements: ["Blockchain Dev", "Frontend Dev", "Security Expert"],
      membersNeeded: 2,
      currentTeamMembers: [
        { name: "Mike Ross", email: "mike@example.com", role: "Blockchain Lead", avatar: "mike" },
        { name: "Emma Watson", email: "emma@example.com", role: "Frontend Dev", avatar: "emma" }
      ],
      postedBy: "Mike Ross",
      datePosted: "2024-01-10",
      lastUpdated: "2024-01-18",
      contact: "mike@example.com",
      imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      title: "Smart Home IoT Hub",
      description: "A centralized IoT hub that connects and manages all smart home devices with advanced automation and energy optimization features.",
      problemStatement: "Smart home devices often work in silos. This hub will unify control and enable cross-device automation.",
      category: "IoT",
      techStack: ["C++", "Python", "React Native", "AWS IoT", "MQTT"],
      status: "Looking for team members",
      requirements: ["IoT Engineer", "Mobile Dev", "Backend Dev", "Hardware Engineer"],
      membersNeeded: 4,
      currentTeamMembers: [
        { name: "David Lee", email: "david@example.com", role: "IoT Specialist", avatar: "david" }
      ],
      postedBy: "David Lee",
      datePosted: "2024-01-22",
      lastUpdated: "2024-01-22",
      contact: "david@example.com",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 4,
      title: "Health Fitness Tracker Pro",
      description: "A comprehensive mobile app that tracks fitness metrics, provides personalized workout plans, and integrates with wearable devices.",
      problemStatement: "Existing fitness apps lack personalized AI-driven recommendations and seamless wearable integration.",
      category: "App Dev",
      techStack: ["React Native", "Firebase", "Node.js", "Python", "TensorFlow Lite"],
      status: "Completed",
      requirements: ["Mobile Dev", "Backend Dev", "ML Engineer", "UI/UX Designer"],
      membersNeeded: 0,
      currentTeamMembers: [
        { name: "Lisa Wang", email: "lisa@example.com", role: "Lead Developer", avatar: "lisa" },
        { name: "Tom Brown", email: "tom@example.com", role: "ML Engineer", avatar: "tom" },
        { name: "Maria Garcia", email: "maria@example.com", role: "Mobile Dev", avatar: "maria" }
      ],
      postedBy: "Lisa Wang",
      datePosted: "2024-01-05",
      lastUpdated: "2024-01-25",
      contact: "lisa@example.com",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ]);

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
    techStack: "",
    status: "Looking for team members",
    requirements: "",
    membersNeeded: "",
    postedBy: "",
    contact: "",
    imageUrl: ""
  });

  // Filter and sort projects
  const filteredAndSortedProjects = projects
    .filter(project => {
      // Category filter
      if (filters.category !== "all" && project.category !== filters.category) {
        return false;
      }
      
      // Status filter
      if (filters.status !== "all" && project.status !== filters.status) {
        return false;
      }
      
      // Requirements filter
      if (filters.requirements !== "all" && !project.requirements.includes(filters.requirements)) {
        return false;
      }
      
      // Search query filter
      if (filters.searchQuery && 
          !project.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !project.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !project.techStack.some(tech => tech.toLowerCase().includes(filters.searchQuery.toLowerCase()))) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dateNewest":
          return new Date(b.datePosted) - new Date(a.datePosted);
        case "dateOldest":
          return new Date(a.datePosted) - new Date(b.datePosted);
        case "titleAZ":
          return a.title.localeCompare(b.title);
        case "titleZA":
          return b.title.localeCompare(a.title);
        case "membersNeeded":
          return b.membersNeeded - a.membersNeeded;
        default:
          return 0;
      }
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
    
    setProjects([project, ...projects]);
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

  const handleDeleteProject = (projectId, e) => {
    e?.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter(project => project.id !== projectId));
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(null);
      }
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      "Looking for team members": "bg-green-500",
      "In progress": "bg-blue-500",
      "Completed": "bg-gray-500"
    };
    return colors[status] || "bg-gray-500";
  };

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
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getAllProjects({});
        console.log(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
  
    fetchProjects();
  }, []);
  
  
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
                  <div className="text-2xl font-bold text-blue-500">{filteredAndSortedProjects.length}</div>
                  <div className="text-sm">projects found</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Projects List */}
          <div className="flex-1 min-w-0">
            {/* Projects List - Horizontal Layout */}
            <div className="space-y-6">
              {filteredAndSortedProjects.map(project => (
                <div 
                  key={project.id}
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
                          src={project.imageUrl} 
                          alt={project.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Project Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                         
                          <div className="text-right">
                            
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Posted {formatDate(project.datePosted)}
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
                              {project.requirements.map((req, index) => (
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
                              Posted by: {project.postedBy}
                            </span>
                          </div>
                          <Link to={`/project-collaboration/${project.id}`}><button
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
            {filteredAndSortedProjects.length === 0 && (
              <div className={`rounded-2xl p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>No Projects Found</h2>
                <p className={`mb-8 max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {projects.length === 0 
                    ? "There are no projects available at the moment. Be the first to create a project!"
                    : "No projects match your current filters. Try adjusting your search criteria."
                  }
                </p>
                {projects.length === 0 ? (
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
            
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              {/* ... (create project form remains the same) ... */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCollabPage;