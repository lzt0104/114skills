// 可信任的 iframe 來源白名單
const trustedDomains = [
    'https://docs.google.com'
];

// 驗證 URL 是否來自可信任的域名
function isTrustedUrl(url) {
    try {
        const urlObj = new URL(url);
        return trustedDomains.some(domain => url.startsWith(domain));
    } catch (e) {
        return false;
    }
}

// 為下拉選單項目添加點擊事件
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const url = this.getAttribute('data-url');

        // 驗證 URL 是否安全
        if (!isTrustedUrl(url)) {
            console.error('不安全的 URL:', url);
            return;
        }

        // 創建 iframe 並設置屬性
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = '100%';
        iframe.height = '600px';
        iframe.name = 'pastFrame';
        iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts'); // 限制 iframe 權限
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin'); // 限制引用者信息

        // 清空容器並添加 iframe
        const container = document.getElementById('pastContent');
        container.innerHTML = '';
        container.appendChild(iframe);
    });
});