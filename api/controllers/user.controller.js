import User from "../models/user.model.js";


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


export { getAllUsers, getSpecificUser };






