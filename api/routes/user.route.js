import express from "express";
import { ensureAuthenticated } from "../middleware/auth.js";
import { allUsers, specificUser } from "../controllers/user.controller.js"; 

const router = express.Router()


//Get methods
router.get("/", ensureAuthenticated, allUsers)
router.get("/:mail", ensureAuthenticated, specificUser)