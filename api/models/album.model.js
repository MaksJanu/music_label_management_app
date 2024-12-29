import mongoose from "mongoose";

const albumSchema = mongoose.Schema(
  {
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
  },
  {
    timestamps: true,
  }
);

const Album = mongoose.model("Album", albumSchema);
export default Album;
