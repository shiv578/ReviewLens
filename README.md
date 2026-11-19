# ReviewLens – AI Review Insights

An AI-powered product review analysis platform that transforms customer feedback into actionable business insights.

## Project Status
🚧 Under Development

## Planned Features
- CSV review upload and processing
- AI-powered sentiment analysis
- Customer feedback topic extraction
- Duplicate review detection
- Interactive analytics dashboard
- AI-generated review replies

---

## Tech Stack

### Frontend (`client/`)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animation:** Motion (`motion`)
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **File Upload:** React Dropzone
- **Notifications:** React Hot Toast

### Backend (`server/`)
- **Runtime:** Node.js (ES Modules)
- **Server:** Express.js
- **Database:** MongoDB + Mongoose
- **AI Engine:** Google Gemini API (`@google/genai`)
- **Validation:** Zod
- **Security & Rate Limiting:** CORS, `express-rate-limit`
- **File & CSV Processing:** Multer, PapaParse
- **Testing:** Vitest, Supertest

---

## Project Structure

```
ReviewLens/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── hooks/
│       ├── services/
│       ├── utils/
│       ├── animations/
│       ├── charts/
│       ├── context/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── app.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### 1. Environment Configuration

Copy the example environment file in `server/`:

```bash
cd server
copy .env.example .env
```

Configure your variables in `server/.env`:
- `PORT`: Server port (default: `5000`)
- `MONGODB_URI`: Local MongoDB or MongoDB Atlas connection string
- `GEMINI_API_KEY`: Google Gemini API key
- `CLIENT_URL`: Frontend client URL (default: `http://localhost:5173`)

### 2. Running Backend

```bash
cd server
npm run dev     # Starts nodemon hot reload on port 5000
npm start       # Production start
npm test        # Runs Vitest unit & integration tests
```

Health check endpoint: `http://localhost:5000/api/health`

### 3. Running Frontend

```bash
cd client
npm run dev     # Starts Vite dev server on port 5173
npm run build   # Production build
npm run preview # Preview production build locally
```

---

## Tech Stack

### Frontend (`client/`)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animation:** Motion (`motion`)
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **File Upload:** React Dropzone
- **Notifications:** React Hot Toast

### Backend (`server/`)
- **Runtime:** Node.js (ES Modules)
- **Server:** Express.js
- **Database:** MongoDB + Mongoose
- **AI Engine:** Google Gemini API (`@google/genai`)
- **Validation:** Zod
- **Security & Rate Limiting:** CORS, `express-rate-limit`
- **File & CSV Processing:** Multer, PapaParse
- **Testing:** Vitest, Supertest

---

## Project Structure

```
ReviewLens/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── hooks/
│       ├── services/
│       ├── utils/
│       ├── animations/
│       ├── charts/
│       ├── context/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── app.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### 1. Environment Configuration

Copy the example environment file in `server/`:

```bash
cd server
copy .env.example .env
```

Configure your variables in `server/.env`:
- `PORT`: Server port (default: `5000`)
- `MONGODB_URI`: Local MongoDB or MongoDB Atlas connection string
- `GEMINI_API_KEY`: Google Gemini API key
- `CLIENT_URL`: Frontend client URL (default: `http://localhost:5173`)

### 2. Running Backend

```bash
cd server
npm run dev     # Starts nodemon hot reload on port 5000
npm start       # Production start
npm test        # Runs Vitest unit & integration tests
```

Health check endpoint: `http://localhost:5000/api/health`

### 3. Running Frontend

```bash
cd client
npm run dev     # Starts Vite dev server on port 5173
npm run build   # Production build
npm run preview # Preview production build locally
```
