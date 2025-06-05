import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "../styles/Register.module.css";

const Register = () => {
  const [userType, setUserType] = useState("farmer");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Corrected state name
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    shop_name: "",
    shop_address: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  /** Handle Input Change */
  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  /** Validate Inputs Before Submission */
  const validateInputs = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.firstname.trim())
      newErrors.firstname = "First name is required";
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";

    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (
      formData.password.length < 8 ||
      !/[A-Z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[@#$]/.test(formData.password)
    ) {
      newErrors.password =
        "Password must be at least 8 characters long, contain one capital letter, one number, and one special character (@, #, $)";
      isValid = false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    if (userType === "farmer" && !formData.address.trim())
      newErrors.address = "Address is required";

    if (userType === "retailer") {
      if (!formData.shop_name.trim())
        newErrors.shop_name = "Shop name is required";
      if (!formData.shop_address.trim())
        newErrors.shop_address = "Shop address is required";
    }

    setErrors(newErrors);
    return isValid;
  };

  /** Handle Form Submission */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const endpoint =
      userType === "farmer"
        ? "/api/auth/register/farmer"
        : "/api/auth/register/retailer";

    try {
      const res = await axios.post(
        `http://localhost:8081${endpoint}`,
        formData
      );
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className={classes.con}>
    <div className={classes.registerContainer}>
      <h2 className={classes.heading}>Create Account</h2>

      {/* User Type Selection Tabs */}
      <div className={classes.tabs}>
        <button
          onClick={() => setUserType("farmer")}
          className={userType === "farmer" ? classes.active : ""}
        >
          Farmer
        </button>
        &nbsp; &nbsp;
        <button
          onClick={() => setUserType("retailer")}
          className={userType === "retailer" ? classes.active : ""}
        >
          Retailer
        </button>
      </div>

      <form onSubmit={handleSubmit} className={classes.inputContainer}>
        {/* First Name */}
        <label
          htmlFor="firstname"
          className={`${classes.label} ${
            userType === "farmer" ? classes.farmerLabel : classes.retailerLabel
          }`}
        >
          First Name <span className={classes.required}>*</span>
        </label>

        <input
          id="firstname"
          type="text"
          name="firstname"
          onChange={handleChange}
          className={classes.input}
          required
        />
        {errors.firstname && (
          <p className={classes.error_message}>{errors.firstname}</p>
        )}

        {/* Last Name */}
        <label
          htmlFor="lastname"
          className={`${classes.label} ${
            userType === "farmer" ? classes.farmerLabel : classes.retailerLabel
          }`}
        >
          Last Name <span className={classes.required}>*</span>
        </label>
        <input
          id="lastname"
          type="text"
          name="lastname"
          onChange={handleChange}
          className={classes.input}
          required
        />
        {errors.lastname && (
          <p className={classes.error_message}>{errors.lastname}</p>
        )}

        {/* Email */}
        <label
          htmlFor="email"
          className={`${classes.label} ${
            userType === "farmer" ? classes.farmerLabel : classes.retailerLabel
          }`}
        >
          E-mail <span className={classes.required}>*</span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          onChange={handleChange}
          className={classes.input}
          required
        />
        {errors.email && (
          <p className={classes.error_message}>{errors.email}</p>
        )}

        {/* Password */}
        <label
          htmlFor="password"
          className={`${classes.label} ${
            userType === "farmer" ? classes.farmerLabel : classes.retailerLabel
          }`}
        >
          Password <span className={classes.required}>*</span>
        </label>
        <div className={classes.passwordContainer}>
          <input
            type={isPasswordVisible ? "text" : "password"} // Fixed variable name
            name="password" // Added name to update state
            value={formData.password} // Bind input with state
            onChange={handleChange} // Handle input changes
            className={classes.input}
            placeholder="Enter password"
            required
          />
          <button
            type="button"
            className={classes.eyeIcon}
            onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Fixed function name
          >
            {isPasswordVisible ? "👁️‍🗨️" : "👁️‍🗨️"}
          </button>
        </div>
        {errors.password && (
          <p className={classes.error_message}>{errors.password}</p>
        )}

        {/* Phone Number */}
        <label
          htmlFor="phone"
          className={`${classes.label} ${
            userType === "farmer" ? classes.farmerLabel : classes.retailerLabel
          }`}
        >
          Phone <span className={classes.required}>*</span>
        </label>
        <input
          id="phone"
          type="text"
          name="phone"
          onChange={handleChange}
          className={classes.input}
          required
        />
        {errors.phone && (
          <p className={classes.error_message}>{errors.phone}</p>
        )}

        {/* Farmer Specific Fields */}
        {userType === "farmer" && (
          <>
            <label
              htmlFor="address"
              className={`${classes.label} ${
                userType === "farmer"
                  ? classes.farmerLabel
                  : classes.retailerLabel
              }`}
            >
              Address <span className={classes.required}>*</span>
            </label>
            <input
              id="address"
              type="text"
              name="address"
              onChange={handleChange}
              className={classes.input}
              required
            />
            {errors.address && (
              <p className={classes.error_message}>{errors.address}</p>
            )}
          </>
        )}

        {/* Retailer Specific Fields */}
        {userType === "retailer" && (
          <>
            <label
              htmlFor="shop_name"
              className={`${classes.label} ${
                userType === "farmer"
                  ? classes.farmerLabel
                  : classes.retailerLabel
              }`}
            >
              Shop Name <span className={classes.required}>*</span>
            </label>
            <input
              id="shop_name"
              type="text"
              name="shop_name"
              onChange={handleChange}
              className={classes.input}
              required
            />
            {errors.shop_name && (
              <p className={classes.error_message}>{errors.shop_name}</p>
            )}

            <label
              htmlFor="shop_address"
              className={`${classes.label} ${
                userType === "farmer"
                  ? classes.farmerLabel
                  : classes.retailerLabel
              }`}
            >
              Shop Address <span className={classes.required}>*</span>
            </label>
            <input
              id="shop_address"
              type="text"
              name="shop_address"
              onChange={handleChange}
              className={classes.input}
              required
            />
            {errors.shop_address && (
              <p className={classes.error_message}>{errors.shop_address}</p>
            )}
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={classes.register_button}
        >
          Sign Up
        </button>
        <p className={classes.login_link}>
          Already have an account? <a href="/login">login</a>
        </p>
      </form>
    </div>
    </div>
  );
};

export default Register;
