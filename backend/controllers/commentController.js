const Comment = require("../models/Comment");

// Create a new comment on a post or create a reply to an existing comment
exports.createComment = async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    const { postId } = req.params;

    if (!text) return res.status(400).json({ msg: "Text is required" });

    // create a new commente and save to db
    const comment = new Comment({
      post: postId,
      parentComment: parentComment || null, // set parentComment to null if it's a top-level comment, else parent comment
      user: req.user.id,
      text,
    });
    await comment.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Fetch all top-level comments and their nested replies for a given post
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find all top-level comments for the specified post
    const comments = await Comment.find({
      post: postId,
      parentComment: null, // Only retrieve top-level comments
    })
      .populate("user", ["username"]) // Populate username of the user who made each comment
      .populate({
        path: "replies", // Populate nested replies
        populate: {
          path: "user", // Populate the username for each reply author
          select: "username",
        },
      });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Add a like to a specific comment
exports.likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // Check if the user has already liked this comment
    if (comment.likes.includes(req.user.id))
      return res.status(400).json({ msg: "Comment already liked" });

    // Add the user's ID to the likes array and save the updated comment
    comment.likes.push(req.user.id);
    await comment.save();

    res.status(201).json(comment.likes);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Remove a like from a specific comment
exports.unlikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // Check if user has not liked this comment
    if (!comment.likes.includes(req.user.id))
      return res.status(400).json({ msg: "Comment has not yet been liked" });

    // Remove the user from the likes array
    comment.likes = comment.likes.filter(
      (userId) => userId.toString() !== req.user.id
    );

    await comment.save();

    res.status(200).json(comment.likes);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Retrieve a single comment and its replies ie nested comments if any
exports.getCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Find the comment by its ID and populate user information and replies
    const comment = await Comment.findById(commentId)
      .populate("user", ["username"])
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "username",
        },
      });

    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
