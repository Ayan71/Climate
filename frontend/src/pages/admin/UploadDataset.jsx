import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createDataset, clearDatasetErrors } from '../../redux/datasetSlice';
import CSVUploader from '../../components/visualizations/CSVUploader';
import { toast } from 'react-toastify';
import { Upload, ArrowLeft, Layers, MapPin, TrendingUp, CheckCircle, Info } from 'lucide-react';

const UploadDataset = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, validationErrors } = useSelector((state) => state.datasets);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Climate');
  const [chartType, setChartType] = useState('timeseries_line');

  const [file, setFile] = useState(null);
  const [rawCsvText, setRawCsvText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearDatasetErrors());

    if (!file && !rawCsvText.trim()) {
      return toast.error('Please upload a .CSV file or paste CSV content');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('domain', domain);
    formData.append('chartType', chartType);

    if (file) {
      formData.append('file', file);
    } else {
      formData.append('rawCsvText', rawCsvText);
    }

    const result = await dispatch(createDataset(formData));

    if (createDataset.fulfilled.match(result)) {
      toast.success('Dataset uploaded successfully! Status set to Pending review.');
      navigate('/admin/dashboard');
    } else {
      const errMsg = typeof result.payload === 'object' ? result.payload.error : result.payload;
      toast.error(errMsg || 'CSV Schema validation failed.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Add New Dataset</h1>
          <p className="text-xs text-slate-500">Upload CSV telemetry dataset and select visualization configuration</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Metadata & Domain */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-extrabold flex items-center justify-center">1</span>
            <span>Dataset Metadata & Domain</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Chart Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Renewable Energy Capacity – State Wise"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-teal-500 outline-none font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Domain Category <span className="text-red-500">*</span>
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-teal-500 outline-none font-bold"
              >
                <option value="Climate">Climate Domain (/climate)</option>
                <option value="Energy">Energy Domain (/energy)</option>
                <option value="Power">Power Domain (/power)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description / Context</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context regarding data collection methodologies or telemetry sources..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>

        {/* Step 2: Visualization Type Picker */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-extrabold flex items-center justify-center">2</span>
            <span>Select Visualization Type</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Lat/Lng Map */}
            <div
              onClick={() => setChartType('latlng')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                chartType === 'latlng'
                  ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <MapPin className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Latitude / Longitude</h3>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Latitude + Longitude coordinates plotted on interactive India Leaflet map with telemetry popups.
              </p>
            </div>

            {/* 2. State-wise Heatmap */}
            <div
              onClick={() => setChartType('statewise')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                chartType === 'statewise'
                  ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Layers className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">State-wise Heatmap</h3>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                State-level dataset represented using India state boundary choropleth heatmap.
              </p>
            </div>

            {/* 3. Time-Series */}
            <div
              onClick={() => setChartType('timeseries_line')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                chartType.startsWith('timeseries')
                  ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Time-Series Data</h3>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Temporal trends plotted on Recharts Line, Bar, or Area charts.
              </p>
            </div>
          </div>

          {/* Sub-picker for Time Series chart variant */}
          {chartType.startsWith('timeseries') && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Chart Representation Variant</label>
              <div className="flex space-x-3">
                {[
                  { label: 'Line Chart', val: 'timeseries_line' },
                  { label: 'Bar Chart', val: 'timeseries_bar' },
                  { label: 'Area Chart', val: 'timeseries_area' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.val}
                    onClick={() => setChartType(item.val)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      chartType === item.val
                        ? 'bg-teal-600 text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 3: CSV Data Upload & Validation */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-extrabold flex items-center justify-center">3</span>
            <span>CSV Upload & Schema Validation</span>
          </h2>

          <CSVUploader
            file={file}
            setFile={setFile}
            rawCsvText={rawCsvText}
            setRawCsvText={setRawCsvText}
            chartType={chartType}
            validationErrors={validationErrors}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-xs text-amber-600 dark:text-amber-400">
            <Info className="w-4 h-4" />
            <span>Dataset will default to <strong>Pending</strong> status until Super Admin approval.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-teal-600/20 flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{loading ? 'Validating & Uploading...' : 'Submit Dataset for Approval'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadDataset;
