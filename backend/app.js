const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser=require('cookie-parser');
const cors = require('cors');

// import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

// load the environment variables
dotenv.config();

const app = express();

// connect to database
connectDB();

// middleware to parse json data
app.use(express.json());

// cookie-parser middleware
app.use(cookieParser());

// cors

app.use(cors({
    origin: 'http://localhost:5173', // Update this to match your frontend URL
    credentials: true,
  }));

// use Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
