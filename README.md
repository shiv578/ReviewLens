# ReviewLens – AI Review Insights

ReviewLens is an AI-powered customer review intelligence platform that transforms raw product reviews into actionable business insights. It empowers store owners and product teams to monitor customer satisfaction, detect emerging complaints, uncover product strengths, and draft empathetic, personalized review replies with Google Gemini.

---

## Current Status & Foundation

- **Status:** Initial Development Foundation & Premium AI Intelligence Workspace Active
- **Version:** `0.1.0-alpha`
- **Frontend Build:** Passing (`vite build` - 0 errors, code-split routes)
- **Backend Test Suite:** Passing (4/4 tests across `health.test.js` and `stats.test.js`)
- **Database:** MongoDB connected and verified on `127.0.0.1:27017`

---

## Color System & Visual Identity

ReviewLens utilizes a specialized dark palette tailored for high-contrast intelligence dashboards:

| Token | Hex | Role |
| :--- | :--- | :--- |
| **Midnight Navy** | `#080D19` | Primary workspace canvas background |
| **Deep Navy** | `#101A2B` | Secondary panel, card, and sidebar background |
| **Emerald Accent** | `#10D6A0` | Primary actions, growth metrics, and positive sentiment |
| **Electric Cyan** | `#20C5F5` | Secondary accent, analytics trends, and data charts |
| **Violet Accent** | `#9165F5` | AI engine indicators, reply studio, and LLM synthesis |
| **Amber Accent** | `#F5B942` | Neutral sentiment and system status alerts |
| **Coral Accent** | `#F04470` | Negative sentiment and critical complaint indicators |
| **Main Text** | `#F4F7FC` | High-contrast readable typography |
| **Secondary Text**| `#9BAAC0` | Subtle metadata and helper text |

---

## Technology Stack

### Frontend (`client/`)
- **Core:** React 19, Vite 6, JavaScript (ES Modules)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`, `@import "tailwindcss";`)
- **Animation:** Motion (`motion/react`)
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios with central `/api` proxy
- **Routing:** React Router DOM v7
- **File Upload:** React Dropzone
- **Notifications:** React Hot Toast

### Backend (`server/`)
- **Runtime:** Node.js (ES Modules, `"type": "module"`)
- **Web Framework:** Express.js 5
- **Database:** MongoDB via Mongoose 9
- **Validation:** Zod
- **AI Processing:** Google Gemini API (`@google/genai`)
- **Security & Rate Limiting:** CORS, `express-rate-limit`
- **Parsing:** Multer, PapaParse
- **Testing:** Vitest, Supertest

---

## Project Structure

```text
ReviewLens/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── animations/
│   │   │   └── variants.js           # Motion animation variants
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── assistant/
│   │   │   │   └── AIAssistant.jsx   # Interactive AI Assistant canvas
│   │   │   ├── dashboard/
│   │   │   │   ├── HeroSection.jsx   # Vision banner with real analysis timestamps
│   │   │   │   ├── StatsGrid.jsx     # 5 metric cards with real counts & skeletons
│   │   │   │   ├── SentimentPulse.jsx# Signature circular sentiment donut & trend
│   │   │   │   ├── AIInsightsPanel.jsx# Feedback synthesis & action recommendations
│   │   │   │   └── RecentReviews.jsx # Incoming customer review activity feed
│   │   │   └── navigation/
│   │   │       ├── Sidebar.jsx       # Responsive collapsible navigation
│   │   │       └── TopBar.jsx        # Search, notifications, and profile menus
│   │   ├── context/
│   │   │   └── AppContext.jsx        # Global state, search, and DB health polling
│   │   ├── hooks/
│   │   │   ├── useStats.js           # Live statistics fetching & polling
│   │   │   └── useRecentReviews.js   # Recent reviews fetcher
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx        # Master layout shell
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx     # Primary intelligence workspace
│   │   │   ├── SentimentPage.jsx     # Sentiment Intelligence breakdown
│   │   │   ├── ProductsPage.jsx      # Product performance & catalog insights
│   │   │   ├── ReviewsPage.jsx       # Review Explorer with multi-filter & search
│   │   │   ├── AIReplyPage.jsx       # AI Reply Studio for drafting responses
│   │   │   ├── UploadPage.jsx        # CSV drag-and-drop & schema validation
│   │   │   ├── HistoryPage.jsx       # Analysis run history log
│   │   │   ├── SettingsPage.jsx      # Gemini API key & MongoDB diagnostics
│   │   │   └── NotFoundPage.jsx      # 404 Route handler
│   │   ├── services/
│   │   │   └── api.js                # Configured Axios instance
│   │   ├── utils/
│   │   │   └── formatters.js         # Numbers, dates, sentiment colors, text truncators
│   │   ├── App.jsx                   # Route definition & lazy loading
│   │   ├── index.css                 # Tailwind v4, design tokens & glassmorphism
│   │   └── main.jsx                  # React DOM entry point
│   ├── index.html
│   ├── vite.config.js                # Vite + Tailwind v4 + API proxy
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Resilient MongoDB Mongoose connection
│   │   ├── controllers/
│   │   │   ├── healthController.js   # Health check & DB status
│   │   │   ├── statsController.js    # Review aggregates and calculations
│   │   │   └── reviewsController.js  # Filterable review queries & feed
│   │   ├── middleware/
│   │   │   └── errorHandler.js       # Centralized 404 and 500 error handler
│   │   ├── models/
│   │   │   ├── Review.js             # Mongoose review schema with indexes
│   │   │   └── AnalysisBatch.js      # CSV ingestion batch schema
│   │   ├── routes/
│   │   │   ├── healthRoutes.js       # GET /api/health
│   │   │   ├── statsRoutes.js        # GET /api/stats
│   │   │   ├── reviewsRoutes.js      # GET /api/reviews & /api/reviews/recent
│   │   │   └── index.js              # Express root router
│   │   └── app.js                    # Express app & listener entry point
│   ├── tests/
│   │   ├── health.test.js            # API health & 404 integration tests
│   │   └── stats.test.js             # Statistics & reviews endpoint tests
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### 1. Environment Configuration

