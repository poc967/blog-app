const express = require("express");
const usersRouter = express.Router();
const {
  authenticateUser,
  getUserFromToken,
  authorizeUser,
  clearToken,
} = require("../helpers/security");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  userSearch,
} = require("../controllers/users");

usersRouter.post("/", createUser, getUserFromToken);
usersRouter.get("/", authorizeUser, getUserFromToken);
usersRouter.get("/:identifier", getUserById);
usersRouter.delete("/:identifier", deleteUser);
usersRouter.patch("/:identifier", authorizeUser, updateUser);
usersRouter.post("/login", authenticateUser, getUserFromToken);
usersRouter.post("/logout", clearToken);
usersRouter.post("/search", authorizeUser, userSearch);

module.exports = usersRouter;
