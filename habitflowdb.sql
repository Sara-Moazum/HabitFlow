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
    signUpDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastLogin TIMESTAMP NULL
);

ALTER TABLE `users`
ADD COLUMN `hasSelectedInterests` BOOLEAN NOT NULL DEFAULT FALSE;

-- Interests Table (no changes)
CREATE TABLE interests (
    interestId INT AUTO_INCREMENT PRIMARY KEY,
    interestName VARCHAR(255) NOT NULL
);

-- User_Interests Table (no changes)
CREATE TABLE user_interests (
    Id INT AUTO_INCREMENT PRIMARY KEY;
    userId INT NOT NULL,
    interestId INT NOT NULL,

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
    startDate DATE NOT NULL,  -- Date the habit was created
    nextDueDate DATE NOT NULL, -- Next date the habit should appear
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
    FOREIGN KEY (habitId) REFERENCES habits(habitId) ON DELETE CASCADE,
    constraint unique_goal unique (userId,habitId)
);

-- Habit Progress Table (no changes)
CREATE TABLE habit_progress (
    progressId INT AUTO_INCREMENT PRIMARY KEY,
    habitId INT NOT NULL,  -- Foreign key to habits table
    userId INT NOT NULL,   -- Foreign key to users table (assuming you have a users table)
    completionDate DATE NOT NULL,  -- Tracks completion for a specific day
    isCompleted BOOLEAN DEFAULT FALSE,  -- Whether the habit was marked completed
    FOREIGN KEY (habitId) REFERENCES habits(habitId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,  -- Assumes a users table with userId
    CONSTRAINT unique_habit_date UNIQUE (habitId, completionDate, userId)  -- Ensure unique progress for each habit, date, and user
);

ALTER TABLE habit_progress 
MODIFY COLUMN completionDate DATE;

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



CREATE TABLE default_habits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    habitName VARCHAR(255) NOT NULL,
    habitDescription TEXT NOT NULL,
    categoryId INT NOT NULL,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
);
CREATE TABLE interest_habits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    interestId INT NOT NULL,
    habitName VARCHAR(255) NOT NULL,
    habitDescription TEXT NOT NULL,
    categoryId INT NOT NULL,
    FOREIGN KEY (interestId) REFERENCES interests(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
);
INSERT INTO default_habits (habitName, habitDescription, categoryId) 
VALUES 
    ('Learn a New Instrument', 'Spend 30 minutes daily learning or practicing a musical instrument.', 4),
    ('Sketch or Paint', 'Dedicate time to create artwork using your preferred medium.', 4),
    ('Read a Book', 'Read at least one chapter of a book every day.', 4);
    INSERT INTO default_habits (habitName, habitDescription, categoryId) 
VALUES 
    ('Morning Yoga', 'Start your day with 15 minutes of yoga to improve flexibility and focus.', 1),
    ('Daily Walk', 'Walk 10,000 steps or at least 30 minutes every day.', 1),
    ('Hydration Tracker', 'Drink 8 glasses of water to stay hydrated and healthy.', 1);

    INSERT INTO default_habits (habitName, habitDescription, categoryId) 
VALUES 
    ('Plan Tomorrow Today', 'Spend 10 minutes planning your tasks for the next day.', 2),
    ('Deep Work Session', 'Work on your most important task for 90 minutes without distractions.', 2),
    ('Declutter Workspace', 'Spend 5 minutes organizing your workspace each evening.', 2);
INSERT INTO interest_habits (interestId, habitName, habitDescription, categoryId) 
VALUES
-- Reading
(1, 'Read 30 minutes daily', 'Develop a consistent reading habit', 3),
(1, 'Join a book club', 'Engage in discussions about books', 1),
(1, 'Write book reviews', 'Reflect on and summarize what you read', 3),

-- Exercise
(2, 'Morning jog', 'Start the day with a 20-minute jog', 2),
(2, 'Daily stretches', 'Improve flexibility with simple stretches', 2),
(2, 'Attend a fitness class', 'Join a weekly group fitness session', 2),

-- Cooking
(3, 'Try a new recipe', 'Experiment with new ingredients weekly', 1),
(3, 'Meal prep Sundays', 'Prepare meals for the week', 3),
(3, 'Host a dinner', 'Cook and share meals with friends or family', 1),

-- Traveling
(4, 'Plan a weekend getaway', 'Explore a new location every month', 1),
(4, 'Research travel tips', 'Learn from experienced travelers', 3),
(4, 'Create a travel journal', 'Document your journeys creatively', 1),

-- Music
(5, 'Learn a new instrument', 'Practice 30 minutes a day', 1),
(5, 'Explore a new genre', 'Expand your musical horizons', 1),
(5, 'Attend a live concert', 'Experience live music regularly', 1),

-- Technology
(6, 'Learn a programming language', 'Dedicate time to improve coding skills', 3),
(6, 'Explore a new tech tool', 'Test software or hardware weekly', 3),
(6, 'Stay updated with tech news', 'Read tech-related blogs or news', 3),

-- Art & Design
(7, 'Sketch daily', 'Spend 15 minutes sketching ideas', 1),
(7, 'Create a design portfolio', 'Showcase your best works', 1),
(7, 'Explore a new medium', 'Experiment with different art supplies', 1),

-- Gaming
(8, 'Try a new game', 'Explore genres outside your comfort zone', 1),
(8, 'Join an online tournament', 'Compete in your favorite game', 1),
(8, 'Stream gameplay', 'Share your gaming experience online', 3),

-- Mental Well-being
(9, 'Meditate for 10 minutes daily', 'Relax your mind through mindfulness', 2),
(9, 'Write in a gratitude journal', 'Focus on positive aspects of life', 3),
(9, 'Practice deep breathing', 'Enhance calmness and focus', 2),

-- Photography
(10, 'Capture daily moments', 'Take one meaningful photo each day', 1),
(10, 'Experiment with editing', 'Enhance photos using editing tools', 1),
(10, 'Participate in a photo contest', 'Test your skills competitively', 1),

-- Sports
(11, 'Join a local sports club', 'Engage with like-minded enthusiasts', 2),
(11, 'Practice drills daily', 'Focus on skill improvement', 2),
(11, 'Watch professional games', 'Learn from observing the pros', 1),

-- Fashion
(12, 'Plan outfits for the week', 'Stay organized and stylish', 3),
(12, 'Learn basic sewing', 'Customize and repair your clothing', 1),
(12, 'Follow fashion trends', 'Stay updated with the latest styles', 3),

-- Writing
(13, 'Write a daily journal', 'Document your thoughts and ideas', 3),
(13, 'Start a blog', 'Share your stories online', 3),
(13, 'Join a writers’ group', 'Collaborate and improve writing skills', 1),

-- Languages
(14, 'Learn a word daily', 'Expand vocabulary in a new language', 3),
(14, 'Practice with a language partner', 'Improve conversational skills', 1),
(14, 'Watch movies in the language', 'Enhance listening and comprehension', 3),

-- Social Media
(15, 'Schedule posts', 'Plan and create engaging content', 3),
(15, 'Explore new platforms', 'Try out emerging social media sites', 3),
(15, 'Engage with followers', 'Build stronger online connections', 3),

-- Movies & TV Shows
(16, 'Watch a classic film weekly', 'Explore timeless cinema', 1),
(16, 'Write reviews', 'Critique and analyze your watchlist', 3),
(16, 'Create a themed movie night', 'Enjoy films with friends or family', 1),

-- Volunteering
(17, 'Participate in a community event', 'Contribute to local causes', 1),
(17, 'Mentor someone', 'Share your knowledge and experience', 3),
(17, 'Join an NGO', 'Work on projects that inspire you', 1),

-- Pets & Animals
(18, 'Spend time with pets daily', 'Build a bond through care and play', 2),
(18, 'Volunteer at an animal shelter', 'Help animals in need', 1),
(18, 'Learn about pet training', 'Improve your pet’s behavior', 3),

-- Science
(19, 'Read a science article daily', 'Stay updated with advancements', 3),
(19, 'Conduct a DIY experiment', 'Explore science hands-on', 1),
(19, 'Join a science club', 'Engage with curious minds', 1),

-- Cooking & Baking
(20, 'Bake a new recipe weekly', 'Explore the world of baking', 1),
(20, 'Learn food plating', 'Enhance the presentation of your meals', 1),
(20, 'Master a cooking technique', 'Focus on specific skills like sautéing', 1),

-- Yoga & Meditation
(21, 'Attend a yoga class', 'Improve flexibility and mindfulness', 2),
(21, 'Practice deep stretching', 'Loosen tight muscles and joints', 2),
(21, 'Meditate before bed', 'Relax for a good night’s sleep', 2),

-- Gardening
(22, 'Plant a seasonal flower', 'Bring colors to your garden', 1),
(22, 'Compost organic waste', 'Promote sustainable gardening', 3),
(22, 'Water plants daily', 'Keep your garden healthy and hydrated', 2),

-- Outdoor Adventures
(23, 'Go hiking monthly', 'Explore nature trails', 2),
(23, 'Try camping', 'Spend a night under the stars', 2),
(23, 'Learn map navigation', 'Improve outdoor survival skills', 2),

-- Business & Entrepreneurship
(24, 'Read business case studies', 'Learn from successful entrepreneurs', 3),
(24, 'Attend networking events', 'Build professional connections', 3),
(24, 'Create a business plan', 'Start laying the groundwork for your ideas', 3);

SET GLOBAL event_scheduler = ON;

SET GLOBAL SQL_SAFE_UPDATES = 0;

DELIMITER $$

CREATE EVENT insert_progress_for_all_habits
ON SCHEDULE EVERY 1 DAY STARTS '2024-11-30 00:00:00'
ON COMPLETION NOT PRESERVE ENABLE
DO
  BEGIN
    -- For Daily Habits: Insert a progress record if the due date has passed
    INSERT INTO habit_progress (userId, habitId, completionDate, isCompleted)
    SELECT habits.userId, habits.habitId, CURDATE(), FALSE
    FROM habits
    WHERE DATE(habits.nextDueDate) = CURDATE();

    -- Now, update the nextDueDate for each habit
    UPDATE habits
    SET habits.nextDueDate = CASE
        WHEN habits.frequency = 'daily' THEN DATE_ADD(DATE(habits.nextDueDate), INTERVAL 1 DAY)
        WHEN habits.frequency = 'weekly' THEN DATE_ADD(DATE(habits.nextDueDate), INTERVAL 7 DAY)
        WHEN habits.frequency = 'monthly' THEN DATE_ADD(DATE(habits.nextDueDate), INTERVAL 1 MONTH)
    END
    WHERE DATE(habits.nextDueDate) = CURDATE();
  END $$

DELIMITER ;




