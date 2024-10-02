import multer from "multer";
import path from "path";
import fs from "fs";

export function uploadFile() {
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

  // Configura o multer
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, path.resolve("uploads"));
      },
      filename: (req, file, callback) => {
        callback(null, "doc.pdf"); // Nome fixo "doc.pdf", talvez você queira algo mais dinâmico
      },
    }),
    fileFilter: (req, file, callback) => {
      if (file.mimetype !== "application/pdf") {
        return callback(new Error("Only PDF files are allowed"), false);
      }
      callback(null, true);
    },
  });
}
