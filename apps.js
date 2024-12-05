document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progress');
    progressBar.style.width = '40%';
    const lionIcon = document.getElementById('lion-icon');
    const coinCountElement = document.getElementById('coin-count');
    const boostButton = document.querySelector('.boost-btn');
    const clickCounterElement = document.getElementById('current-clicks');
    
    let coinCount = 500;
    let coinsPerClick = 10;
    let isBoostActive = false;
    let boostTimeout;
    let touchCount = 0;
    let maxClicks = 8000;
    let currentClicks = maxClicks;
    let refillInterval;
    
    // Mission progress tracking
    let tapCount = 0;
    let earnedCoins = 0;
    let boostCount = 0;

    // Update mission progress in localStorage
    function updateMissionProgress() {
        const missionProgress = {
            tap100: tapCount,
            earn5000: earnedCoins,
            boost3: boostCount
        };
        localStorage.setItem('missionProgress', JSON.stringify(missionProgress));
    }

    // Boost button functionality
    boostButton.addEventListener('click', (event) => {
        event.preventDefault();
        
        if (!isBoostActive) {
            // Activate boost
            isBoostActive = true;
            coinsPerClick = 25;
            
            // Add active class for style change
            boostButton.classList.add('active');
            
            // Create particle effects
            createBoostParticles();
            
            // Show boost message
            showBoostMessage();
            
            // Set timeout to end boost
            boostTimeout = setTimeout(() => {
                endBoost();
            }, 30000);
        }
    });

    // Create boost particles
    function createBoostParticles() {
        const boostEffect = document.createElement('div');
        boostEffect.className = 'boost-active';
        document.body.appendChild(boostEffect);
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'boost-particles';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 1000 + 'ms';
            boostEffect.appendChild(particle);
        }
        
        setTimeout(() => boostEffect.remove(), 30000);
    }

    // End boost
    function endBoost() {
        isBoostActive = false;
        coinsPerClick = 10;
        boostButton.classList.remove('active');
        document.querySelector('.boost-active')?.remove();
    }

    // Show boost message
    function showBoostMessage() {
        const message = document.createElement('div');
        message.className = 'boost-message';
        message.textContent = 'BOOST ACTIVATED! (30s)';
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 3000);
    }

    // ট্লিক কাউন্ট আপডেট ফাংশন
    function updateClickCounter() {
        // প্তি ক্লিকে 10 করে কমবে
        currentClicks = Math.max(0, currentClicks - 10); // 0 এর নিচে যাবে না
        clickCounterElement.textContent = currentClicks;
        
        // যদি সব ক্লিক শেষ হয়ে যায়
        if (currentClicks <= 0) {
            lionIcon.style.pointerEvents = 'none';
            lionIcon.style.opacity = '0.5';
        }
    }

    // ক্লিক রিফিল ফাংশন
    function startRefilling() {
        clearInterval(refillInterval); // আগের ইন্টারভাল বন্ধ করা
        
        refillInterval = setInterval(() => {
            if (currentClicks < maxClicks) {
                // প্রতি সেকেন্ডে 1টি করে বাড়বে
                // 100 বাড়তে 100 সেকেন্ড = ~2 মিনিট লাগবে
                currentClicks = Math.min(maxClicks, currentClicks + 1);
                clickCounterElement.textContent = currentClicks;
                
                // যদি পূর্ণ হয়ে যায়
                if (currentClicks > 0) {
                    lionIcon.style.pointerEvents = 'auto';
                    lionIcon.style.opacity = '1';
                }
            }
        }, 1000); // প্রতি 1 সেকেন্ডে একবার চেক করবে
    }

    // টাচ ইভেন্ট
    lionIcon.addEventListener('touchstart', (event) => {
        event.preventDefault();
        
        // ক্লিক বাকি না থাকলে রিটার্ন
        if (currentClicks <= 0) return;
        
        touchCount = event.touches.length;
        lionIcon.classList.add('zoom');
        
        for(let i = 0; i < event.touches.length; i++) {
            if (currentClicks > 0) {
                const touch = event.touches[i];
                addCoins(touch.clientX, touch.clientY);
                updateClickCounter();
            }
        }

        // Update tap mission
        tapCount += event.touches.length;
        updateMissionProgress();
    });

    // টাচ শেষে রিফিল শুরু
    lionIcon.addEventListener('touchend', () => {
        setTimeout(() => {
            lionIcon.classList.remove('zoom');
        }, 300);
        touchCount = 0;
        startRefilling();
    });

    // ডেস্কটপ ক্লিক
    lionIcon.addEventListener('click', (event) => {
        if(event.pointerType !== 'touch') {
            if (currentClicks <= 0) return;
            
            lionIcon.classList.add('zoom');
            setTimeout(() => {
                lionIcon.classList.remove('zoom');
            }, 300);

            addCoins(event.clientX, event.clientY);
            updateClickCounter();
            startRefilling();

            // Update tap mission
            tapCount++;
            updateMissionProgress();
        }
    });

    // কয়েন যোগ করার ফাংশন
    function addCoins(x, y) {
        const coinDisplay = document.createElement('div');
        coinDisplay.classList.add('coin-display');
        
        // Boost অ্যাক্টিভ থাকলে টেক্সট রঙ পরিবর্তন
        if (isBoostActive) {
            coinDisplay.style.color = '#ff4444';
            coinDisplay.style.fontWeight = 'bold';
        }
        
        coinDisplay.textContent = `+${coinsPerClick}`;
        coinDisplay.style.left = `${x}px`;
        coinDisplay.style.top = `${y}px`;
        
        document.body.appendChild(coinDisplay);
        
        setTimeout(() => {
            coinDisplay.classList.add('show');
            setTimeout(() => {
                coinDisplay.remove();
            }, 500);
        }, 0);
        
        coinCount += coinsPerClick;
        coinCountElement.textContent = coinCount.toLocaleString();

        // Update earn mission
        earnedCoins += coinsPerClick;
        updateMissionProgress();
    }
});
