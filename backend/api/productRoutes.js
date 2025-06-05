const express = require("express");
const multer = require("multer");
const fs = require("fs");
const db = require("../config/db");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Add a new product
router.post("/", upload.single("image"), (req, res) => {
  const { name, description, quantity, unitprice, category_id } = req.body;
  const farmer_id = req.body.farmer_id;
  const image = req.file ? `/images/${req.file.filename}` : null;

  if (!name || !description || !quantity || !unitprice || !category_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `INSERT INTO product (name, description, image, quantity, unitprice, farmer_id, category_id)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [name, description, image, quantity, unitprice, farmer_id, category_id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding product:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.status(201).json({
      message: "Product added successfully",
      productId: result.insertId,
    });
  });
});
//searchbar routes
router.get("/search", (req, res) => {
  const { query } = req.query;

  let sql = `SELECT p.id, p.name, p.description, p.unitprice AS price, p.quantity, p.image, 
                    c.name AS category_name, CONCAT(f.firstname, ' ', f.lastname) AS farmer_name
             FROM product p
             JOIN category c ON p.category_id = c.id
             JOIN farmer f ON p.farmer_id = f.id
             WHERE p.name LIKE ? 
             OR p.description LIKE ? 
             OR c.name LIKE ? 
             OR CONCAT(f.firstname, ' ', f.lastname) LIKE ?`; //   Search both product & farmer

  const values = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Error searching products" });
    }

    const updatedData = data.map((product) => ({
      ...product,
      image: product.image ? `http://localhost:8081${product.image}` : null,
    }));

    res.json(updatedData);
  });
});


// Get all products (Fixed: Added `quantity`)
router.get("/", (req, res) => {
  const { category, farmer_id } = req.query;

  let sql = `SELECT p.id, p.name, p.unitprice, p.quantity, p.image, p.farmer_id, 
                    c.name AS category_name
             FROM product p
             JOIN category c ON p.category_id = c.id`;
  
  const values = [];

  if (category) {
    sql += " WHERE c.name = ?";
    values.push(category);
  }

  if (farmer_id) {
    sql += category ? " AND" : " WHERE";
    sql += " p.farmer_id = ?";
    values.push(farmer_id);
  }

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Error fetching products" });
    }

    const updatedData = data.map((product) => ({
      ...product,
      image: product.image ? `http://localhost:8081${product.image}` : null,
    }));

    res.json(updatedData);
  });
});


// Get single product by ID
router.get("/:id", (req, res) => {
  const productId = req.params.id;

  if (!productId || isNaN(Number(productId))) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  const sql = `SELECT p.id, p.name, p.description, p.image, p.quantity, p.unitprice AS price, 
                      p.farmer_id,  -- Include farmer_id here
                      CONCAT(f.firstname, ' ', f.lastname) AS seller,
                      f.address AS address, 
                      c.name AS category
               FROM product p
               JOIN category c ON p.category_id = c.id
               JOIN farmer f ON p.farmer_id = f.id
               WHERE p.id = ?`;

  db.query(sql, [productId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Error fetching product details" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = {
      ...data[0],
      image: data[0].image ? `http://localhost:8081${data[0].image}` : null,
    };

    res.json(product);
  });
});

// Delete a product by ID
router.delete("/:id", (req, res) => {
  const productId = req.params.id;

  if (!productId || isNaN(Number(productId))) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  const getImageQuery = "SELECT image FROM product WHERE id = ?";
  db.query(getImageQuery, [productId], (err, result) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const deleteQuery = "DELETE FROM product WHERE id = ?";
    db.query(deleteQuery, [productId], (deleteErr) => {
      if (deleteErr) {
        console.error("Error deleting product:", deleteErr);
        return res.status(500).json({ error: "Database error" });
      }

      const productImage = result[0].image;
      if (productImage) {
        const imagePath = `./${productImage}`;
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting image file:", unlinkErr);
          });
        }
      }

      res.json({ message: "Product deleted successfully" });
    });
  });
});

// Update a product (Fixed: Allow updating image)
router.put("/:id", upload.single("image"), (req, res) => {
  const { name, description, quantity, unitprice, category_id } = req.body;
  const { id } = req.params;
  
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  if (!name || !description || !quantity || !unitprice || !category_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const image = req.file ? `/images/${req.file.filename}` : null;

  let sql, values;
  if (image) {
    sql = "UPDATE product SET name=?, description=?, quantity=?, unitprice=?, category_id=?, image=? WHERE id=?";
    values = [name, description, quantity, unitprice, category_id, image, id];
  } else {
    sql = "UPDATE product SET name=?, description=?, quantity=?, unitprice=?, category_id=? WHERE id=?";
    values = [name, description, quantity, unitprice, category_id, id];
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ error: "Error updating product", details: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });
  });
});


module.exports = router;
