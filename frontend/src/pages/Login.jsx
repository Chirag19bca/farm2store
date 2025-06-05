import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext"; // Import AuthContext
import classes from "../styles/Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); 

  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext); // Get user and login function from context

  useEffect(() => {
    if (user) {
      navigate("/profile"); // Redirect if already logged in
    }
  }, [user, navigate]);

  const validateInputs = () => {
    let isValid = true;
    let newErrors = {};

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }
    if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one capital letter";
      isValid = false;
    }
    if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number";
      isValid = false;
    }
    if (!/[@#$]/.test(password)) {
      newErrors.password = "Password must contain at least one special character (@, #, $)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      const res = await axios.post("http://localhost:8081/api/auth/login", { email, password });

      if (res.data.success) {
        const userData = res.data;
        login(userData); // Store user in context

        navigate("/profile"); // Redirect on success
      } else {
        setErrorMessage(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      setErrorMessage("Login failed. Please try again later.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className={classes.con}>
    <div className={classes.loginContainer}>
      <div className={classes.container}>
        <h2 className={classes.heading}>Sign In</h2>

        {errorMessage && <p className={classes.error}>{errorMessage}</p>}

        <form className={classes.form} onSubmit={handleSubmit}>
          <div className={classes.inputContainer}>
            <input
              className={classes.input}
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className={classes.error}>{errors.email}</p>}
          </div>

          <div className={classes.inputContainer}>
            <input
              className={classes.input}
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className={classes.eyeIcon}
            >
              {isPasswordVisible ? "👁" : "👁‍🗨"}
            </button>
            {errors.password && <p className={classes.error}>{errors.password}</p>}
          </div>

          <button className={classes.login_button} type="submit">
            Sign In
          </button>

          <p className={classes.register_link}>
            Don't have an account? <a href="/register">Create Account</a>
          </p>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;
