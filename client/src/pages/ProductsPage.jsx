import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Package,
  Search,
  Star,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  MessageSquareReply,
  Upload,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../services/api';

const SENTIMENT_COLORS = {
  positive: '#10b981',
  neutral: '#f59e0b',
  negative: '#ef4444',
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedProductName = searchParams.get('product');

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Selected product detail state
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    document.title = selectedProductName
      ? `${selectedProductName} Analytics | ReviewLens`
      : 'Products Intelligence | ReviewLens';
  }, [selectedProductName]);

  // Load all products list
  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const res = await api.get('/products');
      if (res.data?.status === 'ok') {
        setProducts(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setProductsError(err.message || 'Failed to fetch products');
    } finally {
      setProductsLoading(false);
    }
  };

  // Load detail for selected product
  const fetchProductDetail = async (prodName) => {
    if (!prodName) return;
    setDetailLoading(true);
    setDetailError(null);
    try {
      const res = await api.get(`/products/${encodeURIComponent(prodName)}`);
      if (res.data?.status === 'ok') {
        setDetail(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load product detail:', err);
      setDetailError(err.message || 'Failed to fetch product details');
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProductName) {
      fetchProductDetail(selectedProductName);
    } else {
      setDetail(null);
    }
  }, [selectedProductName]);

  const selectProduct = (name) => {
    setSearchParams({ product: name });
  };

  const clearSelectedProduct = () => {
    setSearchParams({});
  };

  const filteredProducts = products.filter((p) =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepare chart data for detail view
  const sentimentPieData = detail
    ? [
        { name: 'Positive', value: detail.sentimentSplit.positive, color: SENTIMENT_COLORS.positive },
        { name: 'Neutral', value: detail.sentimentSplit.neutral, color: SENTIMENT_COLORS.neutral },
        { name: 'Negative', value: detail.sentimentSplit.negative, color: SENTIMENT_COLORS.negative },
      ].filter((d) => d.value > 0)
    : [];

  const ratingBarData = detail
    ? [
        { star: '5★', count: detail.ratingDistribution[5] || 0 },
        { star: '4★', count: detail.ratingDistribution[4] || 0 },
        { star: '3★', count: detail.ratingDistribution[3] || 0 },
        { star: '2★', count: detail.ratingDistribution[2] || 0 },
        { star: '1★', count: detail.ratingDistribution[1] || 0 },
      ]
    : [];

  return (
    <div className="space-y-6 w-full pb-12">
      {/* View 1: Single Product Deep Dive View */}
      {selectedProductName ? (
        <div className="space-y-6">
          {/* Back button & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={clearSelectedProduct}
                className="p-2 rounded-xl transition-colors"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
                title="Back to all products"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {selectedProductName}
                  </h2>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
                  >
                    Product View
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Per-product sentiment distribution, rating spread, and recurring complaints.
                </p>
              </div>
            </div>

            <button
              onClick={() => fetchProductDetail(selectedProductName)}
              disabled={detailLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto transition-colors"
              style={{
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${detailLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {detailLoading ? (
            <div className="py-16 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 opacity-50" />
              Loading product intelligence metrics...
            </div>
          ) : detailError ? (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {detailError}
            </div>
          ) : detail ? (
            <>
              {/* Product KPI Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <span className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Total Reviews
                  </span>
                  <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {detail.totalReviews}
                  </span>
                  <span className="text-[10px] block mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Analyzed by AI
                  </span>
                </div>

                <div
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <span className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Average Rating
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="text-2xl font-bold tracking-tight text-amber-400">
                      {detail.avgRating !== null ? `${detail.avgRating} / 5` : 'N/A'}
                    </span>
                  </div>
                  <span className="text-[10px] block mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Customer score
                  </span>
                </div>

                <div
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <span className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Needs Attention
                  </span>
                  <span
                    className="text-2xl font-bold tracking-tight"
                    style={{ color: detail.needsReplyCount > 0 ? 'var(--accent)' : '#10b981' }}
                  >
                    {detail.needsReplyCount}
                  </span>
                  <span className="text-[10px] block mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Negative / unanswered
                  </span>
                </div>

                <div
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <span className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Rating Mismatches
                  </span>
                  <span
                    className="text-2xl font-bold tracking-tight"
                    style={{ color: detail.mismatchCount > 0 ? '#f59e0b' : '#10b981' }}
                  >
                    {detail.mismatchCount}
                  </span>
                  <span className="text-[10px] block mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Rating vs sentiment conflicts
                  </span>
                </div>
              </div>

              {/* Sentiment Split & Rating Distribution Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Sentiment Split Donut */}
                <div
                  className="p-6 rounded-3xl"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Sentiment Split
                  </h3>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="h-48 w-48 relative flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sentimentPieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={4}
                          >
                            {sentimentPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                          {detail.totalReviews}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                          Reviews
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1 w-full">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/5 dark:bg-white/5">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-emerald-500" />
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Positive
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-500">
                            {detail.sentimentSplit.positivePercentage}%
                          </span>
                          <span className="text-[10px] block text-emerald-500/70">
                            {detail.sentimentSplit.positive} reviews
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/5 dark:bg-white/5">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-amber-500" />
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Neutral
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-amber-500">
                            {detail.sentimentSplit.neutralPercentage}%
                          </span>
                          <span className="text-[10px] block text-amber-500/70">
                            {detail.sentimentSplit.neutral} reviews
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/5 dark:bg-white/5">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-500" />
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Negative
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-red-500">
                            {detail.sentimentSplit.negativePercentage}%
                          </span>
                          <span className="text-[10px] block text-red-500/70">
                            {detail.sentimentSplit.negative} reviews
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Star Rating Distribution Bar Chart */}
                <div
                  className="p-6 rounded-3xl"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Rating Distribution (Stars)
                  </h3>

                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ratingBarData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="star" type="category" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border)',
                            borderRadius: '12px',
                            fontSize: '11px',
                          }}
                        />
                        <Bar dataKey="count" fill="var(--accent)" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Top Issues & Top Praises Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Issues (Complaints) */}
                <div
                  className="p-6 rounded-3xl"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-2 mb-4 text-red-400">
                    <ThumbsDown className="w-4 h-4" />
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      Top Issues & Complaints
                    </h3>
                  </div>

                  {detail.topIssues?.length === 0 ? (
                    <p className="text-xs py-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                      No major complaints detected for this product!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {detail.topIssues.map((issue, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl border"
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.05)',
                            borderColor: 'rgba(239, 68, 68, 0.15)',
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/10 text-red-400">
                              {issue.topic}
                            </span>
                            {issue.rating && (
                              <span className="text-[11px] font-bold text-amber-500">
                                {issue.rating}★
                              </span>
                            )}
                          </div>
                          <p className="text-xs" style={{ color: 'var(--text-primary)' }}>
                            {issue.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Top Praises */}
                <div
                  className="p-6 rounded-3xl"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-2 mb-4 text-emerald-400">
                    <ThumbsUp className="w-4 h-4" />
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      Top Praises & Highlights
                    </h3>
                  </div>

                  {detail.topPraises?.length === 0 ? (
                    <p className="text-xs py-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                      No praise mentions recorded yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {detail.topPraises.map((praise, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl border"
                          style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.05)',
                            borderColor: 'rgba(16, 185, 129, 0.15)',
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400">
                              {praise.topic}
                            </span>
                            {praise.rating && (
                              <span className="text-[11px] font-bold text-amber-500">
                                {praise.rating}★
                              </span>
                            )}
                          </div>
                          <p className="text-xs" style={{ color: 'var(--text-primary)' }}>
                            {praise.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Reviews for this Product */}
              <div
                className="p-6 rounded-3xl"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    Customer Reviews for {selectedProductName}
                  </h3>
                  <button
                    onClick={() => navigate(`/reviews?product=${encodeURIComponent(selectedProductName)}`)}
                    className="text-xs font-semibold inline-flex items-center gap-1"
                    style={{ color: 'var(--accent)' }}
                  >
                    <span>View in Review Table</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                        <th className="pb-2.5 font-semibold">ID</th>
                        <th className="pb-2.5 font-semibold">Rating</th>
                        <th className="pb-2.5 font-semibold">Sentiment</th>
                        <th className="pb-2.5 font-semibold">AI Summary / Text</th>
                        <th className="pb-2.5 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                      {detail.recentReviews?.map((r) => (
                        <tr key={r._id || r.reviewId} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 font-mono font-bold" style={{ color: 'var(--accent)' }}>
                            {r.reviewId || 'N/A'}
                          </td>
                          <td className="py-3">
                            <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {r.rating ? `${r.rating}★` : '-'}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className="px-2 py-0.5 rounded-full font-bold uppercase text-[10px]"
                              style={{
                                backgroundColor:
                                  r.sentiment === 'positive'
                                    ? 'rgba(16, 185, 129, 0.15)'
                                    : r.sentiment === 'negative'
                                    ? 'rgba(239, 68, 68, 0.15)'
                                    : 'rgba(245, 158, 11, 0.15)',
                                color:
                                  r.sentiment === 'positive'
                                    ? '#10b981'
                                    : r.sentiment === 'negative'
                                    ? 'var(--accent)'
                                    : '#f59e0b',
                              }}
                            >
                              {r.sentiment}
                            </span>
                          </td>
                          <td className="py-3 max-w-[320px] truncate" style={{ color: 'var(--text-primary)' }}>
                            {r.summary || r.reviewText}
                          </td>
                          <td className="py-3">
                            {r.needs_reply ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400">
                                Needs Reply
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400">
                                Resolved
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        /* View 2: All Products Catalog Grid */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Product Intelligence
              </h2>
              <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                Per-product breakdown of sentiment split, customer satisfaction, and recurring issues.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchProducts}
                disabled={productsLoading}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${productsLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => navigate('/upload')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-md"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--btn-text)',
                }}
              >
                <Upload className="h-4 w-4" />
                <span>Upload Dataset</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter products by name..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs focus:outline-none transition-colors"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
                borderWidth: '1px',
                borderStyle: 'solid',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="py-16 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 opacity-50" />
              Loading product intelligence catalog...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              className="rounded-3xl p-12 text-center max-w-lg mx-auto"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--accent)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <Package className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {searchTerm ? 'No Matching Products' : 'No Product Catalog Data'}
              </h3>
              <p className="text-xs leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                {searchTerm
                  ? `No products matching "${searchTerm}". Try a different search term.`
                  : 'Upload customer reviews with a productName column to benchmark sentiment and inspect issues per product.'}
              </p>
              <button
                onClick={() => navigate('/upload')}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-lg"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--btn-text)',
                }}
              >
                <Upload className="h-4 w-4" />
                <span>Upload Dataset</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.productName}
                  onClick={() => selectProduct(p.productName)}
                  className="rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <div>
                    {/* Top Row: Name and Avg Rating */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-base font-bold tracking-tight line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                          {p.productName}
                        </h3>
                        <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                          {p.totalReviews} total reviews
                        </span>
                      </div>
                      {p.avgRating !== null && (
                        <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-xl text-xs flex-shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{p.avgRating}★</span>
                        </div>
                      )}
                    </div>

                    {/* Segmented Sentiment Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5">
                        <span style={{ color: 'var(--text-secondary)' }}>Sentiment Split</span>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-emerald-500">{p.positivePercentage}% pos</span>
                          <span className="text-red-500">{p.negativePercentage}% neg</span>
                        </div>
                      </div>

                      <div className="w-full h-2 rounded-full overflow-hidden flex bg-black/10 dark:bg-white/10">
                        <div style={{ width: `${p.positivePercentage}%`, backgroundColor: '#10b981' }} />
                        <div style={{ width: `${p.neutralPercentage}%`, backgroundColor: '#f59e0b' }} />
                        <div style={{ width: `${p.negativePercentage}%`, backgroundColor: '#ef4444' }} />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Top Issue Tag & Action */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                      style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
                    >
                      Topic: {p.topTopic}
                    </span>

                    <span
                      className="text-xs font-semibold inline-flex items-center gap-1"
                      style={{ color: 'var(--accent)' }}
                    >
                      <span>Inspect View</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
