const Posts = require("../models/posts");
const { parseCategoriesToArray } = require("../helpers/cleaners");

const createPost = async (request, response) => {
  const { title, category, body, author } = request.body;

  if (!title || !category || !body || !author) {
    return response
      .status(400)
      .json("All fields required: title, category, body");
  }

  const newPost = {
    title,
    author,
    category,
    body,
  };

  await Posts.create(newPost, async function (error, newPost) {
    if (error) {
      console.log(error);
      return response.status(400).json(error);
    } else {
      const updatedNewPost = await Posts.populate(newPost, {
        path: "author",
        model: "User",
      });
      return response.status(201).json(updatedNewPost);
    }
  });
};

const getPosts = async (request, response) => {
  await Posts.find({ isDeleted: false })
    .populate("author")
    .exec(function (error, posts) {
      if (error) {
        return response.status(400).json(error);
      } else {
        return response.status(200).json(posts);
      }
    });
};

const getPostById = async (request, response) => {
  const id = request.params.identifier;

  await Posts.findOne({ _id: id, isDeleted: false }, function (error, post) {
    if (error) {
      return response.status(400).json(error);
    } else {
      return response.status(200).json(post);
    }
  });
};

const getPostByCategory = async (request, response) => {
  const category = request.params.category;

  if (!category) {
    return response.status(400).json("Please provide a category");
  }

  const parsedCategories = parseCategoriesToArray(category);

  await Posts.find(
    { isDeleted: false, category: { $in: parsedCategories } },
    function (error, posts) {
      if (error) {
        return response.status(400).json(error);
      } else {
        return response.status(201).json(posts);
      }
    }
  );
};

const editPost = async (request, response) => {
  const { title, category, body } = request.body;
  const id = request.params.identifier;

  await Posts.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { title, category, body },
    { new: true },
    function (error, newPost) {
      if (error) {
        return response.status(400).json(error);
      } else {
        return response.status(200).json(newPost);
      }
    }
  );
};

const deletePost = async (request, response) => {
  const id = request.params.identifier;

  await Posts.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
    function (error, deletedPost) {
      if (error) {
        return response.status(400).json(error);
      } else {
        return response.status(200).json(deletedPost);
      }
    }
  );
};

const deleteAllPostsByUser = async (request, response) => {
  const id = request.params.identifier;

  await Posts.deleteMany({ author: id }, function (error, postsToDelete) {
    if (error) {
      return response.status(400).send(error);
    } else {
      return response.status(200).json(postsToDelete);
    }
  });
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  getPostByCategory,
  editPost,
  deletePost,
  deleteAllPostsByUser,
};
