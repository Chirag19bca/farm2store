import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "../styles/SearchResult.module.css";

function SearchResult() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`); //   Fixed route path
  };
  useEffect(() => {
    if (query) {
      axios
        .get(`http://localhost:8081/api/products/search`, { params: { query } }) //   Single query for both
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => console.error("Error fetching search results:", err));
    }
  }, [query]);

  return (
    <div className={classes.con}>
      <div className={classes.search_result_page}>
        <h2>Search Results for "{query}"</h2>
        {products.length > 0 ? (
          <div className={classes.coc}>
            <div className={classes.product_grid}>
              {products.map((product) => (
                <div key={product.id} className={classes.product_card}>
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>Price: ₹{product.price}</p>
                  <p>Category: {product.category_name}</p>
                  <p>Farmer: {product.farmer_name}</p> {/*   Show farmer name */}
                  <button
                    className={classes.add_to_cart}
                    onClick={() => handleViewProduct(product.id)}
                  >
                    View Details {/*   Updated button text */}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className={classes.no_results}>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResult;