/**
 * Experiment 5: Cart Total Calculator & Discount Logic
 * Concept Focus: JavaScript Array Methods & Object Handling
 */

// ==========================================
// 1. DATA STRUCTURES (Objects & Arrays)
// ==========================================

// Catalog Products Database (Array of Product Objects)
const PRODUCTS = [
  { id: 'p1', name: 'Wireless Noise-Canceling Headphones', category: 'Electronics', price: 1499.00, oldPrice: 1999.00, rating: 4.8, icon: '🎧', stock: 15 },
  { id: 'p2', name: 'Smart Fitness Watch Series 5', category: 'Electronics', price: 1999.50, oldPrice: 2490.00, rating: 4.9, icon: '⌚', stock: 8 },
  { id: 'p3', name: 'Ergonomic Mechanical Keyboard', category: 'Accessories', price: 899.00, oldPrice: 1100.00, rating: 4.6, icon: '⌨️', stock: 20 },
  { id: 'p4', name: 'Ultra-Precision Gaming Mouse', category: 'Accessories', price: 459.99, oldPrice: 599.99, rating: 4.5, icon: '🖱️', stock: 12 },
  { id: 'p5', name: 'Minimalist Leather Backpack', category: 'Fashion', price: 799.99, oldPrice: 950.00, rating: 4.7, icon: '🎒', stock: 5 },
  { id: 'p6', name: 'Stainless Steel Insulated Tumbler', category: 'Home', price: 245.00, oldPrice: 320.00, rating: 4.4, icon: '🥤', stock: 25 },
  { id: 'p7', name: 'Smart Ambient LED Desk Lamp', category: 'Home', price: 540.00, oldPrice: 699.99, rating: 4.6, icon: '💡', stock: 10 },
  { id: 'p8', name: 'Classic Chronograph Quartz Watch', category: 'Fashion', price: 1290.00, oldPrice: 1600.00, rating: 4.7, icon: '⌚', stock: 7 }
];

// Available Promo Codes Database (Array of Coupon Objects)
const COUPONS = [
  { code: 'SAVE10', type: 'percent', value: 10, minSubtotal: 0, description: '10% off any order' },
  { code: 'SUPER20', type: 'percent', value: 20, minSubtotal: 1000, description: '20% off orders > ₹1000' },
  { code: 'FLAT50', type: 'flat', value: 50, minSubtotal: 2000, description: '₹50 flat off orders > ₹2000' },
  { code: 'FREESHIP', type: 'shipping', value: 150, minSubtotal: 300, description: 'Free shipping (₹150 value)' }
];

// Active State Object
const state = {
  products: [...PRODUCTS],
  cart: [],
  selectedCategory: 'All',
  searchQuery: '',
  sortBy: 'default',
  appliedCoupon: null,
  taxRate: 0.08, // 8% Tax
  shippingFee: 150.00
};