The repository contains `server/.env.example`. Copy it to create your local `server/.env`:

```bash
cd server
copy .env.example .env
```

Variables:
- `PORT`: Server port (default: `5000`)
- `MONGODB_URI`: MongoDB connection string (default: `mongodb://127.0.0.1:27017/reviewlens`)
- `GEMINI_API_KEY`: Your Google Gemini API key (from Google AI Studio)
- `CLIENT_URL`: URL of the frontend client (default: `http://localhost:5173`)

### 2. Running the Backend Server

```bash
cd server
npm run dev     # Hot-reload development mode via nodemon
npm test        # Run Vitest integration test suite
npm start       # Start in production mode
```

Verified Endpoints:
- `GET /api/health`: Health status & live database connection state
- `GET /api/stats`: Real-time aggregated statistics (total reviews, sentiment distribution, response needs)
- `GET /api/reviews/recent`: 10 most recent reviews
- `GET /api/reviews`: Filterable and searchable review explorer

### 3. Running the Frontend Application

```bash
cd client
npm run dev     # Start Vite dev server on http://localhost:5173
npm run build   # Production build verification (code-split)
npm run preview # Preview the compiled production build locally
```

---

## Strict No-Fake-Data Policy

ReviewLens enforces a strict policy against fabricated data:
- Zero-review workspaces display realistic empty states with action guides rather than fabricated numbers.
- AI features clearly display connection states (e.g., `Gemini: Not Connected`) until valid API keys are configured.
- No dummy customer reviews or simulated trendlines are presented as genuine analytics.

---

## Next Development Milestones

1. **Milestone 1 (Complete):** Workspace foundation, layout shell, color system, navigation, Mongoose models, and real backend endpoints.
2. **Milestone 2:** CSV file ingestion pipeline with streaming PapaParse, duplicate review hashing, and batch queueing.
3. **Milestone 3:** Gemini AI batch processing pipeline (sentiment scoring, feedback topic modeling, complaint extraction).
4. **Milestone 4:** AI Reply Studio generation with customizable tone and contextual customer review citations.
5. **Milestone 5:** Live AI Assistant chat connected to analyzed customer review embeddings.
