const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view-engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("Article", articleSchema);

async function getArticles() {
  const Articles = await Article.find({});
  return Articles;
}

app
  .route("/articles")
  .get(async function (req, res) {
    try {
      await getArticles().then(function (foundArticles) {
        res.send(foundArticles);
      });
    } catch (error) {
      res.send(error);
    }
  })

  .post(async function (req, res) {
    try {
      const newArticle = await new Article({
        title: req.body.title,
        content: req.body.content,
      });
      await newArticle.save();
      res.send("success");
    } catch (error) {
      res.send(err);
    }
  })

  .delete(async function (req, res) {
    try {
      await Article.deleteMany({});
      res.send("Deleted successfully!");
    } catch (error) {
      res.send(error);
    }
  });

app
  .route("/articles/:articleTitle")
  .get(async function (req, res) {
    try {
      const foundArticle = await Article.findOne({
        title: req.params.articleTitle,
      });
      res.send(foundArticle);
    } catch (error) {
      res.send(error);
    }
  })
  .put(async function (req, res) {
    try {
      await Article.updateOne(
        { title: req.params.articleTitle },
        {
          $set: { title: req.body.title, content: req.body.content },
        },
        { overwrite: true }
      );
      res.send("Successfully Updated");
    } catch (error) {
      res.send(error);
    }
  })
  .patch(async function (req, res) {
    try {
      await Article.updateOne(
        { title: req.params.articleTitle },
        { $set: req.body }
      );
      res.send("Successfully Updated");
    } catch (error) {
      res.send(error);
    }
  })
  .delete(async function (req, res) {
    try {
      await Article.deleteOne({
        title: req.params.articleTitle,
      });
      res.send("Successfully Deleted");
    } catch (error) {
      res.send(error);
    }
  });

app.listen(3000, function () {
  console.log("Server has started on port 3000");
});
