const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const tables = ["admin", "retailer", "farmer"];

  try {
    for (const table of tables) {
      const sql = `SELECT * FROM ${table} WHERE email = ? AND password = ?`;
      const result = await new Promise((resolve, reject) => {
        db.query(sql, [email, password], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

      if (result.length > 0) {
        const user = result[0];

        return res.json({
          success: true,
          id: user.id,          // Include ID
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,      // Include email
          role: table,
          phone: user.phone,      // Include phone
          address: user.address, // Include address
          shop_name: user.shop_name,    // Include shop_name for retailers
          shop_address: user.shop_address, // Include shop_address for retailers
        });
      }
    }

    // If no match is found after checking all tables
    res.json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

// Farmer Registration
router.post("/register/farmer", (req, res) => {
  const { firstname, lastname, email, password, phone, address } = req.body;

  if (!address) {
    return res.status(400).json({ message: "Address is required for farmers." });
  }

  const sql = "INSERT INTO farmer (firstname, lastname, email, password, phone, address) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [firstname, lastname, email, password, phone, address], (err, result) => {
    if (err) {
      console.error("Farmer Registration Error:", err);
      return res.status(500).json({ message: "Error registering farmer" });
    }
    res.json({ message: "Farmer registered successfully" });
  });
});

// Retailer Registration
router.post("/register/retailer", (req, res) => {
  const { firstname, lastname, email, password, phone, shop_name, shop_address } = req.body;

  if (!shop_name || !shop_address) {
    return res.status(400).json({ message: "Shop Name and Shop Address are required for retailers." });
  }

  const sql = "INSERT INTO retailer (firstname, lastname, email, password, phone, shop_name, shop_address) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [firstname, lastname, email, password, phone, shop_name, shop_address], (err, result) => {
    if (err) {
      console.error("Retailer Registration Error:", err);
      return res.status(500).json({ message: "Error registering retailer" });
    }
    res.json({ message: "Retailer registered successfully" });
  });
});

router.post("/updateProfile", async (req, res) => {
  const { id, phone, address, shop_name, shop_address, role, firstname, lastname } = req.body;

  let table;
  let updateFields = [];
  let values = [];

  if (role === "farmer") {
    table = "farmer";
    updateFields = ["phone = ?", "address = ?", "firstname = ?", "lastname = ?"];
    values = [phone, address, firstname, lastname, id];
  } else if (role === "retailer") {
    table = "retailer";
    updateFields = ["phone = ?", "shop_name = ?", "shop_address = ?", "firstname = ?", "lastname = ?"];
    values = [phone, shop_name, shop_address, firstname, lastname, id];
  } else if (role === "admin") {
    table = "admin";
    updateFields = ["phone = ?", "firstname = ?", "lastname = ?"];
    values = [phone, firstname, lastname, id];
  } else {
    return res.status(400).json({ success: false, error: "Invalid role" });
  }

  try {
    const sql = `UPDATE ${table} SET ${updateFields.join(", ")} WHERE id = ?`;

    await new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    res.json({ success: true, message: "Profile updated successfully", data: {firstname, lastname, phone, address, shop_name, shop_address} }); //send back the updated data
  } catch (error) {
    res.status(500).json({ success: false, error: "Database error" });
  }
});


module.exports = router;