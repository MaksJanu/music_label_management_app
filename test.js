import express from "express";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = process.env.PORT;

app.use(express.static("public"));
app.set('views', './views');
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
    res.render("start.ejs")
})


app.get("/auth", (req, res) => {
    res.render("auth.ejs")
})


app.get("/dashboard", (req, res) => {
    res.render("dashboard.ejs")
})


app.get("/profile", (req, res) => {
    res.render("profile.ejs")
})








app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });