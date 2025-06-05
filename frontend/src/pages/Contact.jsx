import React, { useState, useContext, useEffect } from 'react';
import classes from '../styles/Contact.module.css';
import axios from 'axios';
import AuthContext from '../context/AuthContext'; // adjust the path if needed

const ContactUs = () => {
  const { user } = useContext(AuthContext); // get the logged-in user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);

  // Autofill email if user is logged in
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/email', formData);
      setSubmissionStatus({ success: true, message: response.data.message });
      setFormData({ name: '', email: user?.email || '', message: '' }); // keep email filled
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error);
      setSubmissionStatus({ success: false, message: error.response?.data?.message || 'Failed to send message.' });
    }
  };

  return (
    <div className={classes.con}>
      <div className={classes.contactContainer}>
        <h2>Contact Us</h2>
        {submissionStatus && (
          <div className={submissionStatus.success ? classes.successMessage : classes.errorMessage}>
            {submissionStatus.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className={classes.contactForm}>
          <div className={classes.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={classes.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              readOnly={!!user?.email} // make it read-only if auto-filled
            />
          </div>
          <div className={classes.formGroup}>
            <label>Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={classes.submitButton}>Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
