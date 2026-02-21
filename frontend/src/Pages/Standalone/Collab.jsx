import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { addTeammate, getProjectById, updateProject } from '../../services/collabApis';

// Add this near the other form components (inside ProjectCollaboration, before return)
const EditProjectForm = ({ 
  show, 
  onClose, 
  darkMode, 
  projectData, 
  // onSave ,
  id
}) => {
  const [formData, setFormData] = useState({
    description: projectData?.description || '',
    status: projectData?.status || '',
    rolesLookingFor: ''
  });

  useEffect(() => {
    if (projectData) {
      setFormData({
        description: projectData.description || '',
        status: projectData.status || '',
        rolesLookingFor: ''
      });
    }
  }, [projectData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    const res = await updateProject(id,formData)
    console.log(res);
    onClose()
    // onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Edit Project Requirements</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-opacity-20 ${
                darkMode ? 'hover:bg-white' : 'hover:bg-gray-300'
              }`}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Describe the project..."
            />
          </div>

          {/* Status */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Select status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Roles Looking For */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Roles Looking For *
            </label>

            <input
              type="text"
              placeholder="Enter roles separated by commas (e.g. Frontend Developer, Backend Developer)"
              name= "rolesLookingFor"
              value={formData.rolesLookingFor}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />

            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Separate roles using commas
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold border-2 transition-colors ${
                darkMode 
                  ? 'border-gray-600 hover:bg-gray-700' 
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const AddTeammateForm = ({ 
  show, 
  onClose, 
  darkMode, 
  teammateData, 
  onInputChange, 
  onSubmit, 
  roles 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Add Team Member</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-opacity-20 ${
                darkMode ? 'hover:bg-white' : 'hover:bg-gray-300'
              }`}
            >
              ✕
            </button>
          </div>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Add a new member to your project team
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Username */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={teammateData.username}
              onChange={onInputChange}
              required
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter team member's username"
            />
          </div>

          {/* Role */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Role *
            </label>
            <select
              name="role"
              value={teammateData.role}
              onChange={onInputChange}
              required
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Select a role</option>
              {roles.map((role, index) => (
                <option 
                  key={index} 
                  value={role}
                  className={`py-2 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
                >
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold border-2 transition-colors ${
                darkMode 
                  ? 'border-gray-600 hover:bg-gray-700' 
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!teammateData.username || !teammateData.roleAssigned}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                !teammateData.username || !teammateData.roleAssigned
                  ? 'bg-gray-400 cursor-not-allowed'
                  : darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Add to Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Component ---

const ProjectCollaboration = () => {
  const {id} = useParams();
  const [darkMode, setDarkMode] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showAddTeammateForm, setShowAddTeammateForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    github: '',
    resume: null,
    message: '',
    roles: []
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [teammateData, setTeammateData] = useState({
    username: '',
    role: ''
  });
  const [roles, setRoles] = useState([]);
  const [data, setData] = useState(null);
  const isLeader = true;
  const availableRoles = ["Frontend Developer", "Backend Developer", "ML Engineer", "UI/UX Designer", "DevOps Engineer", "Product Manager", "QA Engineer", "Data Scientist"];

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Apply Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      roles: selectedOptions
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      resume: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Application Data:', formData);
    alert('Application submitted successfully!');
    setShowApplyForm(false);
    setFormData({
      username: '',
      email: '',
      github: '',
      resume: null,
      message: '',
      roles: []
    });
  };

  // Add Teammate Form Handlers
  const handleTeammateInputChange = (e) => {
    const { name, value } = e.target;
    setTeammateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleEditProject = async (updatedData) => {
  //   try {
  //     // Call API to update project
  //     const res = await updateProject({ ...updatedData, id }); // adjust according to your API
  //     if (res.data.success) {
  //       // Update local data
  //       setData(prev => ({ ...prev, ...updatedData }));
  //       setShowEditForm(false);
  //       alert('Project updated successfully!');
  //     }
  //   } catch (error) {
  //     console.error('Update failed', error);
  //     alert('Failed to update project');
  //   }
  // };
  const handleAddTeammateSubmit = async (e) => {
    e.preventDefault();
    console.log(teammateData);
    const res = await  addTeammate(id,teammateData);
    console.log(res);
    setShowAddTeammateForm(false);
    setTeammateData({
      username: '',
      role: ''
    });
  };

  const fetchProject = async () => {
    try {
        const res = await getProjectById(id);
        console.log(res.data.data);
        setData(res.data.data);
        setRoles(res.data.data.rolesLookingFor);
    } catch (error) {
        console.error(error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      {/* Header with Theme Toggle */}
      <header className={`py-4 px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-500">CollabHub</h1>
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              darkMode 
                ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Project Image */}
        <div className="rounded-2xl overflow-hidden shadow-2xl mb-8">
          <img 
            src={data.file} 
            alt="AI Code Assistant" 
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Category */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold">{data.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                }`}>
                  {data.Category}
                </span>
              </div>
              
              {/* Status Badge */}
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${
                data.status === 'Looking for team members' 
                  ? (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                  : (darkMode ? 'bg-gray-700' : 'bg-gray-200')
              }`}>
                <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                {data.status}
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">About the Project</h2>
              <p className={`text-lg leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {data.description}
              </p>
            </section>

            {/* Problem Statement */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">Problem Statement</h2>
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {data.problemStatement}
                </p>
              </div>
            </section>

            {/* Requirements Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Project Requirements</h2>
              
              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-3">Technology Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {data.techStackUsed.map((tech, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-2 rounded-lg font-medium ${
                        darkMode 
                          ? 'bg-purple-900 text-purple-200' 
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Roles Needed */}
              <div>
                <h3 className="text-xl font-medium mb-3">Roles We're Looking For</h3>
                <div className="space-y-3">
                  {data.rolesLookingFor.map((role, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg flex items-center justify-between ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } shadow-lg`}
                    >
                      <span className="font-medium">{role}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        Open
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Team and Actions */}
          <div className="space-y-8">
            {/* Team Info */}
            <section className={`p-6 rounded-2xl shadow-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className="text-2xl font-semibold mb-4">Team Information</h2>
              
              <div className="mb-6">
                <div className={`p-3 rounded-lg text-center ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <span className="text-sm opacity-75">Total Team Size</span>
                  <div className="text-2xl font-bold text-blue-500">{data.currentTeamMembers.length} members</div>
                </div>
              </div>

              <h3 className="text-xl font-medium mb-3">Current Team Members</h3>
              <div className="space-y-4">
              {data.currentTeamMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center space-x-4"
                >
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      darkMode ? "bg-blue-900" : "bg-blue-100"
                    }`}
                  >
                    {member.user.username.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="font-semibold">
                      {member.user.username}
                    </div>
                    <div
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {member.roleAssigned}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </section>

            {/* Project Leader */}
            <section className={`p-6 rounded-2xl shadow-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className="text-2xl font-semibold mb-4">Project Leader</h2>
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${
                  darkMode ? 'bg-green-900' : 'bg-green-100'
                }`}>
                  {data.createdBy.username.toString().charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-lg">{data.createdBy.username}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Project Lead
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Posted:</span>
                  <span>{data.createdAt.toString().slice(0,10)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>{data.updatedAt.toString().slice(0,10)}</span>
                </div>
              </div>
            </section>

            {/* Leader Actions */}
            {isLeader && (
              <section className={`p-6 rounded-2xl shadow-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className="text-2xl font-semibold mb-4">Project Management</h2>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowAddTeammateForm(true)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    ➕ Add Team Members
                  </button>
                  <button 
                    onClick={() => setShowEditForm(true)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      darkMode 
                        ? 'bg-yellow-600 hover:bg-yellow-700' 
                        : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    }`}
                  >
                    ✏️ Modify Requirements
                  </button>
                  <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    darkMode 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}>
                    🗑️ Delete Project
                  </button>
                </div>
              </section>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={() => setShowApplyForm(true)}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                🚀 Apply as Collaborator
              </button>
              
              {!isLeader && (
                <button className={`w-full py-3 px-6 rounded-xl font-semibold border-2 transition-all ${
                  darkMode 
                    ? 'border-gray-600 hover:bg-gray-800' 
                    : 'border-gray-300 hover:bg-gray-200'
                }`}>
                  💬 Contact Team
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

     
      <EditProjectForm
        show={showEditForm}
        onClose={() => setShowEditForm(false)}
        darkMode={darkMode}
        projectData={data}
        // onSave={handleEditProject}
        id={id}
      />
      {/* Add Teammate Form Popup */}
      <AddTeammateForm
        show={showAddTeammateForm}
        onClose={() => setShowAddTeammateForm(false)}
        darkMode={darkMode}
        teammateData={teammateData}
        onInputChange={handleTeammateInputChange}
        onSubmit={handleAddTeammateSubmit}
        roles={roles}
      />
    </div>
  );
};

export default ProjectCollaboration;