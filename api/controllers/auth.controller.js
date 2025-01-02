import User from "../models/user.model.js";


const register = async (req, res) => {
    try {
      const { email } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
  
      const newUser = await User.create(req.body);
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        return res.status(201).json(newUser);
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}


const login = (req, res) => {
    res.status(200).json({ message: 'Logged in successfully' });
}


const logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to log out' });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
}


const changeCredentials = async (req, res) => {
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
}


export { register, login, logout, changeCredentials };