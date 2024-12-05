// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;

// Connect to Telegram
async function connectTelegram() {
    try {
        const telegramId = tg.initDataUnsafe?.user?.id;
        if (!telegramId) {
            throw new Error('Not opened in Telegram');
        }

        const response = await fetch('http://your-api/api/connect-telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ telegramId })
        });

        const data = await response.json();
        if (data.success) {
            // Store Telegram connection in localStorage
            localStorage.setItem('telegramConnected', 'true');
            localStorage.setItem('telegramId', telegramId);
        }
    } catch (error) {
        console.error('Error connecting to Telegram:', error);
    }
}

// Send mission updates to Telegram
async function updateMissionProgress(missionType, reward) {
    const telegramId = localStorage.getItem('telegramId');
    if (!telegramId) return;

    try {
        await fetch('http://your-api/api/complete-mission', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                telegramId,
                missionType,
                reward
            })
        });
    } catch (error) {
        console.error('Error updating mission:', error);
    }
}

// Check if connected to Telegram
function isTelegramConnected() {
    // Check if running inside Telegram WebApp
    if (!window.Telegram.WebApp) {
        console.log('Not running in Telegram WebApp');
        return false;
    }

    // Get user data
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    if (user) {
        console.log('Connected to Telegram as:', user.username || user.id);
        // Show user info on page
        displayTelegramUser(user);
        return true;
    }

    console.log('Not connected to Telegram');
    return false;
}

// Display Telegram user info
function displayTelegramUser(user) {
    // Update profile section with Telegram info
    const profileSection = document.querySelector('.profile-section');
    if (profileSection) {
        const userNameElement = profileSection.querySelector('strong');
        if (userNameElement) {
            userNameElement.textContent = user.username || 'Telegram User';
        }
    }

    // You can also show a connection status
    const connectionStatus = document.createElement('div');
    connectionStatus.className = 'telegram-status';
    connectionStatus.innerHTML = `
        <span class="status-dot connected"></span>
        Connected to Telegram
    `;
    document.querySelector('.container').appendChild(connectionStatus);
}

// Add this to your existing CSS
const styles = `
.telegram-status {
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.7);
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 12px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 5px;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-dot.connected {
    background: #2ecc71;
    box-shadow: 0 0 5px #2ecc71;
}
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Check connection when page loads
document.addEventListener('DOMContentLoaded', () => {
    isTelegramConnected();
}); 