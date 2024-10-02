import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from "dotenv";

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function analyzeFile(filePath) {
  try {
    console.log(`Uploading file: ${filePath}`);

    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: "application/pdf",
      displayName: "Gemini 1.5 PDF",
    });

    console.log(`Upload response: ${JSON.stringify(uploadResponse)}`);

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      {
        text: `Please return JSON describing the contract's number (only the numbers), the contractor, the contracted party, the contract value, the contract object, and the contracted party's document (CPF or CNPJ) and representative person from the results using the following schema:
      
      {
        "contract_number: "str",
        "contractor": {"name": str, "description": str, "document": str},
        "contracted_party": {"name": str, "description": str, "document": str, "representative": str},
        "contract_value": float,
        "contract_object": str
      }
      
      All fields are required.
      
      Important: Only return a single piece of valid JSON text.`,
      },
    ]);

    console.log(result);
    const summaryText = await result.response.text();
    return summaryText;
  } catch (error) {
    console.error("Error analyzing file:", error);
    throw error;
  }
}
