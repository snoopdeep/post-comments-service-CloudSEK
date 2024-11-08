import React, { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { AlertContext } from "../contexts/AlertContext";
import { formatDistanceToNow } from "date-fns";
import {
  HandThumbUpIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CommentItem({ comment, postId, level }) {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [likes, setLikes] = useState(comment.likes);
  const [replies, setReplies] = useState(comment.replies || []);
  const isLikedByUser = user && likes.includes(user._id);
  const likesCount = likes.length;

  const handleLike = async () => {
    if (!user) {
      setAlert({ message: "Please login to like comments", type: "error" });
      return;
    }
    try {
      if (isLikedByUser) {
        // Unlike the comment
        await api.post(`/comments/${comment._id}/unlike`);
        setLikes(likes.filter((userId) => userId !== user._id));
        setAlert({ message: "Comment unliked successfully", type: "success" });
      } else {
        // Like the comment
        await api.post(`/comments/${comment._id}/like`);
        setLikes([...likes, user._id]);
        setAlert({ message: "Comment liked successfully", type: "success" });
      }
    } catch (error) {
      console.error("Failed to update like status", error);
      setAlert({ message: "Failed to update like status", type: "error" });
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setAlert({ message: "Please login to reply", type: "error" });
      return;
    }
    try {
      const res = await api.post(`/comments/${postId}`, {
        text: replyText,
        parentComment: comment._id,
      });
      setReplies([...replies, res.data]);
      setReplyText("");
      setShowReplyForm(false);
      setAlert({ message: "Reply added!", type: "success" });
    } catch (error) {
      console.error("Failed to post reply", error);
      setAlert({ message: "Failed to post reply", type: "error" });
    }
  };

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  return (
    <div className={`ml-${level * 4} mt-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-2">
          <UserIcon className="h-6 w-6 text-gray-500" />
        </div>
        <div>
          <div className="bg-gray-100 p-2 rounded-lg">
            <p className="font-semibold">{comment.user.username}</p>
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: comment.text }}
            />
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                isLikedByUser ? "text-red-500" : "text-gray-500"
              }`}
            >
              <HandThumbUpIcon className="h-4 w-4" />
              <span>{likesCount}</span>
            </button>
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center space-x-1 text-gray-500"
            >
              <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
              <span>Reply</span>
            </button>
            <span className="text-gray-400">{timeAgo}</span>
          </div>
          {showReplyForm && (
            <form onSubmit={handleReplySubmit} className="mt-2">
              <ReactQuill
                value={replyText}
                onChange={setReplyText}
                placeholder="Write a reply..."
                className="w-full"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-3 py-1 mt-1 rounded-md"
              >
                Post Reply
              </button>
            </form>
          )}
          {/* Render replies recursively */}
          {replies.length > 0 && (
            <div>
              {replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  postId={postId}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
