
require('dotenv').config();
const express=require('express')
const cookieParser = require('cookie-parser')
const mongoose=require('mongoose')
const cors=require('cors')
const socketIO = require('socket.io'); 
const path = require('path');
const http=require("http")
const app=express()

const userRoute=require('./routes/user')
const adminRoute=require('./routes/admin')
const partnerRoute=require('./routes/partner')
const chatRoute=require('./routes/chat')
const messageRoute=require('./routes/message')

app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

const server = http.createServer(app);
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors({
    origin:["http://localhost:3000"],
    methods:['GET','POST','PATCH'],
    credentials:true
  }))
// app.use(cors({
//   origin: ["http://localhost:3000"],
//   methods: '*',
//   credentials: true
// }));

  app.use(express.json());

  app.use("/",userRoute)
  app.use("/admin",adminRoute)
  app.use("/partner",partnerRoute)
  app.use("/chat",chatRoute)
  app.use("/message",messageRoute)


// // Socket.io connection handling
// io.on('connection', (socket) => {
//   console.log('Socket.io connected');

//   // Handle incoming messages from clients
//   socket.on('message', async (data) => {
//     try {
//       // Assuming data object contains relevant information like chatId, senderId, and text
//       // Call your createMessage function to save the message to the database
//       // Emit the message to relevant chat using io.to(chatId).emit(...)
//     } catch (error) {
//       console.log('Error handling message:', error);
//     }
//   });

//   // Handle Socket.io disconnection
//   socket.on('disconnect', () => {
//     console.log('Socket.io disconnected');
//   });
// });

  // Connect to the database
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Connected to the database');
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
})
.catch((error) => {
  console.error('Database connection error:', error.message);
});