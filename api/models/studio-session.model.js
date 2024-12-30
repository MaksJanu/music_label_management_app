import mongoose from "mongoose";


const studioSessionSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },

  artist: {
    type: String,
    required: true
  },

  details: {
    type: String,
  },

  duration: {
    type: Number,
    required: true,
  },
  
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled"
  }
});

const StudioSession = mongoose.model("StudioSession",  studioSessionSchema)
export default StudioSession