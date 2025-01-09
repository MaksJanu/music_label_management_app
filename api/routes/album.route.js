import express from "express";
import { ensureAuthenticated, ensureArtistRole } from "../middleware/auth.js";
import { getAllAlbums, getSpecificAlbums, postAlbum, deleteAlbum, getDistinctGenresAndArtists }  from "../controllers/album.controller.js";
import upload from '../middleware/uploadFile.js';

const router = express.Router()


//Get methods
router.get("/", ensureAuthenticated, ensureArtistRole, getAllAlbums)
router.get("/filters", getDistinctGenresAndArtists)
router.get("/:artistName", ensureAuthenticated, ensureArtistRole, getSpecificAlbums)

//Post methods
router.post("/", ensureAuthenticated, ensureArtistRole, upload.single('image'), postAlbum)

//Delete methods
router.delete("/:albumName", ensureAuthenticated, ensureArtistRole, deleteAlbum)


export default router;