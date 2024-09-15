import path from "path";
import fs from "fs";
import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use variáveis de ambiente para proteger a chave de API
const genAI = new GoogleGenerativeAI("AIzaSyAQq2BAbdXuOvaCYVnJAMnYsA5zqy5_UkA");
const fileManager = new GoogleAIFileManager(
  "AIzaSyAQq2BAbdXuOvaCYVnJAMnYsA5zqy5_UkA"
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function analyzeFile() {
  try {
    console.log("Reading PDF file");

    // Caminho do arquivo PDF
    const filePath = path.resolve("uploads", "doc.pdf");

    // Ler o arquivo PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    // Conteúdo extraído do PDF
    const extractedText = pdfData.text;

    // Geração do conteúdo a partir do texto extraído
    const result = await model.generateContent({
      text: extractedText,
      prompt: `Please return JSON describing the contractor, the hired, the contract amount, the contract object, and the hired's document (CPF or CNPJ) from the results using the following schema:
      
      {
        "contractor": {"name": str, "description": str},
        "hired": {"name": str, "description": str, "document": str},
        "contract_amount": float,
        "contract_object": str
      }
      
      All fields are required.
      
      Important: Only return a single piece of valid JSON text.`,
    });

    console.log("Generated content result:", JSON.stringify(result));

    return result;
  } catch (error) {
    console.error("Error analyzing file:", error);
    throw error;
  }
}

analyzeFile();
