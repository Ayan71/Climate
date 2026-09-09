import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';

const SAMPLES = {
  latlng: `latitude,longitude,value,name,city
28.6139,77.2090,46.2,Safdarjung Station,Delhi
26.9124,75.7873,47.8,IMD Observatory,Jaipur
19.0760,72.8777,38.6,Santacruz Station,Mumbai
13.0827,80.2707,41.5,Meenambakkam,Chennai`,
  statewise: `state,value
Rajasthan,18700
Gujarat,10400
Karnataka,8900
Tamil Nadu,7500
Maharashtra,5200
Delhi,340`,
  timeseries: `year,value
2018,175.4
2019,182.5
2020,184.1
2021,200.5
2022,215.8
2023,240.0
2024,250.2
2025,262.8`,
};

const CSVUploader = ({
  file,
  setFile,
  rawCsvText,
  setRawCsvText,
  chartType,
  validationErrors = [],
}) => {
  const [activeTab, setActiveTab] = useState('file'); // 'file' | 'paste'

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleLoadSample = () => {
    const key = chartType === 'latlng' ? 'latlng' : chartType === 'statewise' ? 'statewise' : 'timeseries';
    setRawCsvText(SAMPLES[key]);
    setActiveTab('paste');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 w-full pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'file'
                ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Upload .CSV File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'paste'
                ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Paste CSV Data
          </button>

          <button
            type="button"
            onClick={handleLoadSample}
            className="ml-auto flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/40 hover:bg-teal-200 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Load Sample CSV</span>
          </button>
        </div>
      </div>

      {activeTab === 'file' ? (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-900/40 transition-colors">
          <Upload className="w-10 h-10 mx-auto text-teal-600 dark:text-teal-400 mb-2 animate-bounce" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {file ? file.name : 'Drag & Drop your dataset .CSV file here or click to browse'}
          </p>
          <p className="text-xs text-slate-500 mt-1">Supports standard CSV formatting up to 10MB</p>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-file-input"
          />
          <label
            htmlFor="csv-file-input"
            className="inline-block mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow"
          >
            Select File
          </label>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            rows={7}
            value={rawCsvText}
            onChange={(e) => setRawCsvText(e.target.value)}
            placeholder="latitude,longitude,value,name&#10;28.6139,77.2090,46.2,Safdarjung"
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
      )}

      {/* Built-in Schema Validation Errors Display */}
      {validationErrors && validationErrors.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs space-y-2">
          <div className="flex items-center space-x-2 font-bold text-sm">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>CSV Schema Validation Rejected ({validationErrors.length} Errors Found)</span>
          </div>
          <ul className="list-disc list-inside space-y-1 font-mono text-[11px] max-h-36 overflow-y-auto pr-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CSVUploader;
