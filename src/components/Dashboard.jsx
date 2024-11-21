import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa';
import './Dashboard.css';
import jwt_decode from 'jwt-decode';

const Dashboard = ({ currentDate }) => {
    console.log('Inside Dashboard component');
    const [frequency, setFrequency] = useState('Daily');
    const [habits, setHabits] = useState([]);
    const [goals, setGoals] = useState([]);
    const [progress, setProgress] = useState({});
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');

    // Fetch username and userId from localStorage when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decoded = jwt_decode(token); // Decode the JWT
                const userId = decoded.userId;
                const username = decoded.username;

                setUserId(userId); // Set userId
                setUsername(username); // Set username
            } catch (error) {
                console.error('Error decoding the token', error);
            }
        } else {
            console.log('No token found');
        }
    }, []);

    console.log('Username:', username);

    // Fetch habits and goals whenever frequency or userId changes
    useEffect(() => {
        const fetchHabitsAndGoals = async () => {
            try {
                // Fetch habits by frequency
                const habitsResponse = await axios.get(`/api/habits/${frequency}`, {
                    params: { userId },
                });                
                setHabits(habitsResponse.data);

                // Fetch all habits with their goals
                const goalsResponse = await axios.get('/api/habits/all', {
                    params: { userId },
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
    }, [frequency, userId]);

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

            {/* Action Buttons */}
            <div className="actions-section">
                <button>Set Goal</button>
                <button>Create New Habit</button>
                <button>Track Progress</button>
                <button>Habit Suggestions</button>
                <button>Account Settings</button>
            </div>
        </div>
    );
};

export default Dashboard;
