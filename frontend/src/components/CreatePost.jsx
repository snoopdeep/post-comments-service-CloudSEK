import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { AlertContext } from "../contexts/AlertContext";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";
import api from "../services/api";

function CreatePost() {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);

  // quill editor modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  const handlePostCreation = async () => {
    if (!title.trim()) {
      setAlert({ message: "Please enter a title", type: "error" });
      return;
    }

    if (!content.trim()) {
      setAlert({ message: "Please enter some content", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/posts", {
        title: title.trim(),
        content: content.trim(),
      });

      setAlert({ message: "Post created successfully!", type: "success" });
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Failed to create post. Please try again.";
      setAlert({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-4 p-4 max-w-2xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>

        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter post title"
            disabled={loading}
          />
        </div>

        <div className="mb-14">
          <label
            htmlFor="content"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Content
          </label>
          <div className="border rounded-md">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Write your post content here..."
              className="h-64"
              id="content"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handlePostCreation}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
