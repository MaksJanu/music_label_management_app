import User from "../models/user.model.js";
import StudioSession from "../models/studio-session.model.js";
import mqtt from 'mqtt';

const client = mqtt.connect("mqtt://localhost:1883");


const getAllStudioSessions = async (req, res) => {
    try {
      const searchedStudioSessions = await StudioSession.find({})
      res.status(200).json(searchedStudioSessions)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
}


const getSpecificStudioSessions = async (req, res) => {
    try {
      const { artistName } = req.params
      const searchedStudioSessions = await StudioSession.find({artist: artistName})
      res.status(200).json(searchedStudioSessions)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
}


const postStudioSession = async (req, res) => {
    try {
      const loggedArtist = req.user.name
      const { details } = req.body
      const searchedArtist = await User.findOne({name: loggedArtist, role: "artist"})
      if (!searchedArtist) {
        return res.status(404).json({ message: "Artist not found" });
      }
  
      const existingSession = await StudioSession.findOne({details})
      if (existingSession) {
        return res.status(404).json({ message: "Session with the same details already exists!" })
      }
    
      const newSession = await StudioSession.create({
        ...req.body,
        artist: loggedArtist
      });
    
      searchedArtist.studioSessions.push(newSession._id);
      await searchedArtist.save();

      client.publish(`artist/${searchedArtist._id}/new-session`, JSON.stringify(newSession));

      res.status(201).json(newSession);
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
}


const deleteStudioSession = async (req, res) => {
    try {
      const { id } = req.params
      const deletedStudioSession = await StudioSession.findByIdAndDelete(id)
      if (!deletedStudioSession) {
        res.status(404).json({ message: "Studio session with given id doesn't exist!" })
      }
      res.status(200).json({ message: "Studio session was sucessfully deleted!" })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
}


export { getAllStudioSessions, getSpecificStudioSessions, postStudioSession, deleteStudioSession };