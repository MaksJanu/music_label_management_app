import Album from "../models/album.model.js";
import User from "../models/user.model.js";
import mqtt from 'mqtt';

const client = mqtt.connect("mqtt://localhost:1883");

const getAllAlbums = async (req, res) => {
    try {
      const albums = await Album.find({});
      res.status(200).json(albums);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      title: req.body.title,
      genre: req.body.genre,
      releaseDate: req.body.releaseDate,
      tracklist: req.body.tracklist,
    };
    if (req.file) {
      updatedData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }
    console.log('Updated data:', updatedData);
    const album = await Album.findByIdAndUpdate(id, updatedData, { new: true });
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    res.status(200).json({ message: "Album updated successfully" });
  } catch (error) {
    console.error('Error updating album:', error);
    res.status(500).json({ message: error.message });
  }
};


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

        client.publish(`artist/${searchedArtist._id}/new-album`, JSON.stringify(newAlbum));

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

const getDistinctGenresAndArtists = async (req, res) => {
  try {
      const genres = await Album.distinct('genre');
      const artists = await Album.distinct('artist');

      res.status(200).json({
          success: true,
          data: {
              genres,
              artists
          }
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Error fetching filters",
          error: error.message
      });
  }
};

export { getAllAlbums, getSpecificAlbums, postAlbum, deleteAlbum, getDistinctGenresAndArtists, getAlbumById, updateAlbum };