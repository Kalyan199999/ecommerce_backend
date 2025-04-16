const multer = require('multer');
const path = require('path');

// Storage setup
const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
          cb(null, 'uploads/products/');
        },

        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + path.extname(file.originalname));
        }
   }
);

// File type validation
const fileFilter = (req, file, cb) => 
    {
        const allowedTypes = /jpeg|jpg|png/;

        const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        const mime = allowedTypes.test(file.mimetype);

        if (ext && mime) return cb(null, true);

        cb(new Error('Only images are allowed'));
        
   };

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
