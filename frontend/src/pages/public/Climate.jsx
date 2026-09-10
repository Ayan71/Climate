import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDomainDatasets } from '../../redux/datasetSlice';
import ChartRenderer from '../../components/visualizations/ChartRenderer';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Wind, Eye, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Climate = () => {
  const dispatch = useDispatch();
  const { domainLists, loading } = useSelector((state) => state.datasets);
  const climateList = domainLists.Climate || [];

  const [search, setSearch] = useState('');
  const [selectedChartType, setSelectedChartType] = useState('All');

  useEffect(() => {
    dispatch(fetchDomainDatasets('Climate'));
  }, [dispatch]);

  const filtered = climateList.filter(d => {
    const matchesChart = selectedChartType === 'All' || d.chartType === selectedChartType;
    const matchesSearch = !search ||
      (d.title && d.title.toLowerCase().includes(search.toLowerCase())) ||
      (d.description && d.description.toLowerCase().includes(search.toLowerCase())) ||
      (d.category && d.category.toLowerCase().includes(search.toLowerCase()));
    return matchesChart && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded bg-white border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
          <Wind className="w-4 h-4 text-teal-700" />
          <span>Domain Portal: Climate (/climate)</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Climate Telemetry & Indicators</h1>
        <p className="text-slate-600 text-xs max-w-2xl leading-relaxed">
          Verified climate change telemetry, ambient surface temperature anomalies, heatwave alerts, and atmospheric monitoring datasets across India.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Climate datasets..."
            className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-300 bg-white"
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedChartType}
            onChange={(e) => setSelectedChartType(e.target.value)}
            className="p-1.5 rounded border border-slate-300 bg-white font-medium"
          >
            <option value="All">All Visualization Types</option>
            <option value="latlng">Coordinates Map</option>
            <option value="statewise">State Heatmap</option>
            <option value="timeseries_line">Time-Series Line</option>
            <option value="timeseries_bar">Bar Chart</option>
            <option value="timeseries_area">Area Chart</option>
          </select>
        </div>
      </div>

      {/* Dataset List */}
      {loading ? (
        <SkeletonLoader count={2} />
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded border border-slate-200 text-slate-500">
          <Wind className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <p className="font-bold text-sm text-slate-800">No Climate datasets match the current filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((dataset) => (
            <article
              key={dataset._id || dataset.id}
              className="bg-white rounded border border-slate-200 p-5 space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      Climate Domain
                    </span>
                    {dataset.category && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {dataset.category}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    {dataset.title}
                  </h2>
                </div>
                <Link
                  to={`/dataset/${dataset._id || dataset.id}`}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Data Table</span>
                </Link>
              </div>

              {dataset.description && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {dataset.description}
                </p>
              )}

              <ChartRenderer dataset={dataset} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Climate;
