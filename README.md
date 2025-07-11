# 🎥 AdGen — AI Video Ad Generator from Any Product URL (For Businesses)

A full-stack application that turns **product URLs into scroll-stopping video ads** using GPT-4 for scriptwriting and Remotion for video generation. Just paste a link from Amazon or Shopify — we’ll do the rest.

> ✅ Built with: `Next.js`, `TypeScript`, `Remotion`, `Puppeteer`, `OpenAI GPT-4`, `TailwindCSS`, `ShadcnUI`

![GitHub Repo stars](https://img.shields.io/github/stars/Rakshath66/adgen?style=social)
![GitHub forks](https://img.shields.io/github/forks/Rakshath66/adgen?style=social)
![MIT License](https://img.shields.io/github/license/Rakshath66/adgen)

---

## 📸 Preview

![Preview](images/adgen-ui.png)


---

## ✨ Features

* 🔗 Paste a product URL (Amazon or Shopify)
* 🤖 AI extracts images, title, features & benefits
* ✍️ GPT-4 writes catchy ad scripts
* 🎞️ Remotion generates video ad with overlays
* 🎯 15–30 sec MP4 video output (vertical or horizontal)
* 🖥️ Modern UI with real-time status and preview
* 📥 One-click video download

---

## 🚀 Getting Started

### 🔧 Prerequisites

* Node.js v18+
* OpenAI API key
* Google Chrome / Chromium (required for Puppeteer)

---

### 🖥️ Local Setup

```bash
# 1. Clone this repo
git clone https://github.com/Rakshath66/adgen.git
cd adgen

# 2. Install dependencies
npm install

# 3. Create env file
cp .env.example .env.local

# 4. Add your OpenAI key to .env.local
OPENAI_API_KEY=your_openai_api_key

# 5. Run the app
npm run dev
```

---

## 🔐 Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key
```

> ⚠️ Required for script generation via OpenAI

---

## 🎬 How It Works

1. **Input**: Paste a product page URL (Amazon/Shopify)
2. **Scrape**: Puppeteer extracts product data
3. **Script**: GPT-4 generates ad script
4. **Video**: Remotion renders a 15–30 sec video
5. **Output**: Preview & download final MP4

---

## 🧠 Tech Stack

| Layer         | Tech                                          |
| ------------- | --------------------------------------------- |
| Frontend      | Next.js 14, TypeScript, TailwindCSS, ShadcnUI |
| State Mgmt    | Zustand, React Query                          |
| Backend       | API Routes in Next.js                         |
| Scraping      | Puppeteer                                     |
| AI Generation | OpenAI GPT-4                                  |
| Video         | Remotion + Node.js FS                         |

---

## 📁 Project Structure

```
adgen/
├── .env.local             # API Keys
├── app/
│   ├── page.tsx           # Main Page
│   └── api/
│       ├── scrape/        # Scrape logic
│       ├── generate-script/ # GPT-4 ad copy
│       ├── generate-video/  # Remotion output
│       └── save-video/    # Video download
├── components/
│   ├── UrlInputForm.tsx
│   ├── ProductPreview.tsx
│   ├── ScriptPreview.tsx
│   ├── VideoPlayer.tsx
│   └── Stepper.tsx
├── public/videos/
└── downloads/
```

---

## 💬 Example Use Cases

* DTC brands testing product creatives
* Shopify owners generating quick ads
* Amazon affiliates making viral content
* Influencers creating reels for product links

---

## 🛠️ Quick Tips

* Stick to Amazon or Shopify for best results
* Long descriptions = better scripts
* Vertical videos are ideal for Instagram/TikTok

---

## 🤝 Contributing

We welcome PRs and improvements!

### ✅ Steps:

1. Fork this repo
2. Create your branch:

```bash
git checkout -b feat/your-feature
```

3. Make changes & commit:

```bash
git commit -m "feat: added cool thing"
```

4. Push and open a Pull Request

---

## 🧪 Code Commit Style

Use [Conventional Commits](https://www.conventionalcommits.org/):

* `feat:` New feature
* `fix:` Bug fix
* `docs:` Readme/docs updates
* `refactor:` Cleanup/refactoring
* `chore:` Setup or tool configs

---

## 🛣️ Roadmap

### ✅ Phase 1: MVP (URL → Ad Video)

* ✔️ URL scraping
* ✔️ GPT-4 ad copy
* ✔️ Remotion video render
* ✔️ Basic UI

---

### 🔜 Phase 2: Upgrades

* 🔁 Multiple script versions
* 🗣️ Text-to-speech (AI voiceover)
* 🔳 Multiple aspect ratios (9:16, 1:1)
* ✨ Advanced templates + animation

---

### 🔒 Phase 3: (Out of Scope Now)

* User auth
* Deployments
* Payment + SaaS features

---

## 📄 License

MIT © [Rakshath U Shetty](https://github.com/Rakshath66)

```
Permission is hereby granted, free of charge, to any person obtaining a copy...
```
Connect on LinkedIn [Rakshath](https://www.linkedin.com/in/rakshathushetty/)

---

## ⭐ If You Like It

Star ⭐ this repo to support the project and help others find it.
Open an issue, suggest features, or contribute a video template!

