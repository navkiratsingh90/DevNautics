import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ActivityCard from "../../components/ActivityCard";
import { getActivities, getUserFeed } from "../../services/activityApis";
import { toast } from "react-toastify";

const FeedPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [posts, setPosts] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [newPost, setNewPost] = useState("");
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, name: "Emma Davis", username: "emdavis", avatar: "ED", mutual: 12 },
    { id: 2, name: "David Kim", username: "davidk", avatar: "DK", mutual: 8 },
    { id: 3, name: "Lisa Wang", username: "lisaw", avatar: "LW", mutual: 15 }
  ]);
  const [showRequests, setShowRequests] = useState(false);
  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        };
      }
      return post;
    }));
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
    setActiveMenu(null);
  };

  const handleEdit = (postId) => {
    console.log("Edit post:", postId);
    setActiveMenu(null);
  };

  const handleAddPost = () => {
    if (newPost.trim() === "") return;
    
    const newPostObj = {
      id: posts.length + 1,
      user: {
        name: "Alex Johnson",
        username: "alexj",
        avatar: "AJ",
        role: "Senior Frontend Developer"
      },
      content: {
        text: newPost,
        media: null,
        mediaType: null
      },
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      isLiked: false,
      isBookmarked: false,
      isOwnPost: true
    };
    
    setPosts([newPostObj, ...posts]);
    setNewPost("");
    setShowNewPostModal(false);
  };

  const handleAcceptRequest = (requestId) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
    // In a real app, you would also update the connection status in your backend
  };

  const handleDeclineRequest = (requestId) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
    // In a real app, you would also update the connection status in your backend
  };

  const trendingTopics = [
    { name: "ReactJS", posts: "12.5K" },
    { name: "TypeScript", posts: "8.7K" },
    { name: "TailwindCSS", posts: "6.3K" },
    { name: "NextJS", posts: "5.9K" },
    { name: "Web Development", posts: "15.2K" }
  ];

  const suggestedUsers = [
    { name: "Tom Wilson", username: "tomw", avatar: "TW", mutual: 5 },
    { name: "Sophie Brown", username: "sophieb", avatar: "SB", mutual: 9 },
    { name: "Chris Lee", username: "chrisl", avatar: "CL", mutual: 3 }
  ];
  useEffect(() => {
    const fetchActivities = async () => {
      const res = await getActivities();
      toast.success("successful")
      console.log(res);
      setPosts(res.data)
    };
  
    fetchActivities();
  }, []);
  if (!posts) return <div>loading...</div>
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Feed - Left Column */}
          <div className="lg:w-2/3">
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
              <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Social Activity</h1>
                <p className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Latest from your network</p>
              </div>
              
              {/* Pending Requests Button */}
              <div className="relative">
                <Link to={'/activity/pending-requests'}>
                <button        
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Pending Requests</span>
                  {pendingRequests.length > 0 && (
                    <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`}>
                      {pendingRequests.length}
                    </span>
                  )}
                </button>
                </Link>

                
              </div>
            </header>

            {/* Posts Feed */}
            <div className="space-y-6">
                <ActivityCard posts={posts}  darkMode={darkMode} />
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:w-1/3 space-y-6">

            {/* Suggested Users */}
            <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-4 border-b border-gray-700">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Suggested Developers</h2>
              </div>
              
              <div className="p-4 space-y-4">
                {suggestedUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">{user.avatar}</span>
                      </div>
                      <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.name}</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.mutual} mutual connections
                        </p>
                      </div>
                    </div>
                    <button className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-blue-700 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;