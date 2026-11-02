// 1. 获取切换按钮
const langToggleBtn = document.getElementById('lang-toggle');

// 2. 从本地存储获取语言，如果没有则默认中文 'zh'
let currentLang = localStorage.getItem('site-lang') || 'zh';

// 3. 核心翻译函数
function updateLanguage(lang) {
    // 找到所有带有 data-en 和 data-zh 的元素
    const elementsToTranslate = document.querySelectorAll('[data-en][data-zh]');
    
    // 遍历并替换文本
    elementsToTranslate.forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });

    // 更新按钮上的字
    langToggleBtn.textContent = lang === 'zh' ? '🌐 Switch to EN' : '🌐 切换至中文';

    // 保存当前语言到本地存储
    localStorage.setItem('site-lang', lang);
}

// 4. 点击按钮时切换
langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    updateLanguage(currentLang);
});

// 5. 页面刚加载时，立刻应用一次当前语言
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(currentLang);
});