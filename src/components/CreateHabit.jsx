import React from 'react';
import './Habit.css';

const CreateHabit = () => {
  return (
    <div className="create-habit-container">
      <div className="create-habit-content">
        <h2>Create Habit <span className="icon"></span></h2>
        <hr style={{width:"330px", marginLeft:"180px", marginBottom:"40px"}}/>
        <div className="quote">"Small daily improvements are the key to staggering long-term results." – Robin Sharma</div>

        <form className="form-container">
          <div className="form-row">
            <label>Category:</label>
            <select style={{width:"250px"}}>
              <option>Select category</option>
              <option>Health</option>
              <option>Productivity</option>
              <option>Learning</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-row">
            <label>Habit Name:</label>
            <input type="text" placeholder="Enter Habit name" style={{width:"300px"}}/>
          </div>

          <div className="form-row">
            <label>Frequency:</label>
            <select style={{width:"370px"}}>
              <option>Select</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
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

export default CreateHabit;
