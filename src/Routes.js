import express from "express";
import { uploadFile } from "./Controllers/UploadFile.js";
import { analyzeFile } from "./gemini.js";

const router = express.Router();

// Middleware de upload
const upload = uploadFile();

router.get("/", (req, res) => {
  res.send("Servidor rodando...");
});

router.use("/files", express.static("uploads")); // Expor a pasta uploads

// Endpoint para upload de arquivos
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const filePath = req.file.path;

    console.log(`Analyzing file: ${filePath}`);

    const result = await analyzeFile(filePath);

    console.log(result);

    res.json({ result });
  } catch (error) {
    console.error("Error in /upload endpoint:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
