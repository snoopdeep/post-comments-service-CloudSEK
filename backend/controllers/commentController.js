const Comment = require("../models/Comment");

// Create a new comment on a post or create a reply to an existing comment
exports.createComment = async (req, res) => {
  console.log('this is create comment controller.. ');
  // console.log(req.body);
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

// Fetch all comments for a post and build a nested comment tree
exports.getCommentsByPost = async (req, res) => {
  console.log('this is getCommentsByPost controller');

  try {
    const { postId } = req.params;

    // Fetch all comments for the specified post
    const comments = await Comment.find({ post: postId })
      .populate("user", ["username"])
      .lean(); // Use .lean() to get plain JavaScript objects

    // Build a map of comments by _id
    const commentsById = {};
    comments.forEach(comment => {
      comment.replies = [];
      commentsById[comment._id.toString()] = comment;
    });

    // Build the comment tree
    const topLevelComments = [];
    comments.forEach(comment => {
      if (comment.parentComment) {
        // This comment is a reply
        const parentCommentId = comment.parentComment.toString();
        const parentComment = commentsById[parentCommentId];
        if (parentComment) {
          parentComment.replies.push(comment);
        }
      } else {
        // This is a top-level comment
        topLevelComments.push(comment);
      }
    });

    res.status(200).json(topLevelComments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


// Add a like to a specific comment
exports.likeComment = async (req, res) => {
  console.log('this is likeComment Controller');

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
  console.log('this is unlikecomment controller');

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
  console.log('this is getCommentById controller');

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
