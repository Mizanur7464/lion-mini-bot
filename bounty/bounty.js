document.addEventListener('DOMContentLoaded', () => {
    // Load completed tasks from localStorage
    loadCompletedTasks();
    
    // Daily rewards data - 30 days complete list
    const dailyRewards = [
        { day: 1, coins: 500 },
        { day: 2, coins: 1000 },
        { day: 3, coins: 1500 },
        { day: 4, coins: 2000 },
        { day: 5, coins: 2500 },
        { day: 6, coins: 3000 },
        { day: 7, coins: 5000 },
        { day: 8, coins: 6000 },
        { day: 9, coins: 7000 },
        { day: 10, coins: 10000 },
        { day: 11, coins: 12000 },
        { day: 12, coins: 15000 },
        { day: 13, coins: 18000 },
        { day: 14, coins: 20000 },
        { day: 15, coins: 25000 },
        { day: 16, coins: 30000 },
        { day: 17, coins: 35000 },
        { day: 18, coins: 40000 },
        { day: 19, coins: 45000 },
        { day: 20, coins: 50000 },
        { day: 21, coins: 60000 },
        { day: 22, coins: 70000 },
        { day: 23, coins: 80000 },
        { day: 24, coins: 90000 },
        { day: 25, coins: 100000 },
        { day: 26, coins: 200000 },
        { day: 27, coins: 300000 },
        { day: 28, coins: 500000 },
        { day: 29, coins: 1000000 },
        { day: 30, coins: 1500000 }
    ];

    // Show daily rewards modal
    window.showDailyRewards = function() {
        const modal = document.getElementById('dailyRewardsModal');
        const grid = modal.querySelector('.rewards-grid');
        grid.innerHTML = '';

        dailyRewards.forEach(reward => {
            const dayElement = document.createElement('div');
            dayElement.className = 'day-reward';
            // Add 'completed' class for past days, 'active' for current day
            if (reward.day < getCurrentDay()) {
                dayElement.classList.add('completed');
            } else if (reward.day === getCurrentDay()) {
                dayElement.classList.add('active');
            }
            
            dayElement.innerHTML = `
                <h3>Day ${reward.day}</h3>
                <p>${reward.coins.toLocaleString()} coins</p>
                ${reward.day < getCurrentDay() ? '<span class="checkmark">✓</span>' : ''}
                ${reward.day === getCurrentDay() ? '<button class="claim-btn">Claim</button>' : ''}
            `;

            if (reward.day === getCurrentDay()) {
                const claimBtn = dayElement.querySelector('.claim-btn');
                claimBtn.addEventListener('click', () => claimDailyReward(reward));
            }

            grid.appendChild(dayElement);
        });

        modal.style.display = 'flex';
    }

    // Get current day (mock function - replace with actual logic)
    function getCurrentDay() {
        // This should be replaced with actual logic to track user's login days
        return 5; // Example: user is on day 5
    }

    // Claim daily reward
    function claimDailyReward(reward) {
        alert(`Claimed ${reward.coins.toLocaleString()} coins for Day ${reward.day}!`);
        // Add logic to update user's coin balance
        // Add logic to mark day as claimed
        closeDailyRewards();
    }

    // Close daily rewards modal
    window.closeDailyRewards = function() {
        document.getElementById('dailyRewardsModal').style.display = 'none';
    }

    // Back button function
    window.goBack = function() {
        window.history.back();
    }
});

// Add this CSS for reward animation
const style = document.createElement('style');
style.textContent = `
    .reward-animation {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: goldenrod;
        font-size: 24px;
        font-weight: bold;
        animation: floatUp 1.5s ease-out;
        pointer-events: none;
    }

    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -100%);
        }
    }
`;
document.head.appendChild(style); 

// Complete task function
window.completeTask = function(event, element) {
    event.preventDefault();
    const taskId = element.dataset.task;
    
    // Check if task is already completed
    if (element.classList.contains('completed')) {
        return;
    }

    // Show confirmation
    if (confirm('Are you sure you want to complete this task?')) {
        // Mark as completed
        element.classList.add('completed');
        
        // Hide arrow, show checkmark
        const arrow = element.querySelector('.arrow');
        const checkmark = element.querySelector('.checkmark');
        if (arrow) arrow.classList.add('hidden');
        if (checkmark) checkmark.classList.remove('hidden');

        // Get reward amount
        const rewardText = element.querySelector('.task-details p').textContent;
        const reward = parseInt(rewardText.match(/\+(\d+)/)[1]);

        // Show reward animation
        showRewardAnimation(reward);

        // Save completion status
        saveTaskCompletion(taskId);

        // Actually open the link in a new tab
        window.open(element.href, '_blank');
    }
}

// Save task completion to localStorage
function saveTaskCompletion(taskId) {
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    if (!completedTasks.includes(taskId)) {
        completedTasks.push(taskId);
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }
}

// Load completed tasks from localStorage
function loadCompletedTasks() {
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    completedTasks.forEach(taskId => {
        const taskElement = document.querySelector(`[data-task="${taskId}"]`);
        if (taskElement) {
            taskElement.classList.add('completed');
            const arrow = taskElement.querySelector('.arrow');
            const checkmark = taskElement.querySelector('.checkmark');
            if (arrow) arrow.classList.add('hidden');
            if (checkmark) checkmark.classList.remove('hidden');
        }
    });
}

// Show reward animation
function showRewardAnimation(amount) {
    const animation = document.createElement('div');
    animation.className = 'reward-animation';
    animation.textContent = `+${amount.toLocaleString()} coins`;
    document.body.appendChild(animation);

    setTimeout(() => {
        animation.remove();
    }, 1500);
} 