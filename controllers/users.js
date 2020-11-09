const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { param } = require("../routers/users");
const { findById } = require("../models/users");
const { request, response } = require("express");
const { use } = require("chai");
require("dotenv").config();

const createUser = async (request, response, next) => {
  const { firstName, lastName, email, password } = request.body;

  // validate all fields are provided
  if (!firstName || !lastName || !email || !password) {
    return response.status(400).json({ message: "All fields required" });
  }

  // query to verify the user does not already exist in the database
  await User.findOne({ email }, async function (err, user) {
    if (user) {
      return response.status(400).json({ message: "user already exists" });
    } else {
      const userData = await new User({
        firstName,
        lastName,
        email,
        password,
      });

      // create the salt, hash the password and then update the user in the database
      bcrypt.genSalt(10, async function (err, salt) {
        bcrypt.hash(userData.password, salt, async function (err, hash) {
          if (err) throw new err();
          userData.password = hash;
          userData.save();

          // sign and deliver the jwt
          jwt.sign(
            { id: userData.id },
            process.env.jwtSecret,
            { expiresIn: 3600 },
            async (err, token) => {
              if (err) throw err;
              return response
                .cookie("token", token, { httpOnly: true })
                .status(200)
                .json(
                  userData.populate({
                    path: "followedAccounts",
                    select: ["firstName", "lastName"],
                  })
                );
            }
          );
        });
      });
    }
  });
};

const getUsers = async (request, response) => {
  await User.find({ isDeleted: false }, function (error, users) {
    if (error) {
      return response.status(400).send(error);
    } else {
      return response.status(200).send(users);
    }
  });
};

const getUserById = async (request, response) => {
  const id = request.params.identifier;

  await User.findOne(
    {
      _id: id,
    },
    function (error, user) {
      if (error) {
        response.status(400).json(error);
      } else {
        response.status(200).json(user);
      }
    }
  );
};

const updateUser = async (request, response) => {
  const key = Object.keys(request.body);
  const user = await User.findOne({
    _id: request.params.identifier,
  });

  try {
    if (key.includes("password")) {
      bcrypt.genSalt(10, async function (err, salt) {
        bcrypt.hash(request.body.password, salt, async function (error, hash) {
          if (error) throw new error();
          user.password = hash;
          user.save();
          return response.status(200).json(user);
        });
      });
    } else {
      user[key] = request.body[key];
      user.save();
      return response.status(200).json(user);
    }

    // could use some better error handling here, add that to techdebt
  } catch (error) {
    return response.status(400).json(error);
  }
};

const deleteUser = async (request, response) => {
  const id = request.params.identifier;

  await User.deleteOne(
    { _id: id },
    {
      new: true,
    },
    // you can delete users now but you can still log in as them lol
    function (error, userToDelete) {
      if (error) {
        return response.status(400).json(error);
      } else {
        return response.status(200).json(userToDelete);
      }
    }
  );
};

const userSearch = async (request, response) => {
  const searchString = request.body;

  await User.find(
    {
      firstName: searchString.firstName,
    },
    function (error, results) {
      if (error) {
        return response.status(400).json(error);
      } else {
        return response.status(200).json(results);
      }
    }
  );
};

const addUserFollowers = async (request, response) => {
  const currentUser = request.params.identifier;
  const userToFollow = request.body.userToFollow;

  await User.findOne(
    {
      _id: currentUser,
    },
    async function (error, user) {
      if (error) {
        return response.status(400).json(error);
      } else {
        if (
          !user.followedAccounts.includes(userToFollow) &&
          currentUser !== userToFollow
        ) {
          user["followedAccounts"].push(userToFollow);
          user.save();
          await user
            .populate({
              path: "followedAccounts",
              select: ["firstName", "lastName"],
            })
            .execPopulate();
          return response.status(200).json({
            message: `User ${userToFollow} added successfully to ${currentUser}'s follower list`,
            user,
          });
        }
      }
    }
  );
};

const deleteUserFollower = async (request, response) => {
  const currentUser = request.params.identifier;
  const userToUnfollow = request.body.userToUnfollow;

  await User.findOne({ _id: currentUser }, async function (error, user) {
    if (error || !user) {
      return response.status(400).json(error);
    } else {
      user["followedAccounts"] = user["followedAccounts"].filter((account) => {
        if (account._id != userToUnfollow) return true;
      });
      user.save();
      await user
        .populate({
          path: "followedAccounts",
          select: ["firstName", "lastName"],
        })
        .execPopulate();
      return response.status(200).json({
        message: `User ${userToUnfollow} added successfully to ${currentUser}'s follower list`,
        user,
      });
    }
  });
};

const getUserFollowers = async (request, response, next) => {
  await User.findOne(
    {
      _id: request.user.id,
    },
    function (error, user) {
      if (error) {
        console.log(error);
      } else {
        request.followedAccounts = user.followedAccounts;
        next();
      }
    }
  );
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  userSearch,
  addUserFollowers,
  getUserFollowers,
  deleteUserFollower,
};
