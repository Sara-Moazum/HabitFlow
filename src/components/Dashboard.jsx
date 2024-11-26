import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa';
import './Dashboard.css';
import { Link } from 'react-router-dom';

// Placeholder function to calculate completion rate dynamically
const calculateCompletionRate = (habitId) => {
    const progressData = [
        { date: '2024-11-20', completed: true },
        { date: '2024-11-21', completed: false },
        { date: '2024-11-22', completed: true },
    ]; // Example progress data

    const totalDays = progressData.length;
    const completedDays = progressData.filter((entry) => entry.completed).length;

    return totalDays > 0 ? ((completedDays / totalDays) * 100).toFixed(2) : 0;
};

const Dashboard = ({ userId, username }) => {
    const [frequency, setFrequency] = useState('Daily');
    const [habits, setHabits] = useState([]);
    const [goals, setGoals] = useState([]);
    const [progress, setProgress] = useState({});
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        // Get current date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        setCurrentDate(today);

        const fetchHabitsAndGoals = async () => {
            try {
                const habitsResponse = await axios.get(
                    `http://localhost:5000/api/habits/${frequency}?userId=${userId}`
                );
                setHabits(habitsResponse.data);

                const goalsResponse = await axios.get('http://localhost:5000/api/habits/all', {
                    params: { userId },
                });
                setGoals(goalsResponse.data);

                const initialProgress = {};
                habitsResponse.data.forEach((habit) => {
                    initialProgress[habit.habitId] = false;
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

    const handleCheckboxChange = async (habitId) => {
        const newProgress = !progress[habitId];
        setProgress((prev) => ({
            ...prev,
            [habitId]: newProgress,
        }));

        try {
            // Save the progress data immediately to the habit_progress table
            await axios.post('/api/habits/update-progress', {
                userId,
                habitId,
                date: currentDate,
                progress: newProgress, // true for completed, false for not completed
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

            {/* Habit Tracking Table (First Table) */}
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

            {/* Habit List and Details Table (Second Table) */}
            <div className="details-section">
                <div className="habit-list">
                    <h3>Habits</h3>
                    {habits.map((habit) => (
                        <div key={habit.habitId} className="habit-item">
                            {habit.habitName}
                        </div>
                    ))}
                </div>

                <div className="details-table-wrapper">
                    <div className="details-heading">
                        <span>Description</span>
                        <span>Goal</span>
                        <span>Completion Rate</span>
                        <span>Actions</span>
                    </div>
                    <table className="details-table">
                        <tbody>
                            {habits.map((habit) => {
                                const goal = goals.find((g) => g.habitId === habit.habitId);
                                const completionRate = calculateCompletionRate(habit.habitId);

                                return (
                                    <tr key={habit.habitId}>
                                        <td>{habit.description}</td>
                                        <td>{goal ? goal.goal : "No goal set"}</td>
                                        <td>{completionRate}%</td>
                                        <td>
                                            <button>Update</button>
                                            <button>Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Additional Action Buttons */}
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
