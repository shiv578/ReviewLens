import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Search, Upload, Package } from 'lucide-react';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'Product Intelligence | ReviewLens';
  }, []);

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Product Intelligence</h2>
          <p className="text-xs md:text-sm text-[#9BAAC0]">
            Compare customer sentiment, review volume, and complaint rates across your product catalog.
          </p>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#080D19] gradient-growth self-start shadow-md"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Dataset</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BAAC0]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter products by name or SKU..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#101A2B] border border-white/10 text-xs text-white placeholder-[#9BAAC0]/60 focus:border-[#10D6A0] focus:outline-none"
        />
      </div>

      {/* Empty State */}
      <div className="rounded-3xl bg-[#101A2B] border border-white/5 p-12 text-center max-w-lg mx-auto">
        <div className="h-14 w-14 rounded-2xl bg-[#20C5F5]/10 text-[#20C5F5] flex items-center justify-center mx-auto mb-4 border border-[#20C5F5]/20">
          <Package className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Product Catalog Data</h3>
        <p className="text-xs text-[#9BAAC0] leading-relaxed mb-6">
          Upload reviews with a <code>productName</code> column to benchmark product ratings and discover which items drive the most praise or returns.
        </p>
        <button
          onClick={() => navigate('/upload')}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#080D19] gradient-growth inline-flex items-center gap-2 shadow-lg shadow-[#10D6A0]/20"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Review Data</span>
        </button>
      </div>
    </div>
  );
}
