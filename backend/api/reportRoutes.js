const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  console.log("Fetching report data...");

  db.query(
    `SELECT
      SUM(total_price) AS totalSales,
      AVG(total_price) AS avgIncome,
      COUNT(id) AS totalOrders
    FROM ordersr`,
    (err, summary) => {
      if (err) {
        console.error("Error fetching summary:", err);
        return res.status(500).json({ error: "Server error" });
      }

      db.query(
        `SELECT
  f.id AS farmerId,
  CONCAT(f.firstname, ' ', f.lastname) AS name,
  SUM(o.total_price) AS sales,
  COUNT(o.id) AS ordersCompleted,
  MAX(o.created_at) AS lastSaleDate
FROM ordersr o
JOIN farmer f ON o.farmer_id = f.id
WHERE o.farmer_status = 'Delivered'
GROUP BY f.id, f.firstname, f.lastname
ORDER BY lastSaleDate DESC;
`,
        (err, farmerSales) => {
          if (err) {
            console.error("Error fetching farmer sales:", err);
            return res.status(500).json({ error: "Server error" });
          }

          const formattedFarmerSales = farmerSales.map(f => ({
            farmerId: f.farmerId,
            name: f.name,
            sales: f.sales || 0,
            ordersCompleted: f.ordersCompleted || 0,
            saleDate: f.saleDate ? new Date(f.saleDate).toISOString() : null,
          }));

          db.query(
            `SELECT
  r.id AS retailerId,
  CONCAT(r.firstname, ' ', r.lastname) AS name,
  SUM(o.total_price) AS purchases,
  COUNT(o.id) AS ordersPlaced,
  MAX(o.created_at) AS lastPurchaseDate
FROM ordersr o
JOIN retailer r ON o.retailer_id = r.id
WHERE o.retailer_status = 'Completed'
GROUP BY r.id, r.firstname, r.lastname
ORDER BY lastPurchaseDate DESC;
`,
            (err, retailerSales) => {
              if (err) {
                console.error("Error fetching retailer sales:", err);
                return res.status(500).json({ error: "Server error" });
              }

              const formattedRetailerSales = retailerSales.map(r => ({
                retailerId: r.retailerId,
                name: r.name,
                purchases: r.purchases || 0,
                ordersPlaced: r.ordersPlaced || 0,
                purchaseDate: r.purchaseDate ? new Date(r.purchaseDate).toISOString() : null,
              }));

              db.query(
                `SELECT
                  p.id AS productId,
                  p.name AS productName,
                  SUM(o.quantity) AS totalQuantity,
                  SUM(o.total_price) AS totalRevenue,
                  GROUP_CONCAT(DISTINCT f.id) AS farmerIds
                FROM ordersr o
                JOIN product p ON o.product_id = p.id
                JOIN farmer f ON o.farmer_id = f.id
                GROUP BY o.product_id
                ORDER BY totalQuantity DESC
                LIMIT 5;`,
                (err, topProductsResult) => {
                  if (err) {
                    console.error("Error fetching top selling products:", err);
                    return res.status(500).json({ error: "Server error" });
                  }

                  const topProducts = topProductsResult.map(tp => ({
                    productId: tp.productId,
                    productName: tp.productName,
                    totalQuantity: tp.totalQuantity || 0,
                    totalRevenue: tp.totalRevenue || 0,
                    farmers: tp.farmerIds ? tp.farmerIds.split(',').map(id => ({ farmerId: parseInt(id) })) : [],
                  }));

                  res.json({
                    totalSales: summary[0]?.totalSales || 0,
                    avgIncome: summary[0]?.avgIncome || 0,
                    totalOrders: summary[0]?.totalOrders || 0,
                    farmerSales: formattedFarmerSales,
                    retailerSales: formattedRetailerSales,
                    topProducts: topProducts,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

module.exports = router;
