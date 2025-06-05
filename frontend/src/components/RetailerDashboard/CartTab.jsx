import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import classes from "./CartTab.module.css";

const CartTab = () => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "retailer") return;

    const cartKey = `cart_${user.id}`;
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    console.log(`🔍 Loading cart for user: ${user.id}`, storedCart); // Debug log
    setCartItems(storedCart);
  }, [user]);

  const updateCartStorage = (newCart) => {
    if (!user || user.role !== "retailer") return;

    const cartKey = `cart_${user.id}`;
    localStorage.setItem(cartKey, JSON.stringify(newCart));

    console.log(`💾 Updated cart for user: ${user.id}`, newCart);
  };

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      const updatedCart = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedCart);
      updateCartStorage(updatedCart);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return alert("Your cart is empty!");
    if (!user || user.role !== "retailer") return alert("Retailer not logged in!");

    try {
      const orders = cartItems.map(item => ({
        retailer_id: user.id,
        farmer_id: item.farmer_id,
        product_id: item.id, // Changed from product_id to id
        quantity: parseInt(item.quantity) || 0,
        price: parseFloat(item.price) || 0,
        total_price: (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0),
        farmer_status: "Pending",
        retailer_status: "Pending"
      }));

      console.log("🚀 Sending order:", orders);

      const response = await axios.post("http://localhost:8081/api/orders/place", { orders });

      if (response.data.success) {
        alert("Order placed successfully!");
        setCartItems([]);
        localStorage.removeItem(`cart_${user.id}`); // Clear only this retailer's cart
        navigate("/retailer-dashboard");
      } else {
        alert(response.data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error(" Error placing order:", error);
      alert(error.response?.data?.message || "Error placing order. Please try again.");
    }
  };

  return (
    <div className={classes.con}>
      <div className={classes.cartPage}>
        <h2>Shopping Cart 🛒</h2>

        {cartItems.length === 0 ? (
          <p className={classes.emptyCart}>
            Your cart is empty. <Link to="/products">Go Shopping!</Link>
          </p>
        ) : (
          <table className={classes.cartTable}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price per Unit</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id || `${item.name}-${Math.random()}`}>
                  <td>
                    <img
                      src={item.image || "https://via.placeholder.com/70"}
                      alt={item.name}
                      className={classes.cartImage}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>₹{parseFloat(item.price).toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className={classes.removeBtn}
                      onClick={() => handleRemove(item.id)}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {cartItems.length > 0 && (
          <div className={classes.totalPrice}>
            <h3>Total: ₹{calculateTotal().toFixed(2)}</h3>
            <button className={classes.checkoutBtn} onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTab;
