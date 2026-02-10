const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

const port = 8080;

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// ================= FILE SETUP =================
const DATA_FILE = path.join(__dirname, "data", "posts.json");

// ================= HELPER FUNCTIONS =================
const readPosts = () => {
    const dir = path.dirname(DATA_FILE);

    // create folder if it doesn't exist
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // create file if it doesn't exist
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, "[]", "utf8");
    }

    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
};

const writePosts = (posts) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
};

// ================= ROUTES =================

// Show all posts
app.get("/posts", (req, res) => {
    const posts = readPosts();
    res.render("index", { posts });
});

// New post form
app.get("/posts/new", (req, res) => {
    res.render("new");
});

// Create new post
app.post("/posts", (req, res) => {
    const posts = readPosts();
    const { username, content } = req.body;

    posts.push({
        id: uuidv4(),
        username,
        content,
    });

    writePosts(posts);
    res.redirect("/posts");
});

// Show single post
app.get("/posts/:id", (req, res) => {
    const posts = readPosts();
    const post = posts.find(p => p.id === req.params.id);

    res.render("show", { post });
});

// Edit post form
app.get("/posts/:id/edit", (req, res) => {
    const posts = readPosts();
    const post = posts.find(p => p.id === req.params.id);

    res.render("edit", { post });
});

// Update post
app.patch("/posts/:id", (req, res) => {
    const posts = readPosts();
    const post = posts.find(p => p.id === req.params.id);

    post.content = req.body.content;
    writePosts(posts);

    res.redirect("/posts");
});

// Delete post
app.delete("/posts/:id", (req, res) => {
    let posts = readPosts();
    posts = posts.filter(p => p.id !== req.params.id);

    writePosts(posts);
    res.redirect("/posts");
});

// ================= SERVER =================
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}/posts`);
});
