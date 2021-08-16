exports.getPosts = (req, res, next) => {
  
    Post.find().then(posts => {
        res.status(200).json({
            posts: posts
        })
    }).catch(err => {
        console.log(err);
        if (err.statusCode) {
            err.status = 500;
        }
        next(err);
    })
}

const {
    validationResult
} = require("express-validator");


const Post = require("../models/Post")

exports.createPost = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const error = new Error("Validation failed, entred data is incorrect!!");
        error.status(422);
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title,
        imageUrl: "/images/image.jpg",
        content,
        creator: {
            name: "Default author"
        }
    });
    post.save().then(post => {
        res.status(201).json({
            message: "Post created successfully",
            post: post
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}


exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId).then(post => {
        if (!post) {
            const error = new Error("Not found error");
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({
            message: "Post fetched",
            post: post
        })
    }).catch(err => {
        if (err.statusCode) {
            err.status = 500;
        }
        next(err);
    })
}