import React from "react";
import { Link } from "react-router-dom";
import { HandThumbUpIcon, ChatBubbleLeftIcon, UserIcon } from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";

const PostItem = ({ post }) => {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  
  // truncation post.content to 60 words
  const truncatedContent = post.content
    .split(/\s+/)
    .slice(0, 60)
    .join(' ') + (post.content.split(/\s+/).length > 60 ? '...' : '');

  return (
    <div className="bg-gray-200 rounded-lg shadow-md p-4 w-150 text-center relative">
      <div className="absolute top-2 left-4 flex items-center text-gray-500 space-x-1">
        <UserIcon className="w-4 h-4" />
        <span className="text-sm font-medium">{post.user.username}</span>
        <span className="text-xs text-gray-400">• {timeAgo}</span>
      </div>

      <h2 className="text-lg font-semibold text-red-500 mt-4">
        <Link to={`/posts/${post._id}`}>{post.title}</Link>
      </h2>

      <div 
        // className="prose prose-sm max-w-none mt-2 prose-headings:text-xl prose-headings:font-bold prose-strong:font-bold prose-em:italic"
        className="max-w-none mt-2 text-gray-800 mb-4"
        dangerouslySetInnerHTML={{ __html: truncatedContent }}
      />

      <div className="flex items-center justify-around mt-4 text-gray-600">
        <div className="flex items-center">
          <HandThumbUpIcon className="w-5 h-5 mr-1" />
          {post.likes.length}
        </div>
        <div className="flex items-center">
          <ChatBubbleLeftIcon className="w-5 h-5 mr-1" />
          {post.comments.length}
        </div>
      </div>
    </div>
  );
};

export default PostItem;