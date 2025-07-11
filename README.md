# AI Video Ad Generator

A full-stack application that generates video ads from product URLs using AI. Built with Next.js, TypeScript, and modern AI tools.

## Features

- Scrape product information from Amazon and Shopify URLs
- Generate compelling ad scripts using GPT-4
- Create professional video ads using Remotion
- Modern UI with ShadcnUI and TailwindCSS
- Real-time progress tracking
- Video preview and download

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Chrome/Chromium (for Puppeteer)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a product URL from Amazon or Shopify
2. Wait for the product information to be scraped
3. Review the generated ad script
4. Generate and preview the video
5. Download the final video

## Tech Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - TypeScript
  - TailwindCSS
  - ShadcnUI
  - Zustand
  - React Query

- **Backend**:
  - Next.js API Routes
  - Puppeteer
  - OpenAI GPT-4
  - Remotion
  - Node File System

## Project Structure

```
/app
├── page.tsx                 # Home page
└── api/
    ├── scrape/             # Product scraping endpoint
    ├── generate-script/    # OpenAI script generation
    ├── generate-video/     # Remotion video generation
    └── save-video/        # Video download handler

/components
├── UrlInputForm.tsx        # URL input form
├── ProductPreview.tsx      # Shows scraped info
├── ScriptPreview.tsx      # Shows generated script
├── VideoPlayer.tsx        # Video preview
├── Loader.tsx            # Loading states
└── Stepper.tsx          # Progress indicator

/lib
├── store.ts             # Zustand store
└── utils.ts            # Utility functions

/public/videos          # Generated video storage
/downloads             # Downloaded video storage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT
