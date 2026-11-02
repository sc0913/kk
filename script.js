// ==========================================
// 1. 动态加载 Footer 与 语言切换逻辑
// ==========================================
function applyLanguage(lang) {
    // 遍历页面上所有带 data-en 和 data-zh 的元素
    document.querySelectorAll('[data-en][data-zh]').forEach(el => {
        el.textContent = el.getAttribute('data-' + lang);
    });
    
    // 更新切换按钮的文字
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.textContent = lang === 'zh' ? '🌐 Switch to EN' : '🌐 切换至中文';
    }
    localStorage.setItem('site-lang', lang);
}

async function loadFooter() {
    try {
        // 请求 footer.html
        const response = await fetch('footer.html');
        const htmlData = await response.text();
        
        // 把 footer 插入到 script 标签前面
        const scriptTag = document.querySelector('script[src="script.js"]');
        scriptTag.insertAdjacentHTML('beforebegin', htmlData);

        // Footer 插入后，给语言按钮绑定事件
        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) {
            langBtn.addEventListener('click', () => {
                let currentLang = localStorage.getItem('site-lang') || 'zh';
                currentLang = currentLang === 'zh' ? 'en' : 'zh';
                applyLanguage(currentLang);
            });
        }

        // 初始化应用语言
        let currentLang = localStorage.getItem('site-lang') || 'zh';
        applyLanguage(currentLang);

    } catch (error) {
        console.error("Footer 加载失败！请确保使用 Live Server 打开。", error);
    }
}

// ==========================================
// 2. 主页数值逻辑 (index.html)
// ==========================================
let stats = JSON.parse(localStorage.getItem('pet-stats')) || { hunger: 50, happiness: 50 };
const hungerBar = document.getElementById('hunger-bar');
const happyBar = document.getElementById('happy-bar');

function updateBars() {
    if (!hungerBar || !happyBar) return;
    stats.hunger = Math.min(100, Math.max(0, stats.hunger));
    stats.happiness = Math.min(100, Math.max(0, stats.happiness));
    hungerBar.style.width = stats.hunger + '%';
    happyBar.style.width = stats.happiness + '%';
    localStorage.setItem('pet-stats', JSON.stringify(stats));
}

const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');
if (feedBtn) feedBtn.onclick = () => { stats.hunger += 10; updateBars(); };
if (playBtn) playBtn.onclick = () => { stats.happiness += 10; updateBars(); };
updateBars();

// ==========================================
// 3. 画板保存逻辑 (editor.html)
// ==========================================
const pixelGrid = document.getElementById('pixel-grid');

if (pixelGrid) {
    let currentColor = '#000000';
    
    // 生成 16x16 网格
    for (let i = 0; i < 256; i++) {
        let cell = document.createElement('div');
        cell.className = 'pixel-cell';
        cell.style.backgroundColor = '#ffffff';
        
        cell.onmousedown = () => cell.style.backgroundColor = currentColor;
        cell.onmouseenter = (e) => { if (e.buttons === 1) cell.style.backgroundColor = currentColor; };
        
        pixelGrid.appendChild(cell);
    }

    // 调色板
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
    if (clearBtn) {
        clearBtn.onclick = () => {
            document.querySelectorAll('.pixel-cell').forEach(c => c.style.backgroundColor = '#ffffff');
        };
    }

    // 保存
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

// 渲染画好的宠物 (index.html)
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
        // 默认显示外星人
        renderArea.style.display = 'flex';
        renderArea.style.alignItems = 'center';
        renderArea.style.justifyContent = 'center';
        renderArea.style.fontSize = '60px';
        renderArea.innerHTML = '👾';
    }
}

// ==========================================
// 4. 菜园种菜逻辑 (garden.html)
// ==========================================
const gardenGrid = document.querySelector('.garden-grid');
if (gardenGrid) {
    let plots = JSON.parse(localStorage.getItem('garden-plots')) || [0, 0, 0, 0];
    let carrots = parseInt(localStorage.getItem('garden-carrots')) || 0;
    const carrotCountEl = document.getElementById('carrot-count');
    
    function renderGarden() {
        if (carrotCountEl) carrotCountEl.textContent = carrots;
        const plotElements = document.querySelectorAll('.plot');
        plotElements.forEach((el, index) => {
            el.classList.remove('sprout', 'mature');
            el.innerHTML = '';
            if (plots[index] === 1) {
                el.classList.add('sprout');
                el.innerHTML = '🌱';
            } else if (plots[index] === 2) {
                el.classList.add('mature');
                el.innerHTML = '🥕';
            }
        });
        localStorage.setItem('garden-plots', JSON.stringify(plots));
        localStorage.setItem('garden-carrots', carrots);
    }
    
    document.querySelectorAll('.plot').forEach(el => {
        el.addEventListener('click', () => {
            const index = parseInt(el.getAttribute('data-index'));
            if (plots[index] === 0) plots[index] = 1;
            else if (plots[index] === 1) plots[index] = 2;
            else if (plots[index] === 2) { carrots += 1; plots[index] = 0; }
            renderGarden();
        });
    });
    renderGarden();
}

// ==========================================
// 5. 启动所有功能
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadFooter(); // 页面加载时动态拉取 Footer
});