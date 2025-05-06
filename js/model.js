const Model = {
    pdfFiles: {
        'B': { count: 24 },
        'C': { count: 13 },
        'D1': { count: 23 },
        'D2': { count: 27 },
        'D3': { count: 12 }
    },

    generateFilePaths(category) {
        const count = this.pdfFiles[category].count;
        const paths = [];
        const prefix = category === 'B' ? 'b' : category === 'C' ? 'c' : `d${category.replace('D', '')}`;
        const folder = category === 'B' ? 'b' : category === 'C' ? 'c' : `d${category.replace('D', '')}`;
        for (let i = 1; i <= count; i++) {
            paths.push(`/assets/pdfs/${folder}/${prefix}${i}.pdf`);
        }
        return paths;
    },

    async loadPDF(pdfPath, viewerId, category, pdfIndex) {
        try {
            const pdf = await pdfjsLib.getDocument(pdfPath).promise;
            const container = document.querySelector(`#${viewerId} .card-body`);
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const canvasId = `pdf-canvas-${category}-${pdfIndex}-${pageNum}`;
                const canvas = document.createElement('canvas');
                canvas.id = canvasId;
                canvas.className = 'pdf-canvas mb-2';
                container.appendChild(canvas);

                const context = canvas.getContext('2d');
                const viewport = page.getViewport({ scale: 1.0 });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
            }
        } catch (error) {
            console.error('載入PDF失敗:', error);
            document.getElementById(viewerId).innerHTML = `
                <div class="card-body text-center text-danger">
                    <p>無法載入PDF，請確認檔案是否存在。</p>
                </div>
            `;
        }
    }
};