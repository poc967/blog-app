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
  addUserFollowers,
  deleteUserFollower,
} = require("../controllers/users");

usersRouter.post("/", createUser);
usersRouter.get("/", authorizeUser, getUserFromToken);
// usersRouter.get("/:identifier", getUserById);
usersRouter.delete("/:identifier", deleteUser);
usersRouter.patch("/:identifier", authorizeUser, updateUser);
usersRouter.post("/login", authenticateUser);
usersRouter.get("/logout", clearToken);
usersRouter.post("/search", authorizeUser, userSearch);
usersRouter.post("/add_followers/:identifier", authorizeUser, addUserFollowers),
  usersRouter.post(
    "/del_followers/:identifier",
    authorizeUser,
    deleteUserFollower
  );

module.exports = usersRouter;
