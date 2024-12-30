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

let id = "";


// this route handler for get request on root(home) endpoint. It renders the index.ejs page and passes the posts array to the view.
app.get("/", (req,res) => {
  res.render("index.ejs", {postArray: posts});
});



// this route handler is for get request on /posts/delete/:id endpoint. It deletes the post with the given id and redirects to the home page.
app.get("/posts/delete/:id", (req,res) => {
    id = req.params.id;
    deleteById(id);

    res.redirect("/");
});



// this route handler is for get request on /posts/view/:id endpoint. It renders the posts-view.ejs page and passes the post object with the given id to the view.
app.get("/posts/view/:id", (req,res) => {
    id = req.params.id;
    res.render("posts-view.ejs", {post: getPostById(id)});
});



// this route handler is for get request on /posts/edit/:id endpoint. It renders the posts-edit.ejs page and passes the post object with the given id to the view.
app.get("/posts/edit/:id", (req,res) => {
    id = req.params.id;
    res.render("posts-edit.ejs", {post: getPostById(id)});
});

// this route handler is for the post request on /posts/edit/update endpoint. It deletes the post with the given id and adds a new post with the updated information. It then redirects to the home page.
app.post("/posts/edit/update", (req,res) => {
  
    deleteById(id);

    let uniqueId = getUniqueId(req.body.authorName, req.body.postTitle);
    addPost(uniqueId, req.body.authorName, req.body.postTitle, req.body.postContent);
    
    res.redirect("/");
});



// this route handler is for the post request on /posts endpoint. It renders the posts.ejs page.
app.get("/posts", (req,res) => {
  res.render("posts.ejs");
});

// this route handler is for the post request on /posts/add endpoint. It adds a new post with the information provided in the form and redirects to the home page.
app.post("/posts/add", (req,res) => {
  
  let uniqueId = getUniqueId(req.body.authorName, req.body.postTitle);
  addPost(uniqueId, req.body.authorName, req.body.postTitle, req.body.postContent);
  
  res.redirect("/");
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});






// Helper functions
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
