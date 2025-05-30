# 📝 Nuxtake

> Create beautiful notes, export and share seamlessly

<div align="center">

![Nuxtake Logo](https://via.placeholder.com/150x150/6366f1/ffffff?text=📝)

## 🛠️ Built With

<div align="center">
  <img src="https://skillicons.dev/icons?i=react,nodejs,mongodb,express,tailwind,javascript,vite" alt="Tech Stack" />
</div>

<br>

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)
[![Zustand](https://img.shields.io/badge/Zustand-181717?style=for-the-badge&logo=react&logoColor=61DAFB)](https://github.com/pmndrs/zustand)

[✨ Demo](https://your-demo-link.com) • [🐛 Report Bug](https://github.com/yourusername/nuxtake/issues) • [🚀 Request Feature](https://github.com/yourusername/nuxtake/issues)

</div>

---

## 🌟 Overview

**Nuxtake** is a full-stack note-taking application that empowers users to create, organize, and share beautiful notes with an intuitive and modern interface. Built with performance and user experience in mind, Nuxtake combines powerful functionality with elegant design to deliver a seamless note-taking experience across all devices.

Whether you're a student organizing study materials, a professional managing project notes, or someone who simply loves to write, Nuxtake provides all the tools you need in a beautifully crafted, responsive interface.

### ✨ Key Features

- 🔐 **Secure Authentication** - JWT-based authentication with email verification and secure cookie management
- 📝 **Rich Note Editor** - Create and format beautiful notes with an intuitive editing experience
- 🎨 **Modern UI/UX** - Built with Shadcn UI components and Tailwind CSS for a polished look
- 📱 **Fully Responsive** - Seamless experience across desktop, tablet, and mobile devices
- 🚀 **Export & Share** - Multiple export formats and flexible sharing options
- 👤 **Profile Management** - Custom profile pictures, user settings, and personalization
- ⚡ **Performance Optimized** - Fast loading times and smooth interactions
- 🎭 **Smooth Animations** - Framer Motion powered transitions and micro-interactions

---

## 🛠️ Tech Stack

### 🎨 Frontend
- **Framework**: React 18 with modern hooks and patterns
- **Styling**: Tailwind CSS for utility-first styling
- **UI Components**: Shadcn UI for consistent, accessible components
- **Animations**: Framer Motion for smooth, performant animations
- **State Management**: Zustand for lightweight, scalable state management
- **Build Tool**: Vite for fast development and optimized builds

### ⚙️ Backend
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with secure httpOnly cookies
- **Email Service**: HTML email templates for verification
- **Security**: bcrypt for password hashing, rate limiting, input validation

### 🔧 DevOps & Tools
- **Version Control**: Git with conventional commits
- **Package Manager**: npm with workspaces support
- **Environment Management**: dotenv for configuration
- **Development**: Hot reloading and auto-restart capabilities

---

## 📸 Screenshots

### 🏠 Homepage
![Homepage](https://via.placeholder.com/800x400/f8fafc/64748b?text=Homepage+Screenshot)
*Clean and welcoming landing page with feature highlights*

### 🔐 Authentication
![Login/Signup](https://via.placeholder.com/800x400/f8fafc/64748b?text=Login%2FSignup+Screenshot)
*Secure authentication flow with modern design and validation*

### 📊 Dashboard
![Dashboard](https://via.placeholder.com/800x400/f8fafc/64748b?text=Dashboard+Screenshot)
*Organized note management interface with search and filtering*

### ✏️ Editor
![Editor](https://via.placeholder.com/800x400/f8fafc/64748b?text=Editor+Screenshot)
*Rich text editor with formatting tools and real-time preview*

### ⚙️ Settings
![Settings](https://via.placeholder.com/800x400/f8fafc/64748b?text=Settings+Screenshot)
*Comprehensive user settings and profile customization*

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or Atlas account) - [Setup guide](https://docs.mongodb.com/manual/installation/)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jaxsei/notes-app.git
   cd notes-app
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` files in both frontend and backend directories:
   
   **Backend `.env`:**
   ```env
   ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_EXPIRY=
NODE_ENV=
MONGODB_URI=
JWT_SECRET=
CORS_ORIGIN=
PORT=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_APP=
   ```
4. **Start the development servers**
   ```bash
   # Start backend server (from backend directory)
   cd backend
   npm run dev
   # Backend runs on http://localhost:5000
   
   # Start frontend server (from frontend directory)
   cd ../frontend
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

6. **Access the application**
   - **Frontend**: `http://localhost:3000`
   - **Backend API**: `http://localhost:5000`

---

## 🔗 API Endpoints

### 🔐 Authentication Routes
- `POST /api/auth/register` - User registration with email verification
- `POST /api/auth/login` - User login with JWT token generation
- `POST /api/auth/logout` - Secure user logout
- `POST /api/auth/verifyotp` - Email verification endpoint
- `POST /api/auth/sendotp` - Email sending endpoint
// will be added later
-----
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation
-----
- `GET /api/auth/checkauth` - Get current user information

### 📝 Notes Management
- `GET /api/notes/get` - Retrieve all user notes
- `POST /api/notes/create` - Create new note
- `GET /api/notes/get/:id` - Get specific note by ID
- `PUT /api/notes/update/:id` - Update existing note
- `DELETE /api/notes/delete/:id` - Delete note

---

### 🏗️ Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   # Creates optimized production build in /dist
   ```

2. **Prepare backend for production**
   ```bash
   cd backend
   npm install --production
   # Install only production dependencies
   ```


#### **Platform-as-a-Service**
- **Frontend**: Deploy to Vercel, Netlify, or Surge
- **Backend**: Deploy to Heroku, Railway, or DigitalOcean App Platform
- **Database**: Use MongoDB Atlas for managed database

### 🔒 Security Checklist

- [ ] Use strong, unique JWT secrets
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB authentication
- [ ] Set up proper error logging

---

## 🛣️ Roadmap

### ✅ Completed Features
- [x] User authentication system with email verification
- [x] Full CRUD operations for notes
- [x] Profile picture upload and management
- [x] Responsive design across all devices (not yet)
- [x] Export functionality for notes
- [x] Secure JWT-based authentication

### 🔄 In Progress
- [ ] **Real-time Collaboration** - Multi-user editing capabilities
- [ ] **Advanced Text Formatting** - Rich text editor with more options
- [ ] **Note Categories & Tags** - Better organization system

### 🎯 Planned Feature
- [ ] **Markdown Support** - Native markdown editing
- [ ] **File Attachments** - Image and document uploads

---

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Here's how you can help make Nuxtake even better:

### 🛠️ Development Setup

1. **Fork and clone the repository**
2. **Follow the installation steps below**
3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```
4. **Make your changes and test thoroughly**
5. **Commit with descriptive messages**
   ```bash
   git commit -m "feat: add amazing new feature"
   ```
6. **Push and create a Pull Request**

### 📋 Development Guidelines

- **Code Style**: Follow existing patterns and use Prettier for formatting
- **Commit Messages**: Use conventional commits (feat:, fix:, docs:, etc.)
- **Testing**: Add tests for new features and ensure existing tests pass
- **Documentation**: Update README and inline documentation as needed
- **Responsive Design**: Ensure all changes work across different screen sizes

<div align="center">

### 🌟 Show Your Support

If you find Nuxtake helpful, please consider:

⭐ **Starring this repository**  
🤝 **Contributing to the project**  

**[⬆ Back to Top](#-nuxtake)**

---

*Made with ❤️, ☕, and countless hours of coding*
*AIs used: ChatGPT for help in debugging and Claude for ui design*

</div>
