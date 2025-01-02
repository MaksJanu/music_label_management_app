import express from "express";
import { ensureAuthenticated, ensureArtistRole } from "../middleware/auth.js";
import { getAllStudioSessions, getSpecificStudioSessions, postStudioSession, deleteStudioSession } from "../controllers/studio-session.controller.js";

const router = express.Router()


//Get methods
router.get("/", ensureAuthenticated, ensureArtistRole, getAllStudioSessions)
router.get("/:artistName", ensureAuthenticated, ensureArtistRole, getSpecificStudioSessions)

//Post methods
router.post("/:artistName", ensureAuthenticated, ensureArtistRole, postStudioSession)

//Delete methods
router.delete("/:id", ensureAuthenticated, ensureArtistRole, deleteStudioSession)


export default router;