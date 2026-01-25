import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleTheme } from "../../Features/ThemeSlice";
import { getPendingRequests } from "../../services/userApis";

const PendingRequestsPage = () => {
  const darkMode = useSelector((state) => state.Theme.darkMode)
  const dispatch = useDispatch()
  const [data,setData] = useState(null)
  const [requests, setRequests] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Williams",
        username: "sarahw",
        avatar: "SW",
        role: "Full Stack Developer",
        mutualConnections: 12,
        location: "San Francisco, CA"
      },
      message: "Hi! I saw your React projects and would love to connect. We have several mutual connections in the developer community.",
      timestamp: "2 hours ago",
      skills: ["React", "Node.js", "TypeScript", "MongoDB"]
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        username: "mikec",
        avatar: "MC",
        role: "UI/UX Designer",
        mutualConnections: 8,
        location: "New York, NY"
      },
      message: "Love your design portfolio! Would be great to connect and potentially collaborate on future projects.",
      timestamp: "5 hours ago",
      skills: ["Figma", "UI/UX", "Prototyping", "Design Systems"]
    },
    {
      id: 3,
      user: {
        name: "Emily Rodriguez",
        username: "emilyr",
        avatar: "ER",
        role: "Backend Developer",
        mutualConnections: 5,
        location: "Austin, TX"
      },
      message: "Impressed with your work on the e-commerce platform. Would love to discuss backend architecture patterns.",
      timestamp: "Yesterday",
      skills: ["Python", "Django", "PostgreSQL", "AWS"]
    },
    {
      id: 4,
      user: {
        name: "David Kim",
        username: "davidk",
        avatar: "DK",
        role: "DevOps Engineer",
        mutualConnections: 3,
        location: "Seattle, WA"
      },
      message: "Your cloud infrastructure projects are impressive! Let's connect and share knowledge about DevOps best practices.",
      timestamp: "2 days ago",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD"]
    }
  ]);

  const handleAccept = (requestId) => {
    setRequests(requests.filter(request => request.id !== requestId));
    // In a real app, you would also update the backend
    console.log(`Accepted request ${requestId}`);
  };

  const handleDecline = (requestId) => {
    setRequests(requests.filter(request => request.id !== requestId));
    // In a real app, you would also update the backend
    console.log(`Declined request ${requestId}`);
  };

  const handleAcceptAll = () => {
    setRequests([]);
    console.log("Accepted all requests");
  };
  const processPendingRequests = (res) => {
    const allRequests = []
    for (const req of res.pendingRequests){
      let allSkills = [];
      const about = req.about;
      const username = req.username
      const skills = req.skills
      Object.keys(skills).forEach(key => {
        skills[key].forEach(ele => {
          allSkills.push(ele);
        });
      });
      const currData = {
        allSkills,
        about,
        username
      }
      allRequests.push(currData)
    }
    setData(allRequests)
  }
  useEffect(() => {
    const fetchRequests = async () => {
      const res = await getPendingRequests()
      console.log(res.pendingRequests);
      // const skill = []
      processPendingRequests(res)
      console.log(data);
    }
     fetchRequests()
  },[])
  if (!data) return <div>Loading...</div>
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Pending Requests</h1>
            <p className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {requests.length} connection request{requests.length !== 1 ? 's' : ''} waiting for your response
            </p>
          </div>
          <div className="flex items-center space-x-4">
            
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
          </div>
        </header>

        {/* Empty State */}
        {data.length === 0 ? (
          <div className={`rounded-2xl p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>No Pending Requests</h2>
            <p className={`mb-8 max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              You're all caught up! When someone sends you a connection request, it will appear here.
            </p>
            <button className={`px-6 py-3 rounded-lg ${darkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
              Find People to Connect With
            </button>
          </div>
        ) : (
          <>
            {/* Requests List */}
            <div className="space-y-6">
              {data.map(request => (
                <div key={request.id} className={`rounded-2xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* User Info */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto md:mx-0">
                          <span className="text-white text-2xl font-bold">{request.username.slice(0,2).toLocaleUpperCase()}</span>
                        </div>
                      </div>
                      
                      {/* Request Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                          <div>
                            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {request.username}
                            </h3>
                            {/* <p className={darkMode ? 'text-blue-400' : 'text-blue-600'}>@{request.user.username}</p> */}
                            {/* <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {request.user.role} • {request.user.location}
                            </p> */}
                            {/* <p className={`text-sm mt-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                              {request.user.mutualConnections} mutual connections
                            </p> */}
                          </div>
                          {/* <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2 md:mt-0`}>
                            {request.timestamp}
                          </span> */}
                        </div>
                        
                        
                        
                        {/* Skills */}
                        <div className="mb-6">
                          <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Skills & Expertise</h4>
                          <div className="flex flex-wrap gap-2">
                            {request.allSkills.slice(0,4).map((skill, index) => (
                              <span 
                                key={index} 
                                className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleAccept(request.id)}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 ${darkMode ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecline(request.id)}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Footer */}
            <div className={`mt-8 rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {requests.length}
                  </div>
                  <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Pending Requests</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    428
                  </div>
                  <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Current Connections</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    1.2K
                  </div>
                  <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Profile Views This Month</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PendingRequestsPage;