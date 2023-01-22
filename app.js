//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/infoDB", { useNewUrlParser: true });
// mongoose.set('strictQuery', true);

const articleSchema = {
    title: String,
    desc: String
};

const Article = mongoose.model("Article", articleSchema)

/////////////////////////////////All Articles//////////////////////

app.route("/articles")

    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            }
            else {
                res.send(err);
            }
        });
    })

    .post(function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            desc: req.body.desc
        });

        newArticle.save(function (err) {
            if (!err) {
                res.send("sucessfully added a new article");
            }
            else {
                res.send(err);
            }
        });
    })

    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Sucessfully deleted all articles.");
            }
            else {
                res.send(err);
            }
        });
    });

/////////////////////////////////// for specific Articles //////////////////////

app.route("/articles/:articleTitle")

    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticles) {
            if (foundArticles) {
                res.send(foundArticles);
            } else {
                res.send("No articles matching that title was found");
            }
        });
    })

    .put(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, desc: req.body.desc },
            // {overwrite: true},
            function (err) {
                if (!err) {
                    res.send("successfully updated articles.");
                }
                else {
                    res.send(err);
                }
            });
    })

    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("successfully updated articles.");
                }
                else {
                    res.send(err);
                }
            });
    })

    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (err) {
                if (!err) {
                    res.send("successfully deleted the article.");
                } else {
                    res.send(err);
                }
            });
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});