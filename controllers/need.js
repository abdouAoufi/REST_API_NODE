exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            title: "First post",
            content: "First post content",
            date: "13-07-1999"
        }]
    });
}

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    res.status(201).json({
        message: "Post created successfully !",
        post: {
            id: new Date().toISOString(),
            title,
            content
        }
    })
}