require('dotenv').config();
const { Server } = require("socket.io");
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


const app = express();
const httpServer = http.createServer(app);

const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const partnerRoute = require('./routes/partner');
const messageRoute = require('./routes/message');

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());



app.use(cors({
  origin: ["http://localhost:3000",process.env.BASE_URL],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use("/partner", partnerRoute);
app.use("/message", messageRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to the database');
    
    const PORT =  5000;

    httpServer.listen(PORT, () => {
      console.log(`HTTP server is running on port ${PORT}`);
    });

    const io = new Server(httpServer, {
      cors: {
        origin: ["http://localhost:3000",process.env.BASE_URL],
        methods: ['GET', 'POST','PATCH'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
      }
    });

    io.on("connection", (socket) => {
      console.log("new connection", socket.id);

      socket.on('message', (message) => {
        io.emit("message", message);
      });

      socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
      });
    });

  })
  .catch((error) => {
    console.error('Database connection error:', error.message);
  });
