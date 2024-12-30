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
      const users = await User.find({})
      .populate("albums")
      .populate("studioSessions");
      
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

app.get("/api/user/:mail", async (req, res) => {
  try {
    const { mail } = req.params
    const user = await User.findOne({ email: mail })
    .populate("albums")
    .populate("studioSessions");
    if (!user) {
      res.status(400).json({ message: "User with given mail doesn't exist!"  })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/user", async (req, res) => {
  try {
    const { email } = req.body
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const newUser = await User.create(req.body);
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/user/:mail", async (req, res) => {
  try {
    const { mail } = req.params
    const userToUpdate = await User.findOneAndUpdate({ email: mail }, req.body, { new: true });
    if (!userToUpdate) {
      return res.status(404).json({ message: "User with given mail doesn't exist!" });
    }
    res.status(200).json(userToUpdate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})






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
        const { artist, title, genre, releaseDate, tracks, imageUrl } = req.body;


        const searchedArtist = await User.findOne({ name: artistName, role: 'artist' });
        if (!searchedArtist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        const existingAlbum = await Album.findOne({ title, artist: searchedArtist.name });
        if (existingAlbum) {
          return res.status(400).json({ message: "Album with this title already exists for this artist" });
        }

        const newAlbum = new Album({ artist, title, genre, releaseDate, tracks, imageUrl });
        await newAlbum.save();

        searchedArtist.albums.push(newAlbum._id);
        await searchedArtist.save();

        res.status(201).json(newAlbum);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});














app.post("/api/studio-session/:artistName", async (req, res) => {
  try {
    const { artistName } = req.params
    const { date, artist, details, status, duration } = req.body
  
    const searchedArtist = await User.findOne({name: artistName, role: "artist"})
    if (!searchedArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }
  
    const newSession = new StudioSession({ date,artist, details, status, duration });
    await newSession.save();
  
    searchedArtist.studioSessions.push(newSession._id);
    await searchedArtist.save();
  
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})











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


