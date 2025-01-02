import express from "express";
import { ensureAuthenticated, ensureArtistRole } from "../middleware/auth.js";
import { getAllAlbums, getSpecificAlbums, postAlbum, deleteAlbum }  from "../controllers/album.controller.js";

const router = express.Router()


//Get methods
router.get("/", ensureAuthenticated, ensureArtistRole, getAllAlbums)
router.get("/:artistName", ensureAuthenticated, ensureArtistRole, getSpecificAlbums)

//Post methods
router.post("/:artistName", ensureAuthenticated, ensureArtistRole, postAlbum)

//Delete methods
router.delete("/:albumName", ensureAuthenticated, ensureArtistRole, deleteAlbum)


export { router };