import mongoose from "mongoose";

const albumSchema = mongoose.Schema(
  {
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

    imageUrl: {
        type: String,
        required: false
    }
  },
  {
    timestamps: true,
  }
);

const Album = mongoose.model("Album", albumSchema);
export default Album;
