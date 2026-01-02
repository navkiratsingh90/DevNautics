import React, { useEffect, useState } from 'react'
import { deleteActivity, getActivities, likeActivity } from '../services/activityApis'
import CommentModal from './CommentModal'

const ActivityCard = ({posts,darkMode,activeMenu}) => {
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [currPage, setCurrPage] = useState(1)
  const [activities, setActivities] = useState([])
  const [showComments, setShowComments] = useState(false);
const [selectedPost, setSelectedPost] = useState(null);


  const limit = 5

  // ✅ Fetch activities
  const getAllActivities = async () => {
    try {
      const res = await getActivities({ page, limit })
      setActivities(res.data)
      setTotalPages(res.totalPages)
      setCurrPage(res.currentPage)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getAllActivities()
  }, [page])

  const handleDelete = async (id) => {
    await deleteActivity(id)
    getAllActivities() // refresh after delete
  }
  const handleLike = async (id) => {
    setActivities(prev =>
      prev.map(act => {
        if (act._id !== id) return act;

        const isLiked = act.likes.includes(userId);

        return {
          ...act,
          likes: isLiked
            ? act.likes.filter(like => like !== userId)
            : [...act.likes, userId],
          isLiked: !isLiked
        };
      })
    );
    await likeActivity(id)

  }
	return (
		<>
    <CommentModal
  isOpen={showComments}
  onClose={() => setShowComments(false)}
  activityId={selectedPost?._id}
  comments={selectedPost?.comments || []}
  currentUserId={userId}
  darkMode={darkMode}
  onAddComment={addComment}
  onDeleteComment={deleteComment}
/>

			{posts.map(post => (
                <div key={post.id} className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  {/* Post Header */}
                  <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-3">
                        <span className="text-white font-bold">{post.user.avatar}</span>
                      </div>
                      <div>
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{post.user.name}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          @{post.user.username} • {post.timestamp}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{post.user.role}</p>
                      </div>
                    </div>
                    
                    {/* Three Dots Menu */}
                    <div className="relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)}
                        className={`p-2 rounded-full hover:bg-opacity-20 ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeMenu === post.id && (
                        <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} ring-1 ring-black ring-opacity-5 z-10`}>
                          <div className="py-1">
                            {post.isOwnPost ? (
                              <>
                               
                                <button
                                  onClick={() => handleDelete(post.id)}
                                  className={`block w-full text-left px-4 py-2 text-sm ${darkMode ? 'text-red-400 hover:bg-gray-600' : 'text-red-600 hover:bg-gray-100'}`}
                                >
                                  Delete Post
                                </button>
                              </>
                            ) : (
                              <p></p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{post.content.text}</p>
                    
                    {post.content.media && post.content.mediaType === 'image' && (
                      <div className="rounded-lg overflow-hidden mb-4">
                        <img 
                          src={post.content.media} 
                          alt="Post media" 
                          className="w-full h-auto object-cover max-h-96"
                        />
                      </div>
                    )}
                    
                    {/* Engagement Stats */}
                    <div className={`flex text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
                      <span className="mr-4">{post.likes} likes</span>
                     <button 
                     onClick={() => {
                      setSelectedPost(post);
                      setShowComments(true);
                    }}
                     > <span>{post.comments} comments</span></button>
                    </div>

                    {/* Engagement Buttons */}
                    <div className="flex border-t border-b border-gray-700 py-2">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors ${post.isLiked ? 'text-blue-500' : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        Like
                      </button>
                      
                      <button className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                        </svg>
                        Comment
                      </button>
                      
                      <button 
                        onClick={() => handleBookmark(post.id)}
                        className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors ${post.isBookmarked ? 'text-blue-500' : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        Save
                      </button>
                    </div>

                    {/* Comment Input */}
                    <div className="pt-4 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white font-bold text-sm">AJ</span>
                      </div>
                      <div className={`flex-1 rounded-full px-4 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <input 
                          type="text" 
                          placeholder="Write a comment..." 
                          className={`w-full bg-transparent outline-none ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Pagination */}
              <div className="flex justify-center items-center mt-6 gap-2">
                
                {/* Prev Button */}
                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => prev - 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition
                    ${page === 1
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                  Prev
                </button>

                {/* Page Numbers */}
                {currPage}

                {/* Next Button */}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => prev + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition
                    ${page === totalPages
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                  Next
                </button>

              </div>

		</>
	)
}

export default ActivityCard