// ==========================================
// 1. 多语言切换逻辑 (i18n)
// ==========================================
const langToggleBtn = document.getElementById('lang-toggle');
let currentLang = localStorage.getItem('site-lang') || 'zh';

function updateLanguage(lang) {
    const elementsToTranslate = document.querySelectorAll('[data-en][data-zh]');
    elementsToTranslate.forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
    if (langToggleBtn) {
        langToggleBtn.textContent = lang === 'zh' ? '🌐 Switch to EN' : '🌐 切换至中文';
    }
    localStorage.setItem('site-lang', lang);
}

if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        updateLanguage(currentLang);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(currentLang);
});


// ==========================================
// 2. 主页宠物状态与互动逻辑 (index.html)
// ==========================================
let petStats = JSON.parse(localStorage.getItem('pet-stats')) || {
    hunger: 50,
    happiness: 50
};

const hungerBar = document.getElementById('hunger-bar');
const happyBar = document.getElementById('happy-bar');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');

function renderStats() {
    if (!hungerBar || !happyBar) return;

    if (petStats.hunger > 100) petStats.hunger = 100;
    if (petStats.hunger < 0) petStats.hunger = 0;
    if (petStats.happiness > 100) petStats.happiness = 100;
    if (petStats.happiness < 0) petStats.happiness = 0;

    hungerBar.style.width = petStats.hunger + '%';
    happyBar.style.width = petStats.happiness + '%';

    localStorage.setItem('pet-stats', JSON.stringify(petStats));
}

if (feedBtn && playBtn) {
    feedBtn.addEventListener('click', () => {
        petStats.hunger += 10;
        renderStats();
    });

    playBtn.addEventListener('click', () => {
        petStats.happiness += 10;
        renderStats();
    });
}
renderStats();


// ==========================================
// 3. 画板逻辑 (editor.html)
// ==========================================
const pixelGrid = document.getElementById('pixel-grid');

if (pixelGrid) {
    const gridSize = 16;
    let currentColor = '#000000';

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('pixel-cell');
        
        cell.addEventListener('mousedown', () => {
            cell.style.backgroundColor = currentColor;
        });
        
        cell.addEventListener('mouseenter', (e) => {
            if (e.buttons === 1) {
                cell.style.backgroundColor = currentColor;
            }
        });

        pixelGrid.appendChild(cell);
    }

    const swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            swatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            
            const colorValue = swatch.getAttribute('data-color');
            if (colorValue === 'transparent') {
                currentColor = '#ffffff';
            } else {
                currentColor = colorValue;
            }
        });
    });

    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const cells = document.querySelectorAll('.pixel-cell');
            cells.forEach(cell => {
                cell.style.backgroundColor = '#ffffff';
            });
        });
    }
}