import mongoose from "mongoose";
import bcrypt from "bcrypt"


const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true 
        },

        password: {
            type: String,
            required: true 
        },

        role: { 
            type: String,
            enum: ['user', 'artist'],
            required: true 
        },

        permissions: { 
            type: [String],
            default: [] 
        },

        name: { 
            type: String,  //Optional for artist
            required: function() { return this.role === "artist" }
        },

        genre: {
            type: String,  //Optional for artist
            required: false
        }, 

        albums: [{
            type: mongoose.Schema.Types.ObjectId,  //Optional for artist added further
            ref: "Album",
            required: false
        }],

        studioSessions: [{
            type: mongoose.Schema.Types.ObjectId,  //Optional for artist added further
            ref: "StudioSession",
            required: false
        }],

        bio: { 
            type: String,  // Optional for artist
            required: false
        },   

        createdAt: {
            type: Date,
            default: Date.now 
        },
    }
)


// Automatyczne przypisanie uprawnień na podstawie roli i hashowanie hasla w bazie
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    // Here I hash the password
    this.password = await bcrypt.hash(this.password, 10);
  
    if (this.isModified('role')) {
      if (this.role === 'artist') {
        this.permissions = [
          'manage_profile', // For artist
          'create_album', // For artist
          'edit_album', // For artist
          'delete_album', // For artist
          'schedule_session', // For artist
          'browse_albums',
          'browse_artists',
          'search',
          'view_sessions',
        ];
      } else if (this.role === 'user') {
        this.permissions = [
          'browse_albums', // For user
          'browse_artists', // For user
          'search', // For user
          'view_sessions', // For user
        ];
      }
    }
    next();
});

// Middleware do hashowania hasła podczas aktualizacji
userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        update.password = await bcrypt.hash(update.password, 10);
    }
    next();
});

// Dodanie metody sprawdzania hasła
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


const User = mongoose.model("User",  userSchema)
export default User