import express from "express";
import { uploadFile } from "./Controllers/UploadFile.js";
import { analyzeFile } from "./gemini.js";
import {
  deleteContract,
  deleteContracts,
  insertContract,
  selectContract,
  selectContracts,
} from "./Controllers/Contracts.js";

const router = express.Router();

// Middleware de upload
const upload = uploadFile();

router.use("/files", express.static("uploads")); // Expor a pasta uploads

router.get("/", (req, res) => {
  res.send({
    statusCode: 200,
    msg: "Servidor rodando...",
  });
});

// Rota para buscar todos os contratos
router.get("/contracts", selectContracts);

// Rota para buscar um contrato específico por ID
router.get("/contract/:id", selectContract);

// Endpoint para upload de arquivos e inserção no banco de dados
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado." });
  }

  try {
    const filePath = req.file.path;

    console.log(`Analisando arquivo: ${filePath}`);

    // Analisa o arquivo PDF e obtém os dados do contrato
    const result = await analyzeFile(filePath);

    // Parse do resultado da análise para JSON
    const cleanResponse = result.replace(/```json|```/g, ""); // Remove a marcação de código
    const contractData = JSON.parse(cleanResponse);

    // Insere o contrato no banco de dados e retorna o contrato inserido
    await insertContract({ body: contractData }, res);
  } catch (error) {
    console.error("Erro no endpoint /upload:", error);
    res.status(500).json({ error: "Erro ao processar o arquivo." });
  }
});

// Rota para deletar um contrato por ID
router.delete("/contract/:id", deleteContract);

// Rota para deletar múltiplos contratos (usando array de IDs no body)
router.delete("/contracts", deleteContracts);

export default router;
