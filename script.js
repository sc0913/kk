// ==========================================
// 0. 开始游戏封面逻辑
// ==========================================
const startScreen = document.getElementById('start-screen');
const mainGame = document.getElementById('main-game');
const startBtn = document.getElementById('start-btn');

function resetStartScreen() {
    if (startScreen && mainGame) {
        startScreen.classList.remove('fade-out', 'hidden');
        mainGame.classList.add('hidden');
    }
}
window.addEventListener('pageshow', function() { resetStartScreen(); });
if (startBtn) {
    startBtn.addEventListener('click', () => {
        startScreen.classList.add('fade-out');
        mainGame.classList.remove('hidden');
    });
}

// ==========================================
// 1. 加载 Footer 与 语言
// ==========================================
function applyLanguage(lang) {
    document.querySelectorAll('[data-en][data-zh]').forEach(el => { el.textContent = el.getAttribute('data-' + lang); });
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) langBtn.textContent = lang === 'zh' ? '🌐 Switch to EN' : '🌐 切换至中文';
    localStorage.setItem('site-lang', lang);
}

async function loadFooter() {
    try {
        const response = await fetch('footer.html');
        const htmlData = await response.text();
        const scriptTag = document.querySelector('script[src="script.js"]');
        if(scriptTag) scriptTag.insertAdjacentHTML('beforebegin', htmlData);
        else document.body.insertAdjacentHTML('beforeend', htmlData);
        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) {
            langBtn.addEventListener('click', () => {
                let currentLang = localStorage.getItem('site-lang') || 'zh';
                currentLang = currentLang === 'zh' ? 'en' : 'zh';
                applyLanguage(currentLang);
            });
        }
        applyLanguage(localStorage.getItem('site-lang') || 'zh');
    } catch (error) { console.error("Footer 加载失败。", error); }
}

// ==========================================
// 2. 全局数据与预设数据
// ==========================================
let gameData = JSON.parse(localStorage.getItem('game-data')) || {
    carrots: 0, burgers: 0, toys: 0, hunger: 50, happiness: 50, gardenPlots: [0, 0, 0, 0]
};
function saveGameData() { localStorage.setItem('game-data', JSON.stringify(gameData)); }

// 预设宠物数据生成器
function parsePreset(presetArray) {
    const colorMap = {
        '.': '#ffffff', 'B': '#000000', 'R': '#ff0000', 'G': '#00ff00', 
        'U': '#0000ff', 'Y': '#ffff00', 'P': '#ff00ff', 'O': '#f59e0b', 'C': '#22d3ee'
    };
    let colors = [];
    presetArray.forEach(row => {
        row.split('').forEach(char => colors.push(colorMap[char] || '#ffffff'));
    });
    return colors;
}

const presets = {
    alien: parsePreset([
        "................","................",".....BBBBBB.....","...BBUUUUUUBB...",
        "..BUUUUUUUUUUB..","..BUUUBUUUBUUB..","..BUUUBUUUBUUB..","..BUUUUUUUUUUB..",
        "..BUUUUUBUUUUB..","...BUUUUUUUUB...","....BBUUUUBB....","......BBBB......",
        "................","................","................","................"
    ]),
    cat: parsePreset([
        "................","..BB........BB..",".BOOB......BOOB.",".BOOOB....BOOOB.",
        ".BOOOOBBBBOOOOB.",".BOOOOOOOOOOOOB.",".BOOBOOOOOBOOOB.",".BOOOOOBBOOOOOB.",
        ".BOOOOOPPOOOOOOB",".BOOOOOOOOOOOOB.","..BOOOOOOOOOOB..","...BOOOOOOOOB...",
        "....BBBBBBBB....","................","................","................"
    ]),
    ghost: parsePreset([
        "................",".....BBBBBB.....","...BBCCCCCCBB...","..BCCCCCCCCCCB..",
        "..BCCCCCCCCCCB..",".BCCCCCCCCCCCCB.",".BCCBBCCCCBBCCB.",".BCCBBCCCCBBCCB.",
        ".BCCCCCCCCCCCCB.",".BCCCCBBBBCCCCB.",".BCCCCCCCCCCCCB.",".BCCCCCCCCCCCCB.",
        ".BCCBCCCCCCBCCB.",".BCCBCCCCCCBCCB.","..BB.BB.BB.BB...","................"
    ])
};

