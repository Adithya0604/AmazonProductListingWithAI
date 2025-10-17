import db from "../../mysqlConnections.js";

export async function AllHistoryProductList(req, res) {
  const sql = "SELECT * FROM products ORDER BY id DESC";

  try {
    const [results] = await db.query(sql);
    res.json({ success: true, products: results });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Database error",
      error: err,
    });
  }
}
