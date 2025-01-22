import express from "express";
import passport from "passport";
import { register, login, logout, updateUser }  from "../controllers/auth.controller.js"
import upload from '../middleware/uploadFile.js';
import { ensureAuthenticated } from '../middleware/auth.js';

const router = express.Router()

//Post methods
router.post("/register", upload.single('image'), register);
router.post("/login", passport.authenticate('local'), login)
router.get("/logout", logout)

//Put methods
//Put methods
router.put('/update-user/:id', ensureAuthenticated, upload.single('image'), updateUser);


export default router;