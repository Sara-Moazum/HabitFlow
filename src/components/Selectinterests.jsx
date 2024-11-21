import React, { useState } from "react";
import "./SelectInterests.css"; // Import the external CSS file

const SelectInterests = () => {
    const [selectedInterests, setSelectedInterests] = useState([]);
    const interests = [
        "Music",
        "Art",
        "Health",
        "Makeup",
        "DIY and Crafts",
        "Photography",
        "Sketch",
        "Sports",
        "Food and drinks",
        "Books",
        "Writing",
        "Design",
        "Electronics",
        "Fashion",
        "Finance",
    ];

    const toggleInterest = (interest) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((item) => item !== interest)
                : [...prev, interest]
        );
    };

    const handleSave = () => {
        alert(`Saved Interests: ${selectedInterests.join(", ")}`);
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
                            className={`interestBtn ${selectedInterests.includes(interest) ? "selectedBtn" : ""
                                }`}
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
