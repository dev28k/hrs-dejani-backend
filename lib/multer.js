const multer = require("multer");

// storage engine 
const storage = multer.diskStorage({
    destination: './public/upload/Images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}.png`)
    }
 })

 const storageVid = multer.diskStorage({
    destination: './public/upload/Videos',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}.mp4`)
    }
 })
 
 // multer upload folder
 const upload = multer({
    storage: storage,
 })

 const uploadVid = multer({
    storage: storageVid,
 })

 module.exports = {upload, uploadVid}