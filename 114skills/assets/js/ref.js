// ref.js with lazy loading

const trustedDomains = ['https://docs.google.com'];

function isTrustedUrl(url) {
  try {
    const urlObj = new URL(url);
    return trustedDomains.some(domain => url.startsWith(domain));
  } catch (e) {
    return false;
  }
}

const pdfQueue = new class {
  constructor(maxConcurrent = 1) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.dequeue();
    });
  }

  dequeue() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) return;
    const { task, resolve, reject } = this.queue.shift();
    this.running++;
    task().then(resolve).catch(reject).finally(() => {
      this.running--;
      this.dequeue();
    });
  }
}(1);

const disclaimerModal = new bootstrap.Modal(document.getElementById('disclaimerModal'), {
  backdrop: 'static',
  keyboard: false
});
disclaimerModal.show();

document.getElementById('agreeButton').addEventListener('click', function () {
  disclaimerModal.hide();
  document.getElementById('pdfContent').style.display = 'block';
  Controller.init();
});

document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    const url = this.getAttribute('data-url');
    if (!isTrustedUrl(url)) {
      console.error('不安全的 URL:', url);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  });
});

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
    document.getElementById('category-list').addEventListener('click', (e) => {
      const btn = e.target.closest('.category-btn');
      if (btn) {
        const categoryId = btn.id.replace('cat-', '');
        this.showCategory(categoryId);
      }
    });
  },

  showCategory(category) {
    View.currentCategory = category;
    View.currentPage = 1;
    View.setActiveCategory(category);
    View.renderPDFsWithPagination(category, Model.generateFilePaths(category));
  }
};

const Model = {
  pdfFiles: {
    'B': { count: 24 },
    'C': { count: 21 },
    'D1': { count: 25 },
    'D2': { count: 29 },
    'D3': { count: 12 }
  },

  generateFilePaths(category) {
    const count = this.pdfFiles[category].count;
    const prefix = category === 'B' ? 'b' : category === 'C' ? 'c' : `d${category.replace('D', '')}`;
    const folder = prefix;
    return Array.from({ length: count }, (_, i) => `./assets/pdfs/${folder}/${prefix}${i + 1}.pdf`);
  },

  async loadPDF(pdfPath, viewerId, category, pdfIndex) {
    const container = document.querySelector(`#${viewerId} .card-body`);
    if (!container) return;

    try {
      // Set pdf.js worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

      // Load PDF document
      const pdf = await pdfjsLib.getDocument(pdfPath).promise;
      const numPages = pdf.numPages;

      // Create page container with navigation
      container.innerHTML = `
        <div class="pdf-pages" style="width: 100%; touch-action: pan-y pinch-zoom; position: relative;">
          <canvas class="pdf-canvas" style="width: 100%; height: auto;"></canvas>
          <div class="pdf-navigation text-center mt-2">
            <button class="btn btn-sm btn-outline-primary me-2" data-action="prev" disabled>上一頁</button>
            <span class="page-info">1 / ${numPages}</span>
            <button class="btn btn-sm btn-outline-primary ms-2" data-action="next" ${numPages === 1 ? 'disabled' : ''}>下一頁</button>
          </div>
        </div>
      `;

      const canvas = container.querySelector('.pdf-canvas');
      const context = canvas.getContext('2d');
      let currentPageNum = 1;

      // Function to render a specific page
      const renderPage = async (pageNum) => {
        if (pageNum < 1 || pageNum > numPages) return;

        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.0 });
        const scale = Math.min(container.offsetWidth / viewport.width, 1.5); // Responsive scaling
        const scaledViewport = page.getViewport({ scale });

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        // Render page
        await page.render({
          canvasContext: context,
          viewport: scaledViewport
        }).promise;

        // Update navigation
        container.querySelector('.page-info').textContent = `${pageNum} / ${numPages}`;
        container.querySelector('[data-action="prev"]').disabled = pageNum === 1;
        container.querySelector('[data-action="next"]').disabled = pageNum === numPages;
        currentPageNum = pageNum;
      };

      // Initial render
      await renderPage(currentPageNum);

      // Add navigation event listeners
      container.querySelectorAll('.pdf-navigation button').forEach(button => {
        button.addEventListener('click', () => {
          const action = button.getAttribute('data-action');
          const newPageNum = action === 'prev' ? currentPageNum - 1 : currentPageNum + 1;
          renderPage(newPageNum);
        });
      });

      // Add touch swipe support for page navigation
      let touchStartX = 0;
      let touchEndX = 0;
      canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });
      canvas.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchStartX - touchEndX;
        if (swipeDistance > 50) {
          // Swipe left -> next page
          renderPage(currentPageNum + 1);
        } else if (swipeDistance < -50) {
          // Swipe right -> previous page
          renderPage(currentPageNum - 1);
        }
      });

    } catch (error) {
      console.error('PDF 載入失敗:', error);
      container.innerHTML = `
        <div class="card-body text-center">
          <p class="error-message">無法載入PDF：${error.message}</p>
        </div>
      `;
    }
  }
};

const View = {
  currentCategory: null,
  currentPage: 1,
  itemsPerPage: 3,

  renderCategories(categories) {
    const list = document.getElementById('category-list');
    list.innerHTML = categories.map(c => `
      <button class="list-group-item list-group-item-action category-btn ${c.id === 'B' ? 'active' : ''}" id="cat-${c.id}">
        ${c.name}
      </button>`).join('');
  },

  renderPDFsWithPagination(category, paths) {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const list = document.getElementById('pdf-list');
  
    list.innerHTML = paths.slice(start, end).map((path, i) => {
      const index = start + i;
      const id = `pdf-viewer-${category}-${index}`;
      return `<div class="col">
                <div class="card pdf-viewer" id="${id}">
                  <div class="card-body p-2"></div>
                </div>
              </div>`;
    }).join('');
  
    paths.slice(start, end).forEach((path, i) => {
      const index = start + i;
      const id = `pdf-viewer-${category}-${index}`;
      const container = document.getElementById(id);
  
      const observer = new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) {
          pdfQueue.enqueue(() => Model.loadPDF(path, id, category, index));
          obs.disconnect();
        }
      }, {
        threshold: 0.1,
        rootMargin: '100px' // 提前載入
      });
  
      observer.observe(container);
    });
  
    const total = Math.ceil(paths.length / this.itemsPerPage);
    document.getElementById('pageInfo').textContent = `第 ${this.currentPage} 頁 / 共 ${total} 頁`;
    document.getElementById('prevPage').disabled = this.currentPage === 1;
    document.getElementById('nextPage').disabled = this.currentPage === total;
  },

  setActiveCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`cat-${category}`).classList.add('active');
  }
};

document.getElementById('prevPage').addEventListener('click', () => {
  if (View.currentPage > 1) {
    View.currentPage--;
    View.renderPDFsWithPagination(View.currentCategory, Model.generateFilePaths(View.currentCategory));
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  const paths = Model.generateFilePaths(View.currentCategory);
  const total = Math.ceil(paths.length / View.itemsPerPage);
  if (View.currentPage < total) {
    View.currentPage++;
    View.renderPDFsWithPagination(View.currentCategory, paths);
  }
});