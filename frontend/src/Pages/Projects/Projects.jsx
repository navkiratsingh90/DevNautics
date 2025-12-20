import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Workspaces = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [workspaces, setWorkspaces] = useState([
    {
      id: 1,
      name: 'AI Code Assistant',
      description: 'ML based intelligent code completion tool',
      progress: 65,
      status: 'In Progress',
      members: 5,
      tasks: 12
    },
    {
      id: 2,
      name: 'Social Innovation Hub',
      description: 'Platform to address social challenges',
      progress: 40,
      status: 'In Progress',
      members: 8,
      tasks: 20
    },
    {
      id: 3,
      name: 'Resale Marketplace',
      description: 'Frontend-only resale platform',
      progress: 80,
      status: 'Testing',
      members: 4,
      tasks: 18
    }
  ]);

  const [form, setForm] = useState({ name: '', description: '' });

  const addWorkspace = (e) => {
    e.preventDefault();
    const newWorkspace = {
      id: workspaces.length + 1,
      name: form.name,
      description: form.description,
      progress: 0,
      status: 'Planning',
      members: 1,
      tasks: 0
    };
    setWorkspaces([...workspaces, newWorkspace]);
    setForm({ name: '', description: '' });
    setShowCreate(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-500';
      case 'Testing': return 'bg-yellow-500';
      case 'Completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Header */}
      <div className={`flex justify-between items-center p-6 shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className="text-3xl font-bold">Workspaces</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            {darkMode ? '☀ Light' : '🌙 Dark'}
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold"
          >
            + Create Workspace
          </button>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workspaces.map(ws => (
          <Link
            to={`/workspace/${ws.id}`}
            key={ws.id}
            className={`rounded-2xl p-6 shadow-xl transition hover:scale-[1.02] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{ws.name}</h2>
              <span className={`px-2 py-1 text-xs rounded text-white ${getStatusColor(ws.status)}`}>
                {ws.status}
              </span>
            </div>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {ws.description}
            </p>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{ws.progress}%</span>
              </div>
              <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-3 bg-blue-500 rounded-full"
                  style={{ width: `${ws.progress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span>👥 {ws.members} Members</span>
              <span>✅ {ws.tasks} Tasks</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Create Workspace Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={addWorkspace}
            className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <h2 className="text-2xl font-bold mb-4">Create Workspace</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Workspace Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                rows="3"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex-1 border rounded-lg py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white rounded-lg py-2 font-semibold"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Workspaces;