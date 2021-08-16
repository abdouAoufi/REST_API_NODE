const express = require("express");
const needController = require("../controllers/Feed");
const {
    body
} = require("express-validator")
const router = express.Router();

router.get("/posts", needController.getPosts);
router.post("/post", [body("title").isString().isLength({
    min: 7
}).withMessage("Invalid title!"), body("content").isString().isLength({
    min: 5
}).withMessage("Invalid content!")], needController.createPost);

router.get("/post/:postId", needController.getPost);


module.exports = router;