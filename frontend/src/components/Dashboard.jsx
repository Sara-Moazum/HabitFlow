import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';

const calculateCompletionRate = (habitId, habitProgress) => {
    const progressData = habitProgress[habitId] || [];
    const totalDays = progressData.length;
    const completedDays = progressData.filter((entry) => entry.completed).length;
    return totalDays > 0 ? ((completedDays / totalDays) * 100).toFixed(2) : 0;
};

const Dashboard = ({ userId, username }) => {
    const [frequency, setFrequency] = useState('Daily'); // Default to 'Daily'
    const [habits, setHabits] = useState([]);
    const [goals, setGoals] = useState([]);
    const [progress, setProgress] = useState({});
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState('');
    const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if data is loaded

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setCurrentDate(today);

        const fetchHabitsAndGoals = async () => {
            setIsDataLoaded(false); // Set loading state before fetching new data

            try {
                // Fetch habits for the selected frequency
                const habitsResponse = await axios.get(
                    `http://localhost:5000/api/habits/${frequency}?userId=${userId}`
                );
                setHabits(Array.isArray(habitsResponse.data) ? habitsResponse.data : []);
                console.log('Habits API response:', habitsResponse.data);

                // Fetch all goals for the user
                const goalsResponse = await axios.get('http://localhost:5000/api/habits/all', {
                    params: { userId },
                });

                setGoals(Array.isArray(goalsResponse.data) ? goalsResponse.data : []);
                console.log('Goals API response:', goalsResponse.data);

                // Initialize progress for each habit
                const initialProgress = {};
                habitsResponse.data.forEach((habit) => {
                    initialProgress[habit.habitId] = []; // Initialize progress state
                });
                setProgress(initialProgress); // Set progress state

            } catch (error) {
                console.error('Error fetching habits and goals:', error);
            }

            setIsDataLoaded(true); // Set to true once data is loaded
        };

        if (userId) {
            fetchHabitsAndGoals();
        }    }, [frequency, userId]); 

    const handleCheckboxChange = async (habitId) => {
        const newProgress = progress[habitId] || [];
        const habitAlreadyCompleted = newProgress.some((entry) => entry.completed);

        if (!habitAlreadyCompleted) {
            newProgress.push({ date: currentDate, completed: true });
        } else {
            newProgress.push({ date: currentDate, completed: false });
        }

        setProgress((prev) => ({
            ...prev,
            [habitId]: newProgress,
        }));

        try {
            await axios.post('http://localhost:5000/api/habits/update-progress', {
                userId,
                habitId,
                date: currentDate,
                progress: !habitAlreadyCompleted,
            });
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleFrequencyChange = (newFrequency) => {
        setFrequency(newFrequency); // Update frequency
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

    // Filter habits that are not marked as completed for the first table
    const filteredHabitsForTable = habits.filter((habit) => {
        const habitProgressData = progress[habit.habitId] || [];
        const completed = habitProgressData.some((entry) => entry.completed);
        return !completed; // Only show habits that are not marked as completed
    });

    return (
        <div className="dashboard-container">
            {/* Only render content when data is fully loaded */}
            {isDataLoaded && (
                <>
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
                                    {filteredHabitsForTable.map((habit) => (
                                        <th key={habit.habitId}>{habit.habitName}</th>
                                    ))}
                                    <th>Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHabitsForTable.length > 0 ? (
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
                                        <td>50%</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td>{frequency}</td>
                                        <td>{currentDate}</td>
                                        <td colSpan={filteredHabitsForTable.length + 1}>No habit of chosen frequency created.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Habit List and Details Table (Second Table) */}
                    <div className="details-section">
                        {habits.length > 0 && (
                            <div className="habits-section">
                                <h3 className="habits-heading">Habits</h3>
                                <div className="habit-list">
                                    {habits.map((habit) => (
                                        <div key={habit.habitId} className="habit-item">
                                            {habit.habitName}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {goals.length === 0 ? (
                            <div className="no-habits-message">
                                <p>No habits found. Create a new habit to get started!</p>
                            </div>
                        ) : (
                            <div className="details-table-wrapper">
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
                                                        className="actionBtn"
                                                        onClick={() => navigate(`/updateHabit/${goal.habitId}`)}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        className="actionBtn"
                                                        onClick={() => handleDeleteHabit(goal.habitId)}
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        className="actionBtn"
                                                        onClick={() => navigate(`/setGoals/${goal.habitId}/${userId}`)}
                                                    >
                                                        Set Goals
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
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
                </>
            )}
        </div>
    );
};

export default Dashboard;
