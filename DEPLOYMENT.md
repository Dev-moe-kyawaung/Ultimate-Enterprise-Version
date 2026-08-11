# ============================================
# FULL DEPLOYMENT GUIDE
# ============================================

# 1. Initialize repository
git init
git add .
git commit -m "🎉 feat: Initial release of Enterprise Portfolio v4.0"

# 2. Create GitHub repository
gh repo create quantum-portfolio-enterprise --public --source=. --remote=origin --push

# 3. Add GitLab remote
git remote add gitlab https://gitlab.com/moekyawaung/quantum-portfolio-enterprise.git
git push -u gitlab main

# 4. Deploy to GitHub Pages
npm run deploy:github

# 5. Deploy to Netlify
netlify deploy --prod

# 6. Deploy to Vercel
vercel --prod

# 7. Deploy to Cloudflare Pages
wrangler pages deploy .

# 8. Deploy to AWS S3
aws s3 sync . s3://my-quantum-portfolio-bucket --exclude ".git/*" --exclude "*.md"

# 9. Deploy to Firebase Hosting
firebase deploy --only hosting

# 10. Deploy to Google Cloud Storage
gsutil rsync -R . gs://my-quantum-portfolio-bucket --exclude ".git/*"
