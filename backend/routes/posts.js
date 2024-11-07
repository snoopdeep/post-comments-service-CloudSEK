const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

// get all posts
router.get("/", postController.getPosts);

// get post by ID
router.get("/:id", postController.getPostById);

// create a post
router.post("/", authMiddleware, postController.createPost);

// like a post
router.post("/:id/like", authMiddleware, postController.likePost);

// unlike a post
router.post("/:id/unlike", authMiddleware, postController.unlikePost);

module.exports = router;
