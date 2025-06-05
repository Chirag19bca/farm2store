import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "../styles/MainHeader.module.css";
import { ShoppingCart, Search } from "lucide-react";
import AuthContext from "../context/AuthContext";

function MainHeader() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); 

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/searchresult?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); 
    }
  };

  return (
    <header className={classes.header}>
      <div className={classes.logo_menu}>
        <div className={classes.logo}>
          <Link to="/">
            <span style={{ color: "lime" }}>Farm</span>
            <span style={{ color: "red" }}>2</span>
            <span style={{ color: "black" }}>Store</span>
          </Link>
        </div>
      </div>

      {/*   Search Bar with Fixed State Handling */}
      <form className={classes.search_form} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products or farmers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={classes.search_input}
        />
        <button type="submit" className={classes.search_btn}>
          <Search size={18} />
        </button>
      </form>

      <div className={classes.nav_button_container}>
        <nav className={classes.nav_links}>
          <Link to="/">Home</Link>
          {user?.role === "retailer" && <Link to="/orders">Orders</Link>}
          <Link to="/contact">Contact</Link>
          <Link to="/products">Products</Link>
          <Link to="/profile">Profile</Link>
        </nav>

        {!user ? (
          <Link to="/login" className={classes.login_btn}>
            Login
          </Link>
        ) : (
          <>
            <button className={classes.logout_btn} onClick={handleLogout}>
              Logout
            </button>
            {user?.role === "retailer" && (
              <Link to="/cart" className={classes.cart_btn}>
                <ShoppingCart size={20} /> Cart
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default MainHeader;
