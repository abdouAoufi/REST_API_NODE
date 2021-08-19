const fs = require("fs");
const path = require("path");
const User = require("../models/User");

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      posts: posts,
      totalPosts: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const { validationResult } = require("express-validator");

const Post = require("../models/Post");

exports.createPost = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new Error("Validation failed, entred data is incorrect!!");
    error.status(422);
    throw error;
  }
  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;
  const userId = req.userId;
  const post = new Post({
    title,
    content,
    imageUrl: imageUrl,
    creator: userId,
  });
  let creator;
  post
    .save()
    .then((post) => {
      return User.findById(userId);
    })
    .then((user) => {
      if (!user) {
        const error = new Error("User attached not found");
        error.statusCode = 404;
        throw error;
      }
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully",
        post: post,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Not found error");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Post fetched",
      post: post,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new Error("Validation failed, entred data is incorrect!!");
    error.status(422);
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No file picked");
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        console.log("not found post");
        const error = new Error("Post not found!");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized");
        error.statusCode = 403; // not authorized
        throw error;
      }
      if (post.imageUrl !== imageUrl) {
        clearImage(post.imageUrl); // means not the same url so image was updated
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      post.save().then((result) => {
        return res
          .status(200)
          .json({ message: "Post updated ....", post: post });
      });
    })

    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 404;
      next(error);
    });
};

exports.deletePost = (req, res, next) => {
  console.log("reaching ...");
  postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized");
        error.statusCode = 403; // not authorized
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post deleted succefully" });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 404;
      next(error);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
