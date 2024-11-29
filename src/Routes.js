import express from "express";
import { uploadFile } from "./Controllers/UploadFile.js";
import { analyzeFile } from "./gemini.js";
import {
  deleteContract,
  insertContract,
  selectContract,
  selectContracts,
} from "./Controllers/Contract.js";

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

router.get("/contracts", selectContracts);
router.get("/contract", selectContract);

// Endpoint para upload de arquivos
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

    // const contractData = JSON.parse(result);

    // console.log(result);

    // Insere o contrato no banco de dados
    await insertContract(contractData);

    console.log("Contrato inserido:", contractData);

    res.json({ message: "Contrato inserido com sucesso.", contractData });
  } catch (error) {
    console.error("Erro no endpoint /upload:", error);
    res.status(500).json({ error: "Erro ao processar o arquivo." });
  }
});

router.delete("/contract", deleteContract);

export default router;
