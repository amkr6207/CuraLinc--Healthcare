# CuraLink

**CuraLink** is an AI-powered platform that connects patients with life-changing clinical trials and top health experts. Built for researchers, patients, and healthcare professionals to collaborate and advance medical research.

## 🌟 Features

- **Smart Trial Discovery**: Search and filter clinical trials by condition, phase, location, and status
- **Expert Network**: Connect with verified health experts and researchers
- **Community Forums**: Engage in discussions with patients and researchers
- **Personalized Dashboard**: Role-based dashboards for patients and researchers
- **Secure Authentication**: JWT-based authentication with email/password login
- **ORCID Integration**: (Optional) Researcher verification via ORCID

## 🛠️ Tech Stack

### Frontend
- **React** with Vite
- **Tailwind CSS** v4 for styling
- **React Router** v6 for navigation
- **Axios** for API requests
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **OpenAI API** (optional) for AI-powered features

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd curalink
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/curalink

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# External APIs (Optional)
OPENAI_API_KEY=your-openai-api-key
PUBMED_API_KEY=optional-if-needed

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📱 Usage

1. **Register**: Create an account as a Patient or Researcher
2. **Login**: Sign in with your credentials
3. **Explore**: Browse clinical trials, health experts, and community forums
4. **Dashboard**: Access your personalized dashboard with quick links

## 🔐 Authentication

- **Password Requirements**: Minimum 6 characters
- **Supported Roles**: Patient, Researcher
- **Token Storage**: JWT tokens stored in localStorage

## 🗂️ Project Structure

```
curalink/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── services/        # External API services
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React Context (Auth)
│   │   └── services/    # API client
│   └── public/
└── README.md
```

