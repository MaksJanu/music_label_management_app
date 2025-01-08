import Album from "../models/album.model.js";
import User from "../models/user.model.js";


const getAllAlbums = async (req, res) => {
    try {
      const albums = await Album.find({});
      res.status(200).json(albums);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}


const getSpecificAlbums = async (req, res) => {
    try {
      const { artistName } = req.params
      const albums = await Album.find({ artist: artistName });
      if (albums.length === 0) {
        return res.status(404).json({ message: "No albums found for this artist" });
      }
      res.status(200).json(albums);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}


const postAlbum = async (req, res) => {
    try {
        const { title } = req.body;
        const loggedArtist = req.user.name

        const searchedArtist = await User.findOne({ name: loggedArtist, role: 'artist' });
        if (!searchedArtist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        const existingAlbum = await Album.findOne({ title, artist: loggedArtist });
        if (existingAlbum) {
          return res.status(400).json({ message: "Album with this title already exists for this artist" });
        }

        const newAlbum = await Album.create({
          ...req.body,
          artist: loggedArtist,
          image: {
            data: req.file.buffer,
            contentType: req.file.mimetype
          }
        });

        searchedArtist.albums.push(newAlbum._id);
        await searchedArtist.save();

        res.status(201).json(newAlbum);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const deleteAlbum = async (req, res) => {
    try {
      const { albumName } = req.params
      const deleteAlbum = await Album.findOneAndDelete({title: albumName})
      if (!deleteAlbum) {
        res.status(404).json({ message: "Album with given name doesn't exist!" })
      }
      res.status(200).json({ message: "Album was deleted successfully!" })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
}


export { getAllAlbums, getSpecificAlbums, postAlbum, deleteAlbum };