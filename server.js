// server.js - LCart Locality Service Provider API & Application Server
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'lcart_super_secret_locality_token_key_2026';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Authentication Helper & Middleware
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Missing token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid token.' });
  }
}

// Optional Auth (for guest or logged-in users)
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      // Ignore invalid token in optional auth
    }
  }
  next();
}

// ======================== API ROUTES ========================

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'LCart Locality Service Provider Pvt Ltd',
    version: '1.0.0',
    dbInfo: db.getEngineInfo(),
    timestamp: new Date().toISOString()
  });
});

// Stats
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// AUTH: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '',
      passwordHash,
      address: address || '',
      role: 'customer'
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to LCart.',
      token,
      user
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed: ' + err.message });
  }
});

// AUTH: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role
    };

    res.json({
      success: true,
      message: 'Welcome back, ' + user.name + '!',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed: ' + err.message });
  }
});

// AUTH: Current User Profile
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CATEGORIES: List
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.getCategories();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// SERVICES: List with search & filters
app.get('/api/services', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    const services = await db.getServices({ category, search, minPrice, maxPrice, sort });
    res.json({ success: true, count: services.length, services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// SERVICES: Single Detail with reviews
app.get('/api/services/:id', async (req, res) => {
  try {
    const service = await db.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    const reviews = await db.getReviews(service.id);
    res.json({ success: true, service, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PROVIDERS: List Local Verified Professionals
app.get('/api/providers', async (req, res) => {
  try {
    const { category } = req.query;
    const providers = await db.getProviders(category);
    res.json({ success: true, count: providers.length, providers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// BOOKINGS / ORDERS: Create New Booking
app.post('/api/bookings', optionalAuth, async (req, res) => {
  try {
    const {
      service_id,
      service_title,
      booking_date,
      time_slot,
      customer_name,
      customer_phone,
      customer_email,
      address,
      locality,
      notes,
      total_price
    } = req.body;

    if (!service_id || !booking_date || !time_slot || !customer_name || !customer_phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking details. Please provide full contact, slot, and address.'
      });
    }

    const userId = req.user ? req.user.id : (req.body.user_id || 'guest-' + Date.now());

    const booking = await db.createBooking({
      user_id: userId,
      service_id,
      service_title: service_title || 'Local Home Service',
      booking_date,
      time_slot,
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      customer_email: customer_email ? customer_email.trim() : '',
      address: address.trim(),
      locality: locality || 'Main City Area',
      notes: notes || '',
      total_price: Number(total_price) || 299
    });

    res.status(201).json({
      success: true,
      message: `Booking ${booking.id} placed successfully! An executive is assigned.`,
      booking
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ success: false, message: 'Booking failed: ' + err.message });
  }
});

// BOOKINGS / ORDERS: Fetch User Bookings
app.get('/api/bookings', optionalAuth, async (req, res) => {
  try {
    if (req.user) {
      if (req.user.role === 'admin') {
        const allBookings = await db.getAllBookings();
        return res.json({ success: true, bookings: allBookings, isAdmin: true });
      }
      const userBookings = await db.getUserBookings(req.user.id);
      return res.json({ success: true, bookings: userBookings });
    }

    // Guest lookup by email or phone
    const { email, phone, user_id } = req.query;
    if (user_id) {
      const userBookings = await db.getUserBookings(user_id);
      return res.json({ success: true, bookings: userBookings });
    }

    if (email) {
      const all = await db.getAllBookings();
      const filtered = all.filter(b => b.customer_email.toLowerCase() === email.toLowerCase());
      return res.json({ success: true, bookings: filtered });
    }

    // Return all recent public demo bookings if none specified
    const all = await db.getAllBookings();
    res.json({ success: true, bookings: all.slice(0, 10) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// BOOKINGS / ORDERS: Update Status (Cancel or Complete)
app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }
    const updated = await db.updateBookingStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    res.json({ success: true, message: `Booking status updated to ${status}.`, booking: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// REVIEWS: Add Review
app.post('/api/reviews', optionalAuth, async (req, res) => {
  try {
    const { service_id, rating, comment, user_name } = req.body;
    if (!service_id || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Service, rating, and feedback comment are required.' });
    }
    const reviewerName = req.user ? req.user.name : (user_name || 'Verified Customer');
    const review = await db.addReview({
      service_id,
      user_name: reviewerName,
      rating: Number(rating),
      comment: comment.trim()
    });
    res.status(201).json({ success: true, message: 'Thank you for your feedback!', review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Catch-all route to serve SPA frontend or 404 for APIs (Express 5 compatible)
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server after initializing DB
async function startServer() {
  await db.initialize();
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 LCart Locality Service Provider Server Running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📊 DB Mode: ${db.getEngineInfo().engine}`);
    console.log(`🌐 API Endpoints: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
}

// Automatically initialize db
db.initialize().catch(err => console.error('DB Init error:', err));

if (!process.env.VERCEL) {
  startServer().catch(err => {
    console.error('Fatal server startup error:', err);
  });
}

module.exports = app;
