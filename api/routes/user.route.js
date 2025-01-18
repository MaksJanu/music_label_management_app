import express from "express";
import { ensureAuthenticated, ensureUserRole } from "../middleware/auth.js";
import { getAllUsers, getSpecificUser, getAllArtists } from "../controllers/user.controller.js"; 

const router = express.Router()


//Get methods
router.get("/", ensureAuthenticated, getAllUsers)
router.get("/:mail", ensureAuthenticated, getSpecificUser)
router.get("/artists", ensureAuthenticated, getAllArtists)


export default router;