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
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const DatasetDetails = () => {
  const { id } = useParams();
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Table pagination & sorting
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

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
    if (!dataset || !dataset.downloadEnabled) {
      return toast.warn('CSV download is disabled for this dataset');
    }
    if (!dataset.parsedData || dataset.parsedData.length === 0) return;
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
    a.setAttribute('download', `${(dataset.title || 'dataset').replace(/\s+/g, '_')}.csv`);
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
      <div className="p-12 text-center bg-white rounded border border-slate-200 space-y-3 font-sans">
        <h2 className="text-lg font-bold text-slate-900">Dataset Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'The requested dataset is unavailable.'}</p>
        <Link to="/" className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded text-xs font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    domain,
    chartType,
    category,
    source,
    year,
    state,
    district,
    downloadEnabled,
    parsedData,
    publishedAt,
    uploadedBy,
  } = dataset;

  const rawColumns = parsedData && parsedData.length > 0 ? Object.keys(parsedData[0]) : [];

  // Sorting table rows
  let displayRows = parsedData ? [...parsedData] : [];
  if (sortCol) {
    displayRows.sort((a, b) => {
      const valA = a[sortCol] !== undefined ? a[sortCol] : '';
      const valB = b[sortCol] !== undefined ? b[sortCol] : '';
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      return sortDir === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }

  const totalPages = Math.ceil(displayRows.length / rowsPerPage) || 1;
  const paginatedRows = displayRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Datasets Portal</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded border border-slate-200 p-6 space-y-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                {domain} Domain
              </span>
              {category && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {category}
                </span>
              )}
              <span className="text-[11px] text-slate-500 font-medium">
                Type: {chartType}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              {uploadedBy && (
                <span className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Publisher: {uploadedBy.name || 'Admin'}</span>
                </span>
              )}
              {publishedAt && (
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Published: {new Date(publishedAt).toLocaleDateString()}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {downloadEnabled ? (
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded shadow transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV Dataset</span>
              </button>
            ) : (
              <span className="flex items-center space-x-1 px-3 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded border border-slate-200">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Disabled</span>
              </span>
            )}

            <button
              onClick={handleCopyEmbed}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded border border-slate-300 transition-colors"
            >
              <Code className="w-4 h-4" />
              <span>Embed</span>
            </button>
          </div>
        </div>

        {/* Metadata Details Card */}
        <div className="bg-slate-50 p-4 rounded border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Data Source</span>
            <span className="font-semibold text-slate-800">{source || 'Government Open Data'}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Year / Period</span>
            <span className="font-semibold text-slate-800">{year || 'N/A'}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Geography / State</span>
            <span className="font-semibold text-slate-800">{state || 'All India'}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">District</span>
            <span className="font-semibold text-slate-800">{district || 'All Districts'}</span>
          </div>
        </div>

        {description && (
          <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded border border-slate-200">
            {description}
          </p>
        )}

        {/* Dynamic Chart Visualization */}
        <div className="pt-2">
          <ChartRenderer dataset={dataset} />
        </div>

        {/* Responsive Data Table */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-sm text-slate-900">
              <TableIcon className="w-4 h-4 text-slate-700" />
              <span>Dataset Table View ({displayRows.length} Rows)</span>
            </div>

            <span className="text-xs text-slate-500">Click headers to sort column</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-slate-100 text-slate-800 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 w-12 text-center">#</th>
                  {rawColumns.map((col) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className="p-2.5 cursor-pointer hover:bg-slate-200 transition-colors select-none"
                    >
                      <div className="flex items-center space-x-1">
                        <span>{col}</span>
                        {sortCol === col && (
                          <span className="text-slate-900">{sortDir === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {paginatedRows.map((row, idx) => {
                  const globalIdx = (currentPage - 1) * rowsPerPage + idx + 1;
                  return (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 text-center font-medium text-slate-400">{globalIdx}</td>
                      {rawColumns.map((col) => (
                        <td key={col} className="p-2.5 text-slate-800">
                          {String(row[col] !== undefined ? row[col] : '')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  className="p-1.5 border border-slate-300 rounded disabled:opacity-40 hover:bg-slate-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  className="p-1.5 border border-slate-300 rounded disabled:opacity-40 hover:bg-slate-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatasetDetails;
