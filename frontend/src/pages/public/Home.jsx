import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPublicDatasets } from '../../redux/datasetSlice';
import ChartRenderer from '../../components/visualizations/ChartRenderer';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Link } from 'react-router-dom';
import {
  Globe,
  Wind,
  Zap,
  Activity,
  Filter,
  Search,
  Calendar,
  User,
  ArrowRight,
  Download,
  Eye,
} from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { publicList, loading } = useSelector((state) => state.datasets);
  const { searchQuery } = useSelector((state) => state.ui);

  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedChartType, setSelectedChartType] = useState('All');

  useEffect(() => {
    dispatch(fetchPublicDatasets());
  }, [dispatch]);

  // Filter datasets
  const filteredDatasets = publicList.filter((d) => {
    const matchesDomain = selectedDomain === 'All' || d.domain === selectedDomain;
    const matchesChartType =
      selectedChartType === 'All' ||
      (selectedChartType === 'map' && ['latlng', 'statewise'].includes(d.chartType)) ||
      (selectedChartType === 'timeseries' && ['timeseries_line', 'timeseries_bar', 'timeseries_area'].includes(d.chartType));

    const matchesSearch =
      !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDomain && matchesChartType && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 p-8 sm:p-12 text-white border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>Open Access Climate Data Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Vasudha India Data Portal for <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-emerald-500">Climate, Energy & Power</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Publicly explore verified climate change indicators, state-wise renewable energy capacity, and national power grid telemetry datasets across India.
          </p>

          {/* Domain Quick Links */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/climate"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-600/80 hover:bg-teal-600 text-white text-xs font-bold transition-all shadow-md"
            >
              <Wind className="w-4 h-4" />
              <span>Climate Domain</span>
            </Link>
            <Link
              to="/energy"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md"
            >
              <Zap className="w-4 h-4" />
              <span>Energy Domain</span>
            </Link>
            <Link
              to="/power"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md"
            >
              <Activity className="w-4 h-4" />
              <span>Power Domain</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Domain Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['All', 'Climate', 'Energy', 'Power'].map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDomain === dom
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {dom === 'All' ? 'All Domains' : dom}
            </button>
          ))}
        </div>

        {/* Chart Type Filter */}
        <div className="flex items-center space-x-2 text-xs w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500 font-medium">Type:</span>
          <select
            value={selectedChartType}
            onChange={(e) => setSelectedChartType(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="All">All Visualizations</option>
            <option value="map">Interactive Maps (Lat/Lng & State Heatmap)</option>
            <option value="timeseries">Time-Series Charts (Line/Bar/Area)</option>
          </select>
        </div>
      </div>

      {/* Published Datasets Sequence List */}
      {loading ? (
        <SkeletonLoader count={3} />
      ) : filteredDatasets.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-3">
          <Search className="w-10 h-10 mx-auto text-slate-400" />
          <p className="font-bold text-base text-slate-700 dark:text-slate-300">No published datasets found matching filters.</p>
          <p className="text-xs">Try selecting a different domain or clearing your search term.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {filteredDatasets.map((dataset, index) => (
            <article
              key={dataset._id || dataset.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6 hover:border-teal-500/50 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                      Sequence #{index + 1} &bull; {dataset.domain}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Chart Type: {dataset.chartType}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {dataset.title}
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    to={`/dataset/${dataset._id || dataset.id}`}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Full Details & Data Table</span>
                  </Link>
                </div>
              </div>

              {/* Description */}
              {dataset.description && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {dataset.description}
                </p>
              )}

              {/* Dynamic Visualization Container */}
              <div className="pt-2">
                <ChartRenderer dataset={dataset} />
              </div>

              {/* Footer Meta */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Uploaded by: {dataset.uploadedBy?.name || 'Admin'}</span>
                  </span>
                  {dataset.publishedAt && (
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Published: {new Date(dataset.publishedAt).toLocaleDateString()}</span>
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
