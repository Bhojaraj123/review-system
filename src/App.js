import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    setReviews(savedReviews);

    fetch("http://localhost:5000/reviews")
      .then(res => res.json())
      .then(data => {
        const combined = [...savedReviews, ...data];
        setReviews(combined);
      });
  }, []);

  const saveToLocal = (review) => {
    const saved = JSON.parse(localStorage.getItem("reviews")) || [];
    saved.unshift(review);
    localStorage.setItem("reviews", JSON.stringify(saved));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReview = {
      username,
      comment,
      rating,
      time: new Date().toLocaleString()
    };

    await fetch("http://localhost:5000/add-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview)
    });

    saveToLocal(newReview);
    setReviews([newReview, ...reviews]);

    setUsername("");
    setComment("");
    setRating(1);
  };

  return (
    <div className="container">
      <div className="form-section">
        <h2>Add Review</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <textarea
            placeholder="Write your comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num}>{num}</option>
            ))}
          </select>

          <button type="submit">Submit Review</button>
        </form>
      </div>

      <div className="review-section">
        <h2>Reviews</h2>
        {reviews.map((r, i) => (
          <div key={i} className="review-box">
            <p><strong>{r.username}</strong> ⭐{r.rating}</p>
            <p>{r.comment}</p>
            <small>{r.time}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