// ==========================================
// 2. DOM ELEMENTS SELECTION
// ==========================================
const productGrid = document.getElementById('product-grid');
const categoryChips = document.getElementById('category-chips');
const cartItemsList = document.getElementById('cart-items-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

// Add Product Form Elements
const addProductForm = document.getElementById('add-product-form');
const prodName = document.getElementById('prod-name');
const prodPrice = document.getElementById('prod-price');
const prodCategory = document.getElementById('prod-category');
const prodIcon = document.getElementById('prod-icon');
const addProductFeedback = document.getElementById('add-product-feedback');

// Stats Elements
const statTotalProducts = document.getElementById('stat-total-products');
const statCartCount = document.getElementById('stat-cart-count');
const statTotalSavings = document.getElementById('stat-total-savings');
const statGrandTotal = document.getElementById('stat-grand-total');

// Coupon Elements
const couponInput = document.getElementById('coupon-input');
const applyCouponBtn = document.getElementById('apply-coupon-btn');
const couponFeedback = document.getElementById('coupon-feedback');
const availableCouponsList = document.getElementById('available-coupons-list');
const autoDiscountBanner = document.getElementById('auto-discount-banner');
const autoDiscountText = document.getElementById('auto-discount-text');

// Summary Elements
const summaryItemsCount = document.getElementById('summary-items-count');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryCouponName = document.getElementById('summary-coupon-name');
const summaryCouponDiscount = document.getElementById('summary-coupon-discount');
const summaryTierDiscount = document.getElementById('summary-tier-discount');
const summaryTax = document.getElementById('summary-tax');
const summaryShipping = document.getElementById('summary-shipping');
const summaryGrandTotal = document.getElementById('summary-grand-total');
const summarySavingsBadge = document.getElementById('summary-savings-badge');
const summarySavingsAmount = document.getElementById('summary-savings-amount');
const clearCartBtn = document.getElementById('clear-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');

// Modal Elements
const checkoutModal = document.getElementById('checkout-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const receiptDetails = document.getElementById('receipt-details');

// Inspector Elements
const inspectorCode = document.getElementById('inspector-code');
const inspectorOutput = document.getElementById('inspector-output');
const toggleInspectorBtn = document.getElementById('toggle-inspector-btn');
const inspectorToggleIcon = document.getElementById('inspector-toggle-icon');
const inspectorCard = document.querySelector('.inspector-card');

// ==========================================
// 3. ARRAY METHODS & CALCULATIONS
// ==========================================

/**
 * Calculates complete cart total with discount logic using Array.prototype.reduce()
 * and Object Handling.
 */
function calculateCartTotals() {
  const { cart, appliedCoupon, taxRate, shippingFee } = state;

  // 1. Array.prototype.reduce() -> Total item count
  const totalItemCount = cart.reduce((accum, item) => accum + item.quantity, 0);

  // 2. Array.prototype.reduce() -> Subtotal calculation (price * quantity)
  const subtotal = cart.reduce((accum, item) => {
    // Object Destructuring
    const { price, quantity } = item;
    return accum + (price * quantity);
  }, 0);

  // 3. Array.prototype.reduce() -> Original total price (before product strike-through savings)
  const originalSubtotal = cart.reduce((accum, item) => {
    const { oldPrice, price, quantity } = item;
    return accum + ((oldPrice || price) * quantity);
  }, 0);

  const productCatalogDiscount = originalSubtotal - subtotal;

  // 4. Coupon Discount Calculation using Object inspection & Array.prototype.find()
  let couponDiscountAmount = 0;
  let isFreeShipping = false;

  if (appliedCoupon) {
    // Validate if subtotal satisfies minimum requirement
    if (subtotal >= appliedCoupon.minSubtotal) {
      if (appliedCoupon.type === 'percent') {
        couponDiscountAmount = (subtotal * appliedCoupon.value) / 100;
      } else if (appliedCoupon.type === 'flat') {
        couponDiscountAmount = Math.min(appliedCoupon.value, subtotal);
      } else if (appliedCoupon.type === 'shipping') {
        isFreeShipping = true;
      }
    }
  }

  // 5. Tiered Volume Discount (Automatic Array condition: if 3 or more unique items in cart)
  // Array.prototype.some() check for bonus bulk discount
  const isEligibleForTierDiscount = totalItemCount >= 3;
  const tierDiscountAmount = isEligibleForTierDiscount ? (subtotal * 0.05) : 0; // 5% bonus

  // Final Calculations
  const finalSubtotalAfterDiscounts = Math.max(0, subtotal - couponDiscountAmount - tierDiscountAmount);
  
  // Tax calculation
  const taxAmount = finalSubtotalAfterDiscounts * taxRate;

  // Shipping logic
  const effectiveShipping = (cart.length === 0 || isFreeShipping) ? 0 : shippingFee;

  // Grand Total
  const grandTotal = finalSubtotalAfterDiscounts + taxAmount + effectiveShipping;

  // Total Savings (Catalog discounts + Coupon discounts + Tier discounts + Shipping savings)
  const shippingSavings = isFreeShipping ? shippingFee : 0;
  const totalSavings = productCatalogDiscount + couponDiscountAmount + tierDiscountAmount + shippingSavings;

  return {
    totalItemCount,
    subtotal,
    originalSubtotal,
    couponDiscountAmount,
    tierDiscountAmount,
    isEligibleForTierDiscount,
    taxAmount,
    effectiveShipping,
    grandTotal,
    totalSavings
  };
}

// ==========================================
// 4. UI RENDER FUNCTIONS USING MAP & FILTER
// ==========================================

/**
 * Render Category Chips using Array.prototype.map() and Object methods
 */
function renderCategoryChips() {
  // Extract unique categories using Array.prototype.map() & Set
  const allCategories = ['All', ...new Set(state.products.map(p => p.category))];

  // Render HTML via Array.prototype.map() & join()
  categoryChips.innerHTML = allCategories.map(cat => `
    <button class="chip-btn ${state.selectedCategory === cat ? 'active' : ''}" data-category="${cat}">
      ${cat}
    </button>
  `).join('');
}

/**
 * Filter and Sort Product Catalog using Array.prototype.filter() and sort()
 */
function getFilteredAndSortedProducts() {
  // 1. Array.prototype.filter() -> Category & Search filtering
  let result = state.products.filter(product => {
    // Object destructuring
    const { name, category } = product;
    const matchesCategory = state.selectedCategory === 'All' || category === state.selectedCategory;
    const matchesSearch = name.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 2. Array.prototype.sort() -> Sorting catalog
  if (state.sortBy === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'rating-desc') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (state.sortBy === 'name-asc') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}

/**
 * Render Product Grid using Array.prototype.map()
 */
function renderProductGrid() {
  const filteredProducts = getFilteredAndSortedProducts();

  statTotalProducts.textContent = filteredProducts.length;

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: #64748b;">
        <i class="fa-solid fa-face-frown" style="font-size: 2.5rem; margin-bottom: 0.5rem;"></i>
        <p>No products match your current search or category filter.</p>
      </div>
    `;
    return;
  }

  // Array.prototype.map() transforms each product object into HTML template string
  productGrid.innerHTML = filteredProducts.map(product => {
    const { id, name, category, price, oldPrice, rating, icon, stock } = product;
    const discountPercent = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

    return `
      <div class="product-card" data-id="${id}">
        ${discountPercent > 0 ? `<span class="product-badge">-${discountPercent}% OFF</span>` : ''}
        <div class="product-img-wrapper">${icon}</div>
        <div>
          <div class="product-category-tag">${category} &bull; Stock: ${stock}</div>
          <h3 class="product-title">${name}</h3>
          <div class="product-rating">
            <i class="fa-solid fa-star"></i> <strong>${rating}</strong> / 5.0
          </div>
        </div>
        <div class="product-footer">
          <div class="product-price-box">
            <span class="product-price">₹${price.toFixed(2)}</span>
            ${oldPrice ? `<span class="product-old-price">₹${oldPrice.toFixed(2)}</span>` : ''}
          </div>
          <button class="btn-add-cart" onclick="addToCart('${id}')">
            <i class="fa-solid fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render Cart Items List using Array.prototype.map()
 */
function renderCartItems() {
  const { cart } = state;

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-basket-shopping cart-empty-icon"></i>
        <p>Your shopping cart is currently empty.</p>
        <small style="color: #94a3b8;">Click "+ Add" on catalog products to calculate total!</small>
      </div>
    `;
    return;
  }

  // Array.prototype.map() transforms cart objects into item rows
  cartItemsList.innerHTML = cart.map(item => {
    const { id, name, price, icon, quantity } = item;
    const itemTotal = price * quantity;

    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-icon">${icon}</div>
          <div class="cart-item-details">
            <span class="cart-item-name">${name}</span>
            <span class="cart-item-unit-price">₹${price.toFixed(2)} each</span>
          </div>
        </div>

        <div class="cart-qty-controls">
          <button class="btn-qty" onclick="updateQuantity('${id}', ${quantity - 1})">-</button>
          <span class="cart-qty-val">${quantity}</span>
          <button class="btn-qty" onclick="updateQuantity('${id}', ${quantity + 1})">+</button>
        </div>

        <div class="cart-item-total">₹${itemTotal.toFixed(2)}</div>

        <button class="btn-remove-item" onclick="removeFromCart('${id}')" title="Remove Item">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;
  }).join('');
}

/**
 * Render Available Coupons using Array.prototype.map()
 */
function renderAvailableCoupons() {
  availableCouponsList.innerHTML = COUPONS.map(c => `
    <span class="coupon-pill" onclick="applyCouponCode('${c.code}')" title="${c.description}">
      <i class="fa-solid fa-tag"></i> ${c.code} (${c.type === 'percent' ? c.value + '%' : '₹' + c.value})
    </span>
  `).join('');
}

/**
 * Update Complete Order Summary and Stats Bar
 */
function updateSummaryUI() {
  const totals = calculateCartTotals();

  // Stats Bar updates
  statCartCount.textContent = totals.totalItemCount;
  statTotalSavings.textContent = `₹${totals.totalSavings.toFixed(2)}`;
  statGrandTotal.textContent = `₹${totals.grandTotal.toFixed(2)}`;

  // Summary Card updates
  summaryItemsCount.textContent = totals.totalItemCount;
  summarySubtotal.textContent = `₹${totals.subtotal.toFixed(2)}`;

  if (state.appliedCoupon) {
    summaryCouponName.textContent = state.appliedCoupon.code;
    summaryCouponDiscount.textContent = totals.couponDiscountAmount > 0 
      ? `-₹${totals.couponDiscountAmount.toFixed(2)}` 
      : (state.appliedCoupon.type === 'shipping' ? 'Free Shipping' : '-₹0.00');
  } else {
    summaryCouponName.textContent = 'None';
    summaryCouponDiscount.textContent = '-₹0.00';
  }

  summaryTierDiscount.textContent = totals.tierDiscountAmount > 0 
    ? `-₹${totals.tierDiscountAmount.toFixed(2)} (5% Auto)` 
    : '-₹0.00';

  summaryTax.textContent = `₹${totals.taxAmount.toFixed(2)}`;
  summaryShipping.textContent = totals.effectiveShipping === 0 
    ? (state.cart.length > 0 && state.appliedCoupon?.type === 'shipping' ? 'FREE' : '₹0.00')
    : `₹${totals.effectiveShipping.toFixed(2)}`;

  summaryGrandTotal.textContent = `₹${totals.grandTotal.toFixed(2)}`;

  // Savings Badge visibility
  if (totals.totalSavings > 0) {
    summarySavingsBadge.style.display = 'block';
    summarySavingsAmount.textContent = `₹${totals.totalSavings.toFixed(2)}`;
  } else {
    summarySavingsBadge.style.display = 'none';
  }

  // Tiered Auto Discount Banner
  if (totals.isEligibleForTierDiscount) {
    autoDiscountBanner.style.background = '#ecfdf5';
    autoDiscountBanner.style.color = '#059669';
    autoDiscountBanner.style.borderColor = '#10b981';
    autoDiscountText.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>5% Extra Volume Discount Applied!</strong> (3+ items)';
  } else {
    autoDiscountBanner.style.background = '#f5f3ff';
    autoDiscountBanner.style.color = '#7c3aed';
    autoDiscountBanner.style.borderColor = 'rgba(124, 58, 237, 0.2)';
    autoDiscountText.textContent = `Add ${3 - totals.totalItemCount > 0 ? 3 - totals.totalItemCount : 1} more item(s) for automatic 5% extra volume discount!`;
  }

  // Update Console Inspector
  updateInspectorConsole(totals);
}

/**
 * Live JS Array Methods & Object Inspector Console
 */
function updateInspectorConsole(totals) {
  // Format code snippet highlighting Array Methods used
  inspectorCode.textContent = `// REAL-TIME JS EXECUTIONS:
const calculateCart = (cart) => {
  // 1. Array.prototype.reduce() -> Subtotal & Items
  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // 2. Array.prototype.find() -> Coupon lookup
  const promo = coupons.find(c => c.code === "${state.appliedCoupon ? state.appliedCoupon.code : 'NONE'}");

  // 3. Array.prototype.some() -> Category / Bulk Check
  const hasBulk = cart.some(i => i.quantity >= 2) || itemCount >= 3;

  // 4. Object Handling -> Destructuring & State snapshot
  return { subtotal, itemCount, grandTotal: ${totals.grandTotal.toFixed(2)} };
};`;

  // Format JSON snapshot using Object.entries()
  const snapshot = {
    cartLength: state.cart.length,
    totalItems: totals.totalItemCount,
    subtotal: Number(totals.subtotal.toFixed(2)),
    appliedCoupon: state.appliedCoupon ? state.appliedCoupon.code : null,
    couponDiscount: Number(totals.couponDiscountAmount.toFixed(2)),
    tierDiscount: Number(totals.tierDiscountAmount.toFixed(2)),
    tax: Number(totals.taxAmount.toFixed(2)),
    grandTotal: Number(totals.grandTotal.toFixed(2)),
    totalSavings: Number(totals.totalSavings.toFixed(2)),
    cartCategories: [...new Set(state.cart.map(i => i.category))]
  };

  inspectorOutput.textContent = JSON.stringify(snapshot, null, 2);
}

// ==========================================
// 5. CART & CATALOG MUTATIONS
// ==========================================

/**
 * Add a New Custom Product to the Catalog
 */
function handleAddProduct(e) {
  e.preventDefault();

  const name = prodName.value.trim();
  const price = parseFloat(prodPrice.value);
  const category = prodCategory.value;
  const icon = prodIcon.value || '📦';

  if (!name || isNaN(price) || price <= 0) {
    addProductFeedback.className = 'form-feedback error';
    addProductFeedback.textContent = 'Please enter a valid product name and positive price!';
    return;
  }

  // Create new product object (Demonstrating Object creation & Array pushing)
  const newProduct = {
    id: 'p_' + Date.now(),
    name: name,
    category: category,
    price: price,
    oldPrice: Math.round(price * 1.25 * 100) / 100, // ~25% higher list price for demonstration tag
    rating: 5.0,
    icon: icon,
    stock: 20
  };

  // Mutate state using Array unshift to place new product at top
  state.products.unshift(newProduct);

  // Update UI components
  renderCategoryChips();
  renderProductGrid();

  // Reset form inputs
  prodName.value = '';
  prodPrice.value = '';
  
  // Display success feedback
  addProductFeedback.className = 'form-feedback success';
  addProductFeedback.textContent = `Product "${name}" added to catalog successfully!`;

  setTimeout(() => {
    addProductFeedback.textContent = '';
  }, 4000);
}

/**
 * Add Product to Cart using Array.prototype.find() and Object cloning
 */
function addToCart(productId) {
  // Array.prototype.find() locates product object by ID
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  // Check if item already in cart using Array.prototype.find()
  const existingCartItem = state.cart.find(item => item.id === productId);

  if (existingCartItem) {
    // Immutable Object update using Spread Operator
    state.cart = state.cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    // Add new object with quantity: 1
    state.cart.push({ ...product, quantity: 1 });
  }

  renderCartItems();
  updateSummaryUI();
}

/**
 * Update Quantity using Array.prototype.map() and filter()
 */
function updateQuantity(productId, newQty) {
  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }

  // Array.prototype.map() updates exact item
  state.cart = state.cart.map(item => 
    item.id === productId ? { ...item, quantity: newQty } : item
  );

  renderCartItems();
  updateSummaryUI();
}

/**
 * Remove Item from Cart using Array.prototype.filter()
 */
function removeFromCart(productId) {
  // Array.prototype.filter() removes item matching ID
  state.cart = state.cart.filter(item => item.id !== productId);

  renderCartItems();
  updateSummaryUI();
}

/**
 * Clear Entire Cart
 */
function clearCart() {
  state.cart = [];
  state.appliedCoupon = null;
  couponInput.value = '';
  couponFeedback.textContent = '';
  renderCartItems();
  updateSummaryUI();
}

/**
 * Apply Coupon Code using Array.prototype.find()
 */
function applyCouponCode(codeToApply) {
  const code = (codeToApply || couponInput.value).trim().toUpperCase();
  if (!code) return;

  // Array.prototype.find() searches for coupon object
  const coupon = COUPONS.find(c => c.code === code);
  const totals = calculateCartTotals();

  if (!coupon) {
    couponFeedback.className = 'coupon-feedback error';
    couponFeedback.textContent = `Invalid coupon code "${code}". Try SAVE10 or SUPER20!`;
    return;
  }

  if (totals.subtotal < coupon.minSubtotal) {
    couponFeedback.className = 'coupon-feedback error';
    couponFeedback.textContent = `Coupon "${code}" requires minimum subtotal of ₹${coupon.minSubtotal}.`;
    return;
  }

  state.appliedCoupon = coupon;
  couponInput.value = code;
  couponFeedback.className = 'coupon-feedback success';
  couponFeedback.textContent = `Coupon "${code}" applied successfully! (${coupon.description})`;

  updateSummaryUI();
}

/**
 * Handle Checkout Modal & Receipt Generation using Array.prototype.map() & reduce()
 */
function handleCheckout() {
  if (state.cart.length === 0) {
    alert('Your cart is empty. Please add items to checkout!');
    return;
  }

  const totals = calculateCartTotals();

  // Generate Receipt HTML via Array.prototype.map()
  const itemsReceiptHtml = state.cart.map(item => `
    <div class="receipt-line">
      <span>${item.name} (x${item.quantity})</span>
      <span>₹${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

  receiptDetails.innerHTML = `
    <div style="font-weight: 700; margin-bottom: 8px; color: #4f46e5; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">Order Breakdown:</div>
    ${itemsReceiptHtml}
    <div style="border-top: 1px dashed #cbd5e1; margin: 8px 0; padding-top: 8px;">
      <div class="receipt-line"><span>Subtotal:</span><span>₹${totals.subtotal.toFixed(2)}</span></div>
      ${totals.couponDiscountAmount > 0 ? `<div class="receipt-line" style="color:#059669"><span>Coupon Savings:</span><span>-₹${totals.couponDiscountAmount.toFixed(2)}</span></div>` : ''}
      ${totals.tierDiscountAmount > 0 ? `<div class="receipt-line" style="color:#059669"><span>Volume Bonus:</span><span>-₹${totals.tierDiscountAmount.toFixed(2)}</span></div>` : ''}
      <div class="receipt-line"><span>Tax (8%):</span><span>₹${totals.taxAmount.toFixed(2)}</span></div>
      <div class="receipt-line"><span>Shipping:</span><span>${totals.effectiveShipping === 0 ? 'FREE' : '₹' + totals.effectiveShipping.toFixed(2)}</span></div>
      <div class="receipt-line" style="font-weight: 700; font-size: 1.05rem; margin-top: 6px;"><span>Paid Total:</span><span style="color:#4f46e5">₹${totals.grandTotal.toFixed(2)}</span></div>
    </div>
  `;

  checkoutModal.classList.add('active');
}

// ==========================================
// 6. EVENT LISTENERS SETUP
// ==========================================
function setupEventListeners() {
  // Add Product Form Submit
  if (addProductForm) {
    addProductForm.addEventListener('submit', handleAddProduct);
  }

  // Category Chips Filter
  categoryChips.addEventListener('click', (e) => {
    if (e.target.classList.contains('chip-btn')) {
      state.selectedCategory = e.target.dataset.category;
      renderCategoryChips();
      renderProductGrid();
    }
  });

  // Search Input
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderProductGrid();
  });

  // Sort Dropdown
  sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderProductGrid();
  });

  // Coupon Buttons & Input
  applyCouponBtn.addEventListener('click', () => applyCouponCode());
  couponInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') applyCouponCode();
  });

  // Clear Cart Button
  clearCartBtn.addEventListener('click', clearCart);

  // Checkout Button
  checkoutBtn.addEventListener('click', handleCheckout);

  // Modal Close
  modalCloseBtn.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
    clearCart();
  });

  // Inspector Drawer Toggle
  toggleInspectorBtn.addEventListener('click', () => {
    inspectorCard.classList.toggle('collapsed');
    const isCollapsed = inspectorCard.classList.contains('collapsed');
    inspectorToggleIcon.className = isCollapsed ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-up';
  });
}

// ==========================================
// 7. INITIALIZATION
// ==========================================
function initApp() {
  renderCategoryChips();
  renderProductGrid();
  renderCartItems();
  renderAvailableCoupons();
  updateSummaryUI();
  setupEventListeners();

  // Add default items to cart for instant colorful visual demonstration
  addToCart('p1'); // Headphones
  addToCart('p3'); // Mechanical Keyboard
  addToCart('p6'); // Insulated Tumbler
  applyCouponCode('SAVE10');
}

// Run app after DOM loads
document.addEventListener('DOMContentLoaded', initApp);
