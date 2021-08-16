const express = require("express");
const needController = require("../controllers/Feed");
const {
    body
} = require("express-validator")
const router = express.Router();

router.get("/posts", needController.getPosts);
router.post("/post", [body("title").isString().isLength({
    min: 5
}).withMessage("Invalid title!"), body("content").isString().isLength({
    min: 10
}).withMessage("Invalid content!")], needController.createPost);


module.exports = router;