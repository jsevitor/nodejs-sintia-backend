// app.js

import express from "express";
import cors from "cors";
import router from "./Routes.js";
import { createTable } from "./Controllers/Contract.js";

const app = express();
const PORT = 3010;

app.use(cors());
app.use(express.json()); // Para interpretar JSON no corpo das requisições
app.use(router); // Use o router que contém as rotas definidas

// createTable();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
