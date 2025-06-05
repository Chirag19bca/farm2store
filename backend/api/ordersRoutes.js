const express = require("express");
const router = express.Router();
const db = require("../config/db");

const BASE_URL = "http://localhost:8081";

// Get orders for a retailer
router.get("/:retailerId", (req, res) => {
  const retailerId = req.params.retailerId;

  const sql = `
    SELECT o.id, o.quantity, o.total_price, 
           o.retailer_status, o.farmer_status, o.created_at,
           p.name AS product_name, p.unitprice AS unit_price, 
           CONCAT('${BASE_URL}', p.image) AS image,
           CONCAT(f.firstname, ' ', f.lastname) AS farmer_name
    FROM ordersr o
    JOIN product p ON o.product_id = p.id
    JOIN farmer f ON o.farmer_id = f.id
    WHERE o.retailer_id = ?;
  `;

  db.query(sql, [retailerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err.sqlMessage });
    }
    res.json(results);
  });
});

// Place a new order
router.post("/place", async (req, res) => {
  const { orders } = req.body;

  if (!orders || orders.length === 0) {
    return res.status(400).json({ success: false, message: "No orders provided." });
  }

  try {
    const productIds = orders.map((order) => order.product_id);
    
    // Fetch product details
    const [products] = await db.promise().query(
      `SELECT id, unitprice, quantity FROM product WHERE id IN (?)`,
      [productIds]
    );

    const stockMap = {};
    const priceMap = {};

    products.forEach((product) => {
      stockMap[product.id] = product.quantity;
      priceMap[product.id] = product.unitprice;
    });

    for (const order of orders) {
      if (!stockMap[order.product_id] || stockMap[order.product_id] < order.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ID ${order.product_id}`,
        });
      }
      order.unitprice = priceMap[order.product_id] || 0;
      order.total_price = order.unitprice * order.quantity;
    }

    const values = orders.map((order) => [
      order.retailer_id,
      order.farmer_id,
      order.product_id,
      order.quantity,
      order.total_price,
      "Pending",
      "Pending"
    ]);

    const sql =
      "INSERT INTO ordersr (retailer_id, farmer_id, product_id, quantity, total_price, retailer_status, farmer_status) VALUES ?";

    db.query(sql, [values], async (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error", error: err });
      }

      for (const order of orders) {
        await db.promise().query("UPDATE product SET quantity = quantity - ? WHERE id = ?", [
          order.quantity,
          order.product_id,
        ]);
      }

      res.json({
        success: true,
        message: "Orders placed successfully",
        orderCount: result.affectedRows,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get payments for a retailer
router.get("/retailer-payments/:retailerId", (req, res) => {
  const { retailerId } = req.params;

  const sql = `
    SELECT o.id, o.total_price AS amount, 
           CASE 
             WHEN LOWER(o.retailer_status) = 'completed' THEN 'Paid'
             ELSE 'Pending' 
           END AS status,
           o.created_at AS date,
           CONCAT(f.firstname, ' ', f.lastname) AS farmer_name
    FROM ordersr o
    JOIN farmer f ON o.farmer_id = f.id
    WHERE o.retailer_id = ?;
  `;

  db.query(sql, [retailerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err.sqlMessage });
    }
    res.json(results);
  });
});

// Get payments for a farmer
router.get("/farmer-payments/:farmerId", (req, res) => {
  const { farmerId } = req.params;

  const sql = `
    SELECT o.id, o.total_price AS amount, 
           CASE 
             WHEN LOWER(o.farmer_status) = 'delivered' THEN 'Received'
             ELSE 'Pending'
           END AS status,
           o.created_at AS date,
           CONCAT(r.firstname, ' ', r.lastname) AS retailer_name,
           p.name AS product_name
    FROM ordersr o
    JOIN retailer r ON o.retailer_id = r.id
    JOIN product p ON o.product_id = p.id
    WHERE o.farmer_id = ?;
  `;

  db.query(sql, [farmerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err.sqlMessage });
    }
    res.json(results);
  });
});

// Update order status
// Update order status
router.put("/update/:orderId", (req, res) => {
  const { orderId } = req.params;
  const { status, userType } = req.body;

  let updateFields = {};

  if (userType === "farmer") {
    updateFields.farmer_status = status;
    // If the farmer is setting the status to "Shipped", also update the retailer's status
    if (status === "Shipped") {
      updateFields.retailer_status = "Shipped";
    }
  } else if (userType === "retailer") {
    updateFields.retailer_status = status;
  } else {
    return res.status(400).json({ error: "Invalid userType." });
  }

  const sql = `UPDATE ordersr SET ? WHERE id = ?;`;

  db.query(sql, [updateFields, orderId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err.sqlMessage });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found or already updated." });
    }

    res.json({ success: true, message: "Order status updated successfully." });
  });
});
// Get orders for a farmer
router.get("/farmer/:farmerId", (req, res) => {
  const { farmerId } = req.params;

  const sql = `
    SELECT o.id, o.quantity, o.total_price, 
           o.farmer_status, o.retailer_status, o.created_at AS date,
           p.name AS product_name, p.unitprice AS unit_price, 
           CONCAT(r.firstname, ' ', r.lastname) AS retailer_name
    FROM ordersr o
    JOIN product p ON o.product_id = p.id
    JOIN retailer r ON o.retailer_id = r.id
    WHERE o.farmer_id = ?;
  `;

  db.query(sql, [farmerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err.sqlMessage });
    }
    res.json({ orders: results });
  });
});

module.exports = router;
