const express = require('express');
const app = express();
const path = require("path");
const port = 8080;
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

let posts = [
    {
        id: uuidv4(),
        username: "subhrajit",
        content: "I love coding!",
    },
    {
        id: uuidv4(),
        username: "jitu",
        content: "I love coding too!",
    },
    {
        id: uuidv4(),
        username: "sourav",
        content: "I love coding also!",
    },
];

// ✅ Render all posts
app.get("/posts", (req, res) => {
    res.render("index", { posts });
});

// ✅ New post form
app.get("/posts/new", (req, res) => {
    res.render("new");
});

// ✅ Create new post (fixed duplicate & typos)
app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    let id = uuidv4();
    posts.push({ id, username, content });
    res.redirect("/posts");
});

// ✅ Show single post (fixed variable name error)
app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);
    res.render("show", { post });
});

// ✅ Edit form
app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);
    res.render("edit", { post });
});

// ✅ Update post content
app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => p.id === id);
    post.content = newContent;
    res.redirect("/posts");
});

// ✅ Delete post
app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => p.id !== id);
    res.redirect("/posts");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
