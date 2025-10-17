import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql2.createPool({
  connectionLimit: parseInt(process.env.connectionLimit, 10) || 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL");
    connection.release();
  } catch (err) {
    console.error("MySQL connection error:", err.message);
    process.exit(1);
  }
})();

export default pool;
