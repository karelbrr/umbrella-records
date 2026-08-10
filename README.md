# [DONE]

# Umbrella Records 

Current Version - **beta v2.1.0**

Umbrella Records is a modern recording studio and online beat store platform. It provides a professional space for recording, music production, and purchasing high-quality beats for artists and producers.

## Key Features

- **Beat Store:** Browse, preview, and purchase high-quality beats.
- **Advanced Audio Player:** Interactive waveform visualization and seamless playback using `wavesurfer.js`.
- **Immersive 3D Experience:** WebGL and 3D elements powered by `three.js` and `react-three-fiber`.
- **Admin Dashboard:** A dedicated portal for studio managers to upload beats, manage collections, and handle store operations.
- **AI Integrations:** Features powered by Vercel AI SDK and Google Generative AI.
- **Fluid Animations:** Smooth page transitions and micro-interactions built with Framer Motion and GSAP.

## Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) + React 19
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Auth:** [Supabase](https://supabase.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Audio/Visuals:** wavesurfer.js, react-audio-visualize, Three.js
- **State Management:** TanStack React Query

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn or pnpm

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd umbrella-records
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the necessary variables (see Environment Variables section below).

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

To run this project locally, you will need to add the following environment variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Configuration (Optional, depending on features used)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
```

## Project Structure

```text
umbrella-records/
├── src/
│   ├── app/
│   │   ├── (admin)/      # Admin dashboard routes
│   │   ├── (public)/     # Public storefront routes (home, beats, login)
│   │   └── api/          # Next.js API routes
│   ├── components/       # Reusable UI components
│   └── ...
├── public/               # Static assets (fonts, images, etc.)
├── package.json          # Project dependencies and scripts
├── tailwind.config.mjs   # Tailwind CSS configuration
└── next.config.ts        # Next.js configuration
```

## Available Scripts

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
