const multer = require("multer")
const path = require("path")

module.exports = multer({
    storage: multer.diskStorage({}),
    /* fileFilter: (req, file, cb)=>{
        let ext = path.extname(file.originalname);
        if(ext!== ".jpg" && ext !==".jpeg" && ext !== ".png" && ext !== ".mkv" && ext !== ".mp4"){
            cb(new Error("Not supported"),false);
            return;
        }
        cb(null,true)
    } */
})