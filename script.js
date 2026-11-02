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
// 3. 画板逻辑 (editor.html) + 保存功能
// ==========================================
const pixelGrid = document.getElementById('pixel-grid');

if (pixelGrid) {
    console.log("画板初始化成功");
    const gridSize = 16;
    let currentColor = '#000000';

    // 生成 256 个格子
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('pixel-cell');
        // 强制给个白色底色，方便后面读取
        cell.style.backgroundColor = '#ffffff'; 
        
        // 点击涂色
        cell.addEventListener('mousedown', () => {
            cell.style.backgroundColor = currentColor;
        });
        
        // 拖拽涂色
        cell.addEventListener('mouseenter', (e) => {
            if (e.buttons === 1) {
                cell.style.backgroundColor = currentColor;
            }
        });

        pixelGrid.appendChild(cell);
    }

    // 调色板逻辑
    const swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            swatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            
            const colorValue = swatch.getAttribute('data-color');
            currentColor = colorValue === 'transparent' ? '#ffffff' : colorValue;
        });
    });

    // 清空按钮
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const cells = document.querySelectorAll('.pixel-cell');
            cells.forEach(cell => {
                cell.style.backgroundColor = '#ffffff';
            });
        });
    }

    // 保存按钮
    const saveBtn = document.getElementById('save-pet-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            console.log("点击了保存按钮");
            const cells = document.querySelectorAll('.pixel-cell');
            const pixelData = [];
            
            // 遍历所有格子，把颜色提取出来
            cells.forEach(cell => {
                // 为了兼容性，统一转成小写的 RGB 格式，或者直接存 hex
                // 这里我们直接存 style.backgroundColor
                pixelData.push(cell.style.backgroundColor || '#ffffff');
            });

            try {
                // 存入 localStorage
                localStorage.setItem('saved-pet-pixels', JSON.stringify(pixelData));
                console.log("保存成功，数据长度:", pixelData.length);
                
                // 提示并跳转回主页
                alert(currentLang === 'zh' ? '宠物保存成功！即将返回主页...' : 'Pet saved! Returning to Console...');
                window.location.href = 'index.html';
            } catch (error) {
                console.error("保存失败:", error);
                alert("保存失败，请查看控制台报错。");
            }
        });
    } else {
        console.error("找不到保存按钮 #save-pet-btn");
    }
}


// ==========================================
// 4. 主页渲染用户画的宠物 (index.html)
// ==========================================
const petRenderArea = document.getElementById('pet-render-area');

if (petRenderArea) {
    console.log("主页渲染区已找到");
    const savedPixels = JSON.parse(localStorage.getItem('saved-pet-pixels'));

    if (savedPixels && savedPixels.length === 256) {
        console.log("找到了保存的宠物数据，开始渲染");
        for (let i = 0; i < 256; i++) {
            const cell = document.createElement('div');
            cell.classList.add('pet-render-cell');
            cell.style.backgroundColor = savedPixels[i];
            petRenderArea.appendChild(cell);
        }
    } else {
        console.log("没有找到保存的宠物数据，显示默认 Emoji");
        petRenderArea.style.display = 'flex';
        petRenderArea.style.justifyContent = 'center';
        petRenderArea.style.alignItems = 'center';
        petRenderArea.style.fontSize = '60px';
        petRenderArea.style.backgroundColor = 'transparent';
        petRenderArea.innerHTML = '👾';
    }
}