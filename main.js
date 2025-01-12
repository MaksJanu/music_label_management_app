import express from "express";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from "body-parser";
import { Server } from 'socket.io';
import { createServer } from 'http';
import _ from 'lodash';
import moment from 'moment';

//Importing models
import User from "./api/models/user.model.js";
import Album from "./api/models/album.model.js";
import StudioSession from "./api/models/studio-session.model.js";


import passport from "passport";
import { Strategy } from 'passport-local';


//Importing routes
import authRoutes from "./api/routes/auth.route.js";
import userRoutes from "./api/routes/user.route.js";
import studioSessionRoutes from "./api/routes/studio-session.route.js";
import albumRoutes from "./api/routes/album.route.js";

//Importing middleware
import { ensureAuthenticated, ensureArtistRole } from "./api/middleware/auth.js";


//Creating express app
const app = express();
const PORT = process.env.PORT;


//Middleware do parsowania danych
app.use(express.json());
app.use(bodyParser.urlencoded( { extended: true }))


//Middleware do obsługi plików statycznych
app.use(express.static("public"));
app.set('views', './views');
app.set('view engine', 'ejs');


// Konfiguracja sesji logowania podpisana kluczem
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URL,
  }),
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24, // 1 dzień
  }
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




// Rendering for login and register
app.get("/", (req, res) => {
  res.render("start.ejs");
});


app.get("/auth", (req, res) => {
  const type = req.query.type;
  res.render("pages/auth.ejs", { type });
});


app.get("/main", ensureAuthenticated, async (req, res) => {
  try {
    const latestAlbums = await Album.find({}).sort({ createdAt: -1 }).limit(4);
    const lastestStudioSessions = await StudioSession.find({}).sort({ createdAt: -1 });

    res.render("pages/main.ejs", { 
      user: req.user,
      albums: latestAlbums,
      studioSessions: lastestStudioSessions,
    });
  } catch (error) {
    res.render("pages/main.ejs", { 
      user: req.user ,
      albums: [],
      studioSessions: [],
    });
  }
});


app.get("/dashboard", ensureAuthenticated, async (req, res) => {
  try {
    if (req.user.role === 'artist') {
      const userAlbums = await Album.find({ artist: req.user.name });
      const userStudioSessions = await StudioSession.find({ artist: req.user.name });
      const formattedSessions = userStudioSessions.map(session => ({
        ...session._doc,
        formattedDate: moment(session.date).format('YYYY-MM-DD HH:mm')
      }));

      res.render("pages/dashboard.ejs", { user: req.user, albums: userAlbums, sessions: formattedSessions, _ });
    } else {
      res.render("pages/dashboard.ejs", { user: req.user, albums: [], sessions: [], _ });
    }
  } catch (error) {
    res.render("pages/dashboard.ejs", { user: req.user, albums: [], sessions: [], _ });
  }
});


app.get("/add-album", ensureAuthenticated, (req, res) => {
  res.render("pages/add_album.ejs", { user: req.user });
});


app.get("/update-album/:id", ensureAuthenticated, ensureArtistRole, async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).send("Album not found");
    }
    res.render("pages/update-album", { user: req.user, album });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get("/add-studio-session", ensureAuthenticated, (req, res) => {
  res.render("pages/add_studio_session.ejs", { user: req.user });
});


app.get("/albums", ensureAuthenticated, async (req, res) => {
  try {
      const [albums, genres, artists] = await Promise.all([
          Album.find({}).sort({ createdAt: -1 }),
          Album.distinct('genre'),
          Album.distinct('artist')
      ]);

      res.render("pages/albums.ejs", { 
          user: req.user, 
          albums: albums,
          genres: genres,
          artists: artists
      });
  } catch (error) {
      console.error('Error fetching albums:', error);
      res.render("pages/albums.ejs", { 
          user: req.user, 
          albums: [],
          genres: [],
          artists: [],
          error: "Failed to load albums"
      });
  }
});


app.get("/artists", async (req, res) => {
  try {
    const artists = await User.find({ role: 'artist' });
    res.render("pages/artists.ejs", { user: req.user, artists });
  } catch (error) {
    res.render("pages/artists.ejs", { user: req.user, artists: [], error: "Failed to load artists" });
  }
})





// Create HTTP server and Socket.IO server
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('chatMessage', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});














mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected!");
    server.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Connection failed, error: ${error}`);
});