# Climate, Energy & Power Data Portal 🌍⚡

A production-ready full-stack MERN application for managing and publicly visualizing Climate, Energy, and Power datasets across India. Developed for **Vasudha India**.

---

## 🌟 Key Features

### 1. User Roles & Authorization
- **Super Admin**:
  - Default Credentials: `superadmin@vasudhaindia.org` / `Admin@123`
  - Complete control: Manage Admin accounts (Create, Edit, Enable/Disable, Delete).
  - Review Queue: Approve or Reject pending CSV dataset uploads with feedback reasons.
  - Master dataset controls & Executive analytics dashboard (KPI cards, upload trends, domain breakdown).
  - Full Audit Trail System Logs.
- **Admin**:
  - Log in using credentials created by Super Admin.
  - Tabular dashboard viewing uploaded datasets, domain, chart type, status, and approval state.
  - Add Dataset with **built-in schema validation**: checks for invalid Lat/Lng bounds, un-matched Indian state names, invalid dates/numbers with line-by-line error reports.
  - Default `Pending` status: datasets remain hidden from public users until approved by Super Admin.
- **Normal / Public User**:
  - **No login or signup required**.
  - Accessible via landing page `/` and explicit domain routes (`/climate`, `/energy`, `/power`).
  - Interactive Leaflet Maps (Lat/Lng coordinates & State-wise Heatmaps).
  - Interactive Recharts Time-Series Charts (Line, Bar, Area).
  - Detailed dataset inspection page (`/dataset/:id`) with raw CSV data table preview and **CSV Export**.

### 2. Dynamic Visualization Engine
- **Latitude / Longitude Data**: Rendered on interactive **React Leaflet India Map** with custom telemetry pins, tooltips, popups, and zoom/pan controls.
- **State-wise Data**: Rendered on custom **India State-level Choropleth Heatmap** using GeoJSON boundary data with color scales, hover state highlights, and dynamic legends.
- **Time-Series Data**: Rendered using **Recharts** with Admin-selected Line Chart, Bar Chart, or Area Chart formats.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, React Router DOM v6, Redux Toolkit, Tailwind CSS, Recharts, Leaflet, React Leaflet, Lucide Icons, Axios, React Hook Form, React Toastify.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, bcrypt, Multer (CSV Upload), csv-parser, Nodemailer, Helmet, CORS, Morgan.
- **Database**: MongoDB Atlas (with local MongoDB & zero-config in-memory fallback).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (Local or MongoDB Atlas string)

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
The server will run on `http://localhost:5000`. On startup, it automatically seeds the default Super Admin account (`superadmin@vasudhaindia.org` / `Admin@123`) and 7 pre-seeded sample datasets across Climate, Energy, and Power domains.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend application will start on `http://localhost:3000`.

---

## 📁 Repository Folder Structure

