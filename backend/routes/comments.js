const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

// create a comment on a post
router.post("/:postId", authMiddleware, commentController.createComment);

// get comments for a post
router.get("/post/:postId", commentController.getCommentsByPost);

// create a reply comment to a comment
router.post(
  "/:postId/reply/:parentCommentId",
  authMiddleware,
  (req, res, next) => {
    req.body.parentComment = req.params.parentCommentId;
    next();
  },
  commentController.createComment
);

// get a comment by id with its replies
router.get("/:commentId", commentController.getCommentById);

// like a comment
router.post("/:commentId/like", authMiddleware, commentController.likeComment);

// unlike a comment
router.post(
  "/:commentId/unlike",
  authMiddleware,
  commentController.unlikeComment
);

module.exports = router;
