// ==========================================
// 1. 动态加载 Footer 与 语言切换逻辑
// ==========================================
function applyLanguage(lang) {
    document.querySelectorAll('[data-en][data-zh]').forEach(el => {
        el.textContent = el.getAttribute('data-' + lang);
    });
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.textContent = lang === 'zh' ? '🌐 Switch to EN' : '🌐 切换至中文';
    }
    localStorage.setItem('site-lang', lang);
}

async function loadFooter() {
    try {
        const response = await fetch('footer.html');
        const htmlData = await response.text();
        const scriptTag = document.querySelector('script[src="script.js"]');
        scriptTag.insertAdjacentHTML('beforebegin', htmlData);

        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) {
            langBtn.addEventListener('click', () => {
                let currentLang = localStorage.getItem('site-lang') || 'zh';
                currentLang = currentLang === 'zh' ? 'en' : 'zh';
                applyLanguage(currentLang);
            });
        }
        let currentLang = localStorage.getItem('site-lang') || 'zh';
        applyLanguage(currentLang);
    } catch (error) {
        console.error("Footer 加载失败，请用 Live Server 打开。", error);
    }
}

// ==========================================
// 2. 游戏全局数据 (胡萝卜、汉堡、玩具、宠物数值)
// ==========================================
let gameData = JSON.parse(localStorage.getItem('game-data')) || {
    carrots: 0,
    burgers: 0,
    toys: 0,
    hunger: 50,
    happiness: 50,
    gardenPlots: [0, 0, 0, 0] // 0空, 1发芽, 2成熟
};

function saveGameData() {
    localStorage.setItem('game-data', JSON.stringify(gameData));
}

// ==========================================
// 3. 主页逻辑 (index.html)
// ==========================================
const hungerBar = document.getElementById('hunger-bar');
const happyBar = document.getElementById('happy-bar');
const burgerCountEl = document.getElementById('burger-count');
const toyCountEl = document.getElementById('toy-count');

function updateHomeUI() {
    if (!hungerBar) return;
    
    // 限制数值在 0-100
    gameData.hunger = Math.min(100, Math.max(0, gameData.hunger));
    gameData.happiness = Math.min(100, Math.max(0, gameData.happiness));
    
    hungerBar.style.width = gameData.hunger + '%';
    happyBar.style.width = gameData.happiness + '%';
    
    // 更新库存显示
    if(burgerCountEl) burgerCountEl.textContent = gameData.burgers;
    if(toyCountEl) toyCountEl.textContent = gameData.toys;
    
    saveGameData();
}

const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');

if (feedBtn) {
    feedBtn.onclick = () => {
        if (gameData.burgers > 0) {
            gameData.burgers--;
            gameData.hunger += 20; // 吃汉堡加 20
            updateHomeUI();
        } else {
            alert("没有汉堡了！快去菜园种菜，然后去商店兑换吧！");
        }
    };
}

if (playBtn) {
    playBtn.onclick = () => {
        if (gameData.toys > 0) {
            gameData.toys--;
            gameData.happiness += 20; // 玩玩具加 20
            updateHomeUI();
        } else {
            alert("没有玩具了！快去菜园种菜，然后去商店兑换吧！");
        }
    };
}

// 渲染宠物图案
const renderArea = document.getElementById('pet-render-area');
if (renderArea) {
    let savedColors = localStorage.getItem('my-pet-drawing');
    if (savedColors) {
        let colorsArray = JSON.parse(savedColors);
        if (colorsArray.length === 256) {
            colorsArray.forEach(color => {
                let cell = document.createElement('div');
                cell.className = 'pet-render-cell';
                cell.style.backgroundColor = color;
                renderArea.appendChild(cell);
            });
        }
    } else {
        renderArea.style.display = 'flex';
        renderArea.style.alignItems = 'center';
        renderArea.style.justifyContent = 'center';
        renderArea.style.fontSize = '60px';
        renderArea.innerHTML = '👾';
    }
}
updateHomeUI();

