# AI Child Insights Dashboard

A Next.js dashboard application for viewing AI-powered insights from child conversations. This is a front-end-only application with mock data, designed to be easily integrated with a real local API.

## Features

- **Overview Section**: Executive summary with key metrics, daily summaries, emotion trends, and top topics
- **Interests & Topics**: Detailed view of what children talk about most, with frequency charts and topic details
- **Emotion & Wellbeing**: Emotional tone tracking over time, emotion distribution, and emotion-topic associations
- **Conversations**: Timeline of recent conversations with detailed views
- **Recommendations**: Personalized suggestions for afterschool programs, clubs, and learning resources
- **Settings & Privacy**: Privacy information, parental controls, and data management

## Tech Stack

- **Next.js 14+** with App Router
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Recharts** for data visualization
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app router
│   ├── layout.tsx          # Root layout with context provider
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── Layout/            # Layout components (Header, Sidebar, MainLayout)
│   ├── Overview/          # Overview section components
│   ├── Interests/         # Interests section components
│   ├── Emotion/           # Emotion section components
│   ├── Conversations/     # Conversations section components
│   ├── Recommendations/   # Recommendations section components
│   ├── Settings/          # Settings section components
│   └── Sections/          # Section wrappers
├── contexts/              # React contexts
│   └── ChildContext.tsx   # Child and date range state management
├── data/                  # Mock data
│   └── mockData.ts        # Mock data and helper functions
├── lib/                   # Utility functions
│   ├── dateUtils.ts       # Date formatting utilities
│   ├── emotionUtils.ts    # Emotion mapping utilities
│   ├── topicUtils.ts      # Topic mapping utilities
│   └── dataFilters.ts     # Data filtering utilities
└── types/                 # TypeScript type definitions
    └── index.ts           # All type definitions
```

## Mock Data

The application includes mock data for 3 children (Alex, Maya, and Sam) with:
- Multiple conversations per child
- Topic insights with trends
- Emotion data points
- Daily summaries
- Personalized recommendations

## Integration with Real API

The codebase is structured to easily swap mock data for real API calls:

1. Replace functions in `data/mockData.ts` with API calls
2. Update `contexts/ChildContext.tsx` to fetch from API if needed
3. Consider using Next.js Server Components for data fetching
4. Update date range filtering to work with API parameters

## Privacy & Local Data

This dashboard is designed for a local-only data system. All UI emphasizes:
- Data stored locally on device
- No cloud transmission
- Parental control over data retention
- Privacy-first approach

## License

This project is a demonstration/demo application.

