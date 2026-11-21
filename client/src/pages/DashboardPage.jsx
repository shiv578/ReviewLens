import React, { useState } from 'react';
import UploadPage from './UploadPage';
import OverviewPage from './OverviewPage';
import { Upload, LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'overview'

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Toggle Switch between Upload and Overview */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <button
            onClick={() => setActiveTab('upload')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
            style={{
              backgroundColor: activeTab === 'upload' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'upload' ? 'var(--btn-text)' : 'var(--text-secondary)',
            }}
          >
            <Upload className="h-4 w-4" />
            <span>Upload Dataset</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
            style={{
              backgroundColor: activeTab === 'overview' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'overview' ? 'var(--btn-text)' : 'var(--text-secondary)',
            }}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview &amp; Analytics</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeTab === 'upload' ? (
        <UploadPage onAnalysisComplete={() => setActiveTab('overview')} />
      ) : (
        <OverviewPage />
      )}
    </div>
  );
}
