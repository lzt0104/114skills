const View = {
    renderCategories(categories) {
        const categoryList = document.getElementById('category-list');
        categoryList.innerHTML = categories.map(category => `
            <button onclick="Controller.showCategory('${category.id}')"
                    class="list-group-item list-group-item-action category-btn ${category.id === 'B' ? 'active' : ''}"
                    id="cat-${category.id}">
                ${category.name}
            </button>
        `).join('');
    },

    renderPDFs(category, filePaths) {
        const pdfList = document.getElementById('pdf-list');
        pdfList.innerHTML = filePaths.map((pdfPath, pdfIndex) => {
            const viewerId = `pdf-viewer-${category}-${pdfIndex}`;
            return `
                <div class="col">
                    <div class="card pdf-viewer" id="${viewerId}">
                        <div class="card-body p-2"></div>
                    </div>
                </div>
            `;
        }).join('');
    },

    setActiveCategory(category) {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`cat-${category}`).classList.add('active');
    }
};