import express from "express";
import { ensureAuthenticated, ensureArtistRole } from "../middleware/auth.js";
import { getAllStudioSessions, getSpecificStudioSessions, postStudioSession, deleteStudioSession, updateStudioSession } from "../controllers/studio-session.controller.js";

const router = express.Router()


//Get methods
router.get("/", ensureAuthenticated, ensureArtistRole, getAllStudioSessions)
router.get("/:artistName", ensureAuthenticated, ensureArtistRole, getSpecificStudioSessions)

//Post methods
router.post("/", ensureAuthenticated, ensureArtistRole, postStudioSession)

//Put methods
router.put("/update-session/:id", ensureAuthenticated, ensureArtistRole, updateStudioSession);

//Delete methods
router.delete("/:id", ensureAuthenticated, ensureArtistRole, deleteStudioSession)


export default router;