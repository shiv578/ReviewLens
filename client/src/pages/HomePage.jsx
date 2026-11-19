import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Activity, CheckCircle2, XCircle, ArrowRight, Layers, Cpu, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function HomePage() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkBackendHealth = async () => {
    setLoading(true);
    try {
      const response = await api.get('/health');
      setHealthStatus(response.data);
      toast.success('Connected to backend successfully!');
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus({ status: 'error', message: error.message });
      toast.error('Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 md:p-12 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-8 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
              ReviewLens
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v0.1.0-alpha
              </span>
            </h1>
            <p className="text-xs text-slate-400">AI-Powered Review Insights</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 border border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${healthStatus?.status === 'ok' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${healthStatus?.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-slate-300">
              API: {healthStatus?.status === 'ok' ? 'Online' : 'Checking...'}
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section with Motion */}
      <main className="max-w-6xl w-full mx-auto my-auto py-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/50 border border-indigo-700/40 text-indigo-300 text-sm mb-6"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Transform Customer Feedback Into Actionable Insights</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight"
        >
          Intelligent Review Analytics Powered by{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent">
            Gemini AI
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
        >
          Automate sentiment analysis, feedback topic clustering, duplicate review detection, and personalized customer responses at scale.
        </motion.p>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full text-left"
        >
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition duration-200">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">CSV Batch Ingestion</h3>
            <p className="text-sm text-slate-400 mt-2">
              High-throughput streaming parser with automatic schema validation and duplicate detection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition duration-200">
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4 border border-violet-500/20">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">AI-Driven Insights</h3>
            <p className="text-sm text-slate-400 mt-2">
              Extract granular sentiment scores, key thematic topics, and generate empathetic replies with Gemini API.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition duration-200">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">Full-Stack Architecture</h3>
            <p className="text-sm text-slate-400 mt-2">
              Modular React + Tailwind frontend combined with an Express and MongoDB backend.
            </p>
          </div>
        </motion.div>

        {/* Backend Connectivity Status Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-lg w-full text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-indigo-400" /> Backend Health Check
            </span>
            <button
              onClick={checkBackendHealth}
              disabled={loading}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg text-xs font-mono border border-slate-800/80">
            {healthStatus ? (
              <pre className="text-slate-300 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(healthStatus, null, 2)}
              </pre>
            ) : (
              <span className="text-slate-500">Checking GET /api/health...</span>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>ReviewLens © 2026. Built with React, Vite, Tailwind CSS, Express & Gemini AI.</div>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-300 transition cursor-pointer">Documentation</span>
          <span className="hover:text-slate-300 transition cursor-pointer">API Specs</span>
        </div>
      </footer>
    </div>
  );
}
