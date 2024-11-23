import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa';
import './Dashboard.css';
import jwt_decode from 'jwt-decode';  // Not needed anymore
import { Link } from 'react-router-dom';

const Dashboard = ({ currentDate, userId, username }) => {  // Receive userId and username as props
    console.log('Inside Dashboard component');
    console.log('userid',userId);
    console.log('username',username);
    const [frequency, setFrequency] = useState('Daily');
    const [habits, setHabits] = useState([]);
    const [goals, setGoals] = useState([]);
    const [progress, setProgress] = useState({});

    // Fetch habits and goals whenever frequency or userId changes
    useEffect(() => {
        const fetchHabitsAndGoals = async () => {
            try {

                // Fetch habits by frequency
                const habitsResponse = await axios.get(`http://localhost:5000/api/habits/${frequency}?userId=${userId}`);

                setHabits(habitsResponse.data);

                // Fetch all habits with their goals
                const goalsResponse = await axios.get('http://localhost:5000/api/habits/all', {
                    params: { userId },  // Use userId directly from props
                });
                setGoals(goalsResponse.data);
                  

                // Initialize progress for each habit
                const initialProgress = {};
                habitsResponse.data.forEach((habit) => {
                    initialProgress[habit.habitId] = false; // Default unchecked
                });
                setProgress(initialProgress);
            } catch (error) {
                console.error('Error fetching habits and goals:', error);
            }
        };

        if (userId) {
            fetchHabitsAndGoals();
        }
    }, [frequency, userId]);  // Fetch data again when userId or frequency changes

    // Handle checkbox state change and update progress
    const handleCheckboxChange = async (habitId) => {
        const newProgress = !progress[habitId];

        setProgress((prev) => ({
            ...prev,
            [habitId]: newProgress, // Toggle progress for the habit
        }));

        try {
            // Send updated progress to the backend
            await axios.post('/api/habits/update-progress', {
                userId,
                habitId,
                date: currentDate,
                progress: newProgress, // Send the updated progress
            });
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleFrequencyChange = (newFrequency) => {
        setFrequency(newFrequency);
    };

    return (
        <div className="dashboard-container">
            {/* Welcome Message */}
            <div className="welcome-message">Welcome Back, {username}!</div>

            {/* Frequency Options */}
            <div className="frequency-options">
                <button onClick={() => handleFrequencyChange('Daily')}>
                    <FaCalendarAlt className="calendar-icon" /> Today
                </button>
                <button onClick={() => handleFrequencyChange('Weekly')}>
                    <FaCalendarAlt className="calendar-icon" /> This Week
                </button>
                <button onClick={() => handleFrequencyChange('Monthly')}>
                    <FaCalendarAlt className="calendar-icon" /> This Month
                </button>
            </div>

            {/* First Table */}
            <div className="habits-table-section">
                <table className="habits-table">
                    <thead>
                        <tr>
                            <th>Frequency</th>
                            <th>Date</th>
                            {habits.map((habit, index) => (
                                <th key={index}>{habit.habitName}</th>
                            ))}
                            <th>Progress &#8721;</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{frequency}</td>
                            <td>{currentDate}</td>
                            {habits.map((habit) => (
                                <td key={habit.habitId}>
                                    <input
                                        type="checkbox"
                                        className="custom-checkbox"
                                        checked={progress[habit.habitId] || false}
                                        onChange={() => handleCheckboxChange(habit.habitId)}
                                    />
                                </td>
                            ))}
                            <td>50%</td> {/* Placeholder for progress percentage */}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Habits Section - Displayed only if habits are found */}
                {habits.length > 0 && (
                    <div className="habits-section">
                        <h3 className="habits-heading">Habits</h3>
                        <div className="habit-list">
                            {habits.map((habit) => (
                                <div key={habit.habitId} className="habit-item">
                                    <span>{habit.habitName}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Details Table */}
                <div className="details-section">
                    {goals.length === 0 ? (
                        <div className="no-habits-message">
                            <p>No habits found. Create a new habit to get started!</p>
                        </div>
                    ) : (
                        <>
                            {/* Table Headings outside the table */}
                            <div className="details-heading">
                                <span>Description</span>
                                <span>Goal</span>
                                <span>Completion Rate</span>
                                <span>Actions</span>
                            </div>
                            <table className="details-table">
                                <tbody>
                                    {goals.map((goal) => (
                                        <tr key={goal.goalId}>
                                            <td>{goal.habit.description}</td>
                                            <td>{goal.goal}</td>
                                            <td>60%</td> {/* Placeholder for completion rate */}
                                            <td>
                                                <button>Update</button>
                                                <button>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>

            <div className="actions-section">
                <Link to="/setGoals">
                    <button>Set Goal</button>
                </Link>
                <Link to="/createHabit">
                    <button>Create New Habit</button>
                </Link>
                <Link to="/trackProgress">
                    <button>Track Progress</button>
                </Link>
                <Link to="/habitSuggestions">
                    <button>Habit Suggestions</button>
                </Link>
                <Link to="/accountSettings">
                    <button>Account Settings</button>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
