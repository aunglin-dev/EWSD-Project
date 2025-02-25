import multer from "multer";
import fs from "fs";

// Ensure the "uploads" directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const originalName = file.originalname.replace(/\s+/g, "_"); // Remove spaces for safety
        cb(null, `${timestamp}_${originalName}`); // Keep original filename with timestamp prefix
    },
});

// File filter (only allow certain types)
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf", "image/jpeg", "image/png", "text/plain",
        "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDF, Word, JPG, PNG, and TXT are allowed."));
    }
};

const upload = multer({ storage, fileFilter });

export default upload;
