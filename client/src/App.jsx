import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';

// Lazy loaded page components for optimal bundle splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SentimentPage = lazy(() => import('./pages/SentimentPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const AIReplyPage = lazy(() => import('./pages/AIReplyPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Sleek fallback loader
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 rounded-xl gradient-growth animate-spin flex items-center justify-center shadow-lg shadow-[#10D6A0]/20" />
      <span className="text-xs text-[#9BAAC0] font-medium tracking-wide">
        Loading intelligence workspace...
      </span>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="sentiment" element={<SentimentPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="ai-reply" element={<AIReplyPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppProvider>
  );
}
