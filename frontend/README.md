# SENTIC Frontend

Civic issue reporting and prioritization platform frontend built with React, TypeScript, and Tailwind CSS.

## Features

- 📸 Image-based civic issue reporting (potholes, garbage, fallen trees)
- 🤖 AI-powered severity analysis (0-100 score)
- 🗺️ Location-based issue tracking
- 👮 Admin dashboard for issue management
- 📊 Public reports dashboard with filtering and sorting

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Shadcn UI components
- Axios for API calls

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:3000
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Route pages
├── lib/             # API client and utilities
├── hooks/           # Custom React hooks
└── App.tsx          # Main app component
```

## Admin Credentials

- **Username**: admin
- **Password**: admin123

## Deployment

To deploy the frontend:

1. **Vercel** (recommended):
   ```bash
   npm run build
   vercel --prod
   ```

2. **Netlify**:
   ```bash
   npm run build
   # Then deploy the `dist` folder to Netlify
   ```

3. **GitHub Pages or other hosts**:
   ```bash
   npm run build
   # Deploy the `dist` folder
   ```

Make sure to update `VITE_API_BASE_URL` to your production backend URL.

