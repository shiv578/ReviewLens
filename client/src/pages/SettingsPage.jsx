import React, { useState, useEffect } from 'react';
import { Settings, Key, Database, Info, Eye, EyeOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

export default function SettingsPage() {
  const { backendHealth, refreshHealth } = useApp();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    document.title = 'Workspace Settings | ReviewLens';
  }, []);

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter an API key or set GEMINI_API_KEY in server/.env');
      return;
    }
    toast.success('Settings noted. Ensure GEMINI_API_KEY is placed in server/.env to secure credentials.');
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshHealth();
    setIsRefreshing(false);
    toast.success('Connection status refreshed');
  };

  const isDbConnected = backendHealth?.database?.connected;

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Workspace Settings</h2>
        <p className="text-xs md:text-sm text-[#8E8E98]">
          Configure your Google Gemini API credentials, monitor MongoDB connectivity, and manage environment parameters.
        </p>
      </div>

      {/* Section 1: Gemini AI Engine Credentials */}
      <div className="rounded-2xl bg-[#0C0C0F] border border-white/10 p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="h-9 w-9 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] border border-[#00F0FF]/25">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Google Gemini API Engine
            </h3>
            <p className="text-xs text-[#8E8E98]">
              Powers sentiment scoring, review topic clustering, and intelligent reply drafting
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveApiKey} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-[#000000] border border-white/15 text-xs text-white placeholder-[#8E8E98]/50 focus:border-[#00F0FF] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E98] hover:text-white"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#8E8E98] leading-relaxed">
              <strong className="text-white">Security note:</strong> ReviewLens processes all LLM prompts server-side.
              For production setups, place your key directly in <code>server/.env</code> as <code>GEMINI_API_KEY=your_key</code>.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Target AI Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#000000] border border-white/15 text-xs text-white focus:border-[#00F0FF] focus:outline-none"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Fastest & Cost Efficient)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Nuance & Complex Synthesis)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-black gradient-growth shadow-md shadow-[#00F0FF]/20 hover:opacity-95 transition-all"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Database Connectivity */}
      <div className="rounded-2xl bg-[#0C0C0F] border border-white/10 p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#10E599]/10 flex items-center justify-center text-[#10E599] border border-[#10E599]/25">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Database Connectivity (MongoDB)
              </h3>
              <p className="text-xs text-[#8E8E98]">Review persistence and deduplication index status</p>
            </div>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8E8E98] hover:text-white transition-colors"
            title="Refresh database connection status"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-[#00F0FF]' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#000000] border border-white/10 space-y-1">
            <span className="text-[11px] text-[#8E8E98] uppercase tracking-wider block font-medium">
              Connection State
            </span>
            <div className="flex items-center gap-2">
              {isDbConnected ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#10E599]" />
                  <span className="text-sm font-bold text-white">Online & Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-[#FBBF24]" />
                  <span className="text-sm font-bold text-[#FBBF24]">Disconnected (Offline)</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#000000] border border-white/10 space-y-1">
            <span className="text-[11px] text-[#8E8E98] uppercase tracking-wider block font-medium">
              Backend API Status
            </span>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10E599]" />
              <span className="text-sm font-bold text-white">
                {backendHealth?.status === 'ok' ? 'Express API Healthy' : 'Checking...'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141418] border border-white/5 text-xs text-[#8E8E98] space-y-2">
          <strong className="text-white block font-semibold">Configuring MongoDB:</strong>
          <p>
            ReviewLens connects to MongoDB at <code>mongodb://127.0.0.1:27017/reviewlens</code> by default.
            If using MongoDB Atlas, configure <code>MONGODB_URI=mongodb+srv://...</code> in <code>server/.env</code>.
          </p>
        </div>
      </div>

      {/* Section 3: About ReviewLens */}
      <div className="rounded-2xl bg-[#0C0C0F] border border-white/10 p-6 md:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] border border-[#00F0FF]/25">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">About ReviewLens</h3>
            <p className="text-xs text-[#8E8E98]">Architecture specification v0.1.0-alpha</p>
          </div>
        </div>

        <p className="text-xs text-[#8E8E98] leading-relaxed">
          ReviewLens is an AI review intelligence platform built with React 19, Vite, Tailwind CSS v4, Motion,
          Express.js, and Google Gemini in a Cyber Minimalist OLED design aesthetic.
        </p>
      </div>
    </div>
  );
}
