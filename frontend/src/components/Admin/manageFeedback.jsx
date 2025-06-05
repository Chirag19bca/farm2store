import { useState, useEffect } from "react";
import axios from "axios";
import classes from "./Admin.module.css"; // Use this CSS file

const ManageFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/feedback/all");
      setFeedbackList(response.data);
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  const deleteFeedback = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/feedback/delete/${id}`);
      setFeedbackList(feedbackList.filter((feedback) => feedback.id !== id));
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  return (
    <div className={classes.feedbackContainer}>
      <h2>Manage Feedback 📢</h2>
      {feedbackList.length > 0 ? (
        feedbackList.map((feedback) => (
          <div key={feedback.id} className={classes.feedbackCard}>
            <p><strong>User Id: </strong>{feedback.user_id}</p>
            <p><strong>From User: </strong>{feedback.full_name}</p>
            <p><strong>User Type:</strong> {feedback.user_type}</p>
            <p><strong>To User : </strong>{feedback.target_user_name || "No Target User"}</p>
            <p><strong>Feedback:</strong> {feedback.feedback_text}</p>
            <p><small>{new Date(feedback.created_at).toLocaleString()}</small></p>
            <button
              className={classes.deleteButton}
              onClick={() => deleteFeedback(feedback.id)}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p className={classes.noFeedback}>No feedback available.</p>
      )}
    </div>
  );
};

export default ManageFeedback;