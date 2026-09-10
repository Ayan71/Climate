import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createDataset, clearDatasetErrors } from '../../redux/datasetSlice';
import CSVUploader from '../../components/visualizations/CSVUploader';
import { toast } from 'react-toastify';
import API from '../../services/api';
import { Upload, ArrowLeft, Layers, MapPin, TrendingUp, PieChart, Sparkles, Info } from 'lucide-react';

const INDIAN_STATES = [
  'All India', 'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const UploadDataset = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, validationErrors } = useSelector((state) => state.datasets);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Climate');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');
  const [source, setSource] = useState('Ministry / Open Data Source');
  const [year, setYear] = useState('2025');
  const [state, setState] = useState('All India');
  const [district, setDistrict] = useState('');
  const [chartType, setChartType] = useState('auto');
  const [downloadEnabled, setDownloadEnabled] = useState(true);

  const [categoriesList, setCategoriesList] = useState([]);
  const [file, setFile] = useState(null);
  const [rawCsvText, setRawCsvText] = useState('');

  useEffect(() => {
    API.get('/categories')
      .then((res) => {
        if (res.data && res.data.categories) {
          setCategoriesList(res.data.categories);
        }
      })
      .catch(() => {});
  }, []);

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
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('source', source);
    formData.append('year', year);
    formData.append('state', state);
    formData.append('district', district);
    formData.append('chartType', chartType);
    formData.append('downloadEnabled', downloadEnabled);

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
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="p-2 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Upload Dataset</h1>
          <p className="text-xs text-slate-500">Submit CSV dataset with metadata for Super Admin review & approval</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Metadata & Classification */}
        <div className="bg-white rounded border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">1</span>
            <span>Dataset Information & Classification</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Dataset Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Solar Power Installed Capacity State-wise"
                className="w-full p-2 text-xs rounded border border-slate-300 bg-white focus:border-slate-800 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Domain <span className="text-red-500">*</span>
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full p-2 text-xs rounded border border-slate-300 bg-white focus:border-slate-800 outline-none font-medium"
              >
                <option value="Climate">Climate (/climate)</option>
                <option value="Energy">Energy (/energy)</option>
                <option value="Power">Power (/power)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 text-xs rounded border border-slate-300 bg-white focus:border-slate-800 outline-none font-medium"
              >
                <option value="General">General</option>
                <option value="Emissions">Emissions</option>
                <option value="Solar Power">Solar Power</option>
                <option value="Thermal Power">Thermal Power</option>
                <option value="Air Quality">Air Quality</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Meteorological Data">Meteorological Data</option>
                <option value="Grid Capacity">Grid Capacity</option>
                {categoriesList.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Year / Period</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2025 or 2020-2025"
                className="w-full p-2 text-xs rounded border border-slate-300 bg-white focus:border-slate-800 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2 text-xs rounded border border-slate-300 bg-white focus:border-slate-800 outline-none"
              >
                {INDIAN_STATES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">District (Optional)</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Jaipur, Pune, Ahmedabad"
                className="w-full p-2 text-xs rounded border border-slate-300 bg-white focus:border-slate-800 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Data Source</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Ministry of Power / IMD"
                className="w-full p-2 text-xs rounded border border-slate-300 bg-white focus:border-slate-800 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. solar, generation, statewise"
                className="w-full p-2 text-xs rounded border border-slate-300 bg-white focus:border-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Dataset Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide background context regarding data parameters or measurement units..."
              className="w-full p-2 text-xs rounded border border-slate-300 bg-white focus:border-slate-800 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="downloadEnabled"
              checked={downloadEnabled}
              onChange={(e) => setDownloadEnabled(e.target.checked)}
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-800"
            />
            <label htmlFor="downloadEnabled" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Enable public CSV dataset download for users
            </label>
          </div>
        </div>

        {/* Step 2: Visualization Type Picker */}
        <div className="bg-white rounded border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">2</span>
            <span>Visualization Selection</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'auto', label: 'Auto Detect', icon: Sparkles, desc: 'Auto-select best visualization' },
              { id: 'latlng', label: 'Coordinates Map', icon: MapPin, desc: 'Lat & Lng map pins' },
              { id: 'statewise', label: 'State Heatmap', icon: Layers, desc: 'India state choropleth' },
              { id: 'timeseries_line', label: 'Line Chart', icon: TrendingUp, desc: 'Single-line time series' },
              { id: 'multiline', label: 'Multi-Line Chart', icon: TrendingUp, desc: 'Multiple numeric columns' },
              { id: 'timeseries_bar', label: 'Bar Chart', icon: TrendingUp, desc: 'Categories vs values' },
              { id: 'timeseries_area', label: 'Area Chart', icon: TrendingUp, desc: 'Area volume trend' },
              { id: 'pie', label: 'Pie / Doughnut', icon: PieChart, desc: 'Percentages & shares' },
            ].map(item => {
              const IconComp = item.icon;
              const isSelected = chartType === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setChartType(item.id)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <IconComp className={`w-4 h-4 ${isSelected ? 'text-slate-900' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold text-slate-900">{item.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: CSV Data Upload */}
        <div className="bg-white rounded border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">3</span>
            <span>CSV Dataset File & Validation</span>
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
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <Info className="w-4 h-4 text-slate-500" />
            <span>Uploaded dataset will be queued in <strong>Pending</strong> state for Super Admin approval.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded text-xs shadow flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{loading ? 'Validating & Uploading...' : 'Upload & Submit Dataset'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadDataset;
