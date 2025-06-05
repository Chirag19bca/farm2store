const express = require("express");
const router = express.Router();
const db = require("../config/db");

//   Fetch all categories
router.get("/", (req, res) => {
  const sql = "SELECT * FROM category";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Error fetching categories" });
    return res.json(data);
  });
});

module.exports = router;
