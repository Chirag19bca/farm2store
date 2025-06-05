import { useState } from "react";
import classes from "./Admin.module.css";
import ManageFarmer from "./manageFarmer";
import ManageRetailer from "./ManageRetailer";
import ManageReport from "./manageReport";
import ManageFeedback from "./manageFeedback";

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("ManageFarmer");

    const renderTabContent = () => {
        switch (activeTab) {
            case "ManageFarmer":
                return <ManageFarmer />;
            case "ManageRetailer":
                return <ManageRetailer />;
            case "ManageReport":
                return <ManageReport />;
            case "ManageFeedback":
                return <ManageFeedback />;
            default:
                return <ManageFarmer />;
        }
    };

    return (
        <div className={classes.con}>
        <div className={classes.dashboardContainer}>
            {/* Sidebar Navigation */}
            <aside className={classes.sidebar}>
                <h1 className={classes.sidebarTitle}>Admin Panel</h1>
                <ul className={classes.sidebarMenu}>
                    <li 
                        className={`${classes.sidebarItem} ${activeTab === "ManageFarmer" ? classes.active : ""}`}
                        onClick={() => setActiveTab("ManageFarmer")}
                    >Manage Farmer</li>
                    <li 
                        className={`${classes.sidebarItem} ${activeTab === "ManageRetailer" ? classes.active : ""}`}
                        onClick={() => setActiveTab("ManageRetailer")}
                    >Manage Retailer</li>
                    <li 
                        className={`${classes.sidebarItem} ${activeTab === "ManageReport" ? classes.active : ""}`}
                        onClick={() => setActiveTab("ManageReport")}
                    >Manage Report</li>
                    <li 
                        className={`${classes.sidebarItem} ${activeTab === "ManageFeedback" ? classes.active : ""}`}
                        onClick={() => setActiveTab("ManageFeedback")}
                    >Manage Feedback</li>
                </ul>
            </aside>

            {/* Main Content Area */}
            <main className={classes.mainContent}>
                {renderTabContent()}
            </main>
        </div>
        </div>
    );
}

export default AdminDashboard;
