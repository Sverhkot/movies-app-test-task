# Movies Test Task App

A modern React application for managing your movie collection. Built with Vite, Redux Toolkit, TypeScript, and Material-UI.

## Features

- 🎬 Add movies manually or import from files
- 🔍 Search and filter by title or actor
- 📱 Responsive design with Material-UI
- 🔐 User authentication
- 🐳 Docker ready for easy deployment

## Quick Start with Docker

The easiest way to run this app is using Docker. The image is available on Docker Hub:

```bash
# Pull and run the latest version
docker run --name movies-app \
  -p 3000:3000 \
  -e API_URL=http://your-api-server:8000/api/v1 \
  sverhkot/movies:latest
```

The app will be available at `http://localhost:3000`

## Running Without Docker

### Prerequisites

- Node.js 18+ 
- npm

### Installation & Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd movies-app

# Install dependencies
npm install

# Create the runtime configuration file
echo 'window.__APP_CONFIG__ = { API_URL: "http://localhost:8000/api/v1" };' > public/env.js

# Start development server
npm run dev
```

The development server will start at `http://localhost:5173`

### Configuring API_URL for Local Development

Since the app uses runtime configuration, you need to create the `public/env.js` file manually:

```bash
# For local backend on port 8000
echo 'window.__APP_CONFIG__ = { API_URL: "http://localhost:8000/api/v1" };' > public/env.js

# For custom API server
echo 'window.__APP_CONFIG__ = { API_URL: "https://your-api-domain.com/api/v1" };' > public/env.js
```

**Important**: The `public/env.js` file is git-ignored, so each developer needs to create it locally.

## Building Docker Image

To build your own Docker image:

```bash
# Build the image
docker build -t your-username/movies:latest .

# Run your custom build
docker run --name movies-app \
  -p 3000:3000 \
  -e API_URL=http://your-api-server:8000/api/v1 \
  your-username/movies:latest
```

## Scripts

- `dev`/`start` - start dev server
- `build` - build for production
- `preview` - locally preview production build
- `test` - launch test runner
- `lint` - run ESLint

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **State Management**: Redux Toolkit, RTK Query
- **UI**: Material-UI (MUI)
- **Build**: Vite
- **Deployment**: Docker, Node.js with serve
