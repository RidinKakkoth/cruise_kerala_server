const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
   
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/files"));
  },
  filename: function (req, file, cb) {
    console.log("gggggggggggggggg");
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  }
});

module.exports = multer({ storage: storage });

