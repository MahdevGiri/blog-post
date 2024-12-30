import express from 'express';
import bodyParser from 'body-parser';
import {dirname} from "path";
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

const posts = []; 

let idToDelete = "";

app.get("/", (req,res) => {
  res.render("index.ejs", {postArray: posts});
});



app.get("/posts/delete/:id", (req,res) => {
    const id = req.params.id;
    deleteById(id);

    res.redirect("/");
});


app.get("/posts/view/:id", (req,res) => {
    idToDelete = req.params.id;
    res.render("posts-view.ejs", {post: getPostById(idToDelete)});
});



app.get("/posts/edit/:id", (req,res) => {
    idToDelete = req.params.id;
    res.render("posts-edit.ejs", {post: getPostById(idToDelete)});
});

app.post("/posts/edit/update", (req,res) => {
  
    deleteById(idToDelete);

    let uniqueId = getUniqueId(req.body.authorName, req.body.postTitle);
    addPost(uniqueId, req.body.authorName, req.body.postTitle, req.body.postContent);
    
    res.redirect("/");
});



app.get("/posts", (req,res) => {
  res.render("posts.ejs");
});

app.post("/posts/add", (req,res) => {
  
  let uniqueId = getUniqueId(req.body.authorName, req.body.postTitle);
  addPost(uniqueId, req.body.authorName, req.body.postTitle, req.body.postContent);
  
  res.redirect("/");
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});







function getUniqueId(authorName, postTitle) {
    let last2CharsOfAuthor = authorName.slice(-2);
    let last2CharsOfTitle = postTitle.slice(-2);
    return last2CharsOfAuthor + last2CharsOfTitle;
}

function addPost(uniqueId, authorName, postTitle, postContent) {
    const post = { id:uniqueId, author: authorName, title: postTitle, content: postContent};
    posts.push(post);
}


function deleteById(id) {
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === id) {
            posts.splice(i, 1);
        }
    }
}

function getPostById(id) {
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === id) {
            return posts[i];
        }
    }
    return null;
}
