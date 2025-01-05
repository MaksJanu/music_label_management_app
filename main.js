import express from "express";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from "body-parser";


//Importing models
import User from "./api/models/user.model.js";


import passport from "passport";
import { Strategy } from 'passport-local';


//Importing routes
import authRoutes from "./api/routes/auth.route.js";
import userRoutes from "./api/routes/user.route.js";
import studioSessionRoutes from "./api/routes/studio-session.route.js";
import albumRoutes from "./api/routes/album.route.js";



const app = express();
const PORT = process.env.PORT;



//Middleware do parsowania danych
app.use(express.json());
app.use(bodyParser.urlencoded( { extended: true }))

// Konfiguracja sesji logowania podpisana kluczem
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 dzień
}));

// Inicjalizacja biblioteki do uwierzytelniania uzytkownikow
app.use(passport.initialize());
app.use(passport.session());


// Konfiguracja Passport
passport.use(new Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Invalid email or password' });
    }
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      return done(null, false, { message: 'Invalid email or password' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});



//Auth routes
app.use("/auth", authRoutes)


//User routes
app.use("/api/user", userRoutes)


//Album routes
app.use("/api/album", albumRoutes)


//Studio Sessions routes
app.use("/api/studio-session", studioSessionRoutes)



mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected!");
    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Connection failed, error: ${error}`);
});