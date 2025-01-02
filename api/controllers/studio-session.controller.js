import User from "../models/user.model.js";
import StudioSession from "../models/studio-session.model.js";



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
      const { artistName } = req.params
      const { details } = req.body
      const searchedArtist = await User.findOne({name: artistName, role: "artist"})
      if (!searchedArtist) {
        return res.status(404).json({ message: "Artist not found" });
      }
  
      const existingSession = await StudioSession.findOne({details})
      if (existingSession) {
        return res.status(404).json({ message: "Session with the same details already exists!" })
      }
    
      const newSession = await StudioSession.create(req.body);
    
      searchedArtist.studioSessions.push(newSession._id);
      await searchedArtist.save();
    
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