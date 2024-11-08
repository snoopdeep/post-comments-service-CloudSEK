import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import CommentList from "../components/CommentList";
import { AuthContext } from "../contexts/AuthContext";
import { AlertContext } from "../contexts/AlertContext";
import { formatDistanceToNow } from "date-fns";
import {
  HandThumbUpIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ShareIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { setAlert } = useContext(AlertContext);
  const commentsSectionRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.error("Failed to fetch post", error);
      }
    };

    const fetchComments = async () => {
      try {
        // fetch all level comments of this post including all the nested comments
        const res = await api.get(`/comments/post/${id}`);
        console.log("this is fetchComments of a postm", res);
        setComments(res.data);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  const isLikedByUser = user && post.likes.includes(user._id);

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  const handleLike = async () => {
    if (!user) {
      setAlert({ message: "Please login to like posts", type: "error" });
      return;
    }
    try {
      if (isLikedByUser) {
        // unlike the post
        await api.post(`/posts/${id}/unlike`);
        const updatedLikes = post.likes.filter((userId) => userId !== user._id);
        setPost({ ...post, likes: updatedLikes });
        setAlert({ message: "Post unliked successfully", type: "success" });
      } else {
        // like the post
        await api.post(`/posts/${id}/like`);
        setPost({ ...post, likes: [...post.likes, user._id] });
        setAlert({ message: "Post liked successfully", type: "success" });
      }
    } catch (error) {
      setAlert({ message: "Failed to update like status", type: "error" });
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setAlert({ message: "Please login to comment", type: "error" });
      return;
    }
    try {
      const res = await api.post(`/comments/${id}`, { text: commentText });
      setComments([...comments, res.data]);
      setCommentText("");
      setAlert({ message: "Comment added!", type: "success" });
    } catch (error) {
      setAlert({ message: "Failed to post comment", type: "error" });
    }
  };

  return (
    <div className="flex justify-center bg-gray-200 min-h-screen">
      <div className="w-full max-w-3xl bg-white p-6 mt-8 rounded-lg shadow-md">
        {/* User Info */}
        <div className="flex items-center mb-4">
          <UserIcon className="h-8 w-8 text-gray-500 mr-2" />
          <div>
            <p className="font-semibold">{post.user.username}</p>
            <p className="text-sm text-gray-500">{timeAgo}</p>
          </div>
        </div>
        {/* Post Content */}
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <div
          className="max-w-none mt-2 text-gray-800 mb-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {/* Post Actions */}
        <div className="flex items-center space-x-6 text-gray-600 mb-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 ${
              isLikedByUser ? "text-red-500" : "text-gray-500"
            }`}
          >
            <HandThumbUpIcon className="h-5 w-5" />
            <span>{post.likes.length}</span>
          </button>

          <button
            onClick={() =>
              commentsSectionRef.current.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center space-x-1 text-gray-500"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
            <span>{comments.length}</span>
          </button>

          <button className="flex items-center space-x-1 text-gray-500">
            <ShareIcon className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>
        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <ReactQuill
            value={commentText}
            onChange={setCommentText}
            placeholder="Add a comment"
            className="w-full"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-3 py-1 mt-2 rounded-md"
          >
            Post Comment
          </button>
        </form>
        {/* Comments Section */}
        <div className="mt-6" ref={commentsSectionRef}>
          <CommentList comments={comments} postId={id} />
        </div>
      </div>
    </div>
  );
}

export default PostPage;