// ==========================================
// 3. 主页逻辑 (包含动画与反馈)
// ==========================================
const hungerBar = document.getElementById('hunger-bar');
const happyBar = document.getElementById('happy-bar');
const burgerCountEl = document.getElementById('burger-count');
const toyCountEl = document.getElementById('toy-count');
const petContainer = document.getElementById('pet-container');
const petBubble = document.getElementById('pet-bubble');

function updateHomeUI() {
    if (!hungerBar) return;
    gameData.hunger = Math.min(100, Math.max(0, gameData.hunger));
    gameData.happiness = Math.min(100, Math.max(0, gameData.happiness));
    hungerBar.style.width = gameData.hunger + '%';
    happyBar.style.width = gameData.happiness + '%';
    if(burgerCountEl) burgerCountEl.textContent = gameData.burgers;
    if(toyCountEl) toyCountEl.textContent = gameData.toys;
    saveGameData();
}

// 播放反馈动画与气泡
function showReaction(type) {
    if (!petContainer || !petBubble) return;
    
    // 移除之前的动画
    petContainer.classList.remove('animate-bounce', 'animate-shake');
    
    if (type === 'happy') {
        petBubble.textContent = '😋'; // 或者 😆
        petBubble.classList.remove('hidden');
        // 强制重排以重启动画
        void petContainer.offsetWidth; 
        petContainer.classList.add('animate-bounce');
        setTimeout(() => petBubble.classList.add('hidden'), 2000);
    } else if (type === 'angry') {
        petBubble.textContent = '😭'; // 或者 😡
        petBubble.classList.remove('hidden');
        void petContainer.offsetWidth;
        petContainer.classList.add('animate-shake');
        setTimeout(() => petBubble.classList.add('hidden'), 2000);
    }
}

const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');

if (feedBtn) {
    feedBtn.onclick = () => {
        if (gameData.burgers > 0) { 
            gameData.burgers--; gameData.hunger += 20; updateHomeUI(); 
            showReaction('happy');
        } else { 
            showReaction('angry');
            alert("没有汉堡了！快去菜园种菜，然后去商店兑换吧！"); 
        }
    };
}
if (playBtn) {
    playBtn.onclick = () => {
        if (gameData.toys > 0) { 
            gameData.toys--; gameData.happiness += 20; updateHomeUI(); 
            showReaction('happy');
        } else { 
            showReaction('angry');
            alert("没有玩具了！快去菜园种菜，然后去商店兑换吧！"); 
        }
    };
}

if (petContainer) {
    let savedColors = localStorage.getItem('my-pet-drawing');
    if (savedColors) {
        let colorsArray = JSON.parse(savedColors);
        if (colorsArray.length === 256) {
            colorsArray.forEach(color => {
                let cell = document.createElement('div'); cell.className = 'pet-render-cell';
                cell.style.backgroundColor = color; petContainer.appendChild(cell);
            });
        }
    } else {
        petContainer.style.display = 'flex'; petContainer.style.alignItems = 'center'; petContainer.style.justifyContent = 'center'; petContainer.style.fontSize = '60px'; petContainer.innerHTML = '👾';
    }
}
updateHomeUI();

// ==========================================
// 4. 商店逻辑
// ==========================================
const shopCarrotCountEl = document.getElementById('shop-carrot-count');
const buyButtons = document.querySelectorAll('.buy-btn');

