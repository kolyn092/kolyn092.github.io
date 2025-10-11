#!/bin/bash

# React 앱 빌드
echo "Building React app..."
npm run build

# gh-pages 패키지 설치 (전역)
echo "Installing gh-pages..."
npm install -g gh-pages

# GitHub Pages에 배포
echo "Deploying to GitHub Pages..."
npx gh-pages -d build

echo "Deployment complete!"
echo "Your site should be available at: https://kolyn092.github.io/ark-grid-optimizer"
