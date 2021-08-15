const express = require("express");
const needController = require("../controllers/need")

const router = express.Router();

router.get("/posts" , needController.getPosts);
router.post("/post" , needController.createPost);


module.exports = router ;