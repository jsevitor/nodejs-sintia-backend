import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Define a route
app.get("/teste", (req, res) => {
  // Send a response to the client
  res.send("something");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

/* ****************************************************************** */

import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const genAI = new GoogleGenerativeAI("AIzaSyAQq2BAbdXuOvaCYVnJAMnYsA5zqy5_UkA");
const fileManager = new GoogleAIFileManager(
  "AIzaSyAQq2BAbdXuOvaCYVnJAMnYsA5zqy5_UkA"
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  tools: {
    functionDeclarations: [contractDataFunctionDeclaration],
  },
});

async function setContractData(
  contractor,
  hired,
  contractAmount,
  contractObject,
  hiredDocument
) {
  return {
    contractor: contractor,
    hired: hired,
    contractAmount: contractAmount,
    contractObject: contractObject,
    hiredDocument: hiredDocument,
  };
}

const contractDataFunctionDeclaration = {
  name: "contractAnalysis",
  parameters: {
    type: "OBJECT",
    description: "obtains the main data of a contract",
    properties: {
      contractor: {
        type: "STRING",
        description: "individual or entity that hires",
      },
      hired: {
        type: "STRING",
        description: "individual or entity that is hired",
      },
      contractAmount: {
        type: "NUMBER",
        description:
          "is the amount of remuneration to be paid to the contractor",
      },
      contractObject: {
        type: "STRING",
        description:
          "is what is intended to be obtained or accomplished, the purpose or objective of a contract",
      },
      hiredDocument: {
        type: "NUMBER",
        description:
          "is the hired's identification document, being the CPF for individuals and CNPJ for companies/entities",
      },
    },
    required: [
      "contractor",
      "hired",
      "contractAmount",
      "contractObject",
      "hiredDocument",
    ],
  },
};

const functions = {
  contractAnalysis: ({
    contractor,
    hired,
    contractAmount,
    contractObject,
    hiredDocument,
  }) => {
    return setContractData(
      contractor,
      hired,
      contractAmount,
      contractObject,
      hiredDocument
    );
  },
};

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
        text: "Identifique o contratante, o contratado, o valor do contrato, o objeto de contratação e o CPF ou CNPJ do contratado. Retorne o dado exato em tópicos",
      },
    ]);

    const summaryText = await result.response.text();
    return summaryText;
  } catch (error) {
    console.error("Error analyzing file:", error);
    throw error;
  }
}
