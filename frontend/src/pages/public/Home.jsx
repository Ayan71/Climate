import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPublicDatasets } from '../../redux/datasetSlice';
import ChartRenderer from '../../components/visualizations/ChartRenderer';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Globe,
  Wind,
  Zap,
  Activity,
  Filter,
  Search,
  Calendar,
  User,
  Eye,
  Tag,
  Download,
  MapPin
} from 'lucide-react';

const INDIAN_STATES = [
  'All States', 'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const Home = () => {
  const dispatch = useDispatch();
  const { publicList, loading } = useSelector((state) => state.datasets);

  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedChartType, setSelectedChartType] = useState('All');

  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    dispatch(fetchPublicDatasets());
    API.get('/categories')
      .then((res) => {
        if (res.data && res.data.categories) {
          setCategoriesList(res.data.categories);
        }
      })
      .catch(() => {});
  }, [dispatch]);

  // Extract years present in data
  const yearOptions = Array.from(new Set(publicList.map(d => d.year).filter(Boolean))).sort().reverse();

  // Filter datasets
  const filteredDatasets = publicList.filter((d) => {
    const matchesDomain = selectedDomain === 'All' || d.domain === selectedDomain;
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesState = selectedState === 'All States' || d.state === selectedState;
    const matchesYear = selectedYear === 'All' || String(d.year) === String(selectedYear);
    const matchesChartType =
      selectedChartType === 'All' ||
      (selectedChartType === 'map' && ['latlng', 'statewise'].includes(d.chartType)) ||
      (selectedChartType === 'timeseries' && ['timeseries_line', 'timeseries_bar', 'timeseries_area', 'multiline'].includes(d.chartType)) ||
      (selectedChartType === 'pie' && ['pie', 'doughnut'].includes(d.chartType));

    const matchesSearch =
      !search ||
      (d.title && d.title.toLowerCase().includes(search.toLowerCase())) ||
      (d.domain && d.domain.toLowerCase().includes(search.toLowerCase())) ||
      (d.category && d.category.toLowerCase().includes(search.toLowerCase())) ||
      (d.source && d.source.toLowerCase().includes(search.toLowerCase())) ||
      (d.description && d.description.toLowerCase().includes(search.toLowerCase())) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));

    return matchesDomain && matchesCategory && matchesState && matchesYear && matchesChartType && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Government / Research Header */}
      <section className="bg-white p-6 md:p-8 rounded border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Globe className="w-4 h-4 text-slate-900" />
          <span>Vasudha India Data Portal &bull; Open Access Platform</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Climate, Energy & Power Data Visualization Portal
        </h1>

        <p className="text-slate-600 text-xs md:text-sm max-w-3xl leading-relaxed">
          Comprehensive open-access research repository for telemetry stations, state-wise power capacity, and climate change metrics across India. Explore approved datasets through interactive maps, heatmaps, and time-series charts.
        </p>

        {/* Quick Domain Filter Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setSelectedDomain('All')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
              selectedDomain === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Domains ({publicList.length})
          </button>
          <button
            onClick={() => setSelectedDomain('Climate')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors ${
              selectedDomain === 'Climate' ? 'bg-teal-700 text-white' : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Climate Domain</span>
          </button>
          <button
            onClick={() => setSelectedDomain('Energy')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors ${
              selectedDomain === 'Energy' ? 'bg-amber-700 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Energy Domain</span>
          </button>
          <button
            onClick={() => setSelectedDomain('Power')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors ${
              selectedDomain === 'Power' ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Power Domain</span>
          </button>
        </div>
      </section>

      {/* Search & Multi-Filter Control Panel */}
      <div className="bg-white p-4 rounded border border-slate-200 space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search datasets by keyword, title, source, or tag..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded border border-slate-300 bg-white focus:border-slate-800 outline-none"
            />
          </div>

          {/* Reset Filters */}
          {(selectedDomain !== 'All' || selectedCategory !== 'All' || selectedState !== 'All States' || selectedYear !== 'All' || selectedChartType !== 'All' || search) && (
            <button
              onClick={() => {
                setSelectedDomain('All');
                setSelectedCategory('All');
                setSelectedState('All States');
                setSelectedYear('All');
                setSelectedChartType('All');
                setSearch('');
              }}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 rounded bg-slate-50 hover:bg-slate-100 whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 border-t border-slate-100 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-1.5 rounded border border-slate-300 bg-white font-medium outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Emissions">Emissions</option>
              <option value="Solar Power">Solar Power</option>
              <option value="Thermal Power">Thermal Power</option>
              <option value="Air Quality">Air Quality</option>
              <option value="Renewable Energy">Renewable Energy</option>
              <option value="Meteorological Data">Meteorological Data</option>
              <option value="Grid Capacity">Grid Capacity</option>
              {categoriesList.map(c => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">State / Geography</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full p-1.5 rounded border border-slate-300 bg-white font-medium outline-none"
            >
              {INDIAN_STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Year / Period</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-1.5 rounded border border-slate-300 bg-white font-medium outline-none"
            >
              <option value="All">All Years</option>
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Visualization Type</label>
            <select
              value={selectedChartType}
              onChange={(e) => setSelectedChartType(e.target.value)}
              className="w-full p-1.5 rounded border border-slate-300 bg-white font-medium outline-none"
            >
              <option value="All">All Visualizations</option>
              <option value="map">Interactive Maps & Heatmaps</option>
              <option value="timeseries">Time-Series Line, Bar & Area</option>
              <option value="pie">Pie & Doughnut Charts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-semibold">
        <span>Showing <strong>{filteredDatasets.length}</strong> approved dataset(s)</span>
      </div>

      {/* Published Datasets Sequence List */}
      {loading ? (
        <SkeletonLoader count={3} />
      ) : filteredDatasets.length === 0 ? (
        <div className="p-12 text-center bg-white rounded border border-slate-200 text-slate-500 space-y-2">
          <Search className="w-8 h-8 mx-auto text-slate-400" />
          <p className="font-bold text-sm text-slate-800">No approved datasets match the selected criteria.</p>
          <p className="text-xs">Try adjusting your category, state, or search filters.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredDatasets.map((dataset, index) => (
            <article
              key={dataset._id || dataset.id}
              className="bg-white rounded border border-slate-200 p-5 md:p-6 space-y-4 shadow-sm"
            >
              {/* Dataset Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                      Sequence #{index + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      {dataset.domain}
                    </span>
                    {dataset.category && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {dataset.category}
                      </span>
                    )}
                    {dataset.year && (
                      <span className="text-[11px] text-slate-500 font-semibold">
                        Year: {dataset.year}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {dataset.title}
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    to={`/dataset/${dataset._id || dataset.id}`}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Table & Download</span>
                  </Link>
                </div>
              </div>

              {/* Description */}
              {dataset.description && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {dataset.description}
                </p>
              )}

              {/* Dynamic Visualization Render */}
              <div className="pt-1">
                <ChartRenderer dataset={dataset} />
              </div>

              {/* Metadata Footer */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100 gap-2">
                <div className="flex flex-wrap items-center gap-4">
                  {dataset.source && (
                    <span><strong>Source:</strong> {dataset.source}</span>
                  )}
                  {dataset.state && (
                    <span><strong>Geography:</strong> {dataset.state}</span>
                  )}
                  {dataset.uploadedBy && (
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{dataset.uploadedBy.name || 'Admin'}</span>
                    </span>
                  )}
                </div>

                {dataset.tags && dataset.tags.length > 0 && (
                  <div className="flex items-center space-x-1 text-[10px]">
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span>{dataset.tags.join(', ')}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
