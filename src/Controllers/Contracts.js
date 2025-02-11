import { pool } from "../configDB.js";

/**
 * Seleciona todos os contratos do banco de dados.
 */
export const selectContracts = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM contracts ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar contratos:", error);
    res.status(500).json({ error: "Erro ao buscar contratos." });
  }
};

/**
 * Seleciona um contrato pelo ID.
 */
export const selectContract = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID do contrato é obrigatório." });
  }

  try {
    const { rows } = await pool.query("SELECT * FROM contracts WHERE id = $1", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Contrato não encontrado." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar contrato:", error);
    res.status(500).json({ error: "Erro ao buscar contrato." });
  }
};

/**
 * Insere um novo contrato no banco de dados.
 */
export const insertContract = async (req, res) => {
  const contractData = req.body;
  const {
    contract_number,
    contract_value,
    contract_object,
    contract_term,
    contractor,  // Agora, 'contractor' e 'contracted_party' são objetos
    contracted_party
  } = contractData;

  const {
    name: contractor_name,
    description: contractor_description,
    document: contractor_document,
    representative: contractor_representative
  } = contractor || {}; // Desestruturação do objeto contractor

  const {
    name: contracted_party_name,
    description: contracted_party_description,
    document: contracted_party_document,
    representative: contracted_party_representative
  } = contracted_party || {}; // Desestruturação do objeto contracted_party

  try {
    const { rows } = await pool.query(
      `INSERT INTO contracts (
        contract_number, contractor_name, contractor_description, contractor_document, 
        contractor_representative, contracted_party_name, contracted_party_description, 
        contracted_party_document, contracted_party_representative, contract_value, 
        contract_object, contract_term
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      ) RETURNING *`,
      [
        contract_number,
        contractor_name,
        contractor_description,
        contractor_document,
        contractor_representative,
        contracted_party_name,
        contracted_party_description,
        contracted_party_document,
        contracted_party_representative,
        contract_value,
        contract_object,
        contract_term,
      ]
    );

    res.json({ message: "Contrato inserido com sucesso.", contract: rows[0] });
  } catch (error) {
    console.error("Erro ao inserir contrato:", error);
    res.status(500).json({ error: "Erro ao inserir contrato." });
  }
};

/**
 * Deleta um contrato pelo ID.
 */
export const deleteContract = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID do contrato é obrigatório." });
  }

  try {
    const { rowCount } = await pool.query("DELETE FROM contracts WHERE id = $1", [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Contrato não encontrado." });
    }

    res.json({ message: "Contrato deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar contrato:", error);
    res.status(500).json({ error: "Erro ao deletar contrato." });
  }
};

/**
 * Deleta múltiplos contratos pelo ID.
 */
export const deleteContracts = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "IDs inválidos." });
  }

  try {
    await pool.query("DELETE FROM contracts WHERE id = ANY($1)", [ids]);
    res.json({ message: "Contratos deletados com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar contratos:", error);
    res.status(500).json({ error: "Erro ao deletar contratos." });
  }
};
