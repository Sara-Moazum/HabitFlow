import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import "./SelectInterests.css";

const SelectInterests = () => {
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    const interests = [
        "Reading", "Exercise", "Cooking", "Traveling", "Music", "Technology", "Art & Design",
        "Gaming", "Mental Well-being", "Photography", "Sports", "Fashion", "Writing",
        "Languages", "Social Media", "Movies & TV Shows", "Volunteering", "Pets & Animals",
        "Science", "Cooking & Baking", "Yoga & Meditation", "Gardening", "Outdoor Adventures",
        "Business & Entrepreneurship"
    ];

    // Check if the user is logged in and retrieve user ID when the component mounts
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setIsLoggedIn(true);
            setUserId(storedUserId);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const toggleInterest = (interest) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((item) => item !== interest)
                : [...prev, interest]
        );
    };

    const handleSave = async () => {
        if (!isLoggedIn) {
            alert("Please log in to save your interests.");
            return;
        }

        if (selectedInterests.length === 0) {
            alert("Please select at least one interest.");
            return;
        }

        try {
            // Send the selected interests to the backend API
            const response = await axios.post("http://localhost:3000/api/interests/save", {
                userId: userId,
                selectedInterests: selectedInterests, // Pass selected interests as an array
            });

            if (response.status === 201) {
                alert("Interests saved successfully!");
            } else {
                alert("Failed to save interests. Please try again.");
            }
        } catch (error) {
            console.error("Error saving interests:", error);
            alert("An error occurred while saving your interests.");
        }
    };

    return (
        <div className="app">
            <main className="interestsPage">
                <h2>
                    Select your <span className="highlight">Interests</span> 🎯
                </h2>
                <div className="interestsGrid">
                    {interests.map((interest) => (
                        <button
                            key={interest}
                            className={`interestBtn ${selectedInterests.includes(interest) ? "selectedBtn" : ""}`}
                            onClick={() => toggleInterest(interest)}
                        >
                            {interest}
                        </button>
                    ))}
                </div>
                <button className="saveBtn" onClick={handleSave}>
                    Save
                </button>
            </main>
        </div>
    );
};

export default SelectInterests;
