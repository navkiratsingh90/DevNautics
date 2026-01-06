import React, { useState } from "react";
import { deleteComment } from "../services/activityApis";

const CommentModal = ({
  isOpen,
  onClose,
  activityId,
  comments = [],
  currentUserId,
  darkMode,
  onAddComment,
}) => {
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!content.trim()) return;
    onAddComment(activityId, content);
    setContent("");
  };
	const onDeleteComment = async (actId,comId) => {
		await deleteComment(actId,comId)
	}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div
        className={`w-full max-w-xl rounded-xl shadow-lg ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <h2 className="font-semibold text-lg">Comments</h2>
          <button onClick={onClose} className="text-xl font-bold">
            ×
          </button>
        </div>

        {/* Comments List */}
        <div className="max-h-80 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 && (
            <p className="text-sm text-gray-400">No comments yet</p>
          )}

          {comments.map(comment => (
            <div
              key={comment._id}
              className={`flex gap-3 p-3 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {comment.createdBy.username?.[0]}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">
                      {comment.createdBy.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      @{comment.createdBy.username}
                    </p>
                  </div>

                  {/* Delete Button */}
                  {comment.createdBy._id === currentUserId && (
                    <button
                      onClick={() =>
                        onDeleteComment(activityId, comment._id)
                      }
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <p className="mt-1 text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <div className="p-4 border-t border-gray-600 flex gap-2">
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write a comment..."
            className={`flex-1 px-4 py-2 rounded-full outline-none ${
              darkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
