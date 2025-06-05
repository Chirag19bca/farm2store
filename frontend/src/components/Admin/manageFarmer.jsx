import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./Admin.module.css";

function ManageFarmer() {
    const [farmers, setFarmers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchFarmers();
    }, [search]);

    const fetchFarmers = () => {
        axios.get(`http://localhost:8081/api/admin/farmer?search=${search}`)
            .then((response) => {
                console.log("API Response:", response.data);
                setFarmers(response.data.data || []);
            })
            .catch((error) => {
                console.error("Error fetching farmers:", error);
                setFarmers([]);
            });
    };

    const deleteFarmer = (id) => {
        axios.delete(`http://localhost:8081/api/admin/farmer/${id}`)
            .then(() => {
                setFarmers((prevFarmers) => prevFarmers.filter(farmer => farmer.id !== id));
            })
            .catch((error) => {
                console.error("Error deleting farmer:", error);
            });
    };

    return (
        <div className={classes.tableContainer}>
            <h2>Manage Farmers</h2>
            <input
                type="text"
                placeholder="Search by Firstname, Lastname, or Phone"
                className={classes.searchBox}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <table border={1}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Password</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        {/* <th>Delete</th> */}
                    </tr>
                </thead>
                <tbody>
                    {farmers.length > 0 ? (
                        farmers.map((farmer) => (
                            <tr key={farmer.id}>
                                <td>{farmer.id}</td>
                                <td>{farmer.firstname}</td>
                                <td>{farmer.lastname}</td>
                                <td>{farmer.password}</td>
                                <td>{farmer.email}</td>
                                <td>{farmer.phone}</td>
                                <td>{farmer.address}</td>
                                {/* <td>
                                    <button onClick={() => deleteFarmer(farmer.id)} className={classes.deleteButton}>
                                        Delete
                                    </button>
                                </td> */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No farmers found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ManageFarmer;
