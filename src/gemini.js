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
        text: `Por favor, retorne um JSON descrevendo o número do contrato (na configuração números/ano), o contratante, a pessoa representante do contratante, a parte contratada, o documento da parte contratada (CPF ou CNPJ), a pessoa representante da contratada, o valor do contrato, o objeto do contrato e a data de vigência do contrato, utilizando o seguinte esquema:
        {
          "contract_number": "str",
          "contractor": {"name": str, "description": str, "document": str, "representative": str},
          "contracted_party": {"name": str, "description": str, "document": str, "representative": str},
          "contract_value": float,
          "contract_object": str,
          "contract_term": "str"
        }
          
          Todos os campos são obrigatórios.
          
          Importante: Retorne apenas um único texto JSON válido.`,
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
