import pool from "../../mysqlConnections.js";

async function createTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      asin VARCHAR(10) NOT NULL UNIQUE,
      original_data TEXT,
      optimized_data TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableSQL);
    console.log("Table 'products' created or already exists.");
  } catch (err) {
    console.error("Error creating table:", err);
    process.exit(1);
  }
}

createTable();
