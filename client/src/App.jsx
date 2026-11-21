import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import OverviewPage from './pages/OverviewPage';
import SentimentPage from './pages/SentimentPage';
import ProductsPage from './pages/ProductsPage';
import ReviewsPage from './pages/ReviewsPage';
import AIReplyPage from './pages/AIReplyPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Default Landing: Dashboard (Upload + Status Diagnostics) */}
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          {/* Overview Analytics Page */}
          <Route path="overview" element={<OverviewPage />} />
          <Route path="upload" element={<DashboardPage />} />
          <Route path="sentiment" element={<SentimentPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="ai-reply" element={<AIReplyPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppProvider>
  );
}
