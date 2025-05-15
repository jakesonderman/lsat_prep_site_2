#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting deployment process..."

# Install Netlify plugin if not already installed
if ! grep -q "@netlify/plugin-nextjs" package.json; then
    echo "📦 Installing Netlify Next.js plugin..."
    npm install --save-dev @netlify/plugin-nextjs
fi

# Add all changes
echo "📁 Adding files to git..."
git add .

# Check if there are any changes to commit
if git diff --staged --quiet; then
    echo "⚠️  No changes to deploy"
    exit 0
fi

# Get commit message from user or use default
read -p "Enter commit message (or press Enter for default): " commit_message
if [ -z "$commit_message" ]; then
    commit_message="Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Commit changes
echo "💾 Committing changes..."
git commit -m "$commit_message"

# Push to main branch
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Deployment complete! Your site will be updated on Netlify shortly."
echo "🌐 Check your Netlify dashboard for deployment status." 