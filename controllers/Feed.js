exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: 1,
            title: "First post",
            content: "First post content",
            imageUrl: "/images/image.jpg",
            creator: {
                name: "Abdou"
            },
            createdAt: new Date().toISOString()
        }]
    });
}

const {validationResult} = require("express-validator");


exports.createPost = (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({message: "Validation failed, entred data is incorrect!!"})
    }
    const title = req.body.title;
    const content = req.body.content;
    console.log(title , content)
    res.status(201).json({
        post: {
            _id: new Date().toISOString(),
            title: title,
            content: content,
            imageUrl: "/images/image.jpg",
            creator: {
                name: "Abdou"
            },
            createdAt: new Date().toISOString()
        }
    })
}