// ==========================================
// 4. 商店逻辑 (shop.html)
// ==========================================
const shopCarrotCountEl = document.getElementById('shop-carrot-count');
const buyButtons = document.querySelectorAll('.buy-btn');

if (shopCarrotCountEl) {
    function updateShopUI() {
        shopCarrotCountEl.textContent = gameData.carrots;
    }
    
    buyButtons.forEach(btn => {
        btn.onclick = () => {
            const itemType = btn.getAttribute('data-item');
            
            if (itemType === 'burger') {
                if (gameData.carrots >= 2) {
                    gameData.carrots -= 2;
                    gameData.burgers += 1;
                    alert("兑换成功！获得 1 个汉堡 🍔");
                } else {
                    alert("胡萝卜不足！需要 2 个胡萝卜。");
                }
            } else if (itemType === 'toy') {
                if (gameData.carrots >= 3) {
                    gameData.carrots -= 3;
                    gameData.toys += 1;
                    alert("兑换成功！获得 1 个玩具 🧸");
                } else {
                    alert("胡萝卜不足！需要 3 个胡萝卜。");
                }
            }
            
            saveGameData();
            updateShopUI();
        };
    });
    
    updateShopUI();
}

// ==========================================
// 5. 菜园逻辑 (garden.html)
// ==========================================
const gardenGrid = document.querySelector('.garden-grid');
if (gardenGrid) {
    const carrotCountEl = document.getElementById('carrot-count');
    
    function renderGarden() {
        if (carrotCountEl) carrotCountEl.textContent = gameData.carrots;
        const plotElements = document.querySelectorAll('.plot');
        plotElements.forEach((el, index) => {
            el.classList.remove('sprout', 'mature');
            el.innerHTML = '';
            if (gameData.gardenPlots[index] === 1) {
                el.classList.add('sprout');
                el.innerHTML = '🌱';
            } else if (gameData.gardenPlots[index] === 2) {
                el.classList.add('mature');
                el.innerHTML = '🥕';
            }
        });
        saveGameData();
    }
    
    document.querySelectorAll('.plot').forEach(el => {
        el.addEventListener('click', () => {
            const index = parseInt(el.getAttribute('data-index'));
            if (gameData.gardenPlots[index] === 0) {
                gameData.gardenPlots[index] = 1;
            } else if (gameData.gardenPlots[index] === 1) {
                gameData.gardenPlots[index] = 2;
            } else if (gameData.gardenPlots[index] === 2) {
                gameData.carrots += 1;
                gameData.gardenPlots[index] = 0;
            }
            renderGarden();
        });
    });
    renderGarden();
}

// ==========================================
// 6. 画板保存逻辑 (editor.html)
// ==========================================
const pixelGrid = document.getElementById('pixel-grid');
if (pixelGrid) {
    let currentColor = '#000000';
    for (let i = 0; i < 256; i++) {
        let cell = document.createElement('div');
        cell.className = 'pixel-cell';
        cell.style.backgroundColor = '#ffffff';
        cell.onmousedown = () => cell.style.backgroundColor = currentColor;
        cell.onmouseenter = (e) => { if (e.buttons === 1) cell.style.backgroundColor = currentColor; };
        pixelGrid.appendChild(cell);
    }

    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.onclick = () => {
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            let c = swatch.getAttribute('data-color');
            currentColor = (c === 'transparent') ? '#ffffff' : c;
        };
    });

    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.onclick = () => {
            document.querySelectorAll('.pixel-cell').forEach(c => c.style.backgroundColor = '#ffffff');
        };
    }

    const saveBtn = document.getElementById('save-pet-btn');
    if (saveBtn) {
        saveBtn.onclick = () => {
            let colors = [];
            document.querySelectorAll('.pixel-cell').forEach(c => colors.push(c.style.backgroundColor));
            localStorage.setItem('my-pet-drawing', JSON.stringify(colors));
            window.location.href = 'index.html';
        };
    }
}

// ==========================================
// 7. 启动
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadFooter();
});