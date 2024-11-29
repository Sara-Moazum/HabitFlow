import React from "react";
import "./HabitSuggestions.css";

const HabitSuggestions = () => {
  const habits = [
    { category: "Health & Wellness", name: "Drink water" },
    { category: "Health & Wellness", name: "Exercise" },
    { category: "Health & Wellness", name: "Meditation" },
    { category: "Creative Pursuits", name: "Sunset photo" },
    { category: "Creative Pursuits", name: "Reading" },
    { category: "Creative Pursuits", name: "Journaling" },
    { category: "Productivity", name: "Time Blocking" },
    { category: "Productivity", name: "Practice a skill" },
    { category: "Productivity", name: "Take notes" },
  ];

  return (
    <div className="habit-suggestions">
      <h1>Habit Suggestions</h1>
      <div className="divider" /> 
      <p>
        Based on your interests, we suggest these habits to help you reach your
        goals!
      </p>
      <div className="categories">
        {["Health & Wellness", "Creative Pursuits", "Productivity"].map(
          (category) => (
            <div key={category} className="category">
              <h2>{category}</h2>
              {habits
                .filter((habit) => habit.category === category)
                .map((habit, idx, arr) => (
                  <React.Fragment key={idx}>
                    <div className="habit">
                      <span>{habit.name}</span>
                      <button>Add</button>
                    </div>
                    {idx < arr.length - 1 && <div className="habit-divider" />}
                  </React.Fragment>
                ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default HabitSuggestions;
