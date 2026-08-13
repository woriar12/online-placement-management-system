# Placement Management Frontend Application

React + Vite frontend application for the Online Placement Management System.

## Project Structure

```
src/
├── assets/      # Images, logos, SVGs
├── components/  # Reusable UI components
├── pages/       # Page view components
├── layouts/     # Page layout wrappers
├── services/    # Axios API client setup
├── hooks/       # Custom React hooks
├── context/     # React Context providers (AuthContext)
├── utils/       # Helper functions and constants
└── App.jsx      # Root routing component
```

## Setup & Running

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Development Server
```bash
npm run dev
```
Application runs at: `http://localhost:5173`
