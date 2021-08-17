const fs = require("fs");
const path = require("path");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .then((posts) => {
          res.status(200).json({
            posts: posts,
            totalPosts : totalItems
          });
        })
        .catch((err) => {
          console.log(err);
          if (err.statusCode) {
            err.status = 500;
          }
          next(err);
        });
    })
    .catch((err) => {});
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

  const post = new Post({
    title,
    imageUrl: imageUrl,
    content,
    creator: {
      name: "Default author",
    },
  });
  post
    .save()
    .then((post) => {
      res.status(201).json({
        message: "Post created successfully",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Not found error");
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json({
        message: "Post fetched",
        post: post,
      });
    })
    .catch((err) => {
      if (err.statusCode) {
        err.status = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  console.log(postId);
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
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
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
