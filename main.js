const GAMES = [
    {
        id: 'snake',
        title: 'Neon Snake',
        category: 'Arcade',
        description: 'Classic snake with a neon twist. Grow as long as possible.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-2 2.5h3L12 7h3L11 11h3L12 15h3L11 19h3l-2 3"/></svg>',
        color: 'from-emerald-500/20 to-emerald-900/20',
        type: 'internal'
    },
    {
        id: 'clicker',
        title: 'Energy Clicker',
        category: 'Idle',
        description: 'Generate energy, buy upgrades, and build an empire.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/></svg>',
        color: 'from-rose-500/20 to-rose-900/20',
        type: 'internal'
    },
    {
        id: 'tetris',
        title: 'Tetris',
        category: 'Puzzle',
        description: 'The world-famous puzzle game that everyone knows.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10h4v4h-4z"/><path d="M14 10h4v4h-4z"/><path d="M6 10h4v4H6z"/><path d="M10 6h4v4h-4z"/></svg>',
        color: 'from-blue-500/20 to-blue-900/20',
        type: 'iframe',
        url: 'https://tetris.com/play-tetris'
    },
    {
        id: 'pacman',
        title: 'Pac-Man',
        category: 'Arcade',
        description: 'Guide Pac-Man through the maze and eat all the dots.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12a9 9 0 1 0-9-9l9 9Z"/></svg>',
        color: 'from-yellow-500/20 to-yellow-900/20',
        type: 'iframe',
        url: 'https://www.google.com/logos/2010/pacman10-i.html'
    }
];

let activeCategory = 'All';
let searchQuery = '';

function init() {
    renderCategories();
    renderGames();
    
    document.getElementById('gameSearch').addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderGames();
    });
}

function renderCategories() {
    const categories = ['All', ...new Set(GAMES.map(g => g.category))];
    const container = document.getElementById('categoryFilters');
    container.innerHTML = categories.map(cat => `
        <button onclick="setCategory('${cat}')" class="category-btn px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}">
            ${cat}
        </button>
    `).join('');
}

function setCategory(cat) {
    activeCategory = cat;
    renderCategories();
    renderGames();
}

function renderGames() {
    const grid = document.getElementById('gameGrid');
    const filtered = GAMES.filter(g => {
        const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = activeCategory === 'All' || g.category === activeCategory;
        return matchesSearch && matchesCat;
    });

    grid.innerHTML = filtered.map(game => `
        <div onclick="openGame('${game.id}')" class="group cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden transition-all hover:border-emerald-500/50 hover:-translate-y-2 relative">
            <div class="h-48 bg-gradient-to-br ${game.color} flex items-center justify-center relative overflow-hidden">
                <div class="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
                <div class="relative z-10 p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 text-white">
                    ${game.icon}
                </div>
            </div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-black uppercase tracking-tighter">${game.title}</h3>
                    <span class="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">${game.category}</span>
                </div>
                <p class="text-zinc-500 text-sm mb-4 line-clamp-2 leading-relaxed">${game.description}</p>
                <div class="flex items-center justify-end">
                    <span class="text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Play Now ➜
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

function openGame(id) {
    const game = GAMES.find(g => g.id === id);
    if (!game) return;

    const modal = document.getElementById('gameModal');
    const content = document.getElementById('modalContent');
    const title = document.getElementById('modalTitle');
    const icon = document.getElementById('modalIcon');

    title.innerText = game.title;
    icon.innerHTML = game.icon.replace('48', '24').replace('48', '24');
    
    if (game.type === 'iframe') {
        content.innerHTML = `<iframe src="${game.url}" class="w-full h-full border-0 rounded-xl bg-white" allowfullscreen></iframe>`;
    } else if (game.id === 'snake') {
        content.innerHTML = `<canvas id="snakeCanvas" width="400" height="400" class="bg-zinc-950 rounded-lg border-4 border-zinc-800"></canvas>`;
        startSnake();
    } else if (game.id === 'clicker') {
        content.innerHTML = `
            <div class="flex flex-col items-center gap-8 w-full">
                <div class="text-center">
                    <h2 id="clickCount" class="text-6xl font-black text-white tracking-tighter">0</h2>
                    <p class="text-zinc-500 font-mono uppercase text-sm tracking-widest">Energy Generated</p>
                </div>
                <button onclick="clickEnergy()" class="w-48 h-48 rounded-full bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] flex items-center justify-center border-8 border-zinc-800 hover:scale-105 active:scale-95 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </button>
            </div>
        `;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('gameModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.getElementById('modalContent').innerHTML = '';
}

function scrollToGames() {
    document.getElementById('gameGrid').scrollIntoView({ behavior: 'smooth' });
}

// --- SNAKE GAME LOGIC ---
function startSnake() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const box = 20;
    let snake = [{ x: 9 * box, y: 10 * box }];
    let direction = 'RIGHT';
    let food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
    let score = 0;

    document.addEventListener('keydown', (e) => {
        if (e.keyCode == 37 && direction != 'RIGHT') direction = 'LEFT';
        else if (e.keyCode == 38 && direction != 'DOWN') direction = 'UP';
        else if (e.keyCode == 39 && direction != 'LEFT') direction = 'RIGHT';
        else if (e.keyCode == 40 && direction != 'UP') direction = 'DOWN';
    });

    function draw() {
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i == 0 ? '#10b981' : '#059669';
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            ctx.strokeStyle = '#050505';
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
        ctx.fill();

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (direction == 'LEFT') snakeX -= box;
        if (direction == 'UP') snakeY -= box;
        if (direction == 'RIGHT') snakeX += box;
        if (direction == 'DOWN') snakeY += box;

        if (snakeX == food.x && snakeY == food.y) {
            score += 10;
            document.getElementById('highScore').innerText = score;
            food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
        } else {
            snake.pop();
        }

        let newHead = { x: snakeX, y: snakeY };

        if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
            clearInterval(game);
            alert('Game Over! Score: ' + score);
            closeModal();
        }

        snake.unshift(newHead);
    }

    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x == array[i].x && head.y == array[i].y) return true;
        }
        return false;
    }

    let game = setInterval(draw, 100);
}

// --- CLICKER GAME LOGIC ---
let clicks = 0;
function clickEnergy() {
    clicks++;
    document.getElementById('clickCount').innerText = clicks;
    document.getElementById('highScore').innerText = clicks;
}

init();
