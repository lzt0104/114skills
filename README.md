# 114學年技優甄審社群網站

![image](https://github.com/user-attachments/assets/758d8777-664d-4948-8752-858746c560a9)

## 專案概述

114學年技優甄審社群網站是一個專為技優甄審學生打造的開源平台，旨在提供歷屆甄審資料、學習歷程參考範例以及LINE社群互助資源，幫助學生在升學路上更順利。本網站以教育為目的，透過現代網頁技術實現響應式設計與安全內容管理，適合學生、教師及相關人士參考使用。

## 功能特色

- **歷屆甄審資料**：整合111至113學年的技優甄審數據，透過嵌入式Google Sheets iframe展示，方便查閱。
- **學習歷程參考**：提供多類別PDF範例（B課程學習成果、C多元表現等），支援懶加載與分頁瀏覽，確保高效能體驗。
- **LINE互助社群**：連結至官方LINE群組，促進學生間的即時交流與經驗分享。
- **響應式設計**：基於Bootstrap 5與自訂CSS，適配桌面與行動裝置。
- **安全措施**：採用Content Security Policy (CSP)、iframe沙盒限制及URL白名單，保障內容安全。

## 技術堆疊

- **前端框架**：Bootstrap 5.3.3（CSS與JS）
- **字型**：Google Fonts - Noto Sans TC
- **PDF渲染**：PDF.js（3.11.174）
- **JavaScript**：原生JS，支援懶加載與非同步PDF處理
- **CSS**：自訂樣式，導入變數管理與響應式佈局
- **內容安全**：CSP、X-Frame-Options、X-Content-Type-Options
- **外部資源**：CDN（jsDelivr、Google Fonts）

## 專案結構

```
├── assets/
│   ├── css/
│   │   ├── index.css        # 首頁樣式
│   │   └── ref.css         # 備審資料頁樣式
│   ├── images/
│   │   ├── IMG_4987.JPG    # 創辦人照片
│   │   └── cta-background.jpg  # CTA背景圖（可選）
│   ├── js/
│   │   ├── index.js        # 首頁互動邏輯
│   │   └── ref.js         # 備審資料頁邏輯
│   └── pdfs/
│       ├── b/             # B課程學習成果PDF
│       ├── c/             # C多元表現PDF
│       ├── d1/            # D-1多元表現綜整心得PDF
│       ├── d2/            # D-2學習歷程自述PDF
│       └── d3/            # D-3其他有利審查資料PDF
├── index.html             # 首頁
├── reference.html         # 備審資料頁
└── README.md              # 本文件
```


## 使用說明

1. **首頁**：
   - 瀏覽核心服務（歷屆資料、學習歷程、LINE社群）。
   - 點擊「歷屆資料」下拉選單，選擇學年度以載入Google Sheets iframe。
   - 點擊「加入LINE社群」連結至官方群組。

2. **備審資料頁**：
   - 同意免責聲明後，查看分類PDF列表（B、C、D1、D2、D3）。
   - 點擊側邊欄分類切換內容，使用分頁按鈕瀏覽更多PDF。
   - PDF支援觸控滑動切換頁面（行動裝置）與按鈕導航。

3. **注意事項**：
   - 所有PDF僅供參考，嚴禁複製或用於商業用途。
   - 網站需連線以載入外部資源（Google Fonts、CDN等）。

## 開源聲明

本專案採用 **MIT許可證** 開源，歡迎任何人自由使用、修改與分發，惟需遵守以下條款：

- **版權聲明**：© 2025 114學年技優甄審社群。本專案僅為教育目的，與任何原始項目無關。
- **限制**：網站內的PDF檔案及其他資源（如圖片）可能受原作者版權保護，僅限學習用途，禁止複製、下載、列印或商業使用。
- **貢獻**：歡迎提交Pull Requests或Issues，協助改進功能或修復錯誤。

## 貢獻指南

1. Fork本專案。
2. 創建特性分支（`git checkout -b feature/your-feature`）。
3. 提交變更（`git commit -m 'Add your feature'`）。
4. 推送到分支（`git push origin feature/your-feature`）。
5. 提交Pull Request，描述變更內容。

請確保：
- 代碼遵循ESLint標準（可選：使用Prettier格式化）。
- 新增功能需附帶說明文件。
- 測試所有變更以確保相容性。

## 致謝

- **Bootstrap**：提供響應式框架。
- **PDF.js**：實現高效PDF渲染。
- **Google Fonts**：提供Noto Sans TC字型。
- **jsDelivr**：可靠的CDN服務。
- **Cloudflare Pages**：提供快速且安全的靜態網站部署。
- 感謝所有參與資料整理與社群運營的學生與志願者！

---

**免責聲明**：本網站提供的所有資料僅供教育與參考用途，使用者需自行承擔使用風險。本專案不對資料的準確性或完整性作出任何保證。
