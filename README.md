# LCart Locality Service Provider Pvt Ltd ⚡

> **Hyperlocal Multi-Service On-Demand Platform**  
> Connects local homeowners and families with certified, police-verified professionals: **Painters, Electricians, Tuition Teachers, Deep Cleaners, Plumbers, AC & Appliance Technicians, Carpenters, and Pest Control Specialists**.

---

## 🌟 Key Highlights & Features

1. **All Major Neighborhood Services Included**:
   - ⚡ **Electrician**: Ceiling fans, light fixtures, switchboards, MCB, house wiring audits.
   - 🎨 **Painter**: Full interior/exterior home painting, accent textures, damp wall waterproofing.
   - 📚 **Tuition Teacher**: Class 1-5 all subjects, Class 6-10 Math & Science, English fluency coaching.
   - ✨ **Cleaner**: 2BHK/3BHK deep sanitization, kitchen degreasing, bathroom scrub, sofa foam wash.
   - 🔧 **Plumber**: Tap and pipe leakage repair, water tank jet wash, drain clearing, toilet installation.
   - ❄️ **AC & Appliance Repair**: AC jet cleaning, gas refill, washing machine, refrigerator & geyser repair.
   - 🪚 **Carpenter**: Locks, doors, hinges, modular woodwork, precision TV wall mount drilling.
   - 🛡️ **Pest Control**: Herbal cockroach gel, anti-termite drill treatments, bedbugs & mosquitoes.

2. **Full-Stack REST Architecture**:
   - **Frontend**: Clean HTML5, modern CSS3 (Glassmorphism, gradients, micro-animations, responsive layout), and vanilla JavaScript ES6.
   - **Backend**: Node.js & Express server exposing structured HTTP REST API endpoints.
   - **Database**:
     - Native **PostgreSQL** support via `pg` pool.
     - Auto-table creation for `users`, `categories`, `services`, `providers`, `bookings`, `reviews`.
     - Built-in zero-downtime persistent storage fallback in `data/db.json` when PostgreSQL credentials are not yet configured.

3. **Authentication & User Management**:
   - User Registration (`/api/auth/register`) with `bcryptjs` password encryption.
   - Secure Login (`/api/auth/login`) with `jsonwebtoken` (JWT) authentication.
   - One-click **Demo Account** pre-configured for instant testing.
   - Session retention in `localStorage`.

4. **Interactive 4-Step Booking Wizard**:
   - **Step 1**: Review service scope, inclusions, and special instructions.
   - **Step 2**: Pick service date and time slot (Morning, Afternoon, Evening).
   - **Step 3**: Contact details, locality/sector, and exact street address.
   - **Step 4**: Instant confirmation screen with Order ID (e.g. `BK-849102`), technician assignment, and receipt summary.

5. **Customer Orders & Bookings Dashboard**:
   - Real-time order tracking (`Confirmed`, `In Progress`, `Completed`, `Cancelled`).
   - Order cancellation with 1-click status update.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database (Optional for PostgreSQL)
Copy `.env.example` to `.env`:
```env
PORT=5000
JWT_SECRET=your_secret_key_here
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_postgres_password
PGDATABASE=postgres
```
*Note: If PostgreSQL is not running or password is blank, LCart will automatically boot on its built-in persistent local database engine so your application never crashes.*

### 3. Start the Server
```bash
npm start
```
Or with node:
```bash
node server.js
```

Open your browser at:
👉 **`http://localhost:5000`**

---

## 📡 HTTP REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health check and database engine status |
| `GET` | `/api/stats` | Platform statistics (completed jobs, verified partners, speed) |
| `POST` | `/api/auth/register` | Register new customer account |
| `POST` | `/api/auth/login` | Authenticate customer and retrieve JWT token |
| `GET` | `/api/auth/me` | Retrieve profile of authenticated user |
| `GET` | `/api/categories` | Fetch all service categories |
| `GET` | `/api/services` | Query services with search, category & sort filters |
| `GET` | `/api/services/:id` | Get service detail and customer reviews |
| `GET` | `/api/providers` | List verified local service professionals |
| `POST` | `/api/bookings` | Create a new service booking |
| `GET` | `/api/bookings` | Retrieve user bookings / orders |
| `PATCH` | `/api/bookings/:id/status`| Update booking status (e.g., Cancelled) |
| `POST` | `/api/reviews` | Submit verified customer review |

---

## 🌐 Publishing / Deployment

### Deploy to Render or Railway (Recommended)
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of LCart Locality Service Provider"
   ```
2. Connect your repository to **Render.com** or **Railway.app**.
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables:
   - `PORT`: `5000`
   - `DATABASE_URL`: Your PostgreSQL connection string.

---

© 2026 LCart Service Provider Pvt Ltd. All Rights Reserved.
