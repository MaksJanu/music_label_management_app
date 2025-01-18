import User from "../models/user.model.js";
import mqtt from 'mqtt';


const client = mqtt.connect("mqtt://localhost:1883");


const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({})
      .populate("albums")
      .populate("studioSessions");
      
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

const getAllArtists = async (req, res) => {
    try {
      const users = await User.find({role: "artist"})
      .populate("albums")
      .populate("studioSessions");
      
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}


const getSpecificUser = async (req, res) => {
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
}




const subscribe = async (req, res) => {
    try {
        const userId = req.user._id;
        const { artistId } = req.body;

        await User.findByIdAndUpdate(userId, { $addToSet: { subscriptions: artistId } });

        client.subscribe(`artist/${artistId}/new-album`);
        client.subscribe(`artist/${artistId}/new-session`);

        res.status(200).json({ message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const unsubscribe = async (req, res) => {
    try {
        const userId = req.user._id;
        const { artistId } = req.body;

        await User.findByIdAndUpdate(userId, { $pull: { subscriptions: artistId } });

        client.unsubscribe(`artist/${artistId}/new-album`);
        client.unsubscribe(`artist/${artistId}/new-session`);

        res.status(200).json({ message: 'Unsubscribed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




export { getAllUsers, getSpecificUser, getAllArtists, subscribe, unsubscribe };