if (shopCarrotCountEl) {
    function updateShopUI() { shopCarrotCountEl.textContent = gameData.carrots; }
    buyButtons.forEach(btn => {
        btn.onclick = () => {
            const itemType = btn.getAttribute('data-item');
            if (itemType === 'burger') {
                if (gameData.carrots >= 2) { gameData.carrots -= 2; gameData.burgers += 1; alert("兑换成功！获得 1 个汉堡 🍔"); } else { alert("胡萝卜不足！需要 2 个胡萝卜。"); }
            } else if (itemType === 'toy') {
                if (gameData.carrots >= 3) { gameData.carrots -= 3; gameData.toys += 1; alert("兑换成功！获得 1 个玩具 🧸"); } else { alert("胡萝卜不足！需要 3 个胡萝卜。"); }
            }
            saveGameData(); updateShopUI();
        };
    });
    updateShopUI();
}

// ==========================================
// 5. 菜园逻辑
// ==========================================
const gardenGrid = document.querySelector('.garden-grid');
if (gardenGrid) {
    const carrotCountEl = document.getElementById('carrot-count');
    function renderGarden() {
        if (carrotCountEl) carrotCountEl.textContent = gameData.carrots;
        document.querySelectorAll('.plot').forEach((el, index) => {
            el.classList.remove('sprout', 'mature'); el.innerHTML = '';
            if (gameData.gardenPlots[index] === 1) { el.classList.add('sprout'); el.innerHTML = '🌱'; } 
            else if (gameData.gardenPlots[index] === 2) { el.classList.add('mature'); el.innerHTML = '🥕'; }
        });
        saveGameData();
    }
    document.querySelectorAll('.plot').forEach(el => {
        el.addEventListener('click', () => {
            const index = parseInt(el.getAttribute('data-index'));
            if (gameData.gardenPlots[index] === 0) gameData.gardenPlots[index] = 1;
            else if (gameData.gardenPlots[index] === 1) gameData.gardenPlots[index] = 2;
            else if (gameData.gardenPlots[index] === 2) { gameData.carrots += 1; gameData.gardenPlots[index] = 0; }
            renderGarden();
        });
    });
    renderGarden();
}

// ==========================================
// 6. 画板与预设逻辑
// ==========================================
const pixelGrid = document.getElementById('pixel-grid');
if (pixelGrid) {
    let currentColor = '#000000';
    
    // 初始化画板
    for (let i = 0; i < 256; i++) {
        let cell = document.createElement('div'); cell.className = 'pixel-cell'; cell.style.backgroundColor = '#ffffff';
        cell.onmousedown = () => cell.style.backgroundColor = currentColor;
        cell.onmouseenter = (e) => { if (e.buttons === 1) cell.style.backgroundColor = currentColor; };
        pixelGrid.appendChild(cell);
    }

    // 预设按钮点击逻辑
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.onclick = () => {
            const presetType = btn.getAttribute('data-preset');
            const presetColors = presets[presetType];
            if (presetColors) {
                const cells = document.querySelectorAll('.pixel-cell');
                cells.forEach((cell, index) => {
                    cell.style.backgroundColor = presetColors[index];
                });
            }
        };
    });

    // 颜色选择
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.onclick = () => {
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            let c = swatch.getAttribute('data-color');
            currentColor = (c === 'transparent') ? '#ffffff' : c;
        };
    });

    // 清空
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.onclick = () => { document.querySelectorAll('.pixel-cell').forEach(c => c.style.backgroundColor = '#ffffff'); };
    
    // 保存
    const saveBtn = document.getElementById('save-pet-btn');
    if (saveBtn) {
        saveBtn.onclick = () => {
            let colors = []; document.querySelectorAll('.pixel-cell').forEach(c => colors.push(c.style.backgroundColor));
            localStorage.setItem('my-pet-drawing', JSON.stringify(colors)); window.location.href = 'index.html';
        };
    }
}

document.addEventListener('DOMContentLoaded', () => { loadFooter(); });