const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const usersRouter = require("./routers/users");
const postsRouter = require("./routers/posts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

app.use(express.static(path.join(__dirname, "build")));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());

//Connection to MongoDB

mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

if (process.env.NODE_ENV === "development") {
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log(`Database connected`);
  });

  connection.on("error", (error) => {
    console.error("connection error:", error);
  });
}

//-----------------------------------------------------

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://enigmatic-springs-23614.herokuapp.com"
      : "http://localhost:3000",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(cookieParser());

app.use((request, response, next) => {
  response.locals.currentUser = request.session._id;

  next();
});

app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});

module.exports = { server };
