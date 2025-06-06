# SnapPalette

A mobile-optimized web app for extracting color palettes from images and creating beautiful text overlays.

## Features

- 📸 Upload or capture photos
- 🎨 Automatic color palette extraction
- ✍️ Draggable text overlays
- 🎯 Background color customization
- 📱 Mobile-first iOS-inspired design
- 💾 High-resolution image export
- 📋 Copy color codes to clipboard

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd snappalette
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

Or use the Vercel CLI:
\`\`\`bash
npm i -g vercel
vercel
\`\`\`

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Project Structure

\`\`\`
snappalette/
├── app/
│   ├── create/
│   │   └── page.tsx          # Main editor page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── color-palette.tsx     # Color palette display
│   ├── export-button.tsx     # Image export functionality
│   ├── image-uploader.tsx    # Image upload component
│   ├── text-overlay.tsx      # Draggable text overlay
│   └── toolbar.tsx           # Bottom toolbar
├── lib/
│   └── utils.ts              # Utility functions
└── public/
    └── manifest.json         # PWA manifest
\`\`\`

## License

MIT License - feel free to use this project for personal or commercial purposes.
