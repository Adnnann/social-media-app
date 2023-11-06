import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import messagesRoutes from "./routes/messages.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { Server } from "socket.io";
import { config } from "./config/config.js";
import session from "express-session";
import uniqBy from "lodash/uniqBy.js";
import cookieParser from "cookie-parser";
import _ from "lodash";

/* CONFIGURATIONS */
const sessionMiddleware = session({
  secret: "fdfdgdfhfhdfhdfhf",
  resave: true,
  saveUninitialized: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:3000",
  })
);

app.use(sessionMiddleware);

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

const server = app.listen(config.port, (err) => {
  console.log(`Server started at port ${config.port}`);
});
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

let activeUsers = [];

io.on("connection", (socket) => {
  const req = socket.request.session;

  req.save();

  socket.on("login", (data) => {
    console.log("data", data);
    activeUsers.push(data);
    req.users = _.uniqBy(activeUsers, "_id");
    req.save();
  });

  // Store room numbers in session
  let rooms = req.rooms || [];
  socket.on("create-room", (room) => {
    socket.join(room);
    rooms.push(room);
    req.rooms = rooms;
    req.save();
  });

  socket.on("leave-room", (room) => {
    socket.leave(room);
    rooms = rooms.filter((r) => r !== room);
    req.rooms = rooms;
  });

  socket.on("reconnect", (data) => {
    req.users = activeUsers;
    req.save();
  });

  socket.on("comment", (data) => {
    io.emit("post commented", data);
  });
  socket.on("message-sent", async (data) => {
    console.log("data", data);
    console.log(socket.request);
    req.rooms = req.rooms || [];
    console.log(req.rooms);
    let room;

    const roomExist = req.rooms.filter(
      (r) =>
        (r.includes(data.senderId) && r.includes(data.receiverId)) ||
        (r.includes(data.receiverId) && r.includes(data.senderId))
    );

    console.log("roomExist", roomExist);

    if (roomExist.length > 0) {
      socket.join(room);
    } else {
      room = `room-${data.receiverId}-${data.senderId}`;
      req.rooms.push(room);
      req.save();
      socket.join(room);
    }

    console.log("room", room);
    console.log("rooms", rooms);

    socket.broadcast.to(room).emit("message-received", data);
    // const { senderId } = data.user;
    // const message = await Message.findOneAndUpdate(
    //   { sender: data.user._id, receiver: data.receiverId },
    //   { $push: { message: data.message } },
    //   { new: true }
    // );
    // console.log("message", message);
  });
});

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
app.use("/auth", authRoutes);
/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/chat", messagesRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    io.listen(server);
    console.log(`DB connected at port ${PORT}`);
  })
  .catch((error) => console.log(`ERROR: ${error} did not connect`));
