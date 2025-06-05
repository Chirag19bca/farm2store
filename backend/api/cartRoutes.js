const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get cart items for a specific retailer
router.get("/cart/:retailerId", (req, res) => {
    const retailerId = req.params.retailerId;
    const sql = `
        SELECT c.id, c.retailer_id, c.product_id, c.quantity, 
               p.name, p.price, p.image 
        FROM cart c 
        JOIN product p ON c.product_id = p.id 
        WHERE c.retailer_id = ?
    `;
    db.query(sql, [retailerId], (err, result) => {
        if (err) {
            console.error("Error fetching cart items:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(result);
        }
    });
});

// Add product to cart
// Add product to cart
router.post("/add", async (req, res) => {
    const { retailer_id, farmer_id, product_id, quantity } = req.body;

    if (!retailer_id || !farmer_id || !product_id || !quantity) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        // Fetch product quantity
        const [product] = await db.query("SELECT quantity FROM product WHERE id = ?", [product_id]);

        if (!product || product.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        if (quantity > product[0].quantity) {
            return res.status(400).json({ success: false, message: `Only ${product[0].quantity} in stock!` });
        }

        // Check if product is already in cart
        const [existingCart] = await db.query(
            "SELECT id, quantity FROM cart WHERE retailer_id = ? AND product_id = ?",
            [retailer_id, product_id]
        );

        if (existingCart.length > 0) {
            // Update quantity if already in cart
            const newQuantity = existingCart[0].quantity + quantity;

            if (newQuantity > product[0].quantity) {
                return res.status(400).json({ success: false, message: `Only ${product[0].quantity} in stock!` });
            }

            await db.query("UPDATE cart SET quantity = ? WHERE id = ?", [newQuantity, existingCart[0].id]);
        } else {
            // Insert new entry
            await db.query(
                "INSERT INTO cart (retailer_id, farmer_id, product_id, quantity) VALUES (?, ?, ?, ?)",
                [retailer_id, farmer_id, product_id, quantity]
            );
        }

        res.json({ success: true, message: "Product added to cart." });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

// Remove an item from the cart
router.delete("/cart/:retailerId/:productId", (req, res) => {
    const { retailerId, productId } = req.params;
    const sql = "DELETE FROM cart WHERE retailer_id = ? AND product_id = ?";
    db.query(sql, [retailerId, productId], (err, result) => {
        if (err) {
            console.error("Error removing item:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json({ message: "Item removed from cart" });
        }
    });
});

module.exports = router;
