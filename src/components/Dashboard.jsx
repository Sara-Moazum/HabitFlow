import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa';
import './Dashboard.css';
import './NavBar.css'; 
import { Link } from "react-router-dom";


const calculateCompletionRate = (habitProgresses) => {
    const totalDays = habitProgresses.length;
    const completedDays = habitProgresses.filter((entry) => entry.isCompleted).length;
    return totalDays > 0 ? ((completedDays / totalDays) * 100).toFixed(2) : 0;
};

const Dashboard = ({ userId, username }) => {
    const [frequency, setFrequency] = useState('Daily');
    const [habits, setHabits] = useState([]);
    const [goals, setGoals] = useState([]);
    const [overallProgress, setOverallProgress] = useState(0); // Track overall progress
    const [currentDate, setCurrentDate] = useState('');
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        if (!userId) {
            console.error("No userId found!");
            return; 
        }
        const today = new Date().toISOString().split('T')[0];
        setCurrentDate(today);

        const fetchHabitsAndGoals = async () => {
            setIsDataLoaded(false);

            try {
                const habitsResponse = await axios.get(
                    `http://localhost:5000/api/habits/${frequency}?userId=${userId}`
                );
                setHabits(habitsResponse.data);

                console.log('Habits received from backend:', habitsResponse.data);

                const goalsResponse = await axios.get('http://localhost:5000/api/habits/all', {
                    params: { userId },
                });
                setGoals(goalsResponse.data);

                calculateOverallProgress(habitsResponse.data);

            } catch (error) {
                console.error('Error fetching habits and goals:', error);
            }

            setIsDataLoaded(true);
        };

        fetchHabitsAndGoals();
    }, [frequency, userId]);

    const calculateOverallProgress = (habitsData) => {
        let totalDays = 0;
        let completedDays = 0;

        habitsData.forEach((habit) => {
            const habitProgresses = habit.HabitProgresses || [];
            totalDays += habitProgresses.length;
            completedDays += habitProgresses.filter((entry) => entry.isCompleted).length;
        });

        const progress = totalDays > 0 ? ((completedDays / totalDays) * 100).toFixed(2) : 0;
        setOverallProgress(progress);
    };

    const handleCheckboxChange = async (habitId) => {
        try {
            await axios.post('http://localhost:5000/api/habits/update-progress', {
                userId,
                habitId,
                date: currentDate,
                progress: true, // Mark as completed
            });

            // Refetch habits to update the UI
            const habitsResponse = await axios.get(
                `http://localhost:5000/api/habits/${frequency}?userId=${userId}`
            );
            setHabits(habitsResponse.data);
            calculateOverallProgress(habitsResponse.data);
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleFrequencyChange = (newFrequency) => {
        setFrequency(newFrequency);
    };

    const filteredHabitsForTable = habits.filter((habit) => {
        const sortedProgress = [...habit.HabitProgresses].sort(
            (a, b) => new Date(b.completionDate) - new Date(a.completionDate)
        );

        const latestProgress = sortedProgress[0];
        if (latestProgress && latestProgress.isCompleted) {
            return false;
        }

        return true;
    });

    return (
        <div className="dashboard-container">
            
            {isDataLoaded && (
                <>
                     <header className="navbar">
                        <div className="logo">HABITFLOW</div>
                        <nav className="nav-links">
                            <Link to="/Home">Home</Link>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/logout">Logout</Link>
                          

                        </nav>
                    </header>
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
                                    {filteredHabitsForTable.map((habit) => (
                                        <th key={habit.habitId}>{habit.habitName}</th>
                                    ))}
                                    <th>Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {habits.length > 0 ? (
                                    <tr>
                                        <td>{frequency}</td>
                                        <td>{currentDate}</td>
                                        {filteredHabitsForTable.map((habit) => (
                                            <td key={habit.habitId}>
                                                <input
                                                    type="checkbox"
                                                    className="custom-checkbox"
                                                    checked={false}
                                                    onChange={() => handleCheckboxChange(habit.habitId)}
                                                />
                                            </td>
                                        ))}
                                        <td>{overallProgress}%</td>
                                    </tr>
                                ) : (
                                    <tr>

                                        <td>{frequency}</td>
                                        <td>{currentDate}</td>
                                        <td>{overallProgress}%</td>
                                        <td colSpan={filteredHabitsForTable.length}>
                                            No habits created for this frequency.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {habits.length > 0 && (
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
                                    const completionRate = calculateCompletionRate(habit.HabitProgresses || []);

                                    return (
                                    <tr key={habit.habitId}>
                                        <td>{habit.description}</td>
                                        <td>{goal ? goal.goal : 'No goal set'}</td>
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
                        )}

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
