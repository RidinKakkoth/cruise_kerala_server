require('dotenv').config();
const { Server } = require("socket.io");
const express = require('express');
const http = require('http'); // Import http module
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const httpServer = http.createServer(app); // Create an HTTP server using express

const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const partnerRoute = require('./routes/partner');
const chatRoute = require('./routes/chat');
const messageRoute = require('./routes/message');

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// app.use(cors({
//     origin: process.env.BASE_URL || "http://localhost:3000",
//     methods: ['GET', 'POST', 'PATCH', 'DELETE'],
//     credentials: true
// }));
app.use(cors({
  origin: ["https://cruisekerala.netlify.app"],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));

// app.use(cors({
//     origin: ["http://localhost:3000"],
//     methods: ['GET', 'POST', 'PATCH', 'DELETE'],
//     credentials: true
// }));

console.log('PORT:', process.env.PORT);
console.log('BASE_URL:', process.env.BASE_URL);
// ... other environment variables ...


app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use("/partner", partnerRoute);
app.use("/chat", chatRoute);
app.use("/message", messageRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to the database');
    
    // Start the HTTP server (Express app) listening on port 5000
    // httpServer.listen(5000, () => {
    //   console.log('HTTP server is running on port 5000');
    // });
    
    const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`HTTP server is running on port ${PORT}`);
});


    // Start the Socket.io server listening on the same port
    // const io = new Server(httpServer, {
    //   cors: {
    //     origin: "http://localhost:3000",
    //     methods: ["GET", "POST"]
    //   }
    // });
    

    const io = new Server(httpServer, {
      cors: {
        origin: ["https://cruisekerala.netlify.app"],
        methods: ["GET", "POST"]
      }
    });
    // const io = new Server(httpServer, {
    //   cors: {
    //     origin: process.env.BASE_URL || "http://localhost:3000",
    //     methods: ["GET", "POST"]
    //   }
    // });
    


    // Socket.io setup
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