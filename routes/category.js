var express = require('express');
var router = express.Router();
const mongo = require('mongodb')
let db = require('monk')('mongodb+srv://tahmid:526628Tahmid@test1.mbzeo.mongodb.net/gapguysblog?retryWrites=true&w=majority');

router.get('/show/:category', (req, res) => {
    let db = req.db;
    let categories = db.get('categories');
    let cat;
    categories.find({}, {}, (err, categories) => {
        cat = categories
    });

    let posts = db.get('posts');
    posts.find({category: req.params.category}, {}, (err, posts) => {
        res.render('index', {
            'title': req.params.category,
            'posts': posts,
            'categories': cat
        })
    })
    console.log(req.params);
})


module.exports = router;