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
    const type = req.query.type;
    res.render("pages/auth.ejs", { type });
});


app.get("/dashboard", (req, res) => {
    res.render("pages/dashboard.ejs")
})


app.get("/profile", (req, res) => {
    res.render("/pages/profile.ejs")
})








app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });