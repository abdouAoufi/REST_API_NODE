const express = require("express");
const needController = require("../controllers/Feed");
const { body } = require("express-validator");
const router = express.Router();
const isAuth = require("../middleware/is-auth");

router.get("/posts", isAuth, needController.getPosts);
router.post(
  "/post/:postId",
  [
    body("title")
      .isString()
      .isLength({
        min: 5,
      })
      .withMessage("Invalid title!"),
    body("content")
      .isString()
      .isLength({
        min: 5,
      })
      .withMessage("Invalid content!"),
  ],
  needController.updatePost
);

router.post(
  "/post",
  [
    body("title")
      .isString()
      .isLength({
        min: 5,
      })
      .withMessage("Invalid title!"),
    body("content")
      .isString()
      .isLength({
        min: 5,
      })
      .withMessage("Invalid content!"),
  ],
  needController.createPost
);
router.get("/delete/:postId", needController.deletePost);

router.get("/post/:postId", needController.getPost);

module.exports = router;
