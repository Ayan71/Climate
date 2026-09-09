import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import ChartRenderer from '../../components/visualizations/ChartRenderer';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  Download,
  Code,
  Table as TableIcon,
  Calendar,
  User,
  Globe,
} from 'lucide-react';

const DatasetDetails = () => {
  const { id } = useParams();
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/public/${id}`);
        setDataset(res.data.dataset);
      } catch (err) {
        setError(err.response?.data?.error || 'Dataset not found');
      } finally {
        setLoading(false);
      }
    };
    fetchDataset();
  }, [id]);

  // Export JSON to CSV string
  const handleExportCSV = () => {
    if (!dataset || !dataset.parsedData || dataset.parsedData.length === 0) return;
    const data = dataset.parsedData;
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    data.forEach((row) => {
      const values = headers.map((h) => {
        const val = row[h] !== undefined ? row[h] : '';
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${dataset.title.replace(/\s+/g, '_')}_dataset.csv`);
    a.click();
    toast.success('CSV dataset downloaded successfully!');
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${window.location.href}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast.info('Embed snippet copied to clipboard!');
  };

  if (loading) {
    return <SkeletonLoader count={2} />;
  }

  if (error || !dataset) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Dataset Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'The requested dataset is unavailable.'}</p>
        <Link to="/" className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>
      </div>
    );
  }

  const { title, description, domain, chartType, parsedData, publishedAt, uploadedBy } = dataset;
  const columns = parsedData && parsedData.length > 0 ? Object.keys(parsedData[0]) : [];

  return (
    <div className="space-y-8 pb-12">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Landing Page</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              {domain} Domain &bull; {chartType}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {title}
            </h1>
            <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5" />
                <span>By: {uploadedBy?.name || 'Admin'}</span>
              </span>
              {publishedAt && (
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Published: {new Date(publishedAt).toLocaleDateString()}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV Data</span>
            </button>

            <button
              onClick={handleCopyEmbed}
              className="flex items-center space-x-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
            >
              <Code className="w-4 h-4" />
              <span>Embed</span>
            </button>
          </div>
        </div>

        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
            {description}
          </p>
        )}

        {/* Dynamic Visualization */}
        <div className="pt-2">
          <ChartRenderer dataset={dataset} />
        </div>

        {/* Raw Data Table Preview */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-base text-slate-900 dark:text-white">
              <TableIcon className="w-5 h-5 text-teal-600" />
              <span>Raw Dataset Records ({parsedData ? parsedData.length : 0} Rows)</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">#</th>
                  {columns.map((col, i) => (
                    <th key={i} className="p-3">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {parsedData && parsedData.slice(0, 50).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-400">{idx + 1}</td>
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className="p-3">
                        {String(row[col] !== undefined ? row[col] : '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetails;
