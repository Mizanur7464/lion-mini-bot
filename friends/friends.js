document.addEventListener('DOMContentLoaded', () => {
    // Back button function
    window.goBack = function() {
        window.history.back();
    }

    // Load user data and update UI
    loadUserData();
    
    // Load leaderboard data
    loadLeaderboard('global');

    // Add event listeners to tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all tabs
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked tab
            e.target.classList.add('active');
            // Load appropriate leaderboard
            loadLeaderboard(e.target.getAttribute('data-tab'));
        });
    });

    // Add event listeners to follow buttons
    document.querySelectorAll('.follow-btn').forEach(btn => {
        btn.addEventListener('click', handleFollow);
    });

    // Invite button click handler
    document.querySelector('.invite-btn').addEventListener('click', handleInvite);
});

// Load and display user data
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userCoins = parseInt(localStorage.getItem('coinCount') || '0');

    // Update rank
    document.querySelector('.rank').textContent = `#${calculateRank(userCoins)}`;
    
    // Update friends count
    const friendsCount = userData.friends?.length || 0;
    document.querySelector('.stats-section .stat-box:nth-child(2) span').textContent = friendsCount;
    
    // Update team bonus
    const teamBonus = calculateTeamBonus(friendsCount);
    document.querySelector('.stats-section .stat-box:nth-child(3) span').textContent = `+${teamBonus}%`;
}

// Load and display leaderboard
function loadLeaderboard(type) {
    const leaderboardList = document.querySelector('.leaderboard-list');
    leaderboardList.innerHTML = ''; // Clear current list

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    let players;

    if (type === 'friends') {
        // Show only friends
        players = userData.friends || [];
    } else {
        // Show global leaderboard
        players = getGlobalLeaderboard();
    }

    // Sort players by coins
    players.sort((a, b) => b.coins - a.coins);

    // Display players
    players.forEach((player, index) => {
        const playerCard = createPlayerCard(player, index + 1);
        leaderboardList.appendChild(playerCard);
    });
}

// Create player card element
function createPlayerCard(player, rank) {
    const card = document.createElement('div');
    card.className = `player-card ${rank <= 3 ? 'top-player' : ''}`;

    let rankDisplay = '';
    if (rank === 1) rankDisplay = '👑';
    else if (rank === 2) rankDisplay = '🥈';
    else if (rank === 3) rankDisplay = '🥉';
    else rankDisplay = rank;

    card.innerHTML = `
        <div class="${rank <= 3 ? 'rank-badge' : 'rank-number'}">${rankDisplay}</div>
        <img src="${player.avatar || 'img/default-avatar.png'}" alt="Player" class="player-avatar">
        <div class="player-info">
            <h3>${player.name}</h3>
            <p>${formatNumber(player.coins)} coins</p>
        </div>
        <button class="follow-btn" data-userid="${player.id}">${player.isFollowing ? 'Following' : 'Follow'}</button>
    `;

    return card;
}

// Handle follow button click
function handleFollow(e) {
    const btn = e.target;
    const userId = btn.getAttribute('data-userid');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    if (btn.textContent === 'Follow') {
        // Add to following list
        if (!userData.following) userData.following = [];
        userData.following.push(userId);
        btn.textContent = 'Following';
        btn.classList.add('following');
    } else {
        // Remove from following list
        userData.following = userData.following.filter(id => id !== userId);
        btn.textContent = 'Follow';
        btn.classList.remove('following');
    }

    localStorage.setItem('userData', JSON.stringify(userData));
    showMessage(btn.textContent === 'Following' ? 'Started following!' : 'Unfollowed');
}

// Handle invite button click
function handleInvite() {
    const inviteLink = generateInviteLink();
    
    if (navigator.share) {
        navigator.share({
            title: 'Join My Team!',
            text: 'Join my team and get 1000 coins bonus!',
            url: inviteLink
        })
        .then(() => showMessage('Invite shared!'))
        .catch(console.error);
    } else {
        navigator.clipboard.writeText(inviteLink)
            .then(() => showMessage('Invite link copied!'))
            .catch(console.error);
    }
}

// Helper functions
function calculateRank(coins) {
    const allPlayers = getGlobalLeaderboard();
    allPlayers.sort((a, b) => b.coins - a.coins);
    const rank = allPlayers.findIndex(p => p.coins <= coins) + 1;
    return rank || allPlayers.length + 1;
}

function calculateTeamBonus(friendCount) {
    return Math.min(friendCount * 5, 25); // 5% per friend, max 25%
}

function formatNumber(num) {
    if (num >= 1000000) return (num/1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num/1000).toFixed(1) + 'K';
    return num.toString();
}

function generateInviteLink() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return `${window.location.origin}/invite/${userData.id || 'default'}`;
}

function getGlobalLeaderboard() {
    // This would typically come from a server
    // For now, we'll use some sample data plus the current user
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userCoins = parseInt(localStorage.getItem('coinCount') || '0');

    return [
        { id: 'current', name: userData.name || 'You', coins: userCoins, avatar: userData.avatar },
        { id: '1', name: 'CryptoKing', coins: 1500000, avatar: 'img/avatar1.png' },
        { id: '2', name: 'BitQueen', coins: 1200000, avatar: 'img/avatar2.png' },
        { id: '3', name: 'BlockMaster', coins: 900000, avatar: 'img/avatar3.png' },
        { id: '4', name: 'CoinHunter', coins: 800000, avatar: 'img/avatar4.png' }
    ];
}

// Show message function
function showMessage(text) {
    const message = document.createElement('div');
    message.className = 'message';
    message.textContent = text;
    document.body.appendChild(message);

    setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => message.remove(), 300);
    }, 2000);
}

// Add message styles
const style = document.createElement('style');
style.textContent = `
    .message {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(46, 204, 113, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        transition: opacity 0.3s ease;
    }
    .message.fade-out {
        opacity: 0;
    }
`;
document.head.appendChild(style); 