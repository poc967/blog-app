const express = require("express");
const postsRouter = express.Router();
const { authorizeUser } = require("../helpers/security");
const {
  createPost,
  getPosts,
  getPostById,
  getPostByCategory,
  editPost,
  deletePost,
  deleteAllPostsByUser,
} = require("../controllers/posts");

postsRouter.get("/", getPosts);
postsRouter.get("/:identifier", getPostById);
postsRouter.get("/category/:category", getPostByCategory);
// postsRouter.post('/', authorizeUser, createPost)
postsRouter.post("/", createPost);

postsRouter.patch("/:identifier", authorizeUser, editPost);
// postsRouter.delete('/:identifier', authorizeUser, deletePost)
postsRouter.delete("/:identifier", deletePost);
postsRouter.delete(
  "/deleteAllPostsByUser/:identifier",
  authorizeUser,
  deleteAllPostsByUser
);

module.exports = postsRouter;
