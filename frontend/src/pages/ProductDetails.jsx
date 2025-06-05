import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import classes from "../styles/ProductDetails.module.css";

const ProductDetails = () => {
    const { productId } = useParams();
    const { user } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        axios.get(`http://localhost:8081/api/products/${productId}`)
            .then(response => setProduct(response.data))
            .catch(error => console.error("Error fetching product details:", error));
    }, [productId]);

    //   Dynamically assign units based on category
    const getUnit = (category, name) => {
        const lowerCategory = category.toLowerCase();
        const lowerName = name.toLowerCase();
    
        // Handle product-specific unit first
        if ( lowerName.includes("mango") || lowerName.includes("banana")) {
            return "piece";
        }
    
        // Then handle category-based unit
        if (lowerCategory.includes("fruit") || lowerCategory.includes("vegetable") || lowerCategory.includes("grain")) {
            return "kg";
        }
       
        return ""; // Default if no specific unit is matched
    };
    
    const handleQuantityChange = (e) => {
        const selectedQty = parseInt(e.target.value, 10);
        if (selectedQty > product.quantity) {
            alert(`Only ${product.quantity} in stock!`);
            setQuantity(product.quantity);
        } else {
            setQuantity(selectedQty);
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            alert("Please log in to access this feature.");
            return;
        }
    
        if (user.role !== "retailer") {
            alert("Only retailers can add products to the cart!");
            return;
        }
    
        if (product.quantity === 0) {
            alert("Out of stock!");
            return;
        }
    
        const cartKey = `cart_${user.id}`;
        const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
        const existingItem = existingCart.find(
            (item) => item.id === product.id && item.farmer_id === product.farmer_id
        );
    
        let updatedCart;
        if (existingItem) {
            existingItem.quantity += quantity;
            updatedCart = [...existingCart];
        } else {
            updatedCart = [...existingCart, { ...product, quantity }];
        }
    
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        alert(`${quantity} x ${product.name} added to cart!`);
    };
    
    if (!product) return <p className={classes.loading}>Loading...</p>;

    const unit = getUnit(product.category,product.name);

    return (
        <div className={classes.coc}>
            <div className={classes.productDetails}>
            <div className={classes.productImage}>
                <img src={product.image || "/images/default.png"} alt={product.name} />
            </div>
            <div className={classes.productInfo}>
                <h2>{product.name}</h2>
                <p className={classes.price}>
                    <strong>Price:</strong> ₹{product.price} per {unit}
                </p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Seller:</strong> {product.seller}</p>
                <p><strong>Seller Address:</strong> {product.address}</p>
                <p><strong>Description:</strong> {product.description}</p>
                <p><strong>Stock Available:</strong> {product.quantity} {unit}</p>

                {product.quantity > 0 ? (
    <>
        <div className={classes.quantitySelector}>
            <label><strong>Quantity:</strong> </label>
            <input
                type="number"
                value={quantity}
                min="1"
                max={product.quantity}
                onChange={handleQuantityChange}
                className={classes.quantityInput}
            />
            <span> {unit}</span>
        </div>

        <p className={classes.totalPrice}>
            <strong>Total Price:</strong> ₹{product.price * quantity}
        </p>

        <button 
            className={classes.addToCart} 
            onClick={handleAddToCart}
        >
            Add to Cart 🛒
        </button>
    </>
) : (
    <p style={{color:'red',fontSize:'35px',textAlign:"center",paddingRight:"100px"}}> Out of Stock</p>
)}

            </div>
        </div>
        </div>
        
    );
};

export default ProductDetails;