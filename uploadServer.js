
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Save images inside frontend public/images
const uploadPath = path.join(__dirname, "public", "images");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPG and WEBP images are allowed"));
    }
  },
});

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Please select an image",
    });
  }

  res.json({
    message: "Image uploaded successfully",
    image: `/images/${req.file.filename}`,
  });
});

app.listen(3001, () => {
  console.log("Image upload server running on port 3001");
});
