const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateUser = async (request, response, next) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ message: "All fields required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return response.status(400).json({ message: "user does not exist" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return response.status(400).json({ message: "invalid credentials" });
  } else {
    const userWithNoPassword = await User.findById(user.id).select("-password");

    jwt.sign(
      { id: user.id },
      process.env.jwtSecret,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        return response
          .cookie("token", token, { httpOnly: true })
          .status(200)
          .json(userWithNoPassword);
      }
    );
  }
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
  const token = request.cookies.token;

  if (token) {
    return response
      .clearCookie("token")
      .status(200)
      .json({ message: "token cleared successfully" });
  } else {
    return response.status(400).json({ message: "no token found" });
  }
};

const getUserFromToken = async (request, response) => {
  console.log("getting user from token now");
  try {
    const currentUser = await User.findById(request.user.id).select(
      "-password"
    );
    if (!currentUser) throw new Error("user does not exist");
    return response.status(201).send(currentUser);
  } catch (error) {
    return response.status(400).json(error);
  }
};

module.exports = {
  authorizeUser,
  authenticateUser,
  getUserFromToken,
  clearToken,
};
