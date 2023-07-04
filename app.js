
require('dotenv').config();
const express=require('express')
const cookieParser = require('cookie-parser')
const mongoose=require('mongoose')
const cors=require('cors')
const path = require('path');
const app=express()

const adminRoute=require('./routes/admin')
const partnerRoute=require('./routes/partner')

app.use(cookieParser())
app.use(express.urlencoded({extended:false}))


// Serve static files from the 'public' directory
// app.use('/static', express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors({
    origin:["http://localhost:3000"],
    methods:['GET','POST','PATCH'],
    credentials:true
  }))

  app.use(express.json());

  app.use("/admin",adminRoute)
  app.use("/partner",partnerRoute)

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