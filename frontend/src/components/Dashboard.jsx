import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = ({ currentDate, userId, username }) => {
    const [frequency, setFrequency] = useState('Daily');
    const [habits, setHabits] = useState([]);
    const [goals, setGoals] = useState([]);
    const [progress, setProgress] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHabitsAndGoals = async () => {
            try {
                // Fetch habits by frequency
                const habitsResponse = await axios.get(`http://localhost:5000/api/habits/${frequency}`, {
                    params: { userId },
                });

                setHabits(Array.isArray(habitsResponse.data) ? habitsResponse.data : []);
                console.log('Habits API response:', habitsResponse.data);

                // Fetch all habits with their goals
                const goalsResponse = await axios.get('http://localhost:5000/api/habits/all', {
                    params: { userId },
                });

                setGoals(Array.isArray(goalsResponse.data) ? goalsResponse.data : []);
                console.log('Goals API response:', goalsResponse.data);

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

    const handleCheckboxChange = async (habitId) => {
        const newProgress = !progress[habitId];

        setProgress((prev) => ({
            ...prev,
            [habitId]: newProgress,
        }));

        try {
            await axios.post('http://localhost:5000/api/habits/update-progress', {
                userId,
                habitId,
                date: currentDate,
                progress: newProgress,
            });
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleFrequencyChange = (newFrequency) => {
        setFrequency(newFrequency);
    };

    const handleDeleteHabit = async (habitId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/habits/deletehabit/${habitId}`);
            if (response.status === 200) {
                alert('Habit Deleted Successfully');
                setGoals((prev) => prev.filter((habit) => habit.habitId !== habitId));
                setHabits((prev) => prev.filter((habit) => habit.habitId !== habitId));

            }
        } catch (error) {
            console.error('Error deleting habit:', error);
            alert('Failed to delete the habit.');
        }
    };

    return (
        <div className="dashboard-container">
            <div className="welcome-message">Welcome Back, {username}!</div>

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
                            <td>50%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="main-content">
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

                <div className="details-section">
                    {goals.length === 0 ? (
                        <div className="no-habits-message">
                            <p>No habits found. Create a new habit to get started!</p>
                        </div>
                    ) : (
                        <>
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
                                            <td>{goal.description}</td>
                                            <td>{goal.goal}</td>
                                            <td>60%</td>
                                            <td>
                                                <button
                                                    className="actionButtons"
                                                    onClick={() => navigate(`/updateHabit/${goal.habitId}`)}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    className="actionButtons"
                                                    onClick={() => handleDeleteHabit(goal.habitId)}
                                                >
                                                    Delete
                                                </button>
                                                <button className="actionButtons" onClick={() => navigate(`/setGoals/${goal.habitId}/${userId}`)}>Set Goals</button>
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
                    <button onClick={() => navigate('/createHabit')}>Create New Habit</button>
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