import React from 'react';
import './TrackProgress.css'; 

const TrackProgress = () => {
  return (
    <div className="track-progress-page">
      
 

      <main className="main-body">
        <section className="section daily">
          <h2>Daily Habits</h2>
          {/* charts for daily habits */}
        </section>

        <section className="section weekly">
          <h2>Weekly Habits</h2>
          {/* graphs for weekly habits*/}
        </section>

        <section className="section monthly">
          <h2>Monthly Habits</h2>
          {/* graphs for monthly habits */}
        </section>
      </main>


    </div>
  );
};

export default TrackProgress;
