// db.js - Dual-Engine Database Manager (PostgreSQL + Local Fallback)
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const seedData = require('./data/seedData');

require('dotenv').config();

const DATA_DIR = path.join(__dirname, 'data');
const JSON_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let isPgConnected = false;
let pgPool = null;

// Local persistent storage cache
let localDb = {
  users: [],
  categories: [],
  services: [],
  providers: [],
  bookings: [],
  reviews: []
};

function saveLocalDb() {
  try {
    fs.writeFileSync(JSON_FILE, JSON.stringify(localDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error writing db.json:', err.message);
  }
}

function loadLocalDb() {
  if (fs.existsSync(JSON_FILE)) {
    try {
      const content = fs.readFileSync(JSON_FILE, 'utf-8');
      localDb = JSON.parse(content);
    } catch (e) {
      console.warn('[DB] Could not parse existing db.json, re-initializing.');
      initLocalSeed();
    }
  } else {
    initLocalSeed();
  }
}

function initLocalSeed() {
  const defaultPassword = 'password123';
  const salt = bcrypt.genSaltSync(10);
  const defaultHash = bcrypt.hashSync(defaultPassword, salt);

  localDb = {
    users: [
      {
        id: "usr-demo-1",
        name: "Kanha Sharma",
        email: "demo@lcart.com",
        phone: "+91 98765 00000",
        password_hash: defaultHash,
        address: "Flat 402, Green Valley Apartments, Civil Lines",
        role: "customer",
        created_at: new Date().toISOString()
      },
      {
        id: "usr-demo-admin",
        name: "LCart Admin",
        email: "admin@lcart.com",
        phone: "+91 1800 522 7800",
        password_hash: defaultHash,
        address: "LCart Corporate HQ, Sector 18",
        role: "admin",
        created_at: new Date().toISOString()
      }
    ],
    categories: [...seedData.categories],
    services: [...seedData.services],
    providers: [...seedData.providers],
    bookings: [
      {
        id: "BK-" + Math.floor(100000 + Math.random() * 900000),
        user_id: "usr-demo-1",
        service_id: "srv-elec-1",
        service_title: "Fan & Ceiling Light Installation / Repair",
        booking_date: "2026-10-12",
        time_slot: "Morning (09:00 AM - 12:00 PM)",
        customer_name: "Kanha Sharma",
        customer_phone: "+91 98765 00000",
        customer_email: "demo@lcart.com",
        address: "Flat 402, Green Valley Apartments, Civil Lines",
        locality: "Civil Lines",
        notes: "Need quick inspection of living room chandelier and regulator.",
        total_price: 199,
        status: "Confirmed",
        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ],
    reviews: [...seedData.sampleReviews]
  };
  saveLocalDb();
}

// PostgreSQL Table initialization
async function initPgTables(pool) {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(160) UNIQUE NOT NULL,
      phone VARCHAR(30),
      password_hash VARCHAR(255) NOT NULL,
      address TEXT,
      role VARCHAR(20) DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      slug VARCHAR(120) UNIQUE NOT NULL,
      icon VARCHAR(30),
      badge VARCHAR(60),
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS services (
      id VARCHAR(64) PRIMARY KEY,
      category_id VARCHAR(64) REFERENCES categories(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      price NUMERIC(10, 2) NOT NULL,
      duration VARCHAR(50),
      rating NUMERIC(3, 2) DEFAULT 5.0,
      reviews_count INT DEFAULT 0,
      image_url TEXT,
      features TEXT[],
      popular BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS providers (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      profession VARCHAR(120) NOT NULL,
      category_id VARCHAR(64),
      phone VARCHAR(30),
      rating NUMERIC(3, 2) DEFAULT 4.9,
      jobs_completed INT DEFAULT 0,
      experience VARCHAR(50),
      locality VARCHAR(120),
      verified BOOLEAN DEFAULT true,
      avatar_url TEXT
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      service_id VARCHAR(64),
      service_title VARCHAR(200),
      booking_date VARCHAR(30),
      time_slot VARCHAR(60),
      customer_name VARCHAR(120),
      customer_phone VARCHAR(30),
      customer_email VARCHAR(160),
      address TEXT,
      locality VARCHAR(120),
      notes TEXT,
      total_price NUMERIC(10, 2),
      status VARCHAR(30) DEFAULT 'Confirmed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id VARCHAR(64) PRIMARY KEY,
      service_id VARCHAR(64),
      user_name VARCHAR(120),
      rating INT,
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);

  // Seed PostgreSQL if categories empty
  const catCheck = await pool.query('SELECT COUNT(*) FROM categories');
  if (parseInt(catCheck.rows[0].count, 10) === 0) {
    console.log('[PostgreSQL] Seeding initial categories and services...');
    for (const cat of seedData.categories) {
      await pool.query(
        `INSERT INTO categories (id, name, slug, icon, badge, description)
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
        [cat.id, cat.name, cat.slug, cat.icon, cat.badge, cat.description]
      );
    }
    for (const s of seedData.services) {
      await pool.query(
        `INSERT INTO services (id, category_id, title, description, price, duration, rating, reviews_count, image_url, features, popular)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT DO NOTHING`,
        [s.id, s.category_id, s.title, s.description, s.price, s.duration, s.rating, s.reviews_count, s.image_url, s.features, s.popular]
      );
    }
    for (const p of seedData.providers) {
      await pool.query(
        `INSERT INTO providers (id, name, profession, category_id, phone, rating, jobs_completed, experience, locality, verified, avatar_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT DO NOTHING`,
        [p.id, p.name, p.profession, p.category_id, p.phone, p.rating, p.jobs_completed, p.experience, p.locality, p.verified, p.avatar_url]
      );
    }
    for (const r of seedData.sampleReviews) {
      await pool.query(
        `INSERT INTO reviews (id, service_id, user_name, rating, comment)
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
        [r.id, r.service_id, r.user_name, r.rating, r.comment]
      );
    }

    // Default users
    const salt = bcrypt.genSaltSync(10);
    const demoHash = bcrypt.hashSync('password123', salt);
    await pool.query(
      `INSERT INTO users (id, name, email, phone, password_hash, address, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
      ['usr-demo-1', 'Kanha Sharma', 'demo@lcart.com', '+91 98765 00000', demoHash, 'Flat 402, Green Valley Apartments', 'customer']
    );
    console.log('[PostgreSQL] Database seeded successfully.');
  }
}

// Connection Initializer
async function initializeDatabase() {
  loadLocalDb();

  const connectionString = process.env.DATABASE_URL || 
    (process.env.PGPASSWORD ? `postgres://${process.env.PGUSER || 'postgres'}:${encodeURIComponent(process.env.PGPASSWORD)}@${process.env.PGHOST || '127.0.0.1'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'postgres'}` : null);

  if (connectionString) {
    try {
      console.log('[DB] Connecting to PostgreSQL database...');
      pgPool = new Pool({
        connectionString,
        connectionTimeoutMillis: 3000
      });
      const res = await pgPool.query('SELECT NOW()');
      console.log(`[DB] Connected to PostgreSQL successfully at: ${res.rows[0].now}`);
      await initPgTables(pgPool);
      isPgConnected = true;
      return;
    } catch (err) {
      console.warn(`[DB] PostgreSQL connection attempt failed: ${err.message}`);
      console.warn('[DB] Seamlessly falling back to persistent JSON storage engine.');
      isPgConnected = false;
      pgPool = null;
    }
  } else {
    console.log('[DB] Note: PostgreSQL credentials not configured in .env. Using fast persistent storage engine.');
  }
}

// Unified Database API
const db = {
  initialize: initializeDatabase,

  getEngineInfo: () => ({
    engine: isPgConnected ? 'PostgreSQL' : 'Persistent Local Storage (db.json)',
    isPostgres: isPgConnected
  }),

  // Users
  findUserByEmail: async (email) => {
    if (isPgConnected && pgPool) {
      const res = await pgPool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
      return res.rows[0] || null;
    }
    return localDb.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById: async (id) => {
    if (isPgConnected && pgPool) {
      const res = await pgPool.query('SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    const u = localDb.users.find(x => x.id === id);
    if (!u) return null;
    const { password_hash, ...safeUser } = u;
    return safeUser;
  },

  createUser: async ({ name, email, phone, passwordHash, address, role = 'customer' }) => {
    const id = 'usr-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    const createdAt = new Date().toISOString();

    if (isPgConnected && pgPool) {
      const res = await pgPool.query(
        `INSERT INTO users (id, name, email, phone, password_hash, address, role, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, name, email, phone, address, role, created_at`,
        [id, name, email, phone || '', passwordHash, address || '', role, createdAt]
      );
      return res.rows[0];
    }

    const newUser = {
      id,
      name,
      email,
      phone: phone || '',
      password_hash: passwordHash,
      address: address || '',
      role,
      created_at: createdAt
    };
    localDb.users.push(newUser);
    saveLocalDb();

    const { password_hash, ...safe } = newUser;
    return safe;
  },

  // Categories
  getCategories: async () => {
    if (isPgConnected && pgPool) {
      const res = await pgPool.query('SELECT * FROM categories ORDER BY name ASC');
      return res.rows;
    }
    return localDb.categories;
  },

  // Services
  getServices: async ({ category, search, minPrice, maxPrice, sort } = {}) => {
    let list = [];
    if (isPgConnected && pgPool) {
      let query = 'SELECT * FROM services WHERE 1=1';
      const params = [];
      if (category && category !== 'all') {
        params.push(category);
        query += ` AND category_id = $${params.length}`;
      }
      if (search) {
        params.push(`%${search.toLowerCase()}%`);
        query += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`;
      }
      if (minPrice) {
        params.push(minPrice);
        query += ` AND price >= $${params.length}`;
      }
      if (maxPrice) {
        params.push(maxPrice);
        query += ` AND price <= $${params.length}`;
      }
      if (sort === 'price_asc') query += ' ORDER BY price ASC';
      else if (sort === 'price_desc') query += ' ORDER BY price DESC';
      else if (sort === 'rating') query += ' ORDER BY rating DESC';
      else query += ' ORDER BY popular DESC, rating DESC';

      const res = await pgPool.query(query, params);
      return res.rows;
    }

    // Local DB query
    list = [...localDb.services];
    if (category && category !== 'all') {
      list = list.filter(s => s.category_id === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    if (minPrice) list = list.filter(s => s.price >= Number(minPrice));
    if (maxPrice) list = list.filter(s => s.price <= Number(maxPrice));

    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.rating - a.rating);

    return list;
  },

  getServiceById: async (id) => {
    if (isPgConnected && pgPool) {
      const res = await pgPool.query('SELECT * FROM services WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return localDb.services.find(s => s.id === id) || null;
  },

  // Providers
  getProviders: async (categoryId) => {
    if (isPgConnected && pgPool) {
      let query = 'SELECT * FROM providers';
      const params = [];
      if (categoryId && categoryId !== 'all') {
        params.push(categoryId);
        query += ' WHERE category_id = $1';
      }
      query += ' ORDER BY rating DESC';
      const res = await pgPool.query(query, params);
      return res.rows;
    }
    let list = [...localDb.providers];
    if (categoryId && categoryId !== 'all') {
      list = list.filter(p => p.category_id === categoryId);
    }
    return list.sort((a, b) => b.rating - a.rating);
  },

  // Bookings / Orders
  createBooking: async (bookingData) => {
    const id = 'BK-' + Math.floor(100000 + Math.random() * 900000);
    const createdAt = new Date().toISOString();

    const newBooking = {
      id,
      user_id: bookingData.user_id || 'guest',
      service_id: bookingData.service_id,
      service_title: bookingData.service_title || 'Local Service',
      booking_date: bookingData.booking_date,
      time_slot: bookingData.time_slot,
      customer_name: bookingData.customer_name,
      customer_phone: bookingData.customer_phone,
      customer_email: bookingData.customer_email,
      address: bookingData.address,
      locality: bookingData.locality,
      notes: bookingData.notes || '',
      total_price: Number(bookingData.total_price),
      status: 'Confirmed',
      created_at: createdAt
    };

    if (isPgConnected && pgPool) {
      const res = await pgPool.query(
        `INSERT INTO bookings (id, user_id, service_id, service_title, booking_date, time_slot,
          customer_name, customer_phone, customer_email, address, locality, notes, total_price, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING *`,
        [
          newBooking.id, newBooking.user_id, newBooking.service_id, newBooking.service_title,
          newBooking.booking_date, newBooking.time_slot, newBooking.customer_name,
          newBooking.customer_phone, newBooking.customer_email, newBooking.address,
          newBooking.locality, newBooking.notes, newBooking.total_price, newBooking.status,
          newBooking.created_at
        ]
      );
      return res.rows[0];
    }

    localDb.bookings.unshift(newBooking);
    saveLocalDb();
    return newBooking;
  },

  getUserBookings: async (userId) => {
    if (isPgConnected && pgPool) {
      const res = await pgPool.query(
        'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return res.rows;
    }
    return localDb.bookings.filter(b => b.user_id === userId);
  },

  getAllBookings: async () => {
    if (isPgConnected && pgPool) {
      const res = await pgPool.query('SELECT * FROM bookings ORDER BY created_at DESC');
      return res.rows;
    }
    return localDb.bookings;
  },

  updateBookingStatus: async (bookingId, status) => {
    if (isPgConnected && pgPool) {
      const res = await pgPool.query(
        'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
        [status, bookingId]
      );
      return res.rows[0] || null;
    }
    const idx = localDb.bookings.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      localDb.bookings[idx].status = status;
      saveLocalDb();
      return localDb.bookings[idx];
    }
    return null;
  },

  // Reviews
  getReviews: async (serviceId) => {
    if (isPgConnected && pgPool) {
      let query = 'SELECT * FROM reviews';
      const params = [];
      if (serviceId) {
        params.push(serviceId);
        query += ' WHERE service_id = $1';
      }
      query += ' ORDER BY created_at DESC';
      const res = await pgPool.query(query, params);
      return res.rows;
    }
    if (serviceId) {
      return localDb.reviews.filter(r => r.service_id === serviceId);
    }
    return localDb.reviews;
  },

  addReview: async ({ service_id, user_name, rating, comment }) => {
    const id = 'rev-' + Date.now();
    const createdAt = new Date().toISOString();
    const newRev = { id, service_id, user_name, rating: Number(rating), comment, created_at: createdAt };

    if (isPgConnected && pgPool) {
      const res = await pgPool.query(
        'INSERT INTO reviews (id, service_id, user_name, rating, comment, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [id, service_id, user_name, rating, comment, createdAt]
      );
      return res.rows[0];
    }

    localDb.reviews.unshift(newRev);
    saveLocalDb();
    return newRev;
  },

  // Platform statistics
  getStats: async () => {
    let totalServices = localDb.services.length;
    let totalBookings = localDb.bookings.length;
    let totalProviders = localDb.providers.length;

    if (isPgConnected && pgPool) {
      const [sRes, bRes, pRes] = await Promise.all([
        pgPool.query('SELECT COUNT(*) FROM services'),
        pgPool.query('SELECT COUNT(*) FROM bookings'),
        pgPool.query('SELECT COUNT(*) FROM providers')
      ]);
      totalServices = parseInt(sRes.rows[0].count, 10);
      totalBookings = parseInt(bRes.rows[0].count, 10);
      totalProviders = parseInt(pRes.rows[0].count, 10);
    }

    return {
      activeServices: totalServices,
      totalBookings: totalBookings + 14850, // Real + historical base
      verifiedPartners: totalProviders + 120,
      customerSatisfaction: "99.4%",
      avgResponseMinutes: 28,
      citiesCovered: 18
    };
  }
};

module.exports = db;
