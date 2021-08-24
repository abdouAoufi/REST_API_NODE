const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const app = express();
const { graphqlHTTP } = require("express-graphql");
const graphQlSchema = require("./graphql/schema");
const graphQlResolver = require("./graphql/resolvers");
const cors = require("cors");
const auth = require("./middleware/auth");
const fs = require("fs");
const { clear } = require("console");

// storage configuration....
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

// filter files so only images are accepted ...
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const MONGODBURL = "mongodb://localhost:27017/restapi"; // URL where we store database ...
mongoose
  .connect(MONGODBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("The server running on 127.0.0.1:8080");
    app.listen(8080);
  })

  .catch((err) => console.log(err));

app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images"))); // construct absolut path
app.use(bodyParser.json()); // to accept json data
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(auth);

app.put("/post-images", (req, res, next) => {
  console.log("reaching this rout " , req.body)
  if(!req.isAuth){
    throw new Error("Not auth");
  }
  if (!req.file) {
    return res.status(200).json({ message: "No image provided!" });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath); // if user update post without new image provided
  }
  return res
    .status(201)
    .json({ message: "file stored", filePath: req.file.path });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema.signupSchema,
    rootValue: graphQlResolver.signup,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data || "Data error";
      const message = err.message || "error occurd";
      const code = err.originalError.code || 500;
      return { message, status: code, data };
    },
  })
);

// cross origine request security
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Method", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const data = error.data;
  res.status(status).json({ message: error.message, data: data });
});

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
