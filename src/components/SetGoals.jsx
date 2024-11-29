import React from 'react';
import './Habit.css';

const SetGoals = () => {
  return (
    <div className="create-habit-container">
      <div className="create-habit-content">
        <h2>Set Goals <span className="icon"></span></h2>
        <hr style={{width:"330px", marginLeft:"180px", marginBottom:"40px"}}/>
        <div className="quote">"The Journey of a thousand miles begins with one step." – Leo Tzu</div>

        <form className="form-container">
          <div className="form-row">
            <label>Habit Name:</label>
            <input type="text" placeholder="Enter Habit name" style={{width:"300px"}}/>

          </div>

          <div className="form-row">
            <label>Goal:</label>
            <input type="text" placeholder="Enter Goal" style={{width:"300px"}}/>
          </div>

          <div className="form-row">
            <label>Progress Track:</label>
            <input type="text" placeholder="Enter days to tarck" style={{width:"300px"}}/>

          </div>

          <div className="form-row">
            <label>Description:</label>
            <textarea style={{width:"450px"}} ></textarea>
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-button">Save</button>
            <button type="button" className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetGoals;