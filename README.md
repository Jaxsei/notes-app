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
   git clone https://github.com/yourusername/nuxtake.git
   cd nuxtake
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
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/nuxtake
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CORS_ORIGIN=http://localhost:3000
   ```
   
   **Frontend `.env`:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Nuxtake
   VITE_APP_VERSION=1.0.0
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # The application will automatically create required collections
   ```

5. **Start the development servers**
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
   - **API Documentation**: `http://localhost:5000/api-docs` (if implemented)

---

## 📁 Project Structure

```
nuxtake/
├── 📂 frontend/
│   ├── 📂 public/              # Static assets
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 📂 ui/          # Shadcn UI components
│   │   │   ├── 📂 auth/        # Authentication components
│   │   │   ├── 📂 notes/       # Note-related components
│   │   │   ├── 📂 layout/      # Layout components
│   │   │   └── 📂 common/      # Reusable components
│   │   ├── 📂 pages/           # Route/page components
│   │   ├── 📂 hooks/           # Custom React hooks
│   │   ├── 📂 store/           # Zustand stores
│   │   ├── 📂 utils/           # Helper functions
│   │   ├── 📂 lib/             # External library configurations
│   │   └── 📂 styles/          # Global styles and Tailwind config
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   └── 📄 tailwind.config.js
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 controllers/     # Route controllers and business logic
│   │   ├── 📂 models/          # Database models and schemas
│   │   ├── 📂 routes/          # API route definitions
│   │   ├── 📂 middleware/      # Custom middleware (auth, validation, etc.)
│   │   ├── 📂 utils/           # Helper functions and utilities
│   │   ├── 📂 config/          # Configuration files
│   │   └── 📂 services/        # External service integrations
│   ├── 📄 package.json
│   └── 📄 server.js
├── 📄 README.md
└── 📄 .gitignore
```

---

## 🔗 API Endpoints

### 🔐 Authentication Routes
- `POST /api/auth/register` - User registration with email verification
- `POST /api/auth/login` - User login with JWT token generation
- `POST /api/auth/logout` - Secure user logout
- `GET /api/auth/verify/:token` - Email verification endpoint
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation
- `GET /api/auth/me` - Get current user information

### 📝 Notes Management
- `GET /api/notes` - Retrieve all user notes with pagination
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get specific note by ID
- `PUT /api/notes/:id` - Update existing note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/share` - Generate shareable link
- `GET /api/notes/shared/:shareId` - Access shared note

### 👤 User Profile
- `GET /api/user/profile` - Get user profile information
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/upload-avatar` - Upload profile picture
- `DELETE /api/user/avatar` - Remove profile picture

---

## 🚀 Deployment

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

### 🌐 Deployment Options

#### **Option 1: Traditional VPS/Server**
```bash
# On your server
git clone https://github.com/yourusername/nuxtake.git
cd nuxtake

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with production values

# Build and start
cd frontend && npm run build
cd ../backend && npm start
```

#### **Option 2: Docker Deployment**
```dockerfile
# Example Dockerfile for backend
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

#### **Option 3: Platform-as-a-Service**
- **Frontend**: Deploy to Vercel, Netlify, or Surge
- **Backend**: Deploy to Heroku, Railway, or DigitalOcean App Platform
- **Database**: Use MongoDB Atlas for managed database

### 🔧 Production Environment Variables

**Critical production settings:**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nuxtake
JWT_SECRET=your_extremely_secure_production_secret
CORS_ORIGIN=https://your-frontend-domain.com
EMAIL_HOST=your-production-smtp-host
```

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
- [x] Responsive design across all devices
- [x] Export functionality for notes
- [x] Secure JWT-based authentication

### 🔄 In Progress
- [ ] **Real-time Collaboration** - Multi-user editing capabilities
- [ ] **Advanced Text Formatting** - Rich text editor with more options
- [ ] **Note Categories & Tags** - Better organization system

### 🎯 Planned Features
- [ ] **Mobile Application** - React Native companion app
- [ ] **Offline Support** - Progressive Web App capabilities
- [ ] **Advanced Sharing** - Granular permission controls
- [ ] **Note Templates** - Pre-designed note formats
- [ ] **Search & Filtering** - Advanced search capabilities
- [ ] **Dark Mode** - Complete dark theme support
- [ ] **Markdown Support** - Native markdown editing
- [ ] **File Attachments** - Image and document uploads

---

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Here's how you can help make Nuxtake even better:

### 🛠️ Development Setup

1. **Fork and clone the repository**
2. **Follow the installation steps above**
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

### 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

---

## 👨‍💻 Author & Support

**Created with ❤️ by [Your Name]**

- 🐙 **GitHub**: [@yourusername](https://github.com/yourusername)
- 💼 **LinkedIn**: [Your Profile](https://linkedin.com/in/yourprofile)  
- 📧 **Email**: your.email@example.com
- 🌐 **Website**: [yourwebsite.com](https://yourwebsite.com)

### 💬 Get Help

- 📖 **Documentation**: Check this README and inline code comments
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/nuxtake/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/nuxtake/discussions)
- 📧 **Email Support**: support@nuxtake.com

---

## 🙏 Acknowledgments

Special thanks to these amazing projects and communities:

- **[Shadcn UI](https://ui.shadcn.com/)** - For the beautiful, accessible component library
- **[Framer Motion](https://www.framer.com/motion/)** - For smooth, performant animations
- **[Tailwind CSS](https://tailwindcss.com/)** - For utility-first CSS framework
- **[React](https://reactjs.org/)** - For the powerful frontend library
- **[Express.js](https://expressjs.com/)** - For the minimal, flexible backend framework

---

<div align="center">

### 🌟 Show Your Support

If you find Nuxtake helpful, please consider:

⭐ **Starring this repository**  
🐦 **Sharing on social media**  
🤝 **Contributing to the project**  
☕ **[Buy me a coffee](https://buymeacoffee.com/yourusername)**

**[⬆ Back to Top](#-nuxtake)**

---

*Made with ❤️, ☕, and countless hours of coding*

</div>
