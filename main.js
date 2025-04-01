import express from "express";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from "body-parser";
import { Server as SocketIo } from 'socket.io';
import _ from 'lodash';
import moment from 'moment';
import https from 'https';
import fs from 'fs';


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
import searchRoutes from "./api/routes/search.route.js";

//Importing middleware
import { ensureAuthenticated, ensureArtistRole } from "./api/middleware/auth.js";
import { loggerMiddleware } from "./api/middleware/logger.js";


//Creating express app
const app = express();
const PORT = process.env.PORT || 3443;



//Middleware do parsowania danych
app.use(express.json());
app.use(bodyParser.urlencoded( { extended: true }))


//Middleware do obsługi plików statycznych
app.use(express.static("public"));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(loggerMiddleware);

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


//Search routes
app.use("/api/search", searchRoutes);


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


app.get("/studio-sessions", async (req, res) => {
  try {
    const [sessions, artists] = await Promise.all([
      StudioSession.find({}).sort({ createdAt: -1 }),
      StudioSession.find({}).distinct('artist')
    ]);

    const formattedSessions = sessions.map(session => ({
      ...session._doc,
      formattedDate: moment(session.date).format('YYYY-MM-DD HH:mm')
    }));
    res.render("pages/studio_sessions.ejs", { user: req.user, sessions: formattedSessions, artists });
  } catch (error) {
    res.render("pages/studio_sessions.ejs", { user: req.user, sessions: [], artists: [], error: "Failed to load studio sessions" });
  }
});

app.get("/auth/change-credentials", ensureAuthenticated, (req, res) => {
  res.render("pages/change_credentials", { user: req.user });
});

app.get("/update-session/:id", ensureAuthenticated, ensureArtistRole, async (req, res) => {
  try {
    const session = await StudioSession.findById(req.params.id);
    if (!session) {
      return res.status(404).send("Session not found");
    }
    res.render("pages/update-session", { user: req.user, session });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// SSL Certificates
const options = {
  key: fs.readFileSync('plik_klucz'),
  cert: fs.readFileSync('plik_certyfikat')
};
// Create HTTPS server
const server = https.createServer(options, app);



// Initialize WebSocket server
const io = new SocketIo(server);
let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('joinRoom', ({ roomId, user }) => {
    socket.join(roomId);
    console.log(`${user} joined room ${roomId}`);
  });

  socket.on('leaveRoom', ({ roomId, user }) => {
    socket.leave(roomId);
    console.log(`${user} left room ${roomId}`);
  });

  socket.on('chatMessage', ({ roomId, data }) => {
    io.to(roomId).emit('message', data);
  });

  // Dodaj użytkownika do listy online
  socket.on('userLoggedIn', (user) => {
    if (!onlineUsers.includes(user.email)) {
      onlineUsers.push(user.email);
      socket.email = user.email; // Przechowaj email w obiekcie socket
    }
    io.emit('updateOnlineUsers', onlineUsers.length);
  });

  // Emit notification when a new album or session is added
  socket.on('newAlbum', (data) => {
    io.emit('notification', { type: 'album', data });
  });

  socket.on('newSession', (data) => {
    io.emit('notification', { type: 'session', data });
  });

  // Usuń użytkownika z listy online po rozłączeniu
  socket.on('disconnect', () => {
    console.log('User disconnected');
    if (socket.email) {
      onlineUsers = onlineUsers.filter(email => email !== socket.email);
      io.emit('updateOnlineUsers', onlineUsers.length);
    }
  });
});


mongoose.connect(process.env.MONGODB_URL, {  
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 45000
  })
  .then(() => {
    console.log("Connected!");
    server.listen(PORT, () => {
      console.log(`HTTPS server started at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Connection failed, error: ${error}`);
});