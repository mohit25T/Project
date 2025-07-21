import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/misc";

    if (file.fieldname === "profile_pic") {
      folder = "uploads/profiles";
    } else if (file.fieldname === "image") {
      folder = "uploads/posts";
    }

    // Ensure folder exists
    fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;
