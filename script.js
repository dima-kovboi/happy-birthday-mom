document.addEventListener('DOMContentLoaded', () => {
    // Список пожеланий теперь находится прямо здесь, в JavaScript!
    const WISHES = [
        "Спасибо за твою бесконечную любовь и заботу!",
        "Ты самая лучшая мама на свете!",
        "Желаю тебе крепкого здоровья и море энергии!",
        "Пусть каждый твой день будет солнечным и радостным!",
        "Твои советы — мой главный компас в жизни.",
        "Желаю тебе почаще отдыхать и улыбаться!",
        "Пусть все твои мечты сбываются!",
        "Оставайся всегда такой же молодой и красивой!"
    ];

    // --- Весь остальной код остается таким же, как и был ---
    const gameContainer = document.getElementById('game-container');
    const wheelContainer = document.getElementById('wheel-container');
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const phraseDisplay = document.getElementById('phrase-display');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetWidth * 0.75;

    const targetPhrase = "МАМА, С ДНЕМ РОЖДЕНИЯ!";
    const gamePhrase = targetPhrase.replace(/[^А-Я]/g, "");

    let letters = [];
    let displayState = [];
    const catcher = { x: canvas.width / 2 - 50, y: canvas.height - 20, width: 100, height: 10 };
    let gameActive = true;
    let particles = [];

    function setupGame() {
        letters = gamePhrase.split('').map((char, index) => ({ char, x: Math.random()*(canvas.width-20), y: -40*(index+Math.random()), speed: (canvas.height/400)+Math.random()*1.5 }));
        displayState = targetPhrase.split('').map(char => ({ char, revealed: !char.match(/[А-Я]/) }));
        updatePhraseDisplay();
    }
    function handleMove(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const rect = canvas.getBoundingClientRect();
        catcher.x = clientX - rect.left - catcher.width / 2;
        if (catcher.x < 0) catcher.x = 0;
        if (catcher.x + catcher.width > canvas.width) catcher.x = canvas.width - catcher.width;
        if (e.preventDefault) e.preventDefault();
    }
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchstart', handleMove, { passive: false });
    function updatePhraseDisplay() { phraseDisplay.innerHTML = displayState.map(item => item.revealed ? `<span>${item.char}</span>` : '<span>_</span>').join(''); }
    function gameLoop() {
        if (!gameActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#9bf6ff'; ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);
        ctx.fillStyle = '#fdffb6'; ctx.font = '24px Arial';
        letters.forEach((letter, index) => {
            letter.y += letter.speed; ctx.fillText(letter.char, letter.x, letter.y);
            if (letter.y > catcher.y - 10 && letter.y < catcher.y + 10 && letter.x > catcher.x - 10 && letter.x < catcher.x + catcher.width + 10) {
                const firstUnrevealedIndex = displayState.findIndex(item => !item.revealed && item.char === letter.char);
                if (firstUnrevealedIndex !== -1) { displayState[firstUnrevealedIndex].revealed = true; letters.splice(index, 1); updatePhraseDisplay(); }
            }
            if (letter.y > canvas.height) { letter.y = -40; letter.x = Math.random() * (canvas.width - 20); }
        });
        if (displayState.every(item => item.revealed)) { gameActive = false; triggerWinAnimation(); }
        requestAnimationFrame(gameLoop);
    }
    function triggerWinAnimation() {
        const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff"];
        for (let i = 0; i < 100; i++) { particles.push({ x: canvas.width / 2, y: canvas.height / 2, vx: (Math.random()-0.5)*8, vy: (Math.random()-0.5)*8, alpha: 1, color: colors[Math.floor(Math.random()*colors.length)] }); }
        winAnimationLoop(); setTimeout(transitionToWheel, 2000);
    }
    function winAnimationLoop() {
        ctx.fillStyle = 'rgba(26, 42, 76, 0.25)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, index) => { p.x += p.vx; p.y += p.vy; p.alpha -= 0.02; if (p.alpha <= 0) particles.splice(index, 1); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill(); });
        ctx.globalAlpha = 1; if (particles.length > 0) requestAnimationFrame(winAnimationLoop);
    }
    function transitionToWheel() { gameContainer.classList.add('hidden'); wheelContainer.classList.remove('hidden'); }

    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spin-button');
    const wishDisplay = document.getElementById('wish-display');
    let currentRotation = 0;

    spinButton.addEventListener('click', () => {
        spinButton.disabled = true;
        wishDisplay.textContent = "...";

        // *** ИЗМЕНЕНИЕ ЗДЕСЬ: Вместо fetch, просто берем случайное пожелание из списка WISHES ***
        const wish = WISHES[Math.floor(Math.random() * WISHES.length)];

        const randomDegrees = 1440 + Math.floor(Math.random() * 360);
        currentRotation += randomDegrees;
        wheel.style.transform = `rotate(${currentRotation}deg)`;

        setTimeout(() => {
            wishDisplay.textContent = wish;
            spinButton.disabled = false;
        }, 4000);
    });

    setupGame();
    gameLoop();
});