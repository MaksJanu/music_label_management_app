import express from "express";
import { ensureAuthenticated, ensureArtistRole } from "../middleware/auth.js";
import { getAllAlbums, getSpecificAlbums, postAlbum, deleteAlbum, getDistinctGenresAndArtists, getAlbumById, updateAlbum }  from "../controllers/album.controller.js";
import upload from '../middleware/uploadFile.js';

const router = express.Router();

//Get methods
router.get("/", ensureAuthenticated, ensureArtistRole, getAllAlbums);
router.get("/filters", getDistinctGenresAndArtists);
router.get("/:artistName", ensureAuthenticated, ensureArtistRole, getSpecificAlbums);
router.get("/:id", ensureAuthenticated, ensureArtistRole, getAlbumById);

//Post methods
router.post("/", ensureAuthenticated, ensureArtistRole, upload.single('image'), postAlbum);

//Put methods
router.post("/update-album/:id", ensureAuthenticated, ensureArtistRole, upload.single('image'), updateAlbum);

//Delete methods
router.delete("/:albumName", ensureAuthenticated, ensureArtistRole, deleteAlbum);

export default router;