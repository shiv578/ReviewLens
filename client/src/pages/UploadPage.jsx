import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle2, AlertCircle, Download, X, Settings, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import api from '../services/api';

// Helper to parse standard CSV rows
function parseCSVToReviews(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(',')
    .map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());

  const reviewTextIdx = headers.findIndex((h) =>
    ['reviewtext', 'review', 'feedback', 'comment', 'text'].includes(h)
  );
  const productNameIdx = headers.findIndex((h) =>
    ['productname', 'product', 'item', 'title'].includes(h)
  );
  const ratingIdx = headers.findIndex((h) =>
    ['rating', 'score', 'stars', 'star'].includes(h)
  );

  const parsed = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Split respecting quotes
    const row = [];
    let inQuotes = false;
    let curr = '';
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(curr.trim());
        curr = '';
      } else {
        curr += char;
      }
    }
    row.push(curr.trim());

    const cleanVal = (val) => {
      if (!val) return '';
      if (val.startsWith('"') && val.endsWith('"')) return val.slice(1, -1).trim();
      return val.trim();
    };

    const reviewText = reviewTextIdx !== -1 ? cleanVal(row[reviewTextIdx]) : cleanVal(row[0]);
    const productName = productNameIdx !== -1 ? cleanVal(row[productNameIdx]) : cleanVal(row[1]) || 'General Product';
    const ratingRaw = ratingIdx !== -1 ? Number(cleanVal(row[ratingIdx])) : Number(cleanVal(row[2]));
    const rating = !isNaN(ratingRaw) && ratingRaw >= 1 && ratingRaw <= 5 ? ratingRaw : 5;

    if (reviewText && reviewText.length > 2) {
      parsed.push({ reviewText, productName, rating });
    }
  }

  return parsed;
}

export default function UploadPage() {
  const navigate = useNavigate();
  const { backendHealth } = useApp();
  const isGeminiReady = Boolean(backendHealth?.gemini?.configured);
  const isDbConnected = Boolean(backendHealth?.database?.connected);

  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    document.title = 'Upload Reviews | ReviewLens';
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.name.endsWith('.csv')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const rows = parseCSVToReviews(e.target.result);
            setParsedRows(rows);
            toast.success(`Loaded ${file.name} (${rows.length} valid reviews detected)`);
          } catch (err) {
            console.error('CSV parse error:', err);
            toast.error('Could not parse CSV contents');
          }
        };
        reader.readAsText(file);
      } else {
        toast.error('Please upload a valid .csv file');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });

  const handleDownloadSample = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,productName,reviewText,rating\n' +
      '"Wireless Headphones Pro","Sound quality is exceptional and battery lasts all week.",5\n' +
      '"Ergonomic Office Chair","Comfortable back support, though the armrests could be softer.",4\n' +
      '"Mechanical Keyboard","Keys began double-typing after just two weeks of use. Customer support was slow.",1\n' +
      '"Smart Fitness Band","Step counting is accurate and sleep tracking is fantastic. Highly recommend!",5\n' +
      '"USB-C Fast Charger","Cable broke within a month. Disappointed with build quality.",2\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'reviewlens_sample_reviews.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded sample CSV template');
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file first');
      return;
    }

    if (parsedRows.length === 0) {
      toast.error('No valid reviews found in the selected CSV');
      return;
    }

    if (!isDbConnected) {
      toast.error('Database is currently offline. Please ensure MongoDB is running to store reviews.');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Analyzing sentiment & topics with Gemini...');

    try {
      const response = await api.post('/reviews/batch', {
        fileName: selectedFile.name,
        reviews: parsedRows,
      });

      toast.success(
        `Analysis complete! Processed ${response.data?.count || parsedRows.length} reviews.`,
        { id: toastId }
      );
      navigate('/reviews');
    } catch (err) {
      console.error('Batch upload error:', err);
      toast.error(
        err.response?.data?.message || 'Failed to process reviews batch with Gemini',
        { id: toastId }
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Upload Customer Reviews</h2>
          <p className="text-xs md:text-sm text-[#8E8E98]">
            Ingest raw review feedback via CSV. The platform validates headers, normalizes ratings, and runs Gemini AI sentiment analysis.
          </p>
        </div>

        {isGeminiReady ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#10E599]/10 text-[#10E599] border border-[#10E599]/25 self-start shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#10E599] animate-pulse" />
            Gemini Engine Ready
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20 self-start">
            <span className="h-2 w-2 rounded-full bg-[#FBBF24]" />
            Gemini Key Required
          </span>
        )}
      </div>

      {/* Dropzone Container */}
      <div
        {...getRootProps()}
        className={`rounded-2xl border-2 border-dashed p-10 md:p-14 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-[#00F0FF] bg-[#00F0FF]/5'
            : 'border-white/15 bg-[#0C0C0F] hover:border-[#00F0FF]'
        }`}
      >
        <input {...getInputProps()} />

        <div className="max-w-md mx-auto space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/25 flex items-center justify-center mx-auto text-[#00F0FF]">
            <Upload className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white">
              {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
            </h3>
            <p className="text-xs text-[#8E8E98] mt-1">
              or <span className="text-[#00F0FF] font-semibold underline">browse local files</span> from your computer
            </p>
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-[11px] text-[#8E8E98]">
            Supported format: Standard comma-separated .CSV
          </span>
        </div>
      </div>

      {/* Selected File Details */}
      {selectedFile && (
        <div className="rounded-2xl bg-[#0C0C0F] border border-[#00F0FF]/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold text-white">{selectedFile.name}</p>
              <p className="text-[10px] text-[#8E8E98]">
                {(selectedFile.size / 1024).toFixed(1)} KB • {parsedRows.length} reviews parsed and ready
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setParsedRows([]);
              }}
              className="p-1.5 rounded-lg text-[#8E8E98] hover:text-[#FF4B72] hover:bg-white/5"
              title="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
        <button
          onClick={handleDownloadSample}
          className="text-xs font-semibold text-[#00F0FF] hover:underline flex items-center gap-1.5"
        >
          <Download className="h-4 w-4" />
          <span>Download Sample CSV Template</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartAnalysis}
            disabled={!selectedFile || isUploading}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs text-black gradient-growth disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#00F0FF]/20 transition-all flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Running Gemini AI Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Start AI Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CSV Specification Card */}
      <div className="rounded-2xl bg-[#0C0C0F] border border-white/10 p-5 space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">CSV Header Requirements</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#141418] border border-white/5">
            <strong className="text-[#00F0FF] block mb-1">reviewText</strong>
            <span className="text-[#8E8E98] text-[11px]">Primary feedback text from the customer. Required.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#141418] border border-white/5">
            <strong className="text-[#10E599] block mb-1">productName</strong>
            <span className="text-[#8E8E98] text-[11px]">Product or SKU name. Required for grouping.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#141418] border border-white/5">
            <strong className="text-[#FBBF24] block mb-1">rating</strong>
            <span className="text-[#8E8E98] text-[11px]">Star score from 1 to 5. Optional.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
