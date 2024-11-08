import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { AlertContext } from "../contexts/AlertContext";
import { FiUser } from "react-icons/fi";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setAlert({ message: "Logout successful!", type: "success" });
      navigate("/login");
    } catch (error) {
      setAlert({
        message: error.message || "Logout failed. Please try again.",
        type: "error",
      });
      console.error("Logout error:", error);
    }
  };

  const handleCreatePost = () => {
    if (user) {
      navigate("/create-post");
    } else {
      setAlert({
        message: "You need to be logged in to create a post.",
        type: "error",
      });
    }
  };

  return (
    <nav className="bg-navbar-color text-white p-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-lg font-bold flex items-center space-x-2">
        <img src="/new-message.png" alt="Logo" className="w-9 h-9" />
      </Link>

      {/* Links  */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleCreatePost}
          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
        >
          Create Post
        </button>
        {user ? (
          <>
            <FiUser className="text-xl" />
            <span className="mr-4">Hello, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline text-black">
              Login
            </Link>
            <span className="text-black">|</span>
            <Link to="/signup" className="hover:underline text-black">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
