import express from "express";

import morgan from "morgan";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;



app.use(morgan('tiny'));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Middleware to parse URL-encoded data (for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));

var title, content, link, image; 
let array = [];

app.get("/", (req, res) => {
    res.render("home.ejs", {
        array: array,  // Get the image URL from the form
    });
});

app.get("/postBlog", (req, res) => {
    res.render("postBlog.ejs");
});

app.get("/edit/:id", (req, res) => {
    var id = parseInt(req.params.id, 10);

    if (array.length > id && id >= 0) {
        res.render("update.ejs", {
            id: id,
            title: array[id][0],
            content: array[id][1],  // Giả sử mảng lưu trữ nội dung tại vị trí thứ hai
            link: array[id][2],     // Giả sử mảng lưu trữ link tại vị trí thứ ba
            image: array[id][3]     // Giả sử mảng lưu trữ image URL tại vị trí thứ tư
        });
    } else {
        res.status(404).send("Post not found");
    }
});


app.delete("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (array.length > id) {
        array.splice(id, 1);
        res.status(200).send("Post deleted");
    } else {
        res.status(404).send("Post not found");
    }
});



app.put("/update/:id", (req, res) => {
    var id = parseInt(req.params.id, 10);

    if (array.length > id) {
        array[id][0] = req.body["title"];
        array[id][1] = req.body["content"];
        array[id][2] = req.body["link"];
        array[id][3] = req.body["image"];

        res.status(200).send("Post updated");
    } else {
        res.status(404).send("Post not found");
    }
});

app.post("/postBlog", (req, res) => {
    title = req.body["title"];
    content = req.body["content"];
    link = req.body["link"];
    image = req.body["image"];
    array.push([title, content, link, image]);  // Thêm mảng con vào mảng chính
    res.render("home.ejs", {
        array: array,
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
