// app.js

import express from "express";
import cors from "cors";
import router from "./Routes.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // Para interpretar JSON no corpo das requisições
app.use(router); // Use o router que contém as rotas definidas

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
