import Album from "../models/album.model.js";
import User from "../models/user.model.js";
import StudioSession from "../models/studio-session.model.js";

export const search = async (req, res) => {
    try {
        const query = req.query.q;
        const regex = new RegExp(query, 'i'); // 'i' for case insensitive

        const albums = await Album.find({ title: regex });
        const artists = await User.find({ name: regex, role: 'artist' });
        const sessions = await StudioSession.find({ title: regex });

        res.status(200).json({ albums, artists, sessions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};