import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle2, AlertCircle, Download, X, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    document.title = 'Upload Reviews | ReviewLens';
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.name.endsWith('.csv')) {
        setSelectedFile(file);
        toast.success(`Selected ${file.name}`);
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
      '"Mechanical Keyboard","Keys began double-typing after just two weeks of use.",1\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'reviewlens_sample_reviews.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded sample CSV template');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">Upload Customer Reviews</h2>
        <p className="text-xs md:text-sm text-[#9BAAC0]">
          Ingest raw review feedback via CSV. The platform validates headers, normalizes ratings, and stages data for AI analysis.
        </p>
      </div>

      {/* Dropzone Container */}
      <div
        {...getRootProps()}
        className={`rounded-3xl border-2 border-dashed p-10 md:p-14 text-center cursor-pointer transition-all ${isDragActive
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
              <p className="text-xs font-bold text-white">
                {selectedFile.name}
              </p>
              <p className="text-[10px] text-[#8E8E98]">
                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for processing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
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
          className="text-xs font-semibold text-[#20C5F5] hover:underline flex items-center gap-1.5"
        >
          <Download className="h-4 w-4" />
          <span>Download Sample CSV Template</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!selectedFile) {
                toast.error('Please select a CSV file first');
                return;
              }
              toast('Gemini API key is required to initiate AI analysis. Please configure your key in Settings.', {
                icon: '⚠️',
              });
            }}
            disabled={!selectedFile}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs text-[#080D19] gradient-growth disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#10D6A0]/20 transition-all"
          >
            Start Analysis
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
