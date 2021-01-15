//=========================INIT================================================
//Mongoose
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});
const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);

//Express
const express = require('express');
const app = express();
app.use(express.static("public"));
const port = 3000;

//EJS
const ejs = require('ejs');
app.set('view engine', 'ejs');

//Body-Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//=============================================================================

//=================================ALL ARTICLES================================
app.route('/articles')

//This sends back every document as requested through URL
  .get(function(req, res) {
      Article.find(function(err, foundArticles) {
        if (!err) {
          res.send(foundArticles);
          console.log(foundArticles);
        } else {
          res.send(err);
        }
      });
    })

//This deletes every article. Request made through postman
    .delete(function(req, res) {
      Article.deleteMany(function(err) {
        if (!err) {
          res.send("All articles deleted.");
        } else {
          res.send(err);
        }
      });
    })

//This deletes every article. Request made through postman
    .post(function(req, res) {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
      });
      newArticle.save(function(err) {
        if (!err) {
          res.send(`Successfully added article: ${req.body.title}.`);
        } else {
          res.send(err);
        }
      });
    });

//============================SINGLE ARTICLES===============================
app.route('/articles/:articleTitle')

//This sends back an individual document as provided in URL
  .get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if (!err){
        res.send(foundArticle);
        console.log(foundArticle);
      } else{
        res.send("No article found.")
      }
    });
  })

//This updates a document. If a field is not provided, it will be erased. Thats why it asks for both title and content, and tells it to overwrite. Request made via Postman
  .put(function(req, res){
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if (!err){
          res.send("Successfully updated article");
        } else{
          res.send("Article has been updated.");
        }
    });
  })

//This updates a document. It only changes fields that are provided. $set asks for the general body. So a field not provided, is not changed. Request made via Postman.
  .patch(function(req, res){
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err)   {
        if(!err){
          res.send("Successfully updated article.")
        } else{
          res.send(err);
        }
      }
    )
  })

//This deletes a single document as requested through Postman
  .delete(function(req, res) {
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err) {
      if (!err) {
        res.send("The article was deleted.");
      } else {
        res.send(err);
      }
    });
  });









app.listen(port, function(){
  console.log(`Connected to port ${port}.`);
});
