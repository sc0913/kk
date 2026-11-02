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
    langToggleBtn.textContent = lang === 'zh' ? '🌐 Switch to EN' : '🌐 切换至中文';
    localStorage.setItem('site-lang', lang);
}

langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    updateLanguage(currentLang);
});

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(currentLang);
});


// ==========================================
// 2. 宠物状态与互动逻辑
// ==========================================
// 从浏览器获取保存的数据，如果没有，默认饥饿度和快乐度都是 50
let petStats = JSON.parse(localStorage.getItem('pet-stats')) || {
    hunger: 50,
    happiness: 50
};

// 获取页面上的 DOM 元素
const hungerBar = document.getElementById('hunger-bar');
const happyBar = document.getElementById('happy-bar');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');

// 渲染进度条宽度
function renderStats() {
    // 确保数值不会低于0或高于100
    if (petStats.hunger > 100) petStats.hunger = 100;
    if (petStats.hunger < 0) petStats.hunger = 0;
    if (petStats.happiness > 100) petStats.happiness = 100;
    if (petStats.happiness < 0) petStats.happiness = 0;

    hungerBar.style.width = petStats.hunger + '%';
    happyBar.style.width = petStats.happiness + '%';

    // 把最新数据保存到浏览器
    localStorage.setItem('pet-stats', JSON.stringify(petStats));
}

// 喂食按钮点击事件
feedBtn.addEventListener('click', () => {
    petStats.hunger += 10; // 每次增加 10%
    renderStats();
});

// 玩耍按钮点击事件
playBtn.addEventListener('click', () => {
    petStats.happiness += 10; // 每次增加 10%
    renderStats();
});

// 页面刚加载时，立刻渲染一次状态
renderStats();