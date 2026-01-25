import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostActivity from "./PostActivity";
import PostCard from "./PostCard";
import { handleTheme } from "../Features/ThemeSlice";
import ActivityCard from "./ActivityCard";
import { createActivity, getActivities } from "../services/activityApis";

const SocialFeed = () => {
  const darkMode = useSelector((state) => state.Theme.darkMode);
  const userId = useSelector((state) => state.Auth.userId);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
const [mediaPreview, setMediaPreview] = useState(null);

  const dispatch = useDispatch();
  
  const [posts, setPosts] = useState([])

  const [newPost, setNewPost] = useState("");

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
  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };
  const handleAddPost = async () => {
    // if (newPost.trim() === "") return;/./
  
    const formData = new FormData();
    formData.append("description", newPost);
    if (mediaFile) formData.append("file", mediaFile);
    // formData.append("userId", userId);/
  
    await createActivity(formData);
  
    setNewPost("");
    setMediaFile(null);
    setMediaPreview(null);
    setShowNewPostModal(false);
  };
    
  // const handleAddPost = () => {
  //   if (newPost.trim() === "") return;
  //   setNewPost("");
  //   setShowNewPostModal(false);
  // };
  useEffect(() => {
    const fetchActivities = async () => {
      const res = await getActivities();
      // toast.success("successful")
      console.log(res);
      setPosts(res.data)
    };
  
    fetchActivities();
  }, []);
  if (!posts) return <div>loading...</div>
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[var(--color-darkBlue)]' : 'bg-[var(--color-white)]'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Developer Network</h1>
            <p className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Connect, collaborate, and grow together</p>
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
              <svg xmlns="http://www.w3.org/2000/ssvg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </header>
        <div className="space-y-4">
  {/* Description */}
  <textarea
    value={newPost}
    onChange={(e) => setNewPost(e.target.value)}
    placeholder="Describe your activity..."
    rows="4"
    className={`w-full p-3 rounded-lg outline-none ${
      darkMode
        ? "bg-gray-700 text-white border-gray-600"
        : "bg-gray-100 text-gray-800 border-gray-300"
    } border`}
  />

  {/* File Picker */}
  <label
    className={`flex items-center justify-center w-full p-3 rounded-lg cursor-pointer border-dashed border-2 ${
      darkMode
        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
        : "border-gray-300 text-gray-600 hover:bg-gray-100"
    }`}
  >
    <input
      type="file"
      accept="image/*,video/*"
      onChange={handleMediaSelect}
      className="hidden"
    />
    <span className="font-medium">
      {mediaFile ? mediaFile.name : "Select Image / Video"}
    </span>
  </label>

  {/* Preview */}
  {mediaPreview && (
    <div className="rounded-lg overflow-hidden">
      {mediaFile?.type.startsWith("video") ? (
        <video
          src={mediaPreview}
          controls
          className="w-full rounded-lg"
        />
      ) : (
        <img
          src={mediaPreview}
          alt="preview"
          className="w-full rounded-lg"
        />
      )}
    </div>
  )}

  {/* Submit Button */}
  <div className="flex justify-end">
    <button
      onClick={handleAddPost}
      disabled={newPost.trim() === ""}
      className={`px-4 py-2 rounded-lg ${
        newPost.trim() === ""
          ? "bg-blue-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      } text-white`}
    >
      Launch Activity
    </button>
  </div>
</div>


        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Social Feed */}
          <div className="lg:w-2/3">
            <ActivityCard post={posts}  darkMode={darkMode} />
          </div>
</div>
        {/* Create Post Modal */}
        {showNewPostModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl shadow-lg w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Create Post</h2>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">AJ</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Alex Johnson</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>@alexj</p>
                  </div>
                </div>
                
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind?"
                  rows="4"
                  className={`w-full p-3 rounded-lg mb-4 outline-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border`}
                ></textarea>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-3">
                    <button className={`p-2 rounded-full ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className={`p-2 rounded-full ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddPost}
                    disabled={newPost.trim() === ""}
                    className={`px-4 py-2 rounded-lg ${newPost.trim() === "" ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialFeed;