import express from "express";
import { ensureAuthenticated } from "../middleware/auth.js";
import { getAllUsers, getSpecificUser } from "../controllers/user.controller.js"; 

const router = express.Router()


//Get methods
router.get("/", ensureAuthenticated, getAllUsers)
router.get("/:mail", ensureAuthenticated, getSpecificUser)


export default router;