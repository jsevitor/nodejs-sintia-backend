import { openDb } from "../configDB.js";

export async function createTable() {
  openDb().then((db) => {
    db.exec(
      "CREATE TABLE IF NOT EXISTS contracts (id INTEGER PRIMARY KEY AUTOINCREMENT, contract_number TEXT, contractor_name TEXT, contractor_description TEXT, contractor_document TEXT, contractor_representative TEXT, contracted_party_name TEXT, contracted_party_description TEXT, contracted_party_document TEXT, contracted_party_representative TEXT, contract_value REAL, contract_object TEXT, contract_term TEXT)"
    ).catch((error) => console.error("Error creating table:", error));
  });
}

export async function selectContracts(req, res) {
  openDb()
    .then((db) => {
      db.all("SELECT * FROM contracts")
        .then((contracts) => res.json(contracts))
        .catch((error) => {
          res.status(500).json({ error: "Error fetching contracts" });
          console.error("Error fetching contracts:", error);
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error opening database" });
      console.error("Error opening database:", error);
    });
}

export async function selectContract(req, res) {
  let id = req.params.id; // Modificado para pegar o parâmetro da URL
  openDb()
    .then((db) => {
      db.get("SELECT * FROM contracts WHERE id=?", [id])
        .then((contract) => {
          if (contract) {
            res.json(contract);
          } else {
            res.status(404).json({ error: "Contract not found" });
          }
        })
        .catch((error) => {
          res.status(500).json({ error: "Error fetching contract" });
          console.error("Error fetching contract:", error);
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error opening database" });
      console.error("Error opening database:", error);
    });
}

export async function insertContract(contract) {
  const db = await openDb();
  try {
    await db.run(
      "INSERT INTO contracts (contract_number, contractor_name, contractor_description, contractor_document, contractor_representative, contracted_party_name, contracted_party_description, contracted_party_document, contracted_party_representative, contract_value, contract_object, contract_term) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        contract.contract_number,
        contract.contractor.name,
        contract.contractor.description,
        contract.contractor.document,
        contract.contractor.representative,
        contract.contracted_party.name,
        contract.contracted_party.description,
        contract.contracted_party.document,
        contract.contracted_party.representative,
        contract.contract_value,
        contract.contract_object,
        contract.contract_term,
      ]
    );
    console.log("Dados de contrato inseridos com sucesso.");
    return { success: true };
  } catch (error) {
    console.error("Erro ao inserir contrato:", error);
    throw error; // Agora lançamos o erro para o router capturar
  }
}

export async function deleteContract(req, res) {
  let id = req.body.id;
  openDb()
    .then((db) => {
      db.run("DELETE FROM contracts WHERE id=?", [id])
        .then(() => {
          res.json({
            statusCode: 200,
            msg: "Contrato deletado com sucesso!",
          });
        })
        .catch((error) => {
          res.status(500).json({ error: "Error deleting contract" });
          console.error("Error deleting contract:", error);
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error opening database" });
      console.error("Error opening database:", error);
    });
}
