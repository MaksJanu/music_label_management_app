import mongoose from "mongoose";

const albumSchema = mongoose.Schema(
  {
    artist: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true,
    },

    genre: {
      type: String,
      required: true,
    },

    releaseDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    tracks: [{ type: String }],

    image: {
      data: Buffer,
      contentType: String
    }
  },
  {
    timestamps: true,
  }
);

const Album = mongoose.model("Album", albumSchema);
export default Album;
