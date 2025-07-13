const express = require("express");
const app = express();
const port = 8080
const path = require("path");
 const{v4: uuidv4} = require('uuid');
 const methodOverride = require("method-override");


app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"view"));

app.use(express.static (path.join(__dirname,"public")));


const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads"); // Save to this folder
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });


let posts =[
    {
        id: uuidv4(),
        username: "Mohd Jasim",
        content: "Hi Today I watch Ind VS Eng It was Fantastic",
        image: "/uploads/122402020.avif"
    },
     {
        id: uuidv4(),
        username: "Nitin",
        content: "I am not interested in this sorry brother"
    },
     {
        id: uuidv4(),
        username: "Ali Rizvi",
        content: "You Keep Quite Nitu You Don't Know anything",
        image: "/uploads/Rohit-Sharma.jpg"
    }
];




app.get("/posts", (req,res)=>{
    res.render("index",{posts});
});

app.get("/posts/new", (req,res)=>{
    res.render("new",{posts});
});

app.post("/posts", upload.single("image"), (req, res) => {
   
    let { username, content } = req.body;
    let id = uuidv4();
    let image = req.file ? "/uploads/" + req.file.filename : null;

    posts.push({ id, username, content, image });
    res.redirect("/posts");
});


app.get("/posts/:id", (req,res)=>{
   let {id} = req.params;
   let post = posts.find((p)=> id === p.id);
   res.render("show",{post});
});

app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit", { post });
});


app.patch("/posts/:id", upload.single("image"), (req, res) => {
    let { id } = req.params;
    let { content } = req.body;
    let post = posts.find((p) => id === p.id);

    if (post) {
        post.content = content;
        if (req.file) {
            post.image = "/uploads/" + req.file.filename;
        }
    }

    res.redirect("/posts");
});



app.delete("/posts/:id",(req,res)=>{
    let{id} = req.params;
     posts = posts.filter((p)=> id !== p.id);
    res.redirect("/posts");
});

app.listen(port,()=>{
    console.log("Listening to port: 8080");
});