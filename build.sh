#!/bin/bash

# Build script for Todo List Application (Unified Deployment)
# This script builds the frontend and copies it to the backend's public directory

set -e  # Exit on error

echo "🏗️  Building Todo List Application..."
echo ""

# Build Frontend
echo "📦 Building frontend..."
cd frontend
npm run build
echo "✅ Frontend built successfully!"
echo ""

# Copy frontend build to backend public directory
echo "📋 Copying frontend to backend/public..."
cd ..
rm -rf backend/public/*
cp -r frontend/dist/* backend/public/
echo "✅ Frontend copied to backend/public!"
echo ""

# Optionally build backend (uncomment if needed)
# echo "🦀 Building backend..."
# cd backend
# cargo build --release
# echo "✅ Backend built successfully!"
# echo ""

echo "✨ Build complete!"
echo ""
echo "To run the application:"
echo "  cd backend"
echo "  cargo run"
echo ""
echo "Then visit: http://localhost:8000"
