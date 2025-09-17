#!/bin/bash

# Deploy Backend to Railway
echo "🚀 Deploying Backend to Railway..."

cd backend

# Install Railway CLI if not installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
railway login

# Initialize and deploy
railway init
railway up

echo "✅ Backend deployed to Railway!"
echo "📝 Don't forget to:"
echo "   1. Add PostgreSQL service in Railway dashboard"
echo "   2. Set environment variables"
echo "   3. Run: railway run php artisan migrate"
echo "   4. Run: railway run php artisan db:seed"
