const express = require("express");
const bodyParser = require("body-parser")
const router = require("./routes/FeedController");
const app = express();
const mongoose = require("mongoose");


const MONGODBURL = "mongodb://localhost:27017/restapi"; // URL where we store database ...
mongoose
    .connect(MONGODBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("The server running on 127.0.0.1:3000");
        app.listen(3001);
    })
    .catch((err) => console.log(err));


app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET, POST, PUT , PATCH , DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use("/feed", router);