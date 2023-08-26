//Importing or Requiring modules
const express = require("express");
const ejs = require("ejs");
const bp = require("body-parser");
const mongoose = require('mongoose');

//Necessary server lines
const app = express();

app.set('view engine', 'ejs');

app.use(bp.urlencoded({extended: true}));
app.use(express.static('public'));

//Connecting to mongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

//Creating a schema for the document
const articleSchema = {
    title: String,
    content: String
}

//Creating a model to apply methods on
const Article = new mongoose.model("Article",articleSchema);

//App route, specifies a route and in that we can add different methods like get post put patch delete.
app.route("/articles").get(function(req,res){//Gets all the articles 
    Article.find({}).then(function(allArticles){ 
        res.send(allArticles);        
    }).catch(function(err){
        res.send("Something went wrong");
        console.log(err);
    })

}).post(function(req,res){ //Adds a new article by taking contents from body
    const title = (req.body.title);
    const content = (req.body.content);
    
    const article = new Article({
        title: title,
        content: content
    });

    article.save().then(function(){
        res.send("Added");
    });

}).delete(function(req,res){//Deletes all the articles
    Article.deleteMany({}).then(function(){
        res.send("Suxes");
    }).catch(function(err){
        console.log("Failed");
        console.log(err);
    })
});

//Creating a new route with custom user parameter that will be the title of the article
app.route("/articles/:title").get(function(req,res){
    const name = req.params.title;
    Article.findOne({title: name}).then(function(foundArticle){ //Finds that one article with given title name
        res.send(foundArticle);
    }).catch(function(err){
        res.send("Not found");
        console.log(err);
    })
})

.put(function(req,res){ //Overwrites the whole article by given values in body. If some value is not given, it wont show in database
    const name = req.params.title;
    Article.findOneAndUpdate({title: name}, {title: req.body.title, content: req.body.content},{overwrite: true}).then(function(){
        res.send("Suxes");
    }).catch(function(err){
        console.log(err);
    })
})

.patch(function(req,res){ //Partially updates the given article, set req body updates the mentioned title/content into db.
    Article.findOneAndUpdate({title: req.params.title}, {$set : req.body}).then(function(){
        res.send("Suxes");
    }).catch(function(err){
        res.send("Error");
        console.log(err);
    })
})

.delete(function(req,res){ //Deletes the article with given name.
    Article.findOneAndDelete({title: req.params.title}).then(function(){
        res.send("Suxes");
    }).catch(function(err){
        res.send("Error");
        console.log(err);
    })
})



app.listen(3000, function(){
    console.log("Server started !");
})