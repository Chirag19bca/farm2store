import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./Admin.module.css"; 

function ManageRetailer() {
    const [retailers, setRetailers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8081/api/admin/retailer")
            .then((response) => {
                console.log("API Response:", response.data);
                if (Array.isArray(response.data.data)) {
                    setRetailers(response.data.data);
                } else {
                    setRetailers([]);
                }
            })
            .catch((error) => {
                console.log(error);
                setRetailers([]);
            });
    }, []);

    const deleteRetailer = (id) => {
        axios.delete(`http://localhost:8081/api/admin/retailer/${id}`)
            .then(() => {
                setRetailers(retailers.filter(retailer => retailer.id !== id));
            })
            .catch((error) => {
                console.log("Error deleting retailer:", error);
            });
    };

    // Search by firstname, lastname, or phone only
    const filteredRetailers = retailers.filter(retailer =>
        retailer.firstname.toLowerCase().includes(search.toLowerCase()) ||
        retailer.lastname.toLowerCase().includes(search.toLowerCase()) ||
        String(retailer.phone).toLowerCase().includes(search.toLowerCase()) // Convert phone to string
    );
    

    return (
        <div className={classes.container}>
            <h2 className={classes.title}>Manage Retailers</h2>

            {/* Search Box */}
            <div className={classes.searchContainer}>
                <input
                    type="text"
                    placeholder="Search by Firstname, Lastname, or Phone"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={classes.searchBox}
                />
            </div>

            <div className={classes.tableContainer}>
                <table border={1}>
                    <thead>
                        <tr>
                            <th>ID</th>  
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Password</th>  
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Shop Name</th>
                            <th>Shop Address</th>
                            {/* <th>Delete</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRetailers.map((retailer) => (
                            <tr key={retailer.id}>
                                <td>{retailer.id}</td>
                                <td>{retailer.firstname}</td>
                                <td>{retailer.lastname}</td>
                                <td>{retailer.password}</td>
                                <td>{retailer.email}</td>
                                <td>{retailer.phone}</td>
                                <td>{retailer.shop_name}</td>
                                <td>{retailer.shop_address}</td>
                                {/* <td>
                                    <button onClick={() => deleteRetailer(retailer.id)} className={classes.delete}>
                                        Delete
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageRetailer;
