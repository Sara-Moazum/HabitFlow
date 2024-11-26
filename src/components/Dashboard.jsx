import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa';
import './Dashboard.css';
import { Link } from 'react-router-dom';


const calculateCompletionRate = (habitId, habitProgress) => {
    const progressData = habitProgress[habitId] || [];

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
                    initialProgress[habit.habitId] = [];  // Store an empty array for each habit to track its progress
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
        const newProgress = progress[habitId] || [];
        const habitAlreadyCompleted = newProgress.some((entry) => entry.completed);

        if (!habitAlreadyCompleted) {
            // Add progress entry (mark completed)
            newProgress.push({ date: currentDate, completed: true });
        } else {
            // Add missed day (mark not completed)
            newProgress.push({ date: currentDate, completed: false });
        }

        // Update progress state
        setProgress((prev) => ({
            ...prev,
            [habitId]: newProgress,
        }));

        try {
            await axios.post('http://localhost:5000/api/habits/update-progress', {
                userId,
                habitId,
                date: currentDate,
                progress: !habitAlreadyCompleted, // true for completed, false for not completed
            });
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleFrequencyChange = (newFrequency) => {
        setFrequency(newFrequency);
    };

    // Filter habits that are marked as completed for the first table
    const filteredHabitsForTable = habits.filter((habit) => {
        const habitProgressData = progress[habit.habitId] || [];
        const completed = habitProgressData.some((entry) => entry.completed);
        return !completed;  // Only show habits that are not marked as completed
    });

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
                            {filteredHabitsForTable.map((habit, index) => (
                                <th key={index}>{habit.habitName}</th>
                            ))}
                            <th>Progress &#8721;</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{frequency}</td>
                            <td>{currentDate}</td>
                            {filteredHabitsForTable.map((habit) => (
                                <td key={habit.habitId}>
                                    <input
                                        type="checkbox"
                                        className="custom-checkbox"
                                        checked={progress[habit.habitId]?.some((entry) => entry.completed) || false}
                                        onChange={() => handleCheckboxChange(habit.habitId)}
                                    />
                                </td>
                            ))}
                            <td>{/* Placeholder for progress percentage */} 50%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Habit List and Details Table (Second Table) */}
            <div className="details-section">
                <div className="habit-list">
                    <h3>Habit</h3>
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
                                const completionRate = calculateCompletionRate(habit.habitId, progress);

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
