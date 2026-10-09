// app.js - Full-Featured Client for LCart Locality Service Provider
document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentUser = null;
  let authToken = localStorage.getItem('lcart_token') || null;
  let categories = [];
  let services = [];
  let providers = [];
  let userBookings = [];
  let activeCategory = 'all';
  let activeSort = 'popular';
  let searchQuery = '';
  let selectedBookingService = null;
  let selectedSlot = 'Morning (09:00 AM - 12:00 PM)';
  let currentLocality = localStorage.getItem('lcart_locality') || 'Central City / All Localities';

  // DOM Elements
  const servicesGrid = document.getElementById('servicesGrid');
  const categoriesGrid = document.getElementById('categoriesGrid');
  const providersGrid = document.getElementById('providersGrid');
  const heroSearchInput = document.getElementById('heroSearchInput');
  const heroSearchBtn = document.getElementById('heroSearchBtn');
  const serviceSearchInput = document.getElementById('serviceSearchInput');
  const sortSelect = document.getElementById('sortSelect');
  const categoryFilterSelect = document.getElementById('categoryFilterSelect');
  const localitySelect = document.getElementById('localitySelect');
  const heroLocalitySelect = document.getElementById('heroLocalitySelect');
  const navUserSection = document.getElementById('navUserSection');
  const ordersSection = document.getElementById('ordersSection');
  const ordersList = document.getElementById('ordersList');

  // Modals
  const authModal = document.getElementById('authModal');
  const bookingModal = document.getElementById('bookingModal');
  const detailsModal = document.getElementById('detailsModal');
  const toastContainer = document.getElementById('toastContainer');

  // Quick Chips Container
  const heroQuickChips = document.getElementById('heroQuickChips');

  // ------------------ TOAST SYSTEM ------------------
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ------------------ API UTILS ------------------
  async function apiFetch(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    try {
      const res = await fetch(url, { ...options, headers });
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (err) {
      console.error('Fetch error:', err);
      return { credentials: null, ok: false, data: { message: 'Network or server error.' } };
    }
  }

  // ------------------ AUTHENTICATION ------------------
  async function checkAuth() {
    const storedUser = localStorage.getItem('lcart_user');
    if (storedUser && authToken) {
      try {
        currentUser = JSON.parse(storedUser);
        updateNavUserUI();
        loadUserBookings();
      } catch (e) {
        logout();
      }
    } else {
      updateNavUserUI();
    }
  }

  function updateNavUserUI() {
    if (currentUser) {
      navUserSection.innerHTML = `
        <div class="user-menu-btn" id="userMenuBtn">
          <div class="user-avatar-circle">${currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</div>
          <span>${currentUser.name.split(' ')[0]}</span>
          <button class="btn btn-sm btn-outline" id="navLogoutBtn" title="Logout" style="margin-left: 6px; padding: 4px 8px;">Logout</button>
        </div>
      `;
      document.getElementById('navLogoutBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        logout();
      });
      ordersSection.style.display = 'block';
    } else {
      navUserSection.innerHTML = `
        <button class="btn btn-outline" id="navLoginBtn">Log In</button>
        <button class="btn btn-primary" id="navSignupBtn">Sign Up</button>
      `;
      document.getElementById('navLoginBtn').addEventListener('click', () => openAuthModal('login'));
      document.getElementById('navSignupBtn').addEventListener('click', () => openAuthModal('register'));
      ordersSection.style.display = 'none';
    }
  }

  function openAuthModal(initialTab = 'login') {
    authModal.classList.add('open');
    switchAuthTab(initialTab);
  }

  function closeAuthModal() {
    authModal.classList.remove('open');
  }

  function switchAuthTab(tab) {
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const formLogin = document.getElementById('formLogin');
    const formRegister = document.getElementById('formRegister');

    if (tab === 'login') {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      formLogin.style.display = 'block';
      formRegister.style.display = 'none';
    } else {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      formRegister.style.display = 'block';
      formLogin.style.display = 'none';
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginSubmitBtn');

    btn.disabled = true;
    btn.textContent = 'Verifying...';

    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    btn.disabled = false;
    btn.textContent = 'Sign In';

    if (res.ok && res.data.success) {
      authToken = res.data.token;
      currentUser = res.data.user;
      localStorage.setItem('lcart_token', authToken);
      localStorage.setItem('lcart_user', JSON.stringify(currentUser));
      updateNavUserUI();
      closeAuthModal();
      showToast(res.data.message || 'Logged in successfully!', 'success');
      loadUserBookings();
    } else {
      showToast(res.data.message || 'Login failed', 'error');
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const address = document.getElementById('regAddress').value;
    const btn = document.getElementById('registerSubmitBtn');

    btn.disabled = true;
    btn.textContent = 'Registering Account...';

    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password, address })
    });

    btn.disabled = false;
    btn.textContent = 'Create Free Account';

    if (res.ok && res.data.success) {
      authToken = res.data.token;
      currentUser = res.data.user;
      localStorage.setItem('lcart_token', authToken);
      localStorage.setItem('lcart_user', JSON.stringify(currentUser));
      updateNavUserUI();
      closeAuthModal();
      showToast('Registration successful! Welcome to LCart.', 'success');
      loadUserBookings();
    } else {
      showToast(res.data.message || 'Registration failed', 'error');
    }
  }

  function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('lcart_token');
    localStorage.removeItem('lcart_user');
    updateNavUserUI();
    showToast('You have been logged out.', 'info');
  }

  // Quick Demo Login for instant test
  window.quickDemoLogin = async function(email = 'demo@lcart.com', pass = 'password123') {
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = pass;
    document.getElementById('formLogin').dispatchEvent(new Event('submit'));
  };

  // ------------------ DATA LOADERS ------------------
  async function loadStats() {
    const res = await apiFetch('/api/stats');
    if (res.ok && res.data.success) {
      const s = res.data.stats;
      document.getElementById('statBookings').textContent = Number(s.totalBookings).toLocaleString() + '+';
      document.getElementById('statPartners').textContent = Number(s.verifiedPartners).toLocaleString() + '+';
      document.getElementById('statSatisfaction').textContent = s.customerSatisfaction;
      document.getElementById('statSpeed').textContent = s.avgResponseMinutes + ' Mins';
    }
  }

  async function loadCategories() {
    const res = await apiFetch('/api/categories');
    if (res.ok && res.data.success) {
      categories = res.data.categories;
      renderCategories();
      renderCategoryFilterDropdown();
      renderQuickChips();
    }
  }

  function renderCategories() {
    if (!categoriesGrid) return;
    categoriesGrid.innerHTML = categories.map(cat => `
      <div class="category-card ${activeCategory === cat.id ? 'active' : ''}" data-cat-id="${cat.id}">
        <span class="category-badge">${cat.badge}</span>
        <div class="category-icon-box">${cat.icon}</div>
        <h3>${cat.name}</h3>
        <p>${cat.description}</p>
        <div class="category-link">Explore Services &rarr;</div>
      </div>
    `).join('');

    categoriesGrid.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const catId = card.getAttribute('data-cat-id');
        setActiveCategory(catId);
        scrollToSection('servicesSection');
      });
    });
  }

  function renderCategoryFilterDropdown() {
    if (!categoryFilterSelect) return;
    categoryFilterSelect.innerHTML = `<option value="all">All Service Categories</option>` +
      categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  function renderQuickChips() {
    if (!heroQuickChips) return;
    heroQuickChips.innerHTML = `
      <span class="chip-label">Popular:</span>
      <span class="quick-chip" data-cat="all">⚡ All Services</span>
      ${categories.slice(0, 5).map(c => `<span class="quick-chip" data-cat="${c.id}">${c.icon} ${c.name}</span>`).join('')}
    `;

    heroQuickChips.querySelectorAll('.quick-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.getAttribute('data-cat');
        setActiveCategory(cat);
        scrollToSection('servicesSection');
      });
    });
  }

  async function loadServices() {
    let url = `/api/services?category=${encodeURIComponent(activeCategory)}&sort=${encodeURIComponent(activeSort)}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

    const res = await apiFetch(url);
    if (res.ok && res.data.success) {
      services = res.data.services;
      renderServices();
    }
  }

  function renderServices() {
    if (!servicesGrid) return;
    if (services.length === 0) {
      servicesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: #fff; border-radius: 16px; border: 1px dashed #cbd5e1;">
          <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
          <h3>No services found matching your criteria</h3>
          <p style="color: #64748b; margin-bottom: 18px;">Try searching with different keywords like "painter", "cleaner", or "wiring".</p>
          <button class="btn btn-secondary" id="resetFiltersBtn">Reset All Filters</button>
        </div>
      `;
      document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
        activeCategory = 'all';
        searchQuery = '';
        serviceSearchInput.value = '';
        heroSearchInput.value = '';
        categoryFilterSelect.value = 'all';
        loadServices();
      });
      return;
    }

    servicesGrid.innerHTML = services.map(srv => {
      const cat = categories.find(c => c.id === srv.category_id);
      const catName = cat ? cat.name : 'Local Service';
      return `
        <div class="service-card" data-srv-id="${srv.id}">
          <div class="service-thumb-wrap">
            <img src="${srv.image_url}" alt="${srv.title}" class="service-thumb" loading="lazy">
            <span class="service-card-tag">${srv.duration || 'Fast Booking'}</span>
            <div class="service-rating-badge">★ ${srv.rating} <span style="color:#64748b; font-size:0.75rem">(${srv.reviews_count})</span></div>
          </div>
          <div class="service-content">
            <div class="service-category-tag">${catName}</div>
            <h3>${srv.title}</h3>
            <p>${srv.description}</p>
            <div class="service-features-list">
              ${(srv.features || []).map(f => `<span class="service-feature-pill">✓ ${f}</span>`).join('')}
            </div>
            <div class="service-footer">
              <div class="service-price-block">
                <span class="price-starting">Starting from</span>
                <span class="price-amount">₹${srv.price} <span>/ fix</span></span>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-sm btn-outline btn-details" data-srv-id="${srv.id}">Info</button>
                <button class="btn btn-sm btn-primary btn-book" data-srv-id="${srv.id}">Book Now</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners
    servicesGrid.querySelectorAll('.btn-book').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-srv-id');
        openBookingModal(id);
      });
    });

    servicesGrid.querySelectorAll('.btn-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-srv-id');
        openDetailsModal(id);
      });
    });
  }

  async function loadProviders() {
    const res = await apiFetch('/api/providers');
    if (res.ok && res.data.success) {
      providers = res.data.providers;
      renderProviders();
    }
  }

  function renderProviders() {
    if (!providersGrid) return;
    providersGrid.innerHTML = providers.map(p => `
      <div class="provider-card">
        <div class="provider-avatar-box">
          <img src="${p.avatar_url}" alt="${p.name}" class="provider-avatar">
          <span class="verified-badge-icon" title="Police Background Verified">✓</span>
        </div>
        <div class="provider-details">
          <h4>${p.name}</h4>
          <div class="provider-profession">${p.profession}</div>
          <div class="provider-meta-row">
            <span>⭐ ${p.rating} Rating</span>
            <span>💼 ${p.jobs_completed}+ Jobs</span>
            <span>⏱️ ${p.experience} Exp</span>
          </div>
          <div class="provider-locality">📍 ${p.locality}</div>
          <div>
            <button class="btn btn-sm btn-outline provider-direct-book" data-cat-id="${p.category_id}" style="width: 100%;">
              Book ${p.name.split(' ')[0]}
            </button>
          </div>
        </div>
      </div>
    `).join('');

    providersGrid.querySelectorAll('.provider-direct-book').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-cat-id');
        setActiveCategory(catId);
        scrollToSection('servicesSection');
      });
    });
  }

  // ------------------ BOOKINGS & ORDERS ------------------
  async function loadUserBookings() {
    const res = await apiFetch('/api/bookings');
    if (res.ok && res.data.success) {
      userBookings = res.data.bookings || [];
      renderUserBookings();
    }
  }

  function renderUserBookings() {
    if (!ordersList) return;
    if (userBookings.length === 0) {
      ordersList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #64748b;">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">📋</div>
          <h4>No Bookings Found</h4>
          <p>You haven't booked any services yet. Choose from our wide catalog to book today.</p>
        </div>
      `;
      return;
    }

    ordersList.innerHTML = userBookings.map(b => {
      let statusClass = 'status-confirmed';
      if (b.status === 'In Progress') statusClass = 'status-inprogress';
      if (b.status === 'Completed') statusClass = 'status-completed';
      if (b.status === 'Cancelled') statusClass = 'status-cancelled';

      return `
        <div class="order-item-card">
          <div class="order-main-info">
            <span class="order-id-badge">${b.id}</span>
            <div class="order-service-name">${b.service_title}</div>
            <div class="order-meta">
              <span>📅 ${b.booking_date}</span>
              <span>⏰ ${b.time_slot}</span>
              <span>📍 ${b.address}, ${b.locality || ''}</span>
              <span>👤 ${b.customer_name} (${b.customer_phone})</span>
            </div>
            ${b.notes ? `<div style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">Note: "${b.notes}"</div>` : ''}
          </div>
          <div class="order-right-actions">
            <span class="status-pill ${statusClass}">${b.status}</span>
            <div style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; color: #0f172a;">
              ₹${b.total_price}
            </div>
            ${b.status === 'Confirmed' ? `
              <button class="btn btn-sm btn-outline cancel-order-btn" data-order-id="${b.id}" style="color: #ef4444; border-color: #fecaca;">
                Cancel Order
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    ordersList.querySelectorAll('.cancel-order-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-order-id');
        if (confirm(`Are you sure you want to cancel order ${id}?`)) {
          const res = await apiFetch(`/api/bookings/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'Cancelled' })
          });
          if (res.ok) {
            showToast('Booking cancelled successfully.', 'info');
            loadUserBookings();
          }
        }
      });
    });
  }

  // ------------------ BOOKING MODAL WIZARD ------------------
  function openBookingModal(serviceId) {
    const srv = services.find(s => s.id === serviceId);
    if (!srv) return;
    selectedBookingService = srv;

    // Reset steps
    setBookingWizardStep(1);

    // Populate summary
    document.getElementById('bookingSummaryImg').src = srv.image_url;
    document.getElementById('bookingSummaryTitle').textContent = srv.title;
    document.getElementById('bookingSummaryPrice').textContent = '₹' + srv.price;

    // Prefill user details if logged in
    if (currentUser) {
      document.getElementById('bookName').value = currentUser.name || '';
      document.getElementById('bookEmail').value = currentUser.email || '';
      document.getElementById('bookPhone').value = currentUser.phone || '';
      document.getElementById('bookAddress').value = currentUser.address || '';
    }

    // Default booking date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    document.getElementById('bookDate').value = `${yyyy}-${mm}-${dd}`;
    document.getElementById('bookDate').min = `${yyyy}-${mm}-${dd}`;

    bookingModal.classList.add('open');
  }

  function closeBookingModal() {
    bookingModal.classList.remove('open');
  }

  function setBookingWizardStep(step) {
    document.getElementById('bookingStep1').style.display = step === 1 ? 'block' : 'none';
    document.getElementById('bookingStep2').style.display = step === 2 ? 'block' : 'none';
    document.getElementById('bookingStep3').style.display = step === 3 ? 'block' : 'none';
    document.getElementById('bookingSuccessStep').style.display = step === 4 ? 'block' : 'none';

    document.querySelectorAll('.wizard-step').forEach(el => {
      const st = parseInt(el.getAttribute('data-step'), 10);
      if (st <= step) el.classList.add('active');
      else el.classList.remove('active');
    });
  }

  async function handleBookingSubmit(e) {
    e.preventDefault();
    if (!selectedBookingService) return;

    const name = document.getElementById('bookName').value.trim();
    const phone = document.getElementById('bookPhone').value.trim();
    const email = document.getElementById('bookEmail').value.trim();
    const address = document.getElementById('bookAddress').value.trim();
    const locality = document.getElementById('bookLocality').value.trim() || currentLocality;
    const date = document.getElementById('bookDate').value;
    const notes = document.getElementById('bookNotes').value.trim();
    const submitBtn = document.getElementById('submitBookingFinalBtn');

    if (!name || !phone || !address || !date) {
      showToast('Please fill in all mandatory booking fields.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing Booking...';

    const payload = {
      service_id: selectedBookingService.id,
      service_title: selectedBookingService.title,
      booking_date: date,
      time_slot: selectedSlot,
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      address,
      locality,
      notes,
      total_price: selectedBookingService.price
    };

    const res = await apiFetch('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirm & Place Booking';

    if (res.ok && res.data.success) {
      const booking = res.data.booking;
      document.getElementById('successOrderId').textContent = booking.id;
      document.getElementById('successServiceTitle').textContent = booking.service_title;
      document.getElementById('successDateTime').textContent = `${booking.booking_date} (${booking.time_slot})`;
      setBookingWizardStep(4);
      showToast('Order placed successfully!', 'success');
      loadUserBookings();
    } else {
      showToast(res.data.message || 'Booking failed.', 'error');
    }
  }

  // ------------------ SERVICE DETAILS MODAL ------------------
  async function openDetailsModal(serviceId) {
    const res = await apiFetch(`/api/services/${serviceId}`);
    if (res.ok && res.data.success) {
      const srv = res.data.service;
      const reviews = res.data.reviews || [];

      document.getElementById('detailImg').src = srv.image_url;
      document.getElementById('detailTitle').textContent = srv.title;
      document.getElementById('detailDesc').textContent = srv.description;
      document.getElementById('detailPrice').textContent = '₹' + srv.price;
      document.getElementById('detailDuration').textContent = srv.duration;
      document.getElementById('detailRating').textContent = `★ ${srv.rating} (${srv.reviews_count} reviews)`;

      const featuresBox = document.getElementById('detailFeatures');
      featuresBox.innerHTML = (srv.features || []).map(f => `<span class="service-feature-pill">✓ ${f}</span>`).join('');

      const reviewsBox = document.getElementById('detailReviewsList');
      if (reviews.length > 0) {
        reviewsBox.innerHTML = reviews.map(r => `
          <div style="background:#f8fafc; padding:12px; border-radius:8px; margin-bottom:10px; border:1px solid #e2e8f0;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <strong>${r.user_name}</strong>
              <span style="color:#f59e0b;">${'★'.repeat(r.rating)}</span>
            </div>
            <p style="font-size:0.85rem; color:#475569; margin:0;">"${r.comment}"</p>
          </div>
        `).join('');
      } else {
        reviewsBox.innerHTML = `<p style="font-size:0.85rem; color:#94a3b8;">No reviews yet for this service.</p>`;
      }

      document.getElementById('detailBookBtn').onclick = () => {
        closeDetailsModal();
        openBookingModal(srv.id);
      };

      detailsModal.classList.add('open');
    }
  }

  function closeDetailsModal() {
    detailsModal.classList.remove('open');
  }

  // ------------------ HELPERS & EVENT HANDLERS ------------------
  function setActiveCategory(catId) {
    activeCategory = catId;
    if (categoryFilterSelect) categoryFilterSelect.value = catId;
    renderCategories();
    loadServices();
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Event Listeners for Filters
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      loadServices();
    });
  }

  if (categoryFilterSelect) {
    categoryFilterSelect.addEventListener('change', (e) => {
      activeCategory = e.target.value;
      renderCategories();
      loadServices();
    });
  }

  if (serviceSearchInput) {
    serviceSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      loadServices();
    });
  }

  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', () => {
      searchQuery = heroSearchInput.value.trim();
      if (serviceSearchInput) serviceSearchInput.value = searchQuery;
      loadServices();
      scrollToSection('servicesSection');
    });
  }

  if (heroSearchInput) {
    heroSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        heroSearchBtn.click();
      }
    });
  }

  // Locality Selectors
  if (localitySelect) {
    localitySelect.value = currentLocality;
    localitySelect.addEventListener('change', (e) => {
      currentLocality = e.target.value;
      localStorage.setItem('lcart_locality', currentLocality);
      if (heroLocalitySelect) heroLocalitySelect.value = currentLocality;
      showToast(`Locality updated to: ${currentLocality}`, 'info');
    });
  }

  if (heroLocalitySelect) {
    heroLocalitySelect.value = currentLocality;
    heroLocalitySelect.addEventListener('change', (e) => {
      currentLocality = e.target.value;
      localStorage.setItem('lcart_locality', currentLocality);
      if (localitySelect) localitySelect.value = currentLocality;
    });
  }

  // Slot buttons
  document.querySelectorAll('.slot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSlot = btn.getAttribute('data-slot');
    });
  });

  // Modal Close buttons
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAuthModal();
      closeBookingModal();
      closeDetailsModal();
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAuthModal();
        closeBookingModal();
        closeDetailsModal();
      }
    });
  });

  // Auth Form submits
  document.getElementById('formLogin')?.addEventListener('submit', handleLogin);
  document.getElementById('formRegister')?.addEventListener('submit', handleRegister);
  document.getElementById('tabLogin')?.addEventListener('click', () => switchAuthTab('login'));
  document.getElementById('tabRegister')?.addEventListener('click', () => switchAuthTab('register'));

  // Booking step progression
  document.getElementById('step1NextBtn')?.addEventListener('click', () => setBookingWizardStep(2));
  document.getElementById('step2BackBtn')?.addEventListener('click', () => setBookingWizardStep(1));
  document.getElementById('step2NextBtn')?.addEventListener('click', () => {
    const d = document.getElementById('bookDate').value;
    if (!d) {
      showToast('Please select a booking date.', 'error');
      return;
    }
    setBookingWizardStep(3);
  });
  document.getElementById('step3BackBtn')?.addEventListener('click', () => setBookingWizardStep(2));
  document.getElementById('bookingForm')?.addEventListener('submit', handleBookingSubmit);

  document.getElementById('viewBookingsFromSuccessBtn')?.addEventListener('click', () => {
    closeBookingModal();
    if (ordersSection) {
      ordersSection.style.display = 'block';
      scrollToSection('ordersSection');
    }
  });

  // Header Navigation smooth scrolling
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const el = document.getElementById(targetId.substring(1));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Initial Boot
  checkAuth();
  loadStats();
  loadCategories();
  loadServices();
  loadProviders();
});
