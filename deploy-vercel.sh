#!/bin/bash

# Deploy Frontend to Vercel
echo "🚀 Deploying Frontend to Vercel..."

cd frontend

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
vercel login

# Deploy
vercel --prod

echo "✅ Frontend deployed to Vercel!"
echo "📝 Don't forget to set NEXT_PUBLIC_API_URL in Vercel dashboard"
