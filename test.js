import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from "body-parser";
import User from "./api/models/user.model.js";
import StudioSession from "./api/models/studio-session.model.js";
import Album from "./api/models/album.model.js";


const app = express();
const PORT = process.env.PORT;


//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded( { extended: true }))


app.get("/api/user", async (req, res) => {
    try {
      const users = await User.find({ role: 'artist' }).populate('albums');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});


app.post("/api/user", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get("/api/album", async (req, res) => {
    try {
      const albums = await Album.find({});
      res.status(200).json(albums);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
  

app.post("/api/album/:artistName", async (req, res) => {
    try {
        const { artistName } = req.params;
        const { title, genre, releaseDate, tracks, imageUrl } = req.body;


        const artist = await User.findOne({ name: artistName, role: 'artist' });

        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        const newAlbum = new Album({ title, genre, releaseDate, tracks, imageUrl });
        await newAlbum.save();

        artist.albums.push(newAlbum._id);
        await artist.save();

        res.status(201).json(newAlbum);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



mongoose.connect(
    process.env.MONGODB_URL
  )
  .then(() => {
    console.log("Connected!");
    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Connection failed, error: ${error}`);
  });


