import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bytelift",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg",
      "ico",
      "bmp",
      "tiff",
      "mp4",
      "mov",
      "avi",
      "webm",
      "mkv",
      "flv",
      "wmv",
      "m4v",
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "odt",
      "ods",
      "odp",
      "txt",
      "csv",
      "json",
      "xml",
      "html",
      "css",
      "js",
      "ts",
      "md",
      "zip",
      "rar",
      "tar",
      "gz",
      "7z",
      "bz2",
      "mp3",
      "wav",
      "ogg",
      "flac",
      "aac",
      "m4a",
    ],
    resource_type: "auto",
  } as any,
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
      "image/tiff",
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
      "video/x-matroska",
      "video/x-flv",
      "video/x-ms-wmv",
      "video/mp4",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.oasis.opendocument.text",
      "application/vnd.oasis.opendocument.spreadsheet",
      "application/vnd.oasis.opendocument.presentation",
      "text/plain",
      "text/csv",
      "application/json",
      "application/xml",
      "text/html",
      "text/css",
      "text/javascript",
      "application/zip",
      "application/x-rar-compressed",
      "application/x-tar",
      "application/gzip",
      "application/x-7z-compressed",
      "application/x-bzip2",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/flac",
      "audio/aac",
      "audio/mp4",
      "application/octet-stream",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

async function deleteFile(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary, upload, deleteFile };
