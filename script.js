  // Custom cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let cx = 0, cy = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
  });

  function animateRing() {
    rx += (cx - rx) * 0.12;
    ry += (cy - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .portfolio-card, .stat-card, .brand-item').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
  });

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));

  // Stagger sibling reveals
  document.querySelectorAll('.stats-grid, .skills-groups, .portfolio-grid, .brands-grid, .contact-items').forEach(group => {
    const children = group.querySelectorAll('.stat-card, .skill-group, .portfolio-card, .brand-item, .contact-item');
  });

  function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderModalInputColumn(item) {
    if (item.inputImage) {
      return `
        <div class="modal-product-input-frame">
          <img src="${item.inputImage}" alt="" class="modal-product-input-img modal-product-zoomable" loading="lazy"
            onerror="this.classList.add('modal-product-input-img--hidden'); this.closest('.modal-product-input-frame').classList.add('modal-product-input-frame--broken')">
        </div>`;
    }
    if (item.input && typeof item.input === 'string') {
      return `<div class="modal-product-input-frame modal-product-input-frame--text">
        <p class="modal-product-input-text">${escapeHtml(item.input)}</p>
      </div>`;
    }
    return `<div class="modal-product-input-frame modal-product-input-frame--empty">
      <p class="modal-product-input-placeholder">No reference added</p>
    </div>`;
  }

  // Portfolio Modal Functionality
  const modal = document.getElementById('portfolio-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const closeModal = document.querySelector('.close-modal');
  const imageLightbox = document.getElementById('modal-image-lightbox');
  const imageLightboxImg = imageLightbox?.querySelector('.modal-image-lightbox-img');

  function closeImageLightbox() {
    if (!imageLightbox || !imageLightboxImg) return;
    imageLightbox.hidden = true;
    imageLightboxImg.removeAttribute('src');
    imageLightboxImg.alt = '';
  }

  function openImageLightbox(src, alt) {
    if (!imageLightbox || !imageLightboxImg || !src) return;
    imageLightboxImg.src = src;
    imageLightboxImg.alt = alt || '';
    imageLightbox.hidden = false;
  }

  function closePortfolioModal() {
    closeImageLightbox();
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  // Sample portfolio data - replace with actual data
  const portfolioData = {
    kidswear: [
      {
        inputImage: "./images/Portfolio_1/kidswear/1/Input.jpeg",
        outputs: [
          "./images/Portfolio_1/kidswear/1/1.png",
          "./images/Portfolio_1/kidswear/1/2.png",
          "./images/Portfolio_1/kidswear/1/3.png"
        ]
      },
      {
        inputImage: "./images/Portfolio_1/kidswear/2/Input.jpeg",
        outputs: [
          "./images/Portfolio_1/kidswear/2/1.png",
          "./images/Portfolio_1/kidswear/2/2.png",
          "./images/Portfolio_1/kidswear/2/3.jpeg"
        ]
      },
      {
        inputImage: "./images/Portfolio_1/kidswear/3/Input.jpeg",
        outputs: [
          "./images/Portfolio_1/kidswear/3/1.png",
          "./images/Portfolio_1/kidswear/3/2.png",
          "./images/Portfolio_1/kidswear/3/3.png"
        ]
      },
      {
        inputImage: "./images/Portfolio_1/kidswear/4/Input.jpeg",
        outputs: [
          "./images/Portfolio_1/kidswear/4/1.jpeg",
          "./images/Portfolio_1/kidswear/4/2.jpeg"
        ]
      }
    ],
    menswear: [
      {
        inputImage: "./images/Portfolio_1/menswear/1/Input.jpg",
        outputs: [
          "./images/Portfolio_1/menswear/1/1.jpg",
          "./images/Portfolio_1/menswear/1/2.jpg",
          "./images/Portfolio_1/menswear/1/3.jpg"
        ]
      },
      {
        inputImage: "./images/Portfolio_1/menswear/2/Input.jpeg",
        outputs: [
          "./images/Portfolio_1/menswear/2/1.jpg",
          "./images/Portfolio_1/menswear/2/2.jpg",
          "./images/Portfolio_1/menswear/2/3.jpg"
        ]
      },
      {
        inputImage: "./images/Portfolio_1/menswear/3/Input.jpg",
        outputs: [
          "./images/Portfolio_1/menswear/3/1.png",
          "./images/Portfolio_1/menswear/3/2.png",
          "./images/Portfolio_1/menswear/3/3.png"
        ]
      },
      {
        inputImage: "./images/Portfolio_1/menswear/4/Input.jpg",
        outputs: [
          "./images/Portfolio_1/menswear/4/1.jpg",
          "./images/Portfolio_1/menswear/4/2.jpg",
          "./images/Portfolio_1/menswear/4/3.jpeg"
        ]
      }
    ],
    womenswear: [
      {
        inputImage: "./images/Portfolio_1/womenswear/1/Input.jpeg",
        outputs: [
          "./images/Portfolio_1/womenswear/1/1.jpeg",
          "./images/Portfolio_1/womenswear/1/2.jpeg",
          "./images/Portfolio_1/womenswear/1/3.jpeg"
        ]
      },
      {
        inputImage: "./images/Portfolio_1/womenswear/2/Input.jpg",
        outputs: [
          "./images/Portfolio_1/womenswear/2/1.jpg",
          "./images/Portfolio_1/womenswear/2/2.jpg",
          "./images/Portfolio_1/womenswear/2/3.jpg"
        ]
      },
      {
        inputImage: "./images/Portfolio_1/womenswear/3/Input.jpg",
        outputs: [
          "./images/Portfolio_1/womenswear/3/1.jpg",
          "./images/Portfolio_1/womenswear/3/2.jpg",
          "./images/Portfolio_1/womenswear/3/3.jpg",
          "./images/Portfolio_1/womenswear/3/4.jpg"
        ]
      },
      {
        inputImage: "./images/Portfolio_1/womenswear/4/Input.jpg",
        outputs: [
          "./images/Portfolio_1/womenswear/4/1.jpeg",
          "./images/Portfolio_1/womenswear/4/2.jpeg",
          "./images/Portfolio_1/womenswear/4/3.jpeg"
        ]
      },
      {
        inputImage: "./images/Portfolio_1/womenswear/5/Input.jpg",
        outputs: [
          "./images/Portfolio_1/womenswear/5/1.jpg",
          "./images/Portfolio_1/womenswear/5/2.jpg",
          "./images/Portfolio_1/womenswear/5/3.jpg"
        ]
      },
      {
        inputImage: "./images/Portfolio_1/womenswear/6/Input.jpeg",
        outputs: [
          "./images/Portfolio_1/womenswear/6/1.jpg",
          "./images/Portfolio_1/womenswear/6/2.jpg",
          "./images/Portfolio_1/womenswear/6/3.jpg"
        ]
      },
      {
        inputImage: "./images/Portfolio_1/womenswear/7/Input.jpeg",
        outputs: [
          "./images/Portfolio_1/womenswear/7/1.jpg",
          "./images/Portfolio_1/womenswear/7/2.jpg",
          "./images/Portfolio_1/womenswear/7/3.jpg"
        ]
      },
      {
        inputImage: "./images/Portfolio_1/womenswear/8/Input.jpeg",
        outputs: [
          "./images/Portfolio_1/womenswear/8/1.jpg",
          "./images/Portfolio_1/womenswear/8/2.jpg",
          "./images/Portfolio_1/womenswear/8/3.jpg"
        ]
      }
    ]
};

  // Open modal when category is clicked
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      const categoryName = card.querySelector('.category-card-title')?.textContent?.trim() ?? '';
      modalTitle.textContent = categoryName;
      modalBody.innerHTML = '';

      if (portfolioData[category]) {
        portfolioData[category].forEach((item, index) => {
          const section = document.createElement('article');
          section.className = 'modal-product';
          const num = String(index + 1).padStart(2, '0');
          const outputs = Array.isArray(item.outputs) ? item.outputs : [];
          section.innerHTML = `
            <header class="modal-product-head">
              <span class="modal-product-eyebrow">Work sample</span>
              <span class="modal-product-num" aria-hidden="true">${num}</span>
            </header>
            <div class="modal-product-body">
              <div class="modal-product-col modal-product-col--reference">
                <p class="modal-product-col-label">Reference</p>
                ${renderModalInputColumn(item)}
              </div>
              <div class="modal-product-col modal-product-col--results">
                <p class="modal-product-col-label">Results</p>
                <div class="modal-product-output-scroll" role="region" aria-label="Result images, scroll horizontally" tabindex="0">
                  <div class="modal-product-output-track">
                    ${outputs.map((src) => `
                      <figure class="modal-product-output-fig">
                        <img src="${src}" alt="" class="modal-product-output-img modal-product-zoomable" loading="lazy"
                          onerror="this.closest('.modal-product-output-fig').style.display='none'">
                      </figure>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          `;
          modalBody.appendChild(section);
        });
      } else {
        modalBody.innerHTML = '<p>No projects available for this category yet.</p>';
      }

      modal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    });
  });

  // Enlarge reference / result images inside the modal
  modal.addEventListener('click', (e) => {
    const el = e.target;
    if (!(el instanceof HTMLImageElement) || !el.classList.contains('modal-product-zoomable')) return;
    if (el.classList.contains('modal-product-input-img--hidden')) return;
    const src = el.currentSrc || el.src;
    if (!src) return;
    e.stopPropagation();
    openImageLightbox(src, el.alt || '');
  });

  if (imageLightbox && imageLightboxImg) {
    imageLightbox.addEventListener('click', (e) => {
      if (e.target === imageLightboxImg) return;
      closeImageLightbox();
    });
  }

  // Close modal
  closeModal.addEventListener('click', () => closePortfolioModal());

  closeModal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closePortfolioModal();
    }
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) closePortfolioModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modal.style.display !== 'block') return;
    if (imageLightbox && !imageLightbox.hidden) {
      closeImageLightbox();
      e.preventDefault();
      return;
    }
    closePortfolioModal();
    e.preventDefault();
  });