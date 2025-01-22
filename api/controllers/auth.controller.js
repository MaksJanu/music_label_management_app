import User from "../models/user.model.js";
import bcrypt from 'bcrypt';

const register = async (req, res) => {
  try {
      const { email, role } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'User with this email already exists' });
      }

      const newUser = new User({
          ...req.body,
      });

      if (role === 'artist' && req.file) {
          newUser.profilePicture = {
              data: req.file.buffer,
              contentType: req.file.mimetype
          };
      }

      await newUser.save();

      req.login(newUser, (err) => {
          if (err) {
              return res.status(500).json({ message: err.message });
          }
          return res.redirect('/main');
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const login = (req, res) => {
  res.redirect('/main');
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
};



const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword, confirmPassword, name, email } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let passwordChanged = false;

        if (newPassword && newPassword.length > 0) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required to change password' });
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: 'New passwords do not match' });
            }

            user.password = await bcrypt.hash(newPassword, 10);
            passwordChanged = true;
        }

        user.name = name;
        user.email = email;

        if (req.file) {
            user.profilePicture = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        await user.save();

        if (passwordChanged) {
            // Re-login user after password change
            req.login(user, (err) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                return res.status(200).json({ message: 'User updated successfully' });
            });
        } else {
            res.status(200).json({ message: 'User updated successfully' });
        }
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: error.message });
    }
};

export { register, login, logout, updateUser };