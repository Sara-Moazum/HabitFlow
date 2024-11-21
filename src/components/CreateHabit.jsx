import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import './Habit.css';

const CreateHabit = () => {
  const [userId, setUserId] = useState('');
  const [habitName, setHabitName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]); // State to store categories

  // Fetch categories when the component mounts
  useEffect(() => {
    // Fetch the JWT token from localStorage or sessionStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the JWT token to get user data
        const decoded = jwt_decode(token);
        setUserId(decoded.userId); // Assuming userId is part of the payload
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const result = await response.json();
        if (response.ok) {
          setCategories(result); // Set the fetched categories to the state
        } else {
          console.log('Error fetching categories:', result.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const habitData = {
      userId,
      habitName,
      description,
      frequency,
      category,
    };

    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitData),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Habit created:', result);
      } else {
        console.log('Error:', result.message);
      }
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  return (
    <div className="create-habit-container">
      <div className="create-habit-content">
        <h2>Create Habit</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '250px' }}
            >
              <option>Select category</option>
              {/* Dynamically populate categories */}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Habit Name:</label>
            <input
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="Enter Habit name"
              style={{ width: '300px' }}
            />
          </div>

          <div className="form-row">
            <label>Frequency:</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              style={{ width: '370px' }}
            >
              <option>Select</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          <div className="form-row">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '450px' }}
            ></textarea>
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-button">
              Save
            </button>
            <button type="button" className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHabit;