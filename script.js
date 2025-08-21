// Global Variables
let currentUser = null;
let timerInterval = null;
let currentTime = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let isBreak = false;
let pomodoroCount = 0;
let tasks = [];
let completedTasksCount = 0;
let totalFocusTime = 0;
let currentPlaylist = null;
let isPlaying = false;
let focusModeActive = false;
let habitTracker = [];
let speechSynthesis = window.speechSynthesis;

// Enhanced Motivational quotes with categories
const quotes = [
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "action" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "resilience" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "perseverance" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "dreams" },
    { text: "It is never too late to be what you might have been.", author: "George Eliot", category: "potential" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "beginning" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "opportunity" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer", category: "happiness" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "confidence" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "passion" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "persistence" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "action" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown", category: "mindset" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown", category: "motivation" },
    { text: "Great things never come from comfort zones.", author: "Unknown", category: "growth" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown", category: "action" },
    { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown", category: "proactivity" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown", category: "achievement" },
    { text: "Dream bigger. Do bigger.", author: "Unknown", category: "ambition" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown", category: "persistence" },
    { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown", category: "daily" },
    { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery", category: "future" },
    { text: "Little things make big days.", author: "Unknown", category: "daily" },
    { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown", category: "resilience" },
    { text: "Don't wait for opportunity. Create it.", author: "Unknown", category: "proactivity" },
    { text: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "Unknown", category: "strength" },
    { text: "The key to success is to focus on goals, not obstacles.", author: "Unknown", category: "focus" },
    { text: "Dream it. Believe it. Build it.", author: "Unknown", category: "creation" }
];

// Motivational Images Data
const motivationalImages = [
    { 
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        text: "Every mountain top is within reach if you just keep climbing! 🏔️"
    },
    { 
        url: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=400&h=300&fit=crop",
        text: "Success is a journey, not a destination. Keep moving forward! 🌅"
    },
    { 
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        text: "Find your path and walk it with confidence! 🌲"
    },
    { 
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        text: "The view is always better from the top! Keep pushing! ⛰️"
    },
    { 
        url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
        text: "Your potential is endless, just like the ocean! 🌊"
    }
];

// Music Playlists (mock data)
const playlists = {
    lofi: [
        { name: "Chill Study Beats", duration: "3:45" },
        { name: "Coffee Shop Vibes", duration: "4:12" },
        { name: "Late Night Focus", duration: "3:28" },
        { name: "Rainy Day Mood", duration: "4:33" }
    ],
    nature: [
        { name: "Forest Rain", duration: "10:00" },
        { name: "Ocean Waves", duration: "8:15" },
        { name: "Mountain Stream", duration: "12:30" },
        { name: "Bird Songs", duration: "6:45" }
    ],
    classical: [
        { name: "Bach - Air on G String", duration: "5:20" },
        { name: "Chopin - Nocturne in E-flat", duration: "4:30" },
        { name: "Debussy - Clair de Lune", duration: "5:45" },
        { name: "Mozart - Eine kleine Nachtmusik", duration: "6:12" }
    ],
    ambient: [
        { name: "Space Drift", duration: "8:45" },
        { name: "Deep Meditation", duration: "15:00" },
        { name: "Ethereal Pad", duration: "9:30" },
        { name: "Cosmic Journey", duration: "11:20" }
    ]
};

// Leaderboard Data
const leaderboardData = [
    { name: "You", score: 0, tasks: 0, focus: 0 },
    { name: "Alex Chen", score: 2340, tasks: 47, focus: 892 },
    { name: "Sarah Johnson", score: 2180, tasks: 43, focus: 756 },
    { name: "Mike Rodriguez", score: 1950, tasks: 39, focus: 678 },
    { name: "Emma Davis", score: 1820, tasks: 36, focus: 634 }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    showLoadingScreen();
    setTimeout(() => {
        hideLoadingScreen();
        loadUserData();
        updateTimerDisplay();
        displayRandomQuote();
        updateStats();
        generateHabitTracker();
        updateLeaderboard();
        showMotivationalImage();
    }, 2000);
    
    // Add task on Enter key
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Update timer when settings change
    ['workDuration', 'breakDuration', 'longBreakDuration'].forEach(id => {
        document.getElementById(id).addEventListener('change', function() {
            if (!isRunning) {
                resetTimer();
            }
        });
    });

    // Volume control
    document.getElementById('volumeSlider').addEventListener('input', function(e) {
        // Mock volume control
        showNotification(`🔊 Volume set to ${e.target.value}%`, 'info');
    });
});

// Loading Screen Functions
function showLoadingScreen() {
    document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoadingScreen() {
    document.getElementById('loadingOverlay').classList.remove('show');
}

// Authentication Functions
function showLogin() {
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
}

function showRegister() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'flex';
}

function showApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('appContainer').classList.add('active');
}

function socialLogin(provider) {
    showLoadingScreen();
    showNotification(`🚀 Connecting with ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`, 'info');
    
    setTimeout(() => {
        const mockUser = {
            name: provider === 'google' ? 'John Doe' : provider === 'github' ? 'Jane Dev' : 'Alex Smith',
            email: `user@${provider}.com`,
            avatar: provider === 'google' ? 'JD' : provider === 'github' ? 'JD' : 'AS'
        };
        
        loginUser(mockUser);
        hideLoadingScreen();
        showNotification(`🎉 Welcome back, ${mockUser.name}! Ready to be productive?`);
        celebrateWithEmojis(['🎉', '✨', '🚀']);
    }, 2000);
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (email && password) {
        showLoadingScreen();
        setTimeout(() => {
            const mockUser = {
                name: 'Productivity Pro',
                email: email,
                avatar: email.charAt(0).toUpperCase() + email.charAt(email.indexOf('@') + 1).toUpperCase()
            };
            
            loginUser(mockUser);
            hideLoadingScreen();
            showNotification('🚀 Welcome back! Let\'s make today amazing!');
            celebrateWithEmojis(['🎯', '⚡', '🔥']);
        }, 1500);
    }
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('🚫 Passwords do not match!', 'error');
        return;
    }
    
    if (name && email && password) {
        showLoadingScreen();
        setTimeout(() => {
            const mockUser = {
                name: name,
                email: email,
                avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            };
            
            loginUser(mockUser);
            hideLoadingScreen();
            showNotification('🎉 Account created! Welcome to your productivity journey!');
            celebrateWithEmojis(['🎉', '🌟', '💪']);
        }, 1500);
    }
});

function loginUser(user) {
    currentUser = user;
    document.getElementById('userAvatar').textContent = user.avatar;
    saveUserData();
    showApp();
    updateLeaderboard();
}

function logout() {
    if (confirm('Are you sure you want to logout? 🚪')) {
        currentUser = null;
        localStorage.removeItem('focusFlowUser');
        localStorage.removeItem('focusFlowData');
        document.getElementById('appContainer').classList.remove('active');
        document.getElementById('loginPage').style.display = 'flex';
        showNotification('👋 Goodbye! See you soon for more productivity!');
        if (isRunning) {
            pauseTimer();
        }
    }
}

// Timer Functions
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-flex';
        document.querySelector('.timer-section').classList.add('timer-active');
        
        timerInterval = setInterval(() => {
            currentTime--;
            updateTimerDisplay();
            updateProgressCircle();
            
            if (focusModeActive) {
                document.getElementById('focusModeTimer').textContent = formatTime(currentTime);
            }
            
            if (currentTime <= 0) {
                completeSession();
            }
        }, 1000);

        showNotification(isBreak ? '☕ Break time started! Relax and recharge!' : '🏅 Focus session started! You got this!');
    }
}

function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        document.getElementById('startBtn').style.display = 'inline-flex';
        document.getElementById('pauseBtn').style.display = 'none';
        document.querySelector('.timer-section').classList.remove('timer-active');
        showNotification('⏸️ Timer paused. Take a moment to breathe!', 'info');
    }
}

function resetTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    
    if (isBreak) {
        currentTime = parseInt(document.getElementById('breakDuration').value) * 60;
    } else {
        currentTime = parseInt(document.getElementById('workDuration').value) * 60;
    }
    
    updateTimerDisplay();
    updateProgressCircle();
    document.getElementById('startBtn').style.display = 'inline-flex';
    document.getElementById('pauseBtn').style.display = 'none';
    document.querySelector('.timer-section').classList.remove('timer-active');
    showNotification('🔄 Timer reset! Ready for a fresh start!', 'info');
}

function completeSession() {
    isRunning = false;
    clearInterval(timerInterval);
    
    if (!isBreak) {
        // Work session completed
        pomodoroCount++;
        totalFocusTime += parseInt(document.getElementById('workDuration').value);
        showNotification('🏅 Pomodoro completed! Time for a well-deserved break!');
        celebrateWithEmojis(['🏅', '🎉', '⭐', '💪']);
        playNotificationSound();
        
        // Switch to break
        isBreak = true;
        if (pomodoroCount % 4 === 0) {
            currentTime = parseInt(document.getElementById('longBreakDuration').value) * 60;
            showNotification('🌟 Long break time! You\'ve earned it champion! 🏆');
            celebrateWithEmojis(['🏆', '🌟', '🎊', '💎']);
        } else {
            currentTime = parseInt(document.getElementById('breakDuration').value) * 60;
        }
    } else {
        // Break completed
        showNotification('⚡ Break time over! Ready to conquer your next focus session?');
        celebrateWithEmojis(['⚡', '🔥', '🎯']);
        isBreak = false;
        currentTime = parseInt(document.getElementById('workDuration').value) * 60;
    }
    
    updateTimerDisplay();
    updateProgressCircle();
    updateStats();
    updateLeaderboard();
    document.getElementById('startBtn').style.display = 'inline-flex';
    document.getElementById('pauseBtn').style.display = 'none';
    document.querySelector('.timer-section').classList.remove('timer-active');
    displayRandomQuote();
    showMotivationalImage();
    saveUserData();

    if (focusModeActive) {
        document.getElementById('focusModeTimer').textContent = formatTime(currentTime);
    }
}

function updateTimerDisplay() {
    const display = formatTime(currentTime);
    document.getElementById('timerDisplay').textContent = display;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateProgressCircle() {
    const totalTime = isBreak ? 
        (pomodoroCount % 4 === 0 ? parseInt(document.getElementById('longBreakDuration').value) : parseInt(document.getElementById('breakDuration').value)) * 60 :
        parseInt(document.getElementById('workDuration').value) * 60;
    
    const progress = ((totalTime - currentTime) / totalTime) * 100;
    const circumference = 2 * Math.PI * 100; // radius = 100
    const offset = circumference - (progress / 100) * circumference;
    
    document.getElementById('progressCircle').style.strokeDashoffset = offset;
    document.getElementById('progressText').textContent = Math.round(progress) + '%';
}

// Enhanced Task Functions
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            timeSpent: 0,
            createdAt: new Date().toLocaleTimeString(),
            priority: Math.floor(Math.random() * 3) // 0: low, 1: medium, 2: high
        };
        
        tasks.push(task);
        taskInput.value = '';
        renderTasks();
        saveUserData();
        showNotification('📝 Mission added to your quest list! Let\'s conquer it!');
        celebrateWithEmojis(['📝', '⚡', '🎯']);
    }
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        if (task.completed) {
            completedTasksCount++;
            showNotification('✅ Task crushed! You\'re on fire! 🔥');
            celebrateWithEmojis(['✅', '🔥', '🎉', '💪', '⭐']);
            playNotificationSound();
            
            // Show motivational image occasionally
            if (Math.random() < 0.3) {
                showMotivationalImage();
            }
        } else {
            completedTasksCount--;
        }
        renderTasks();
        updateStats();
        updateLeaderboard();
        saveUserData();
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task? 🗑️')) {
        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();
        saveUserData();
        showNotification('🗑️ Task removed from your mission list!', 'info');
    }
}

function startTaskTimer(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task && !isRunning) {
        showNotification(`🎯 Focus mode activated for: "${task.text}"!`, 'info');
        startTimer();
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i class="fas fa-tasks" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p style="font-size: 1.2rem;">No tasks yet! Add your first mission above! 🚀</p>
            </div>
        `;
        return;
    }
    
    tasks.forEach((task, index) => {
        const priorityColors = ['🟢', '🟡', '🔴'];
        const priorityLabels = ['Low', 'Medium', 'High'];
        
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <div class="task-info">
                <div class="task-checkbox ${task.completed ? 'completed' : ''}" 
                     onclick="toggleTask(${task.id})">
                    ${task.completed ? '<i class="fas fa-check" style="color: white;"></i>' : ''}
                </div>
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <span style="margin-left: auto; display: flex; align-items: center; gap: 0.5rem;">
                    <span title="${priorityLabels[task.priority]} Priority">${priorityColors[task.priority]}</span>
                    <span class="task-time">${task.createdAt}</span>
                </span>
            </div>
            <div class="task-actions">
                <button class="action-btn btn-play" onclick="startTaskTimer(${task.id})" 
                        ${task.completed ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} 
                        title="Start focus session for this task">
                    <i class="fas fa-play"></i>
                </button>
                <button class="action-btn btn-delete" onclick="deleteTask(${task.id})" 
                        title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
}

// Music Functions
function selectPlaylist(type) {
    currentPlaylist = type;
    
    // Update active button
    document.querySelectorAll('.playlist-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-playlist="${type}"]`).classList.add('active');
    
    // Update current track display
    const playlist = playlists[type];
    const randomTrack = playlist[Math.floor(Math.random() * playlist.length)];
    document.getElementById('currentTrack').textContent = `🎵 ${randomTrack.name}`;
    
    showNotification(`🎵 ${type.charAt(0).toUpperCase() + type.slice(1)} playlist selected!`, 'info');
}

function playPauseMusic() {
    if (!currentPlaylist) {
        showNotification('🎵 Please select a playlist first!', 'info');
        return;
    }
    
    isPlaying = !isPlaying;
    const playPauseIcon = document.getElementById('playPauseIcon');
    
    if (isPlaying) {
        playPauseIcon.className = 'fas fa-pause';
        showNotification('🎵 Music started! Let the focus flow! 🌊');
    } else {
        playPauseIcon.className = 'fas fa-play';
        showNotification('🎵 Music paused.', 'info');
    }
}

function toggleMusic() {
    playPauseMusic();
}

function toggleMusicPlayer() {
    // This would expand/collapse the music player in a real implementation
    showNotification('🎵 Music player expanded! (Feature coming soon)', 'info');
}

// Quote Functions
function displayRandomQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quoteText').textContent = `"${randomQuote.text}"`;
    document.getElementById('quoteAuthor').textContent = `- ${randomQuote.author}`;
}

function speakQuote() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        showNotification('🔇 Speech stopped.', 'info');
        return;
    }
    
    const quoteText = document.getElementById('quoteText').textContent;
    const quoteAuthor = document.getElementById('quoteAuthor').textContent;
    
    const utterance = new SpeechSynthesisUtterance(`${quoteText} ${quoteAuthor}`);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => {
        showNotification('🔊 Playing inspirational quote!', 'info');
    };
    
    utterance.onend = () => {
        showNotification('✨ Quote finished! You\'re inspired and ready!');
    };
    
    speechSynthesis.speak(utterance);
}

// Stats Functions
function updateStats() {
    const hours = Math.floor(totalFocusTime / 60);
    const minutes = totalFocusTime % 60;
    document.getElementById('focusTime').textContent = `${hours}h ${minutes}m`;
    document.getElementById('completedTasks').textContent = completedTasksCount;
    document.getElementById('pomodoroCount').textContent = pomodoroCount;
    
    // Update habit tracker for today
    const today = new Date().getDate();
    if (pomodoroCount > 0) {
        markHabitDay(today - 1);
    }
}

function resetStats() {
    if (confirm('🔄 Are you sure you want to reset today\'s stats?')) {
        pomodoroCount = 0;
        completedTasksCount = 0;
        totalFocusTime = 0;
        updateStats();
        saveUserData();
        showNotification('📊 Stats reset! Fresh start activated! 🚀');
    }
}

// Motivational Image Functions
function showMotivationalImage() {
    const container = document.getElementById('motivationalImageContainer');
    const img = document.getElementById('motivationalImg');
    const text = document.getElementById('motivationalImgText');
    
    if (tasks.length > 0 && Math.random() < 0.4) {
        const randomImage = motivationalImages[Math.floor(Math.random() * motivationalImages.length)];
        img.src = randomImage.url;
        text.textContent = randomImage.text;
        container.style.display = 'block';
        
        setTimeout(() => {
            container.style.display = 'none';
        }, 10000); // Hide after 10 seconds
    }
}

// Celebration Functions
function celebrateWithEmojis(emojis) {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createFloatingEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
        }, i * 200);
    }
}

function createFloatingEmoji(emoji) {
    const emojiElement = document.createElement('div');
    emojiElement.className = 'celebration-emoji';
    emojiElement.textContent = emoji;
    
    // Random position
    emojiElement.style.left = Math.random() * window.innerWidth + 'px';
    emojiElement.style.top = window.innerHeight + 'px';
    
    document.body.appendChild(emojiElement);
    
    // Remove after animation
    setTimeout(() => {
        emojiElement.remove();
    }, 3000);
}

// Focus Mode
function toggleFocusMode() {
    focusModeActive = !focusModeActive;
    const overlay = document.getElementById('focusModeOverlay');
    
    if (focusModeActive) {
        overlay.style.display = 'flex';
        document.getElementById('focusModeTimer').textContent = formatTime(currentTime);
        document.getElementById('focusModeMessage').textContent = isBreak ? '☕ Break Mode Active' : '🎯 Deep Focus Mode Active';
        showNotification('🎯 Focus mode activated! Eliminate distractions!');
        
        if (!isRunning) {
            startTimer();
        }
    } else {
        overlay.style.display = 'none';
        showNotification('👁️ Focus mode deactivated. Welcome back!', 'info');
    }
}

function exitFocusMode() {
    toggleFocusMode();
}

// Leaderboard Functions
function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    
    // Update user's score
    leaderboardData[0].score = (pomodoroCount * 50) + (completedTasksCount * 20) + Math.floor(totalFocusTime / 5);
    leaderboardData[0].tasks = completedTasksCount;
    leaderboardData[0].focus = totalFocusTime;
    leaderboardData[0].name = currentUser ? currentUser.name : 'You';
    
    // Sort leaderboard
    leaderboardData.sort((a, b) => b.score - a.score);
    
    leaderboardList.innerHTML = '';
    
    leaderboardData.forEach((user, index) => {
        const isCurrentUser = user.name === (currentUser ? currentUser.name : 'You');
        const medals = ['🥇', '🥈', '🥉'];
        const medal = index < 3 ? medals[index] : `#${index + 1}`;
        
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        if (isCurrentUser) {
            item.style.background = 'var(--glass-bg)';
            item.style.border = '2px solid var(--primary-color)';
        }
        
        item.innerHTML = `
            <div class="leaderboard-rank">${medal}</div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${user.name} ${isCurrentUser ? '(You)' : ''}</div>
                <div class="leaderboard-score">${user.tasks} tasks • ${user.focus}min focus • ${user.score} pts</div>
            </div>
        `;
        
        leaderboardList.appendChild(item);
    });
}

// Habit Tracker Functions
function generateHabitTracker() {
    const habitGrid = document.getElementById('habitGrid');
    const today = new Date().getDate();
    const daysInMonth = new Date().getDate();
    
    habitGrid.innerHTML = '';
    
    for (let day = 1; day <= 21; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'habit-day';
        dayElement.textContent = day;
        dayElement.onclick = () => toggleHabitDay(day - 1);
        
        if (day === today) {
            dayElement.classList.add('today');
        }
        
        if (habitTracker[day - 1]) {
            dayElement.classList.add('completed');
        }
        
        habitGrid.appendChild(dayElement);
    }
}

function toggleHabitDay(index) {
    habitTracker[index] = !habitTracker[index];
    generateHabitTracker();
    saveUserData();
    
    if (habitTracker[index]) {
        showNotification('✅ Day marked as completed! Keep the streak alive! 🔥');
        celebrateWithEmojis(['✅', '🔥', '💪']);
    } else {
        showNotification('❌ Day unmarked.', 'info');
    }
}

function markHabitDay(index) {
    if (!habitTracker[index]) {
        habitTracker[index] = true;
        generateHabitTracker();
        saveUserData();
    }
}

function resetHabits() {
    if (confirm('🔄 Are you sure you want to reset your habit tracker?')) {
        habitTracker = [];
        generateHabitTracker();
        saveUserData();
        showNotification('🔄 Habit tracker reset! Fresh start! 🌱');
    }
}

// Utility Functions
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
        showNotification('☀️ Light mode activated! Rise and shine!', 'info');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
        showNotification('🌙 Dark mode activated! Easy on the eyes!', 'info');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

function playNotificationSound() {
    // Create a pleasant notification sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a more pleasant sound sequence
        const frequencies = [523.25, 659.25, 783.99]; // C, E, G notes
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            }, index * 150);
        });
    } catch (error) {
        console.log('Audio context not supported');
    }
}

// Enhanced Data Persistence
function saveUserData() {
    if (currentUser) {
        const userData = {
            user: currentUser,
            tasks: tasks,
            stats: {
                pomodoroCount,
                completedTasksCount,
                totalFocusTime
            },
            settings: {
                workDuration: document.getElementById('workDuration').value,
                breakDuration: document.getElementById('breakDuration').value,
                longBreakDuration: document.getElementById('longBreakDuration').value
            },
            habitTracker: habitTracker,
            currentPlaylist: currentPlaylist,
            lastLogin: new Date().toISOString()
        };
        
        localStorage.setItem('focusFlowUser', JSON.stringify(currentUser));
        localStorage.setItem('focusFlowData', JSON.stringify(userData));
    }
}

function loadUserData() {
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('themeIcon').className = 'fas fa-moon';
    }
    
    // Load user data
    const savedUser = localStorage.getItem('focusFlowUser');
    const savedData = localStorage.getItem('focusFlowData');
    
    if (savedUser && savedData) {
        try {
            currentUser = JSON.parse(savedUser);
            const userData = JSON.parse(savedData);
            
            tasks = userData.tasks || [];
            pomodoroCount = userData.stats?.pomodoroCount || 0;
            completedTasksCount = userData.stats?.completedTasksCount || 0;
            totalFocusTime = userData.stats?.totalFocusTime || 0;
            habitTracker = userData.habitTracker || [];
            currentPlaylist = userData.currentPlaylist;
            
            if (userData.settings) {
                document.getElementById('workDuration').value = userData.settings.workDuration || 25;
                document.getElementById('breakDuration').value = userData.settings.breakDuration || 5;
                document.getElementById('longBreakDuration').value = userData.settings.longBreakDuration || 15;
            }
            
            // Welcome back message
            const lastLogin = new Date(userData.lastLogin);
            const now = new Date();
            const daysSinceLogin = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
            
            let welcomeMessage = `🎉 Welcome back, ${currentUser.name}!`;
            if (daysSinceLogin > 0) {
                welcomeMessage += ` You've been away for ${daysSinceLogin} day${daysSinceLogin > 1 ? 's' : ''}. Ready to be productive? 💪`;
            } else {
                welcomeMessage += ` Let's continue your productivity streak! 🔥`;
            }
            
            document.getElementById('userAvatar').textContent = currentUser.avatar;
            renderTasks();
            updateStats();
            updateLeaderboard();
            generateHabitTracker();
            
            if (currentPlaylist) {
                selectPlaylist(currentPlaylist);
            }
            
            showApp();
            setTimeout(() => showNotification(welcomeMessage), 1000);
        } catch (error) {
            console.error('Error loading user data:', error);
            showNotification('⚠️ Error loading user data. Starting fresh!', 'error');
        }
    }
}

// Initialize timer display and progress circle
function initializeTimer() {
    updateTimerDisplay();
    updateProgressCircle();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Space bar to start/pause timer
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }
    
    // 'R' to reset timer
    if (e.code === 'KeyR' && e.ctrlKey) {
        e.preventDefault();
        resetTimer();
    }
    
    // 'F' for focus mode
    if (e.code === 'KeyF' && e.ctrlKey) {
        e.preventDefault();
        toggleFocusMode();
    }
    
    // 'T' for theme toggle
    if (e.code === 'KeyT' && e.ctrlKey) {
        e.preventDefault();
        toggleTheme();
    }
});

