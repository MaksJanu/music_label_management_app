import express from "express";
import passport from "passport";
import { ensureAuthenticated } from "../middleware/auth.js";
import { register, login, logout, changeCredentials }  from "../controllers/auth.controller.js"

const router = express.Router()


//Post methods
router.post("/register", register)
router.post("/login", passport.authenticate('local'), login)
router.post("/logout", logout)

//Put methods
router.put("/change-credentials/:mail", changeCredentials)


export default router;