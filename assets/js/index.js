// 檢查 URL 是否安全的函數
function isTrustedUrl(url) {
    const trustedDomains = ['docs.google.com', 'drive.google.com'];
    try {
        const urlObj = new URL(url);
        return trustedDomains.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain));
    } catch (e) {
        return false;
    }
}

// 為下拉選單項目添加點擊事件
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault(); // 防止預設連結行為
        const url = this.getAttribute('data-url'); // 獲取 data-url 屬性
        const pastContent = document.getElementById('pastContent'); // 內容區域
        const placeholder = document.getElementById('pastContentPlaceholder'); // 佔位符

        // 驗證 URL 是否安全
        if (!isTrustedUrl(url)) {
            console.error('不安全的 URL:', url);
            pastContent.innerHTML = '<p class="text-center text-danger">無效或不安全的連結，請檢查。</p>';
            return;
        }

        // 隱藏佔位符
        placeholder.classList.add('d-none');

        // 檢查是否為 Google Drive 文件夾連結
        if (url.includes('drive.google.com/drive/folders')) {
            // 在新分頁開啟 Google Drive 連結
            window.open(url, '_blank');
            // 更新內容區域，提示用戶已開啟新分頁
            pastContent.innerHTML = '<p class="text-center">已開啟 Google Drive 文件夾，請檢查新分頁。</p>';
        } else {
            // 創建 iframe 並設置屬性以嵌入 Google Sheets
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.width = '100%';
            iframe.height = '600px';
            iframe.name = 'pastFrame';
            iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts'); // 限制 iframe 權限
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin'); // 限制引用者信息
            iframe.setAttribute('frameborder', '0'); // 移除邊框

            // 清空容器並添加 iframe
            pastContent.innerHTML = '';
            pastContent.appendChild(iframe);
        }
    });
});