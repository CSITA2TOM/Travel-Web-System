// server/src/index.ts
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import './config/passport-setup';
import multer from 'multer';
import path from 'path';

// Routers
import router from './router/index';

const app = express();

// Session configuration
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false // Set to true if using https
    }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Middleware for CORS, JSON parsing, URL encoding, cookie parsing, and compression
app.use(cors({
    origin: ['http://localhost:5173', 'https://editor.swagger.io'],
    credentials: true,
}));

app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static file serving
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes

// Root router
app.use("/", router());

// Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// MongoDB connection
const MONGO_URL =
    'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.0'

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// HTTP server
const server = http.createServer(app);
const PORT = process.env.PORT || (process.env.NODE_ENV === 'test' ? 0 : 8080);
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
export { app };