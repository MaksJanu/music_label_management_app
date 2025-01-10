import express from "express";
import passport from "passport";
import { register, login, logout, changeCredentials }  from "../controllers/auth.controller.js"
import upload from '../middleware/uploadFile.js';

const router = express.Router()

//Post methods
router.post("/register", upload.single('image'), register);
router.post("/login", passport.authenticate('local'), login)
router.get("/logout", logout)

//Put methods
router.put("/change-credentials/:mail", changeCredentials)


export default router;