const multer = require('multer');
const path = require('path');

// app.use(multer({dest: './public/images/uploads/'}).any())

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/uploads/');
    },
  
    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const storage2 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/profile/');
    },
  
    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

module.exports.upload = multer({
    storage: storage
}).single('content_image')

module.exports.upload2 = multer({
    storage: storage2
}).single('profile_image')

module.exports.hudai = () => {
    console.log("I'm hudai")
}


