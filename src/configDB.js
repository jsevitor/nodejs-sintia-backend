import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDb() {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  // Configurações para garantir a consistência
  await db.exec("PRAGMA journal_mode = WAL"); // Habilita o modo Write-Ahead Logging
  await db.exec("PRAGMA synchronous = FULL"); // Sincronização total para maior segurança

  return db;
}
