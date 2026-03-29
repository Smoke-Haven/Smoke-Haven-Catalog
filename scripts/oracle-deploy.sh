#!/bin/bash

# Oracle Cloud Backend Deployment Script
# Run this AFTER following ORACLE_CLOUD_SETUP.md

set -e

echo "🚀 Starting Oracle Cloud Backend Deployment..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js v$(node -v)"
echo "✅ npm v$(npm -v)"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm v$(pnpm -v)"

# Navigate to api-server
cd artifacts/api-server

echo "📥 Installing dependencies..."
pnpm install

echo "🔨 Building project..."
pnpm run build

echo "✅ Build successful!"
echo ""
echo "Next steps:"
echo "1. Create .env file with:"
echo "   NODE_ENV=production"
echo "   MONGODB_URI=mongodb+srv://bhensdum15_db_user:Q1w2e3r4t5@cluster0.h5kczyf.mongodb.net/vapedb?retryWrites=true&w=majority"
echo "   ADMIN_PASSWORD=admin1234"
echo "   PORT=3000"
echo ""
echo "2. Start with PM2: pm2 start 'pnpm run start' --name 'vape-api'"
echo "3. Check logs: pm2 logs vape-api"
echo ""
echo "Test: curl http://localhost:3000/api/healthz"
