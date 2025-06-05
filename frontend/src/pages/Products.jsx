import React, { useEffect, useState } from "react";
import classes from "../styles/Products.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/products")
      .then((response) => {
        console.log("Fetched Products:", response.data); // Debugging
        setProducts(response.data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const categories = ["Fruits", "Vegetables", "Grains"];
  const categorizedProducts = categories.map((category) => ({
    name: category,
    className: classes[`${category.toLowerCase()}_category`],
    products: products.filter((product) => product.category_name === category),
  }));
  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`); //   Fixed route path
  };
  return (
    <div className={classes.con}>
    <div className={classes.container}>
      {categorizedProducts.map((category) => (
        <div key={category.name} className={classes.category_section}>
          <div className={classes.category_title}>
            <h2 className={category.className}>{category.name}</h2>
            <button
              onClick={() =>
                navigate(`/category/${category.name.toLowerCase()}`)
              }
              className={classes.show_more}
            >
              Show More →
            </button>
          </div>
          <div className={classes.product_grid}>
            {category.products.slice(0, 5).map((product) => (
              <div key={product.id} className={classes.product_card}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={classes.product_image}
                />
                <p className={classes.product_name}>{product.name}</p>
                <p className={classes.product_price}>₹{product.unitprice}</p>
                <button
                  className={classes.add_to_cart}
                  onClick={() => handleViewProduct(product.id)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default ProductPage;
