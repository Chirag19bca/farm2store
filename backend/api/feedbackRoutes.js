const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/retailers", (req, res) => {
    db.query("SELECT id, CONCAT(firstname,' ',lastname) AS name FROM retailer", (err, results) => {
      if (err) return res.status(500).json({ success: false });
      res.json(results);
    });
  });
  
  router.get("/farmers", (req, res) => {
    db.query("SELECT id, CONCAT(firstname,' ',lastname) AS name FROM farmer", (err, results) => {
      if (err) return res.status(500).json({ success: false });
      res.json(results);
    });
  });
    

  
  // Submit feedback: from farmer to retailer or retailer to farmer
  router.post("/add", (req, res) => {
    const { user_id, user_type, feedback_text, target_user_id } = req.body;
  
    // Basic validation
    if (!user_id || !user_type || !feedback_text || !target_user_id) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
  
    const query = `
      INSERT INTO feedback (user_id, user_type, feedback_text, target_user_id)
      VALUES (?, ?, ?, ?)
    `;
  
    db.query(query, [user_id, user_type, feedback_text, target_user_id], (err, result) => {
      if (err) {
        console.error("Error inserting feedback:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
  
      return res.status(200).json({ success: true, message: "Feedback submitted successfully" });
    });
  });

  // Get all feedback (for admin)
 // Get all feedback (for admin)
// Get all feedback (for admin)
router.get("/all", (req, res) => {
  const sql = `
  SELECT 
    f.id, 
    f.user_id, 
    f.user_type, 
    f.feedback_text, 
    f.created_at,
    f.target_user_id,
    CASE 
      WHEN f.user_type = 'retailer' THEN CONCAT(r.firstname, ' ', r.lastname)
      WHEN f.user_type = 'farmer' THEN CONCAT(fa.firstname, ' ', fa.lastname)
      ELSE 'Unknown User'
    END AS full_name,
    COALESCE(CONCAT(r2.firstname, ' ', r2.lastname), CONCAT(fa2.firstname, ' ', fa2.lastname), 'No Target User') AS target_user_name
  FROM feedback f
  LEFT JOIN retailer r ON f.user_id = r.id AND f.user_type = 'retailer'
  LEFT JOIN farmer fa ON f.user_id = fa.id AND f.user_type = 'farmer'
  LEFT JOIN retailer r2 ON f.target_user_id = r2.id
  LEFT JOIN farmer fa2 ON f.target_user_id = fa2.id
  ORDER BY f.created_at DESC;
`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching feedback:", err);
      return res.status(500).json({ success: false, message: "Server error!" });
    }
    res.json(results);
  });
});
 
// Delete feedback by ID
router.delete("/delete/:id", (req, res) => {
  const feedbackId = req.params.id;
  const sql = "DELETE FROM feedback WHERE id = ?";
  
  db.query(sql, [feedbackId], (err, result) => {
      if (err) {
          console.error("Error deleting feedback:", err);
          return res.status(500).json({ success: false, message: "Server error!" });
      }
      res.json({ success: true, message: "Feedback deleted successfully!" });
  });
});

  
  
  
module.exports = router;