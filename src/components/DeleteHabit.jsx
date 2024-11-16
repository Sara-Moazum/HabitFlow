import React from 'react';
import {FaTrash } from "react-icons/fa";
import './Habit.css';

const DeleteHabit = () => {
  return (
    <div className="create-habit-container">
      <div className="create-habit-content">
        <h2>Delete Habit <span className="icon"><FaTrash style ={{color:"#9747FF"}}/></span></h2>
        <hr style={{width:"330px", marginLeft:"180px", marginBottom:"40px"}}/>
        <div className="quote" style={{height:"120px", width:"330px",padding:"5px", display:"flex", flexDirection:"column", justifyContent:"center", marginLeft:"175px", marginTop:"80px",marginBottom:"50px"}}>
            <div style={{marginBottom:"10px", color:"#242424", fontWeight:"bold"}}>Confirm Deletion </div>
            <div style={{color:"#242424"}}>Are you sure you want to<br/> <span>permanently delete this habit?</span> </div>

        </div>
        <div className="form-buttons">
            <button type="submit" className="save-button" style={{backgroundColor:"transparent", color:"white", border:"1px solid white"}}>Delete</button>
            <button type="button" className="cancel-button" style={{backgroundColor:"transparent", color:"white", border:"1px solid white"}}>Cancel</button>
          </div>

    
      </div>
    </div>
  );
};

export default DeleteHabit;
