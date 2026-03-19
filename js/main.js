(function () {
  const catalogGrid = document.getElementById('catalogGrid');
  const productModal = document.getElementById('productModal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  const cartBtn = document.getElementById('cartBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartBody = document.getElementById('cartBody');
  const cartClose = document.getElementById('cartClose');
  const cartCount = document.getElementById('cartCount');
  const cartForm = document.getElementById('cartForm');
  const orderItemsInput = document.getElementById('orderItemsInput');

  const CART_KEY = 'roses_cart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function setCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartCount();
  }

  function updateCartCount() {
    if (!cartCount) return;
    const cart = getCart();
    const total = cart.reduce((sum, it) => sum + (it.quantity || 1), 0);
    cartCount.textContent = total;
  }

  function formatPrice(n) {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);
  }

  function getCartQuantity(productId) {
    var item = getCart().find(function (it) { return it.id === productId; });
    return item ? (item.quantity || 1) : 0;
  }

  function getCurrentFilter() {
    var active = document.querySelector('.filter-btn.active');
    return (active && active.dataset.category) ? active.dataset.category : 'all';
  }

  function renderCatalog(filter = 'all') {
    if (!catalogGrid) return;
    const list = filter === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === filter);
    catalogGrid.innerHTML = list.map(product => {
      var qty = getCartQuantity(product.id);
      var inCart = qty > 0;
      return `
      <article class="card ${inCart ? 'card-in-cart' : ''}" data-id="${product.id}">
        <div class="card-image-wrap">
          <img src="${product.image}" alt="${product.name}" class="card-image" loading="lazy" data-fallback="${typeof DEFAULT_IMAGE !== 'undefined' ? DEFAULT_IMAGE : ''}" onerror="if(this.dataset.fallback){this.onerror=null;this.src=this.dataset.fallback}">
        </div>
        <div class="card-body">
          <h3 class="card-title">${product.name}</h3>
          <p class="card-price">${formatPrice(product.price)}</p>
          <div class="card-actions">
            <button type="button" class="card-add-btn ${inCart ? 'card-add-btn-in-cart' : ''}" data-add-cart="${product.id}" aria-label="${inCart ? 'Добавить ещё' : 'Добавить в корзину'}" title="${inCart ? 'Добавить ещё' : 'Добавить в корзину'}">${inCart ? '✓' : '+'}</button>
            <span class="card-in-cart-label">${inCart ? 'В корзине' + (qty > 1 ? ' (' + qty + ')' : '') : ''}</span>
            <button type="button" class="btn btn-outline card-btn" data-open-product="${product.id}">Подробнее</button>
          </div>
        </div>
      </article>
    `;
    }).join('');

    catalogGrid.querySelectorAll('[data-open-product]').forEach(btn => {
      btn.addEventListener('click', () => openProduct(Number(btn.dataset.openProduct)));
    });
    catalogGrid.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        addToCart(Number(this.dataset.addCart));
        renderCatalog(getCurrentFilter());
      });
    });
  }

  function getSimilarProducts(product, limit) {
    return PRODUCTS
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, limit);
  }

  function openProduct(id) {
    if (!productModal || !modalContent) return;
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    var modalImgFallback = typeof DEFAULT_IMAGE !== 'undefined' ? DEFAULT_IMAGE : '';
    var similar = getSimilarProducts(product, 4);
    var similarHtml = similar.length > 0 ? `
      <div class="modal-similar">
        <h3 class="modal-similar-title">Похожие букеты</h3>
        <div class="modal-similar-list">
          ${similar.map(p => `
            <div class="modal-similar-item">
              <a href="#" data-open-product="${p.id}" aria-label="${p.name}">
                <img src="${p.image}" alt="" loading="lazy" data-fallback="${modalImgFallback}" onerror="if(this.dataset.fallback){this.onerror=null;this.src=this.dataset.fallback}">
                <span>${p.name}</span>
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';
    var cartQty = getCartQuantity(product.id);
    var inCart = cartQty > 0;
    var addBtnText = inCart ? 'Добавить ещё' : 'Добавить в корзину';
    var cartStatusHtml = inCart ? '<p class="modal-product-in-cart">В корзине: ' + cartQty + ' ' + (cartQty === 1 ? 'шт.' : 'шт.') + '</p>' : '';
    modalContent.innerHTML = `
      <div class="modal-product">
        <div class="modal-product-image">
          <img src="${product.image}" alt="${product.name}" data-fallback="${modalImgFallback}" onerror="if(this.dataset.fallback){this.onerror=null;this.src=this.dataset.fallback}">
        </div>
        <div class="modal-product-info">
          <h2 id="modalTitle" class="modal-product-title">${product.name}</h2>
          <p class="modal-product-desc">${product.description}</p>
          <p class="modal-product-price">${formatPrice(product.price)}</p>
          ${cartStatusHtml}
          <button type="button" class="btn btn-primary" data-add-cart="${product.id}">${addBtnText}</button>
        </div>
      </div>
      ${similarHtml}
    `;
    modalContent.querySelector('[data-add-cart]').addEventListener('click', () => {
      addToCart(product.id);
      productModal.classList.remove('open');
      productModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      renderCatalog(getCurrentFilter());
    });
    modalContent.querySelectorAll('[data-open-product]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openProduct(Number(this.dataset.openProduct));
      });
    });
    productModal.classList.add('open');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    productModal.classList.remove('open');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function addToCart(productId, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const cart = getCart();
    const existing = cart.find(it => it.id === productId);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + quantity;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, quantity });
    }
    setCart(cart);
  }

  function getDiscountPercent(totalQuantity) {
    if (totalQuantity >= 10) return 15;
    if (totalQuantity >= 6) return 10;
    if (totalQuantity >= 3) return 5;
    return 0;
  }

  function getNextDiscountHint(totalQty) {
    if (totalQty >= 10) return null;
    if (totalQty >= 6) return { need: 10 - totalQty, nextPercent: 15 };
    if (totalQty >= 3) return { need: 6 - totalQty, nextPercent: 10 };
    if (totalQty >= 1) return { need: 3 - totalQty, nextPercent: 5 };
    return { need: 3, nextPercent: 5 };
  }

  function pluralGoods(n) {
    if (n === 1) return '1 букет';
    if (n >= 2 && n <= 4) return n + ' букета';
    return n + ' букетов';
  }

  function renderCart() {
    const cart = getCart();
    if (cart.length === 0) {
      cartBody.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
      var orderTotalInput = document.getElementById('orderTotalInput');
      var orderDiscountInput = document.getElementById('orderDiscountInput');
      if (orderTotalInput) orderTotalInput.value = '';
      if (orderDiscountInput) orderDiscountInput.value = '';
      return;
    }
    var totalQty = 0;
    var subtotal = 0;
    cartBody.innerHTML = cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      const name = product ? product.name : item.name;
      const price = item.price || (product && product.price);
      const qty = item.quantity || 1;
      const sum = price * qty;
      totalQty += qty;
      subtotal += sum;
      return `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-info">
            <span class="cart-item-name">${name}</span>
            <span class="cart-item-qty">${qty} × ${formatPrice(price)}</span>
          </div>
          <div class="cart-item-right">
            <span class="cart-item-sum">${formatPrice(sum)}</span>
            <button type="button" class="cart-item-remove" data-remove="${item.id}" aria-label="Удалить">×</button>
          </div>
        </div>
      `;
    }).join('');

    var discountPercent = getDiscountPercent(totalQty);
    var discountAmount = Math.round(subtotal * discountPercent / 100);
    var total = subtotal - discountAmount;

    var nextHint = getNextDiscountHint(totalQty);
    var totalsHtml = '<div class="cart-totals">';
    totalsHtml += '<div class="cart-totals-row"><span>Сумма</span><span>' + formatPrice(subtotal) + '</span></div>';
    if (discountPercent > 0) {
      totalsHtml += '<div class="cart-totals-row cart-totals-discount"><span>Скидка ' + discountPercent + '%</span><span>−' + formatPrice(discountAmount) + '</span></div>';
    }
    totalsHtml += '<div class="cart-totals-row cart-totals-total"><span>Итого</span><span>' + formatPrice(total) + '</span></div>';
    if (nextHint && nextHint.need > 0) {
      totalsHtml += '<p class="cart-totals-hint">Ещё ' + pluralGoods(nextHint.need) + ' до скидки ' + nextHint.nextPercent + '%</p>';
    }
    totalsHtml += '</div>';
    cartBody.insertAdjacentHTML('beforeend', totalsHtml);

    cartBody.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.remove);
        const newCart = getCart().filter(it => it.id !== id);
        setCart(newCart);
        renderCart();
        if (catalogGrid) renderCatalog(getCurrentFilter());
      });
    });

    const orderText = cart.map(it => {
      const p = PRODUCTS.find(x => x.id === it.id);
      return `${p ? p.name : it.name} — ${it.quantity || 1} шт. × ${formatPrice(it.price || (p && p.price))}`;
    }).join('\n');
    if (orderItemsInput) orderItemsInput.value = orderText;

    var orderTotalInput = document.getElementById('orderTotalInput');
    var orderDiscountInput = document.getElementById('orderDiscountInput');
    if (orderTotalInput) orderTotalInput.value = formatPrice(total);
    if (orderDiscountInput) orderDiscountInput.value = discountPercent > 0 ? discountPercent + '% (−' + formatPrice(discountAmount) + ')' : '';
  }

  function openCart() {
    renderCart();
    cartOverlay.classList.add('open');
    cartOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartOverlay) {
      cartOverlay.classList.remove('open');
      cartOverlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    if (catalogGrid) renderCatalog(getCurrentFilter());
  }

  if (catalogGrid) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCatalog(btn.dataset.category);
      });
    });
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (productModal) productModal.addEventListener('click', (e) => { if (e.target === productModal) closeModal(); });
  if (cartBtn) cartBtn.addEventListener('click', function (e) { e.preventDefault(); openCart(); });
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', (e) => { if (e.target === cartOverlay) closeCart(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeCart();
    }
  });

  if (cartForm) {
    cartForm.addEventListener('submit', function (e) {
      const cart = getCart();
      if (cart.length === 0) {
        e.preventDefault();
        alert('Добавьте букеты в корзину.');
        return;
      }
      var orderTotalInput = document.getElementById('orderTotalInput');
      var orderDiscountInput = document.getElementById('orderDiscountInput');
      var totalQty = cart.reduce(function (sum, it) { return sum + (it.quantity || 1); }, 0);
      var subtotal = 0;
      cart.forEach(function (item) {
        var p = PRODUCTS.find(function (x) { return x.id === item.id; });
        var price = item.price || (p && p.price) || 0;
        subtotal += price * (item.quantity || 1);
      });
      var discountPercent = getDiscountPercent(totalQty);
      var discountAmount = Math.round(subtotal * discountPercent / 100);
      var total = subtotal - discountAmount;
      if (orderTotalInput) orderTotalInput.value = formatPrice(total);
      if (orderDiscountInput) orderDiscountInput.value = discountPercent > 0 ? discountPercent + '% (−' + formatPrice(discountAmount) + ')' : '—';
      setTimeout(function () {
        setCart([]);
        renderCart();
        if (catalogGrid) renderCatalog(getCurrentFilter());
      }, 100);
    });
  }

  if (catalogGrid) renderCatalog();
  updateCartCount();

  var heroImage = document.getElementById('heroImage');
  var heroPlaceholder = document.getElementById('heroPlaceholder');
  if (heroImage && heroPlaceholder) {
    var heroWrap = heroImage.closest('.hero-image-wrap');
    heroImage.onload = function () {
      heroWrap.classList.add('has-hero-image');
    };
    heroImage.onerror = function () {
      heroImage.style.display = 'none';
    };
    if (heroImage.complete && heroImage.naturalWidth > 0) heroWrap.classList.add('has-hero-image');
  }

  var hero = document.getElementById('hero');
  if (hero) {
    var heroTargetX = 0.5;
    var heroTargetY = 0.5;
    var heroCurrentX = 0.5;
    var heroCurrentY = 0.5;
    var heroTicking = false;
    function heroUpdatePosition(e) {
      var rect = hero.getBoundingClientRect();
      heroTargetX = (e.clientX - rect.left) / rect.width;
      heroTargetY = (e.clientY - rect.top) / rect.height;
      if (!heroTicking) {
        heroTicking = true;
        requestAnimationFrame(heroTick);
      }
    }
    function heroTick() {
      heroCurrentX += (heroTargetX - heroCurrentX) * 0.08;
      heroCurrentY += (heroTargetY - heroCurrentY) * 0.08;
      hero.style.setProperty('--mouse-x', heroCurrentX);
      hero.style.setProperty('--mouse-y', heroCurrentY);
      if (Math.abs(heroCurrentX - heroTargetX) > 0.001 || Math.abs(heroCurrentY - heroTargetY) > 0.001) {
        requestAnimationFrame(heroTick);
      } else {
        heroTicking = false;
      }
    }
    function heroReset() {
      heroTargetX = 0.5;
      heroTargetY = 0.5;
      if (!heroTicking) {
        heroTicking = true;
        requestAnimationFrame(heroTick);
      }
    }
    hero.addEventListener('mousemove', heroUpdatePosition);
    hero.addEventListener('mouseleave', heroReset);
  }

  var reviewsWrap = document.getElementById('reviewsWrap');
  var reviewsTrack = document.getElementById('reviewsTrack');
  if (reviewsWrap && reviewsTrack) {
    // Infinite loop (simple & reliable): clone once + normalize scrollLeft.
    if (!reviewsTrack.dataset.loopReady) {
      var originals = Array.prototype.slice.call(reviewsTrack.children);
      originals.forEach(function (node) {
        reviewsTrack.appendChild(node.cloneNode(true));
      });
      reviewsTrack.dataset.loopReady = '1';
    }

    function getBaseWidth() {
      return reviewsTrack.scrollWidth / 2;
    }

    function getStep() {
      var first = reviewsTrack.querySelector('.review-card');
      if (!first) return 300;
      var gap = 0;
      try {
        gap = parseFloat(getComputedStyle(reviewsTrack).gap || '0') || 0;
      } catch { gap = 0; }
      return Math.round(first.getBoundingClientRect().width + gap) || 300;
    }

    // Buttons only (no auto-scroll).
    function scrollByStep(direction) {
      var base = getBaseWidth();
      if (!base) return;
      var step = getStep();
      var maxFirst = Math.max(0, base - reviewsWrap.clientWidth);

      // If user is already at the edge and presses further — then wrap.
      if (direction > 0 && reviewsWrap.scrollLeft >= maxFirst - 1) {
        reviewsWrap.scrollLeft = 0;
        return;
      }
      if (direction < 0 && reviewsWrap.scrollLeft <= 1) {
        reviewsWrap.scrollLeft = maxFirst;
        return;
      }

      var next = reviewsWrap.scrollLeft + (step * direction);
      if (direction > 0) next = Math.min(next, maxFirst);
      if (direction < 0) next = Math.max(next, 0);
      reviewsWrap.scrollTo({ left: next, behavior: 'smooth' });
    }

    var reviewsPrev = document.getElementById('reviewsPrev');
    var reviewsNext = document.getElementById('reviewsNext');
    if (reviewsPrev) reviewsPrev.addEventListener('click', function () { scrollByStep(-1); });
    if (reviewsNext) reviewsNext.addEventListener('click', function () { scrollByStep(1); });
  }
})();
