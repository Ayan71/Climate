# Climate, Energy & Power Data Portal 🌍⚡

A full-stack web platform for managing, visualizing, and analyzing dataset metrics across **Climate**, **Energy**, and **Power** domains in India. The platform supports interactive visualizations (State Heatmaps, Coordinates Map, Time Series Lines/Bars/Areas, Multi-Line Charts, Pie/Doughnut charts), CSV dataset uploading with schema validation, role-based workflows (Public, Admin, Super Admin), and hybrid storage (MongoDB + In-Memory fallback).

---

## 🚀 Project Overview

The **Climate, Energy & Power Data Portal** provides a centralized repository of environmental, energy transition, and electrical grid telemetry across India. 

### Key Features
- **Public Data Portal**:
  - Interactive dashboards across Climate, Energy, and Power domains.
  - Multi-type data visualizations: Lat/Lng Geographic Map Pins, State Choropleth Heatmaps, Decadal Time Series, and Distribution Charts.
  - Search, filter by domain/category/year/state/district, and export dataset CSVs.
- **Admin Dashboard**:
  - CSV dataset uploading with automated column schema validation.
  - Manage uploaded datasets, view status (Pending, Approved, Rejected), and resubmit.
  - Profile management and security credentials update.
- **Super Admin Governance**:
  - Dataset review queue with approval/rejection workflows and audit reasoning.
  - Category manager (Create/Edit/Delete custom dataset categories).
  - Admin user management with invitation welcome emails & status toggling.
  - Activity Audit Logs tracking system events and IP telemetry.
- **Hybrid Storage Engine**:
  - Dual-layer storage: Connects seamlessly to **MongoDB** when active, with an automatic **In-Memory Store Fallback** for zero-downtime offline/standalone usage.

---

## 🛠️ Technology Stack

### **Frontend**
- **Core**: React 19, React Router v7
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`), React Redux
- **Styling**: Tailwind CSS v3 / PostCSS, Lucide React Icons, React Toastify
- **Data Visualization & Maps**: Recharts, Leaflet, React Leaflet

### **Backend**
- **Runtime**: Node.js (v18+) & Express.js (v5)
- **Database / ODM**: MongoDB, Mongoose (v9)
- **Authentication**: JSON Web Tokens (JWT), Bcrypt password hashing
- **File & Data Processing**: Multer (file uploads), CSV Parser (`csv-parser`)
- **Security & Logging**: Helmet, CORS, Morgan request logger, Express Rate Limit
- **Mail Services**: Nodemailer (Admin welcome notifications)

---

## 📁 Project & Code Structure

```text
Climate/
├── backend/                    # Express.js REST API Server
│   ├── config/                 # DB Connection & Memory Store Fallback
│   │   ├── db.js               # Mongoose MongoDB connection handler
│   │   └── store.js            # In-Memory fallback data store
│   ├── controllers/            # API Route Logic Controllers
│   │   ├── adminController.js   # Admin user management controller
│   │   ├── analyticsController.js # Dashboard metrics & audit log controller
│   │   ├── approvalController.js  # Approval workflow controller
│   │   ├── authController.js   # User auth & profile controller
│   │   ├── categoryController.js # Category management controller
│   │   ├── datasetController.js  # Dataset upload, review & CRUD controller
│   │   └── publicController.js   # Public landing & domain telemetry controller
│   ├── middleware/             # Express Middlewares
│   │   ├── auth.js             # JWT verification & role-based RBAC middleware
│   │   └── upload.js           # Multer CSV upload middleware
│   ├── models/                 # Mongoose Database Schemas
│   │   ├── ActivityLog.js      # Audit log schema
│   │   ├── Approval.js         # Approval history schema
│   │   ├── Category.js         # Category schema
│   │   ├── Dataset.js          # Dataset schema
│   │   └── User.js             # User schema with bcrypt password hashing
│   ├── routes/                 # Express API Endpoint Routers
│   ├── seed/                   # Database Seeder (Super Admin & initial datasets)
│   │   └── seedData.js
│   ├── utils/                  # Utility Helpers (CSV Validator, Mailer)
│   │   ├── csvValidator.js     # Automatic schema & column validation
│   │   └── mailer.js           # Nodemailer transport & email templates
│   ├── uploads/                # Directory for uploaded CSV files
│   ├── .env                    # Backend environment variables
│   ├── package.json
│   └── server.js               # API Server Entry Point
│
├── frontend/                   # React.js Web Application
│   ├── public/                 # Static assets & HTML template
│   └── src/
│       ├── components/         # Reusable Component Architecture
│       │   ├── admin/          # Admin & Super Admin dashboard components
│       │   ├── charts/         # Recharts & Leaflet Map visualization wrappers
│       │   ├── common/         # Navbar, Footer, Loading Spinner, Modals
│       │   └── public/         # Domain cards, filter bars, landing page components
│       ├── pages/              # View Pages & Route Containers
│       │   ├── admin/          # Dataset Upload, Manage Datasets, Profile
│       │   ├── auth/           # Login Page
│       │   ├── public/         # Home, Climate, Energy, Power, Dataset Detail pages
│       │   └── superadmin/     # Review Queue, Admin Users, Categories, Audit Logs
│       ├── redux/              # Redux Slices & Store Configuration
│       │   ├── store.js
│       │   └── slices/         # authSlice, datasetSlice, categorySlice, etc.
│       ├── services/           # Axios API Client (`api.js`)
│       ├── App.jsx             # React Router Route Definitions
│       ├── index.css           # Global Styles & Tailwind Directives
│       └── index.js            # React Application Entry Point
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md                   # Project Documentation
```

---

## 📦 Dependencies

### Backend Dependencies (`backend/package.json`)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| `express` | `^5.2.1` | REST API framework |
| `mongoose` | `^9.9.5` | MongoDB object data modeling (ODM) |
| `jsonwebtoken` | `^9.0.3` | Authentication JWT tokens |
| `bcrypt` | `^6.0.0` | Secure password hashing |
| `multer` | `^2.3.0` | Multipart CSV file upload handling |
| `csv-parser` | `^3.2.1` | Streaming CSV parser for validation & data parsing |
| `cors` | `^2.8.6` | Cross-Origin Resource Sharing |
| `helmet` | `^8.3.0` | HTTP security headers middleware |
| `morgan` | `^1.12.0` | HTTP request logger |
| `nodemailer` | `^10.0.1` | SMTP email notifications |
| `dotenv` | `^17.4.2` | Environment variable loader |

### Frontend Dependencies (`frontend/package.json`)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| `react` / `react-dom` | `^19.2.8` | UI Library |
| `react-router-dom` | `^7.18.3` | Client-side routing |
| `@reduxjs/toolkit` | `^2.12.0` | State management store |
| `axios` | `^1.20.0` | HTTP Client for API integration |
| `recharts` | `^3.10.1` | Time series, bar, area, pie, and multi-line charts |
| `leaflet` / `react-leaflet` | `^1.9.4` / `^5.0.0` | Interactive maps & spatial markers |
| `lucide-react` | `^1.43.0` | Icon set |
| `react-toastify` | `^11.1.0` | Notification alerts |
| `tailwindcss` | `^3.4.19` | Utility-first CSS styling framework |

---

## ⚙️ Environment Variables & Configuration

### Backend Environment Configuration (`backend/.env`)
Create or verify the `.env` file in the `backend/` root directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_jwt_key_climate_2026_vasudha
JWT_EXPIRE=30d

# Mailer Configuration (Optional - fallback logs to console if unconfigured)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@vasudhaindia.org
EMAIL_PASS=your_smtp_app_password
```

