import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import classes from "./Admin.module.css";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas'; // Import html2canvas

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ManageReport = () => {
    const [reportData, setReportData] = useState({
        farmerSales: [],
        retailerSales: [],
        topProducts: [],
    });
    const [activeReport, setActiveReport] = useState("farmerSalesTable");
    const [selectedFarmerIdForTopProducts, setSelectedFarmerIdForTopProducts] = useState("");
    const [filteredTopProducts, setFilteredTopProducts] = useState([]);
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [reportTypeForDownload, setReportTypeForDownload] = useState("farmerSales"); // Default download type

    const chartRefFarmer = useRef(null);
    const chartRefRetailer = useRef(null);
    const chartRefTopProducts = useRef(null);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const response = await axios.get("http://localhost:8081/api/reports");
                console.log("API Response:", response.data);
                setReportData(response.data);
            } catch (error) {
                console.error("Error fetching report data:", error);
            }
        };

        fetchReportData();
    }, []);

    useEffect(() => {
        if (selectedFarmerIdForTopProducts) {
            const filtered = reportData.topProducts.filter(tp =>
                tp.farmers && tp.farmers.some(farmer => String(farmer.farmerId) === selectedFarmerIdForTopProducts)
            );
            setFilteredTopProducts(filtered);
        } else {
            setFilteredTopProducts(reportData.topProducts);
        }
    }, [selectedFarmerIdForTopProducts, reportData.topProducts]);

    useEffect(() => {
        if (activeReport.startsWith("farmerSales")) {
            setReportTypeForDownload("farmerSales");
        } else if (activeReport.startsWith("retailerPurchases")) {
            setReportTypeForDownload("retailerSales");
        } else if (activeReport.startsWith("topProducts")) {
            setReportTypeForDownload("topProducts");
        }
    }, [activeReport]);

    const prepareFarmerChartData = () => ({
        labels: reportData.farmerSales.map(fs => fs.name?.trim() || "N/A"),
        datasets: [
            {
                label: 'Total Sales (INR)',
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: reportData.farmerSales.map(fs => fs.sales || 0),
                barThickness: 60,
            },
        ],
    });

    const downloadFarmerSalesPDFWithChart = async () => {
        const doc = new jsPDF();
        doc.text("Farmer Sales Report", 10, 10);
        const tableHeaders = ["Farmer", "Total Sales (INR)", "Orders Completed"];
        const tableData = reportData.farmerSales.map(fs => [
            fs.name?.trim() || "N/A",
            `INR ${Number(fs.sales || 0).toFixed(2)}`,
            fs.ordersCompleted ?? 0,
        ]);
        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: 20,
            columnStyles: {
                0: { cellWidth: 'auto', halign: 'center' },
                1: { cellWidth: 'auto', halign: 'center' },
                2: { cellWidth: 'auto', halign: 'center' },
            },
            styles: { fontSize: 10 },
            headStyles: {
                fillColor: [22, 81, 145],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 11,
                halign: 'center', // Center align all headers
            },
        });

        if (chartRefFarmer.current) {
            try {
                const canvas = await html2canvas(chartRefFarmer.current, {
                    scale: 2, // Increase scale for higher resolution
                });
                const imgData = canvas.toDataURL('image/png');
                const tableHeight = doc.lastAutoTable.finalY || 20;
                doc.addImage(imgData, 'PNG', 10, tableHeight + 15, 150, 100);
                doc.save("farmer_sales_report.pdf");
            } catch (error) {
                console.error("Error converting chart to image:", error);
                alert("Error generating PDF with chart.");
            }
        } else {
            alert("Farmer Sales Chart not available for PDF generation.");
        }
    };

    const prepareRetailerChartData = () => ({
        labels: reportData.retailerSales.map(rs => rs.name?.trim() || "N/A"),
        datasets: [
            {
                label: 'Total Purchases (INR)',
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                data: reportData.retailerSales.map(rs => rs.purchases || 0),
                barThickness: 60,
            },
        ],
    });

    const downloadRetailerPurchasesPDFWithChart = async () => {
        const doc = new jsPDF();
        doc.text("Retailer Purchases Report", 10, 10);
        const tableHeaders = ["Retailer", "Total Purchases (INR)", "Orders Placed"];
        const tableData = reportData.retailerSales.map(rs => [
            rs.name?.trim() || "N/A",
            `INR ${Number(rs.purchases || 0).toFixed(2)}`,
            rs.ordersPlaced ?? 0,
        ]);
        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: 20,
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto', halign: 'center' },
                2: { cellWidth: 'auto', halign: 'center' },
            },
            styles: { fontSize: 10 },
            headStyles: {
                fillColor: [22, 81, 145],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 11,
                halign: 'center', // Center align all headers
            },
        });

        if (chartRefRetailer.current) {
            try {
                const canvas = await html2canvas(chartRefRetailer.current, {
                    scale: 2, // Increase scale for higher resolution
                });
                const imgData = canvas.toDataURL('image/png');
                const tableHeight = doc.lastAutoTable.finalY || 20;
                doc.addImage(imgData, 'PNG', 10, tableHeight + 15, 150, 100);
                doc.save("retailer_purchases_report.pdf");
            } catch (error) {
                console.error("Error converting chart to image:", error);
                alert("Error generating PDF with chart.");
            }
        } else {
            alert("Retailer Purchases Chart not available for PDF generation.");
        }
    };

    const prepareTopProductsChartData = () => ({
        labels: filteredTopProducts.map(tp => tp.productName?.trim() || "N/A"),
        datasets: [
            {
                label: 'Total Quantity Sold',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: filteredTopProducts.map(tp => tp.totalQuantity || 0),
                barThickness: 60,
            },
        ],
    });

    const downloadTopProductsPDFWithChart = async () => {
        const doc = new jsPDF();
        doc.text("Top Selling Products Report", 10, 10);
        const tableHeaders = ["Product Name", "Total Quantity Sold", "Total Revenue (INR)"];
        const tableData = filteredTopProducts.map(tp => [
            tp.productName?.trim() || "N/A",
            tp.totalQuantity ?? 0,
            `INR ${Number(tp.totalRevenue || 0).toFixed(2)}`,
        ]);
        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: 20,
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto', halign: 'center' },
                2: { cellWidth: 'auto', halign: 'left' },
            },
            styles: { fontSize: 10 },
            headStyles: {
                fillColor: [22, 81, 145],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 11,
                0: { halign: 'left' }, // Align Product Name left
                1: { halign: 'center' }, // Center align Total Quantity Sold
                2: { halign: 'left' }, // Right align Total Revenue (INR)
            },
        });

        if (chartRefTopProducts.current && filteredTopProducts.length > 0) {
            try {
                const canvas = await html2canvas(chartRefTopProducts.current, {
                    scale: 2, // Increase scale for higher resolution
                });
                const imgData = canvas.toDataURL('image/png');
                const tableHeight = doc.lastAutoTable.finalY || 20;
                doc.addImage(imgData, 'PNG', 10, tableHeight + 15, 150, 100);
                doc.save("top_selling_products_report.pdf");
            } catch (error) {
                console.error("Error converting chart to image:", error);
                alert("Error generating PDF with chart.");
            }
        } else {
            alert("Top Selling Products Chart not available or no products to display.");
        }
    };

    const handleFarmerSelectionForTopProducts = (event) => {
        setSelectedFarmerIdForTopProducts(event.target.value);
    };

    const handleDownloadReport = () => {
        setLoadingPDF(true);
        if (reportTypeForDownload === "farmerSales") {
            downloadFarmerSalesPDFWithChart().finally(() => setLoadingPDF(false));
        } else if (reportTypeForDownload === "retailerSales") {
            downloadRetailerPurchasesPDFWithChart().finally(() => setLoadingPDF(false));
        } else if (reportTypeForDownload === "topProducts") {
            downloadTopProductsPDFWithChart().finally(() => setLoadingPDF(false));
        } else {
            setLoadingPDF(false);
            alert("No report type selected for download.");
        }
    };

    return (
        <div className={classes.mainContent}>
            <h2 className={classes.title}>Manage Reports</h2>

            <div className={classes.reportNav}>
                <button
                    className={activeReport === "farmerSalesTable" ? classes.active : ""}
                    onClick={() => setActiveReport("farmerSalesTable")}
                >
                    Farmer Sales (Table)
                </button>
                <button
                    className={activeReport === "farmerSalesChart" ? classes.active : ""}
                    onClick={() => setActiveReport("farmerSalesChart")}
                >
                    Farmer Sales (Chart)
                </button>
                <button
                    className={
                        activeReport === "retailerPurchasesTable" ? classes.active : ""
                    }
                    onClick={() => setActiveReport("retailerPurchasesTable")}
                >
                    Retailer Purchases (Table)
                </button>
                <button
                    className={
                        activeReport === "retailerPurchasesChart" ? classes.active : ""
                    }
                    onClick={() => setActiveReport("retailerPurchasesChart")}
                >
                    Retailer Purchases (Chart)
                </button>
                <button
                    className={activeReport === "topProductsTable" ? classes.active : ""}
                    onClick={() => setActiveReport("topProductsTable")}
                >
                    Top Selling Products
                </button>
                <button
                    className={activeReport === "topProductsChart" ? classes.active : ""}
                    onClick={() => setActiveReport("topProductsChart")}
                >
                    Top Selling Products (Chart)
                </button>
            </div>

            {activeReport === "farmerSalesTable" && (
                <div className={classes.tableContainer}>
                    <h3 className={classes.tableTitle}>Farmer Sales</h3>
                    {reportData.farmerSales.length > 0 ? (
                        <table className={classes.reportTable}>
                            <thead>
                                <tr>
                                    <th>Farmer</th>
                                    <th>Total Sales (INR)</th>
                                    <th>Orders Completed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.farmerSales.map((fs, index) => (
                                    <tr key={index}>
                                        <td>{fs.name?.trim() || "N/A"}</td>
                                        <td>INR {Number(fs.sales || 0).toFixed(2)}</td>
                                        <td>{fs.ordersCompleted ?? 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No farmer sales data available.</p>
                    )}
                </div>
            )}

            {activeReport === "farmerSalesChart" && reportData.farmerSales.length > 0 && (
                <div className={classes.chartContainer} id="farmerSalesChartContainer">
                    <h3 className={classes.chartTitle}>Farmer Sales</h3>
                    <div style={{ height: '400px', width: '90%', maxWidth: '800px', margin: '0 auto' }} ref={chartRefFarmer}>
                        <Bar data={prepareFarmerChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            )}

            {activeReport === "retailerPurchasesTable" && (
                <div className={classes.tableContainer}>
                    <h3 className={classes.tableTitle}>Retailer Purchases</h3>
                    {reportData.retailerSales.length > 0 ? (
                        <table className={classes.reportTable}>
                            <thead>
                                <tr>
                                    <th>Retailer</th>
                                    <th>Total Purchases (INR)</th>
                                    <th>Orders Placed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.retailerSales.map((rs, index) => (
                                    <tr key={index}>
                                        <td>{rs.name?.trim() || "N/A"}</td>
                                        <td>INR {Number(rs.purchases || 0).toFixed(2)}</td>
                                        <td>{rs.ordersPlaced ?? 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No retailer purchase data available.</p>
                    )}
                </div>
            )}

            {activeReport === "retailerPurchasesChart" && reportData.retailerSales.length > 0 && (
                <div className={classes.chartContainer} id="retailerPurchasesChartContainer">
                    <h3 className={classes.chartTitle}>Retailer Purchases</h3>
                    <div style={{ height: '400px', width: '90%', maxWidth: '800px', margin: '0 auto' }} ref={chartRefRetailer}>
                        <Bar data={prepareRetailerChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            )}

            {activeReport === "topProductsTable" && (
                <div className={classes.tableContainer}>
                    <h3 className={classes.tableTitle}>Top Selling Products</h3>
                    <div className={classes.filterDropdown}>
                        <label htmlFor="farmerFilter">Filter by Farmer:</label>
                        <select
                            id="farmerFilter"
                            value={selectedFarmerIdForTopProducts}
                            onChange={handleFarmerSelectionForTopProducts}
                        >
                            <option value="">All Farmers</option>
                            {reportData.farmerSales.map(farmer => (
                                <option key={farmer.farmerId} value={farmer.farmerId}>
                                    {farmer.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {filteredTopProducts.length > 0 ? (
                        <table className={classes.reportTable}>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Total Quantity Sold</th>
                                    <th>Total Revenue (INR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTopProducts.map((tp) => (
                                    <tr key={tp.productId}>
                                        <td>{tp.productName?.trim() || "N/A"}</td>
                                        <td>{tp.totalQuantity ?? 0}</td>
                                        <td>INR {Number(tp.totalRevenue || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No top selling products found for the selected farmer.</p>
                    )}
                </div>
            )}

            {activeReport === "topProductsChart" && (
                <div className={classes.chartContainer} id="topProductsChartContainer">
                    <h3>Top Selling Products</h3>
                    <div className={classes.filterDropdown}>
                        <label htmlFor="farmerFilterChart">Filter by Farmer:</label>
                        <select
                            id="farmerFilterChart"
                            value={selectedFarmerIdForTopProducts}
                            onChange={handleFarmerSelectionForTopProducts}
                        >
                            <option value="">All Farmers</option>
                            {reportData.farmerSales.map(farmer => (
                                <option key={farmer.farmerId} value={farmer.farmerId}>
                                    {farmer.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {filteredTopProducts.length > 0 ? (
                        <div style={{ height: '400px', width: '70%', maxWidth: '900px', margin: '0 auto' }} ref={chartRefTopProducts}>
                            <Bar data={prepareTopProductsChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    ) : (
                        <p>No top selling products found for the selected farmer to display in the chart.</p>
                    )}
                </div>
            )}

            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                    onClick={handleDownloadReport}
                    disabled={loadingPDF}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                        transition: "background-color 0.3s ease",
                        ...(loadingPDF ? { opacity: 0.7, cursor: "not-allowed" } : {}), // Conditional styling
                    }}
                >
                    {loadingPDF ? "Generating PDF..." : "Download Report"}
                </button>
            </div>
        </div>
    );
};

export default ManageReport;

