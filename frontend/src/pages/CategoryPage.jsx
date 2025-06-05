import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classes from "../styles/CategoryPage.module.css";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/products?category=${category}`)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, [category]);

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`); //   Fixed route path
  };
  return (
    <div className={classes.con}>
      <div className={classes.categoryContainer}>
        <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          <div className={classes.productGrid}>
            {products.map((product) => (
              <div key={product.id} className={classes.productCard}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={classes.productImage}
                />
                <h3>{product.name}</h3>
                <p className={classes.price}>₹{product.unitprice}</p>
                <button
                  className={classes.viewDetails}
                  onClick={() => handleViewProduct(product.id)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
