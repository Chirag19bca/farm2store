import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import classes from "../styles/FeedbackForm.module.css";

const FeedbackForm = () => {
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [targetUsers, setTargetUsers] = useState([]);
  const [selectedTargetId, setSelectedTargetId] = useState("");

  useEffect(() => {
    const fetchTargetUsers = async () => {
      try {
        const endpoint = user.role === "farmer" ? "/api/feedback/retailers" : "/api/feedback/farmers";
        const res = await axios.get(`http://localhost:8081${endpoint}`);
        setTargetUsers(res.data);
      } catch (err) {
        console.error("Failed to load target users", err);
      }
    };

    fetchTargetUsers();
  }, [user.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.trim()) return setMessage("Feedback cannot be empty!");
    if (!selectedTargetId) return setMessage("Please select a recipient!");

    try {
      const response = await axios.post("http://localhost:8081/api/feedback/add", {
        user_id: user.id,
        user_type: user.role,
        feedback_text: feedback,
        target_user_id: selectedTargetId,
      });

      if (response.data.success) {
        setMessage("Feedback submitted successfully!");
        setFeedback("");
        setSelectedTargetId("");
      } else {
        setMessage("Failed to submit feedback!");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setMessage("Error submitting feedback. Try again later!");
    }
  };

  return (
    <div className={classes.con}>
      <div className={classes.feedbackForm}>
        <h2>Submit Feedback 📝</h2>
        {message && <p className={classes.message}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <select
            value={selectedTargetId}
            onChange={(e) => setSelectedTargetId(e.target.value)}
            required
          >
            <option value="">Select {user.role === "farmer" ? "Retailer" : "Farmer"}</option>
            {targetUsers.map((target) => (
              <option key={target.id} value={target.id}>
                {target.name}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
