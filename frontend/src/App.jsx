import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import { AlertProvider } from './contexts/AlertContext';
import Alert from './components/Alert';
import CreatePost from './components/CreatePost';
import './App.css'

function App() {
  return (
    <AlertProvider>
      <Alert />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:id" element={<PostPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </AlertProvider>
  );
}

export default App;
