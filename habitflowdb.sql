Create database HabitFlow;

Use HabitFlow;

-- Users Table (no changes)
CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    signUpDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interests Table (no changes)
CREATE TABLE interests (
    interestId INT AUTO_INCREMENT PRIMARY KEY,
    interestName VARCHAR(255) NOT NULL
);

-- User_Interests Table (no changes)
CREATE TABLE user_interests (
    userId INT NOT NULL,
    interestId INT NOT NULL,
    PRIMARY KEY (userId, interestId),
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
    FOREIGN KEY (interestId) REFERENCES interests(interestId) ON DELETE CASCADE
);

-- Categories Table (for habit-specific categories)
CREATE TABLE categories (
    categoryId INT AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(255) NOT NULL UNIQUE
);

-- Habits Table (with added 'category' attribute)
CREATE TABLE habits (
    habitId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,  -- Foreign key to users table
    habitName VARCHAR(255) NOT NULL,
    description TEXT,
    frequency ENUM('daily', 'weekly', 'monthly') NOT NULL,
    categoryId INT NOT NULL,  -- Foreign key to categories table
    startDate DATE NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES categories(categoryId) ON DELETE CASCADE,
    CONSTRAINT unique_habit UNIQUE (userId, habitName) -- Prevent duplicate habit names for the same user
);


-- Goals Table (with updated structure: goal varchar, startDate, numberOfDaysToTrack)
CREATE TABLE goals (
    goalId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,  -- Foreign key to users table
    habitId INT NOT NULL,  -- Foreign key to habits table
    goal VARCHAR(255),  -- Goal description as a string
    startDate DATE NOT NULL,  -- Goal start date
    numberOfDaysToTrack INT NOT NULL,  -- Duration of the goal in days
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
    FOREIGN KEY (habitId) REFERENCES habits(habitId) ON DELETE CASCADE
);

-- Habit Progress Table (no changes)
CREATE TABLE habit_progress (
    progressId INT AUTO_INCREMENT PRIMARY KEY,
    habitId INT NOT NULL,  -- Foreign key to habits table
    completionDate DATE NOT NULL,  -- Tracks completion for a specific day
    isCompleted BOOLEAN DEFAULT FALSE,  -- Whether the habit was marked completed
    FOREIGN KEY (habitId) REFERENCES habits(habitId) ON DELETE CASCADE
);

-- Contact Feedback Table (removed 'isHabitTrackerUser' attribute)
CREATE TABLE contact_feedback (
    feedbackId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    thoughts TEXT,
    submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserting categories
INSERT INTO categories (categoryName) 
VALUES 
    ('Health & Fitness'),
    ('Productivity'),
    ('Personal Development'),
    ('Custom'),
    ('Hobbies');
  
-- Inserting interests
INSERT INTO interests (interestName) 
VALUES 
    ('Reading'),
    ('Exercise'),
    ('Cooking'),
    ('Traveling'),
    ('Music'),
    ('Technology'),
    ('Art & Design'),
    ('Gaming'),
    ('Mental Well-being'),
    ('Photography'),
    ('Sports'),
    ('Fashion'),
    ('Writing'),
    ('Languages'),
    ('Social Media'),
    ('Movies & TV Shows'),
    ('Volunteering'),
    ('Pets & Animals'),
    ('Science'),
    ('Cooking & Baking'),
    ('Yoga & Meditation'),
    ('Gardening'),
    ('Outdoor Adventures'),
    ('Business & Entrepreneurship');





