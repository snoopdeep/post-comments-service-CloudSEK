const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, title } = req.body;
    // check for content
    if (!content) return res.status(400).json({ msg: 'Content is required' });

    const post = new Post({
      user: req.user.id,
      content,
      title: title || ''
    });

    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Get all posts with top-level comments
exports.getPosts = async (req, res) => {

  try {
    const posts = await Post.find()
      .populate('user', ['username'])
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username'
        }
      });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Get a single post with its  comments
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', ['username'])
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username'
        }
      });

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Like a post 
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if already liked
    if (post.likes.includes(req.user.id))
      return res.status(400).json({ msg: 'Post already liked' });

    // push the user id in the likes array of this post
    post.likes.push(req.user.id);
    await post.save();

    res.status(200).json(post.likes);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if not yet liked
    if (!post.likes.includes(req.user.id))
      return res.status(400).json({ msg: 'Post has not yet been liked' });

    // remove the user data from the likes array
    post.likes = post.likes.filter(
      (userId) => userId.toString() !== req.user.id
    );

    await post.save();

    res.status(200).json(post.likes);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