// Motivational tips and achievements
const achievements = [
    { id: 'first_task', name: 'First Steps', description: 'Complete your first task!', icon: '🎯', unlocked: false },
    { id: 'first_pomodoro', name: 'Focus Warrior', description: 'Complete your first Pomodoro!', icon: '🏅', unlocked: false },
    { id: 'five_tasks', name: 'Task Master', description: 'Complete 5 tasks in one day!', icon: '⭐', unlocked: false },
    { id: 'ten_pomodoros', name: 'Concentration King', description: 'Complete 10 Pomodoros!', icon: '👑', unlocked: false },
    { id: 'week_streak', name: 'Consistency Champion', description: 'Maintain a 7-day habit streak!', icon: '🔥', unlocked: false },
    { id: 'hour_focus', name: 'Deep Focus', description: 'Accumulate 1 hour of focus time!', icon: '⚡', unlocked: false }
];

function checkAchievements() {
    const unlockedAny = false;
    
    // Check each achievement
    if (!achievements[0].unlocked && completedTasksCount >= 1) {
        achievements[0].unlocked = true;
        showAchievement(achievements[0]);
    }
    
    if (!achievements[1].unlocked && pomodoroCount >= 1) {
        achievements[1].unlocked = true;
        showAchievement(achievements[1]);
    }
    
    if (!achievements[2].unlocked && completedTasksCount >= 5) {
        achievements[2].unlocked = true;
        showAchievement(achievements[2]);
    }
    
    if (!achievements[3].unlocked && pomodoroCount >= 10) {
        achievements[3].unlocked = true;
        showAchievement(achievements[3]);
    }
    
    if (!achievements[4].unlocked && habitTracker.filter(Boolean).length >= 7) {
        achievements[4].unlocked = true;
        showAchievement(achievements[4]);
    }
    
    if (!achievements[5].unlocked && totalFocusTime >= 60) {
        achievements[5].unlocked = true;
        showAchievement(achievements[5]);
    }
}

function showAchievement(achievement) {
    showNotification(`🏆 Achievement Unlocked: ${achievement.name}! ${achievement.icon}`, 'success');
    celebrateWithEmojis(['🏆', '🎉', achievement.icon, '⭐', '💫']);
    
    // Save achievement
    const savedAchievements = JSON.parse(localStorage.getItem('focusFlowAchievements') || '[]');
    if (!savedAchievements.includes(achievement.id)) {
        savedAchievements.push(achievement.id);
        localStorage.setItem('focusFlowAchievements', JSON.stringify(savedAchievements));
    }
}

// Productivity tips
const productivityTips = [
    "💡 Take regular breaks to maintain peak performance!",
    "🧠 Try the 2-minute rule: If it takes less than 2 minutes, do it now!",
    "📱 Put your phone in another room during focus sessions.",
    "🌱 Start with your most important task of the day.",
    "⚡ Use the Pomodoro technique for better time management.",
    "🎯 Set specific, measurable goals for each work session.",
    "💪 Celebrate small wins to maintain motivation!",
    "🌊 Create a workflow that feels natural to you.",
    "🔄 Review your progress regularly and adjust your approach.",
    "✨ Remember: Progress over perfection!"
];

function showRandomTip() {
    const randomTip = productivityTips[Math.floor(Math.random() * productivityTips.length)];
    showNotification(randomTip, 'info');
}

// Show a productivity tip every 10 minutes
setInterval(showRandomTip, 600000);

// Initialize everything
initializeTimer();

// Update achievements periodically
setInterval(() => {
    checkAchievements();
    updateLeaderboard();
}, 5000);

// Auto-save data every 30 seconds
setInterval(saveUserData, 30000);

// Show welcome tip after 5 seconds
setTimeout(() => {
    if (currentUser) {
        showRandomTip();
    }
}, 5000);

console.log(`
🚀 FocusFlow Pro Loaded Successfully!

⌨️  Keyboard Shortcuts:
• Space: Start/Pause Timer
• Ctrl+R: Reset Timer  
• Ctrl+F: Toggle Focus Mode
• Ctrl+T: Toggle Theme

✨ Features:
• Pomodoro Timer with Progress Circle
• Task Management with Priorities  
• Music Playlists for Focus
• Voice-enabled Motivational Quotes
• Habit Tracking (21-day challenge)
• Achievements & Leaderboard
• Focus Mode for Distraction-free Work
• Auto-save & Data Persistence

Happy Productivity! 🎯

`);
