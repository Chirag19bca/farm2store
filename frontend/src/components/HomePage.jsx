import React, { useEffect, useState } from "react";
import classes from "../styles/HomePage.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    axios
      .get("http://localhost:8081/api/products") // Adjust API endpoint if needed
      .then((response) => {
        setProducts(response.data.slice(0, 15)); // Show only the first 8 products
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`); //   Fixed route path
  };

  return (
    <div className={classes.container}>
      <section className={classes.goods_section}>
        {/* Goods Header - Flexbox for alignment */}
        <div className={classes.goods_header}>
          <h2 className={classes.goods_title}>🌿 Farm Products</h2>
          <button
            className={classes.view_all}
            onClick={() => navigate("/products")}
          >
            Show All →
          </button>
        </div>

        {/* Products Grid */}
        <div className={classes.goods_container}>
          {products.map((product) => (
            <div key={product.id} className={classes.goods_item}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className={classes.price}>₹{product.unitprice}</p>{" "}
              {/*   Fixed price field */}
              <button
                className={classes.add_to_cart}
                onClick={() => handleViewProduct(product.id)}
              >
                View Details {/*   Updated button text */}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