### Frontend Environment Configuration (`frontend/.env` - Optional)
If running the API on a custom domain/port, configure `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```
*(By default, the frontend falls back to `http://localhost:5000/api` or uses the proxy configured in `frontend/package.json`)*.

---

## 🗄️ Database Setup

1. **MongoDB Service**:
   - Ensure **MongoDB** (v6.0+) is installed and running locally on `mongodb://127.0.0.1:27017/climate_db` (or supply a MongoDB Atlas connection string in `.env`).
2. **Automatic Data Seeding**:
   - On initial server startup, the application connects to MongoDB and automatically seeds default categories and sample datasets.
   - It also creates the default **Super Admin** account:
     - **Email**: `superadmin@vasudhaindia.org`
     - **Password**: `Admin@123`
3. **Hybrid Fallback Mode**:
   - If MongoDB is not running, the application will issue a notification log and seamlessly operate in **Hybrid Memory Store** mode using sample datasets.

---

## 🚀 Installation & Local Development Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)
- **MongoDB Server** (Optional for local DB mode; memory fallback is built-in)

---

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Climate
```

---

### Step 2: Set Up Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Backend API server:
   ```bash
   npm start
   # Or for hot-reloading with nodemon:
   npm run dev
   ```
   The backend API will run at **`http://localhost:5000`**.

---

### Step 3: Set Up Frontend

1. Open a **new terminal tab/window** and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend web application will automatically open at **`http://localhost:3000`**.

---

## 🔑 Default Login Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@vasudhaindia.org` | `Admin@123` | Full access (Review Queue, Category Manager, Admin User Management, Audit Logs) |
| **Sample Admin** | `admin@vasudhaindia.org` | `Admin@123` | Dataset Upload, My Datasets Manager, Profile Management |

---

## 📡 Key API Endpoints

### **Public Endpoints**
- `GET /api/public` - Fetch all approved datasets for landing page
- `GET /api/public/climate` - Fetch approved Climate datasets
- `GET /api/public/energy` - Fetch approved Energy datasets
- `GET /api/public/power` - Fetch approved Power datasets
- `GET /api/public/:id` - Get published dataset details by ID
- `GET /api/categories` - Fetch active categories

### **Auth Endpoints**
- `POST /api/auth/login` - User login & JWT issuance
- `GET /api/auth/profile` - Get active user profile
- `PUT /api/auth/profile` - Update profile & password

### **Dataset Management (Admin / Super Admin)**
- `POST /api/datasets` - Upload CSV dataset with schema validation
- `GET /api/datasets` - Fetch datasets (with optional status & domain filters)
- `GET /api/datasets/:id` - Fetch single dataset by ID
- `PUT /api/datasets/:id` - Edit dataset metadata
- `DELETE /api/datasets/:id` - Delete dataset
- `PATCH /api/datasets/:id/approve` - Approve & publish dataset (Super Admin)
- `PATCH /api/datasets/:id/reject` - Reject dataset with feedback (Super Admin)

### **Admin & System Governance (Super Admin)**
- `GET /api/admin/users` - List admin accounts
- `POST /api/admin/users` - Create admin account & dispatch welcome email
- `PATCH /api/admin/users/:id/status` - Toggle active/disabled status for admin
- `DELETE /api/admin/users/:id` - Delete admin account
- `GET /api/analytics/dashboard` - Get platform statistics
- `GET /api/analytics/activity-logs` - Retrieve audit trail logs

---

## 💡 Troubleshooting

- **`ERR_CONNECTION_REFUSED` on frontend**:
  - Ensure the backend server is actively running in its own terminal window (`cd backend && npm start`) on port `5000`.
- **CSV Upload Error (`CSV Schema Validation Failed`)**:
  - Ensure the uploaded CSV contains required visualization columns (e.g. `latitude` & `longitude` for maps, `state` & `value` for heatmaps, `year` & `value` for time series).
