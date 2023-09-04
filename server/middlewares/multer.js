const multer = require("multer");
const path = require("path");

const typeChecking = (file, cb) => {
  const allowedFileTypes = [".png", ".jpeg", ".jpg"];
  const fileExt = path.extname(file.originalname);
  if (allowedFileTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb("Invalid file type. Only PNG, JPEG, and JPG files are allowed.", false);
  }
};

const upload = () => {
  return (req, res, next) => {
    try {
      // Set storage engine
      const storage = multer.diskStorage({
        destination: "public/uploads/profile_images",
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + "-codebox-" + file.originalname;
          cb(null, file.fieldname + "-" + uniqueSuffix);
        },
      });

      res.locals.upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
          typeChecking(file, cb);
        },
        limits: { fileSize: 10 * 1024 * 1024 },
      }).single("avatar");
      next();
    } catch (error) {
      res.status(404).json(error.message);
    }
  };
};

module.exports = upload;
