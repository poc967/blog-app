const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prodCookie, devCookie } = require("../cookie_config");
require("dotenv").config();

const authenticateUser = async (request, response, next) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ message: "All fields required" });
  }

  await User.findOne({ email }, async function (error, user) {
    if (error || !user) {
      return response.status(400).json({ message: "user does not exist" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return response.status(400).json({ message: "invalid credentials" });
      } else {
        jwt.sign(
          { id: user.id },
          process.env.jwtSecret,
          { expiresIn: 3600 },
          async (err, token) => {
            if (err) throw err;
            return response
              .cookie(
                "token",
                token,
                process.env.NODE_ENV === "development" ? devCookie : prodCookie
              )
              .status(200)
              .json(
                await User.findOne({ _id: user._id })
                  .select("-password")
                  .populate({
                    path: "followedAccounts",
                    select: ["firstName", "lastName"],
                  })
                  .exec()
              );
          }
        );
      }
    }
  });
};

const authorizeUser = (request, response, next) => {
  const token = request.cookies.token;

  if (!token) {
    return response
      .status(401)
      .json({ message: "no token found, authorization denied" });
  } else {
    try {
      const decodedToken = jwt.verify(token, process.env.jwtSecret);
      request.user = decodedToken;
      next();
    } catch (e) {
      return response
        .clearCookie("token")
        .status(401)
        .json({ message: "bad token" });
    }
  }
};

const clearToken = (request, response) => {
  if (request.cookies.token) {
    return response
      .clearCookie("token")
      .status(200)
      .json({ message: "token cleared successfully" });
  } else {
    return response.status(400).json({ message: "no token found" });
  }
};

const getUserFromToken = async (request, response) => {
  await User.findById(request.user.id)
    .select("-password")
    .populate({ path: "followedAccounts", select: ["firstName", "lastName"] })
    .exec(function (error, currentUser) {
      if (error || !currentUser) {
        return response.status(400).json("no user");
      } else {
        return response.status(200).json(currentUser);
      }
    });
};

module.exports = {
  authorizeUser,
  authenticateUser,
  getUserFromToken,
  clearToken,
};
