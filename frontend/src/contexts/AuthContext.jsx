import axios from "axios";
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { token, user } = response.data;
      setUser(user);
      // Save user to localStorage or state
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      const errorMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        "Login failed. Please try again.";
      throw new Error(errorMessage);
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { username, email, password },
        { withCredentials: true }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      // save user to localStorage or state
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      const errorMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        "Signup failed. Please try again.";
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    console.log("this is logout from authContext");
    try {
      await axios.get("http://localhost:5000/api/auth/logout", {
        withCredentials: true,
      });

      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
