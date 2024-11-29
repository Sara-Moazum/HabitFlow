import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import './TrackProgress.css';

const TrackProgress = () => {
  const [userId, setUserId] = useState('');
  const [habitsByFrequency, setHabitsByFrequency] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Fetch data when the page loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUserId(decoded.userId); // Decode and set userId from the token
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    const fetchHabits = async (frequency) => {
      setIsDataLoaded(false);
      try {
        // Dynamically fetching habits for each frequency
        const response = await axios.get(
          `http://localhost:5000/api/habits/${frequency}?userId=${userId}`
        );
        
        setHabitsByFrequency((prevState) => ({
          ...prevState,
          [frequency]: response.data,
        }));

        console.log(`Fetched ${frequency} habits:`, response.data);
      } catch (error) {
        console.error(`Error fetching ${frequency} habits:`, error);
      }
      setIsDataLoaded(true);
    };

    if (userId) {
      // Fetch daily, weekly, and monthly habits when the page loads
      fetchHabits('daily');
      fetchHabits('weekly');
      fetchHabits('monthly');
    }
  }, [userId]);

  // Calculate completion rate for each habit
  const calculateCompletionRate = (habitProgresses) => {
    const totalDays = habitProgresses.length;
    const completedDays = habitProgresses.filter((entry) => entry.isCompleted).length;
    return totalDays > 0 ? ((completedDays / totalDays) * 100).toFixed(2) : 0;
  };

  return (
    <div className="track-progress-page">
      <main className="main-body">
        {/* Daily Section */}
        <section className="section daily">
          <h2>Daily Habits</h2>
          {isDataLoaded && habitsByFrequency.daily.map((habit) => {
            const completionRate = calculateCompletionRate(habit.HabitProgresses || []);
            return (
              <div key={habit.habitId} className="graph-container">
                <h3>{habit.habitName}</h3>
                <div
                  className="progress-bar"
                  style={{
                    width: `${completionRate}%`,
                    backgroundColor: completionRate === 100 ? 'green' : 'red',
                  }}
                ></div>
                <p>{completionRate}% completion</p>
              </div>
            );
          })}
        </section>

        {/* Weekly Section */}
        <section className="section weekly">
          <h2>Weekly Habits</h2>
          {isDataLoaded && habitsByFrequency.weekly.map((habit) => {
            const completionRate = calculateCompletionRate(habit.HabitProgresses || []);
            return (
              <div key={habit.habitId} className="graph-container">
                <h3>{habit.habitName}</h3>
                <div
                  className="progress-bar"
                  style={{
                    width: `${completionRate}%`,
                    backgroundColor: completionRate === 100 ? 'blue' : 'orange',
                  }}
                ></div>
                <p>{completionRate}% completion</p>
              </div>
            );
          })}
        </section>

        {/* Monthly Section */}
        <section className="section monthly">
          <h2>Monthly Habits</h2>
          {isDataLoaded && habitsByFrequency.monthly.map((habit) => {
            const completionRate = calculateCompletionRate(habit.HabitProgresses || []);
            return (
              <div key={habit.habitId} className="graph-container">
                <h3>{habit.habitName}</h3>
                <div
                  className="progress-bar"
                  style={{
                    width: `${completionRate}%`,
                    backgroundColor: completionRate === 100 ? 'purple' : 'yellow',
                  }}
                ></div>
                <p>{completionRate}% completion</p>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default TrackProgress;
