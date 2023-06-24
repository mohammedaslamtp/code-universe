require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// cors
const corsOptions = {
  origin: process.env.URL,
  methods: "GET, POST, PUT ,DELETE ,PATCH, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(morgan("dev"));
app.use(bodyParser.json({limit:'15mb'}));
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");

// routes representation
const user_route = require("./routes/user");
const admin_route = require("./routes/admin");

// mongoose connection
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("db connected"));

app.use(express.static("public"));
app.use("/", user_route);
app.use("/admin", admin_route);

// port
const server = app.listen(process.env.PORT || 3000);

// socket
const socket = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const io = socket(server, {
  cors: {
    origin: ["https://admin.socket.io", "http://localhost:4200"],
    credentials: true,
  },
});
instrument(io, {
  auth: false,
});

// socket connection
const socketControll = require("./controller/socket");
io.on("connection", (client) => {
  socketControll.socketIo(io, client);
});
