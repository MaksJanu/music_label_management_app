import mongoose from "mongoose";


const studioSessionSchema = mongoose.Schema({
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  date: {
    type: Date,
    required: true,
  },

  details: {
    type: String,
  },

  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "Scheduled"
  }
});

const StudioSession = mongoose.model("StudioSession",  studioSessionSchema)
export default StudioSession