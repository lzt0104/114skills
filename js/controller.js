const Controller = {
    init() {
        const categories = [
            { id: 'B', name: 'B課程學習成果' },
            { id: 'C', name: 'C多元表現' },
            { id: 'D1', name: 'D-1多元表現綜整心得' },
            { id: 'D2', name: 'D-2學習歷程自述' },
            { id: 'D3', name: 'D-3其他有利審查資料' }
        ];
        View.renderCategories(categories);
        this.showCategory('B');
        document.getElementById('pdf-list').addEventListener('contextmenu', (e) => e.preventDefault());
    },

    showCategory(category) {
        View.setActiveCategory(category);
        const filePaths = Model.generateFilePaths(category);
        View.renderPDFs(category, filePaths);
        filePaths.forEach((pdfPath, pdfIndex) => {
            const viewerId = `pdf-viewer-${category}-${pdfIndex}`;
            Model.loadPDF(pdfPath, viewerId, category, pdfIndex);
        });
    }
};

// 初始化
Controller.init();