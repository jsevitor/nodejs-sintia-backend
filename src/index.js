import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { analyzeFile } from "./gemini.js";

const app = express();
const PORT = 3001;

// Criação do diretório de uploads se não existir
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Configuração do multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.resolve("uploads"));
    },
    filename: (req, file, callback) => {
      const time = new Date().getTime();
      //   const ext = path.extname(file.originalname);
      callback(null, "doc.pdf");
    },
  }),
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      return callback(new Error("Only PDF files are allowed"), false);
    }
    callback(null, true);
  },
});

app.use(cors());

// Serve arquivos estáticos da pasta uploads
app.use("/files", express.static("uploads"));

// Endpoint para upload de arquivos
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const filePath = req.file.path;

    console.log(`Analyzing file: ${filePath}`);

    const result = await analyzeFile(filePath);

    console.log(result);

    res.json({ result }); // Envia o resultado como JSON para o frontend
  } catch (error) {
    console.error("Error in /upload endpoint:", error);
    res.status(500).json({ error: error.message });
  }
});

// Inicia o servidor na porta configurada
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
