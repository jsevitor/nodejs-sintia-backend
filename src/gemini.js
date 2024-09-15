import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const genAI = new GoogleGenerativeAI("AIzaSyAQq2BAbdXuOvaCYVnJAMnYsA5zqy5_UkA");
const fileManager = new GoogleAIFileManager(
  "AIzaSyAQq2BAbdXuOvaCYVnJAMnYsA5zqy5_UkA"
);

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
        text: `Please return JSON describing the contract contractor, the hired, the contract amount, the contract object, and the hired's document (CPF or CNPJ) from the results using the following schema:
      
      {
        "contractNumber: "str",
        "contractor": {"name": str, "description": str},
        "hired": {"name": str, "description": str, "document": str},
        "contract_amount": float,
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
