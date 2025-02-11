import express from "express";
import cors from "cors";
import router from "./Routes.js";

const app = express();
const PORT = 3010;

app.use(cors());
app.use(express.json()); 
app.use(router); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
