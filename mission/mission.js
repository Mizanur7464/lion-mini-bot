document.addEventListener('DOMContentLoaded', () => {
    // Mission progress tracking
    let completedMissions = 0;
    const totalMissions = 5;

    // Mission data
    const missions = {
        tap100: { current: 0, target: 100, reward: 1000 },
        earn5000: { current: 0, target: 5000, reward: 2000 },
        boost3: { current: 0, target: 3, reward: 3000 },
        invite2: { current: 0, target: 2, reward: 5000 },
        share: { current: 0, target: 1, reward: 1500 }
    };

    // Update mission progress
    function updateMissionProgress(missionId, progress) {
        const mission = missions[missionId];
        mission.current = Math.min(progress, mission.target);
        
        const missionCard = document.querySelector(`[data-mission="${missionId}"]`);
        const progressText = missionCard.querySelector('.progress-text');
        const progressBar = missionCard.querySelector('.progress-bar-mini .progress');
        const claimBtn = missionCard.querySelector('.claim-btn');
        
        progressText.textContent = `${mission.current}/${mission.target}`;
        progressBar.style.width = `${(mission.current / mission.target) * 100}%`;
        
        if (mission.current >= mission.target) {
            claimBtn.disabled = false;
        }
    }

    // Claim reward
    function claimReward(missionId) {
        const mission = missions[missionId];
        const missionCard = document.querySelector(`[data-mission="${missionId}"]`);
        
        if (mission.current >= mission.target && !missionCard.classList.contains('completed')) {
            missionCard.classList.add('completed');
            const claimBtn = missionCard.querySelector('.claim-btn');
            claimBtn.textContent = 'Claimed';
            claimBtn.disabled = true;
            
            // Show reward animation
            showRewardAnimation(mission.reward);
            
            // Update overall progress
            completedMissions++;
            updateOverallProgress();
        }
    }

    // Update overall progress
    function updateOverallProgress() {
        const progressText = document.getElementById('mission-progress');
        const progressBar = document.getElementById('progress-bar');
        
        progressText.textContent = `${completedMissions}/${totalMissions}`;
        progressBar.style.width = `${(completedMissions / totalMissions) * 100}%`;
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

    // Add click listeners to claim buttons
    document.querySelectorAll('.claim-btn').forEach(btn => {
        const missionId = btn.closest('.mission-card').dataset.mission;
        btn.addEventListener('click', () => claimReward(missionId));
    });

    // Back button function
    window.goBack = function() {
        window.history.back();
    }

    // Example: Update some mission progress (simulate user actions)
    setTimeout(() => {
        updateMissionProgress('tap100', 50);
        updateMissionProgress('earn5000', 2500);
        updateMissionProgress('boost3', 1);
    }, 1000);

    // Load progress from localStorage
    function loadProgress() {
        const progress = JSON.parse(localStorage.getItem('missionProgress') || '{}');
        
        if (progress.tap100) {
            updateMissionProgress('tap100', progress.tap100);
        }
        if (progress.earn5000) {
            updateMissionProgress('earn5000', progress.earn5000);
        }
        if (progress.boost3) {
            updateMissionProgress('boost3', progress.boost3);
        }
    }

    // Load progress when page loads
    loadProgress();

    // Update progress every second
    setInterval(loadProgress, 1000);
});

// Add reward animation styles
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