```
Climate/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB Mongoose connection
│   │   └── store.js              # Offline memory store fallback
│   ├── controllers/
│   │   ├── adminController.js     # Super Admin user management
│   │   ├── analyticsController.js # Dashboard KPI cards & audit logs
│   │   ├── authController.js      # Login, profile, forgot password
│   │   ├── datasetController.js   # CSV upload, schema validation, approval
│   │   └── publicController.js    # Unauthenticated landing page & domain routes
│   ├── middleware/
│   │   ├── auth.js                # JWT & role authorization middleware
│   │   └── upload.js              # Multer CSV file upload handler
│   ├── models/
│   │   ├── ActivityLog.js         # Audit log schema
│   │   ├── Dataset.js             # Dataset & parsed JSON schema
│   │   └── User.js                # User & bcrypt password schema
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── datasetRoutes.js
│   │   └── publicRoutes.js
│   ├── seed/
│   │   └── seedData.js            # Default Super Admin & sample dataset seeder
│   ├── utils/
│   │   ├── csvValidator.js        # CSV schema validation engine
│   │   └── mailer.js              # Nodemailer welcome & reset emails
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # Navbar, Sidebar, Footer, ProtectedRoute, Modal, StatusBadge
│   │   │   └── visualizations/    # ChartRenderer, MapView, HeatmapView, TimeSeriesChart, CSVUploader
│   │   ├── data/
│   │   │   └── india-states.json  # India State GeoJSON boundaries
│   │   ├── pages/
│   │   │   ├── admin/             # AdminDashboard, UploadDataset, MyDatasets, EditDataset, Profile
│   │   │   ├── auth/              # Login, ForgotPassword, ResetPassword
│   │   │   ├── public/            # Home, Climate, Energy, Power, DatasetDetails, NotFound
│   │   │   └── superadmin/        # SuperAdminDashboard, DatasetApproval, AdminManagement, AllDatasets, ActivityLogs
│   │   ├── redux/                 # store, authSlice, datasetSlice, adminSlice, uiSlice
│   │   ├── services/
│   │   │   └── api.js             # Axios API client with JWT interceptors
│   │   ├── App.jsx
│   │   └── index.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 📡 REST API Documentation

### Public Endpoints (No Auth Required)
- `GET /api/public` - Fetch all approved datasets in chronological/approval sequence.
- `GET /api/public/climate` - Fetch approved Climate datasets (`/climate`).
- `GET /api/public/energy` - Fetch approved Energy datasets (`/energy`).
- `GET /api/public/power` - Fetch approved Power datasets (`/power`).
- `GET /api/public/:id` - Fetch single approved dataset with raw parsed JSON for CSV export.

### Authentication Endpoints
- `POST /api/auth/login` - Authenticate user & return JWT token.
- `POST /api/auth/forgot-password` - Dispatch password reset token email.
- `POST /api/auth/reset-password` - Reset account password with token.
- `GET /api/auth/profile` - Fetch authenticated user profile.
- `PUT /api/auth/profile` - Update user name or change password.

### Admin & Dataset Endpoints (JWT Protected)
- `POST /api/datasets` - Upload CSV file, run schema validation, create dataset (Defaults to `pending`).
- `GET /api/datasets` - List datasets filtered by status/domain.
- `PUT /api/datasets/:id` - Edit pending dataset.
- `DELETE /api/datasets/:id` - Delete dataset.

### Super Admin Endpoints (Super Admin Role Required)
- `PATCH /api/datasets/:id/approve` - Approve dataset (Publishes to public portal).
- `PATCH /api/datasets/:id/reject` - Reject dataset with feedback reason.
- `GET /api/admin/users` - List all Admin accounts.
- `POST /api/admin/users` - Create new Admin account (Sends email credentials).
- `PATCH /api/admin/users/:id/status` - Enable or Disable Admin account.
- `DELETE /api/admin/users/:id` - Delete Admin account.
- `GET /api/analytics/dashboard` - Dashboard KPI cards and chart breakdown.
- `GET /api/analytics/activity-logs` - Audit activity log history.

---

## 🔒 Default Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@vasudhaindia.org` | `Admin@123` |
| **Standard Admin** | `admin@vasudhaindia.org` | `Admin@123` |

---

## 🚀 Deployment Instructions

### Deploy Backend to Render / Railway
1. Create a Web Service on Render/Railway pointing to the `backend/` directory.
2. Set Environment Variables:
   - `PORT=5000`
   - `MONGODB_URI=mongodb+srv://...`
   - `JWT_SECRET=your_secret_key`
   - `NODE_ENV=production`
3. Build Command: `npm install`
4. Start Command: `node server.js`

### Deploy Frontend to Vercel / Netlify
1. Import `frontend/` directory to Vercel.
2. Set Environment Variable:
   - `REACT_APP_API_URL=https://your-backend-service.onrender.com/api`
3. Build Command: `npm run build`
4. Output Directory: `build`

---

## 📄 License
ISC &copy; Vasudha India Climate Portal Team
