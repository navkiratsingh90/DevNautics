import React, { useEffect, useState } from 'react'
import { addComment, deleteActivity, getActivities, getUserFeed, likeActivity } from '../services/activityApis'
import CommentModal from './CommentModal'
import { IoSend } from "react-icons/io5"; // arrow icon
import { useSelector } from 'react-redux';


const ActivityCard = ({post,darkMode, currentPage, totalPage}) => {
  const [page, setPage] = useState(1)
  const [posts,setPosts] = useState(post)
  const [totalPages, setTotalPages] = useState(totalPage)
  const [activeMenu, setActiveMenu] = useState(null);
   const [comment, setComment] = useState("");
  const [currPage, setCurrPage] = useState(currentPage)
  const [userFeed, setUserFeed] = useState([])
  const [showComments, setShowComments] = useState(false);
const [selectedPost, setSelectedPost] = useState(null);
  const userId = useSelector((state) => state.Auth.userId)

  console.log("posts = ", posts);
  const limit = 3
  const handleSubmitComment = async (id) => {
    console.log(comment);
    if (comment.trim().length == 0) return;
    const res = await addComment(id, comment)
    console.log(res);
  };
  // const getUserFeed = async () => {
  //     const res = await getUserFeed({ page, limit })
  //     setUserFeed(res.data)
  //     setTotalPages(res.totalPages)
  //     setCurrPage(res.currentPage)
  // }
  const showCommentBox = (post) => {
    setSelectedPost(post)
    setShowComments(true);
  }
  const handleDelete = async (id) => {
    // await deleteActivity(id)
    // getUserFeed() // refresh after delete
  }
  const handleLike = async (id) => {
    setUserFeed(prev =>
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
    // await likeActivity(id)

  }
  useEffect(() => {
    const fetchActivities = async () => {
      const res = await getActivities({page});
      // toast.success("successful")/
      console.log(res);
      setTotalPages(res.totalPages)
      setCurrPage(res.currentPage)
      setPosts(res.data)
    };
  
    fetchActivities();
  }, [page])
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
  onDeleteComment={handleDelete()}
/>

			{posts.map(post => (
                <div key={post.id} className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  {/* Post Header */}
                  <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-3">
                        <span className="text-white font-bold">pic</span>
                      </div>
                      <div>
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{post.createdBy.username}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          @{post.createdBy.username} • {post.createdAt.toString().slice(0,9)}
                        </p>
                        {/* <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{post.user.role}</p> */}
                      </div>
                    </div>
                    
                    {/* Three Dots Menu */}
                    <div className="relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === post._id ? null : post._id)}
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
                            {post.createdBy._id == userId ? (
                              <>
                               
                                <button
                                  onClick={() => handleDelete(post._id)}
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
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{post.description}</p>
                    
                    {post.file  && (
                      <div className="rounded-lg overflow-hidden mb-4">
                        <img 
                          src={post.file} 
                          alt="Post media" 
                          className="w-full h-auto object-cover max-h-96"
                        />
                      </div>
                    )}
                    
                    {/* Engagement Stats */}
                    <div onClick={() => handleLike(post.id)} className={`flex text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
                      <span className="mr-4">{post.likes.length} likes</span>
                     <button 
                     onClick={() => {
                      setSelectedPost(post);
                      setShowComments(true);
                    }}
                     > <span>{post.comments.length} comments</span></button>
                    </div>

                    {/* Engagement Buttons */}
                    <div className="flex border-t border-b border-gray-700 py-2">
                      <button 
                        onClick={() => handleLike(post._id)}
                        className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors ${post.isLiked ? 'text-blue-500' : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        Like
                      </button>
                      
                      <button
                      onClick={() => showCommentBox(post)}
                       className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                        </svg>
                        Comment
                      </button>
                      
                      <button 
                        onClick={() => handleBookmark(post._id)}
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
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold text-sm">AJ</span>
                    </div>

                    {/* Input */}
                    <div
                      className={`flex-1 flex items-center rounded-full px-4 py-2 ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className={`flex-1 bg-transparent outline-none ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                       
                      />

                      {/* Arrow Button */}
                      <button
                        onClick={() => handleSubmitComment(post._id)}
                        disabled={!comment.trim()}
                        className={`ml-3 p-2 rounded-full transition ${
                          comment.trim()
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-400 cursor-not-allowed text-white"
                        }`}
                      >
                        <IoSend size={18} />
                      </button>
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