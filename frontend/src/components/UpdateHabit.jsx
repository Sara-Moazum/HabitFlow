import React from 'react';
import './Habit.css';

const UpdateHabit = () => {
  return (
    <div className="create-habit-container">
      <div className="create-habit-content">
        <h2>Update Habit <span className="icon"></span></h2>
        <hr style={{width:"330px", marginLeft:"180px", marginBottom:"40px"}}/>
        <div className="quote">"Success is the same of small efforts, repeated day in and day out." – Robert Collier</div>

        <form className="form-container">
          <div className="form-row">
            <label>Name:</label>
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

          <div className="form-row">
            <label> Goal:</label>
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

export default UpdateHabit;
