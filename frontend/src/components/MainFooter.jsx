import React from "react";
import classes from "../styles/MainFooter.module.css"; // Import CSS Module
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const MainFooter = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footer_container}>
        <div className={classes.footer_section}>
          <h2>Farm2Store</h2>
          <p>Your trusted online marketplace for farm-fresh products.</p>
        </div>

        <div className={classes.footer_section}>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/feedback">FeedBack</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/products">Products</a></li>
          </ul>
        </div>

        <div className={classes.footer_section}>
          <h3>Follow Us</h3>
          <div className={classes.social_icons}>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
          <p>Contact: <a className={classes.hrf} href="mailto:support@farm2store.com">support@farm2store.com</a></p>
        </div>
      </div>

      <div className={classes.footer_bottom}>
        <p>© 2025 Farm2Store. All Rights Reserved.</p>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/9537412455" // Replace with your WhatsApp number
        className={classes.whatsapp_button}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp /> Chat with Us
      </a>
    </footer>
  );
};

export default MainFooter;