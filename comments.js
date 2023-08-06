//Create web server
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); //uuidv4()
const port = 3000;

//Set up body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Set up static files
app.use(express.static('public'));

//Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set up routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/comments', (req, res) => {
    let comments;
    fs.readFile('./data/comments.json', 'utf-8', (err, data) => {
        if (err) throw err;
        comments = JSON.parse(data);
        comments.forEach(comment => {
            comment.createdAt = moment(comment.createdAt).fromNow();
        });
        res.render('comments', { comments: comments });
    });
});

app.post('/comments', (req, res) => {
    let comments;
    fs.readFile('./data/comments.json', 'utf-8', (err, data) => {
        if (err) throw err;
        comments = JSON.parse(data);
        let newComment = {
            id: uuidv4(),
            name: req.body.name,
            content: req.body.content,
            createdAt: Date.now()
        }
        comments.unshift(newComment);
        fs.writeFile('./data/comments.json', JSON.stringify(comments), (err) => {
            if (err) throw err;
            res.redirect('/comments');
        });
    });
});

app.delete('/comments/:id', (req, res) => {
    let comments;
    fs.readFile('./data/comments.json', 'utf-8', (err, data) => {
        if (err) throw err;
        comments = JSON.parse(data);
        comments = comments.filter(comment => comment.id !== req.params.id);
        fs.writeFile('./data/comments.json', JSON.stringify(comments), (err) => {
            if (err) throw err;
            res.json(comments);
        });
    });
});

app.listen(port, () => console.log(`Server started on port ${port}`));

