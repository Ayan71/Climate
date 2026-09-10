import React, { useState } from 'react';
import { Upload, AlertCircle, Download } from 'lucide-react';

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
    <div className="space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              activeTab === 'file'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Upload .CSV File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              activeTab === 'paste'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Paste CSV Text
          </button>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Load Sample Data</span>
        </button>
      </div>

      {activeTab === 'file' ? (
        <div className="border-2 border-dashed border-slate-300 rounded p-6 text-center bg-slate-50">
          <Upload className="w-8 h-8 mx-auto text-slate-500 mb-2" />
          <p className="text-xs font-bold text-slate-800">
            {file ? file.name : 'Drag & Drop dataset .CSV file here or click to browse'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Supports CSV files up to 10MB</p>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-file-input"
          />
          <label
            htmlFor="csv-file-input"
            className="inline-block mt-3 px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded cursor-pointer transition-colors"
          >
            Select File
          </label>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            rows={6}
            value={rawCsvText}
            onChange={(e) => setRawCsvText(e.target.value)}
            placeholder="latitude,longitude,value,name&#10;28.6139,77.2090,46.2,Safdarjung Station"
            className="w-full p-2.5 font-mono text-xs rounded border border-slate-300 bg-white outline-none"
          />
        </div>
      )}

      {/* Built-in Schema Validation Errors Display */}
      {validationErrors && validationErrors.length > 0 && (
        <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-800 text-xs space-y-1.5">
          <div className="flex items-center space-x-1.5 font-bold">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>CSV Schema Validation Errors ({validationErrors.length})</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px] max-h-32 overflow-y-auto">
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
