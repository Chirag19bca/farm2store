const express = require('express');
const router = express.Router();
const db = require("../config/db");

// Route to fetch registered farmers with optional search
router.get('/farmer', (req, res) => {
    let query = 'SELECT * FROM farmer';
    const search = req.query.search;

    if (search) {
        query += ` WHERE firstname LIKE ? OR lastname LIKE ? OR phone LIKE ?`;
    }

    db.query(query, search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json({ message: 'Fetching successful', data: result });
    });
});

// Route to delete a farmer by ID
router.delete('/farmer/:id', (req, res) => {
    const farmerId = req.params.id;
    const query = 'DELETE FROM farmer WHERE id = ?';

    db.query(query, [farmerId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Farmer not found' });
        }
        res.status(200).json({ message: 'Farmer deleted successfully' });
    });
});

// Route to fetch registered retailers with optional search
router.get('/retailer', (req, res) => {
    let query = 'SELECT * FROM retailer';
    const search = req.query.search;

    if (search) {
        query += ` WHERE firstname LIKE ? OR lastname LIKE ? OR phone LIKE ?`;
    }

    db.query(query, search ? [`%${search}%`, `%${search}%`] : [], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json({ message: 'Fetching successful', data: result });
    });
});

// Route to delete a retailer by ID
router.delete('/retailer/:id', (req, res) => {
    const retailerId = req.params.id;
    const query = 'DELETE FROM retailer WHERE id = ?';

    db.query(query, [retailerId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Retailer not found' });
        }
        res.status(200).json({ message: 'Retailer deleted successfully' });
    });
});

module.exports = router;
