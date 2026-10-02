# LockBox 🔐

**You can't open it. Yet.**

The first visual MVP of LockBox — a playful digital time capsule designed for sharing with friends, couples, family, and your future self.

## First-version flow

Welcome → Home → Create → Add memory → Choose vibe → Choose unlock → Share → Locked box

### Included
- Gen-Z mobile-first visual system
- Instagram-inspired story/card feel without copying Instagram UI
- Date/countdown/mutual-lock concepts
- Message/photo/voice/video/mixed-media choices
- 9 visual vibes
- Live countdown
- Playful “Try to Peek” interaction
- Share screen for Instagram Story, WhatsApp and link
- Minimal profile/history screen
- PWA manifest
- GitHub Pages deployment workflow

## Important
This version is a **frontend prototype**. The lock is simulated in the browser. No private content is being stored remotely yet.

The next production phase should add:
1. PHP + MySQL API
2. Secure authentication / participant links
3. Object/file storage
4. Server-side unlock enforcement
5. Real media uploads
6. Dynamic share links such as `/box/abc123`
7. Real mutual-lock logic
8. Reveal animation and reactions

## Deploy
Pushes to `main` trigger the GitHub Pages workflow. In the repository settings, GitHub Pages should use **GitHub Actions** as its source.
