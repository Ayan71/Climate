import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';

const INDIAN_STATES = [
  'All India', 'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const EditDataset = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Climate');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');
  const [source, setSource] = useState('');
  const [year, setYear] = useState('');
  const [state, setState] = useState('All India');
  const [district, setDistrict] = useState('');
  const [chartType, setChartType] = useState('timeseries_line');
  const [downloadEnabled, setDownloadEnabled] = useState(true);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDs = async () => {
      try {
        const res = await API.get(`/datasets/${id}`);
        const d = res.data.dataset;
        setTitle(d.title || '');
        setDescription(d.description || '');
        setDomain(d.domain || 'Climate');
        setCategory(d.category || 'General');
        setTags(Array.isArray(d.tags) ? d.tags.join(', ') : d.tags || '');
        setSource(d.source || '');
        setYear(d.year || '');
        setState(d.state || 'All India');
        setDistrict(d.district || '');
        setChartType(d.chartType || 'timeseries_line');
        setDownloadEnabled(d.downloadEnabled !== undefined ? d.downloadEnabled : true);
      } catch (err) {
        toast.error('Failed to load dataset details');
      } finally {
        setLoading(false);
      }
    };
    fetchDs();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/datasets/${id}`, {
        title,
        description,
        domain,
        category,
        tags,
        source,
        year,
        state,
        district,
        chartType,
        downloadEnabled,
      });
      toast.success('Dataset updated and reset to pending review!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    }
  };

  if (loading) return <div className="p-8 text-center text-sm font-sans">Loading dataset...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 font-sans">
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
        <button onClick={() => navigate('/admin/dashboard')} className="p-2 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Edit Dataset</h1>
          <p className="text-xs text-slate-500">Update dataset details, classification, and visualization type</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Dataset Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full p-2 text-xs rounded border border-slate-300 bg-white font-medium"
            >
              <option value="Climate">Climate</option>
              <option value="Energy">Energy</option>
              <option value="Power">Power</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Year / Period</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
            >
              {INDIAN_STATES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full p-2 text-xs rounded border border-slate-300 bg-white font-medium"
            >
              <option value="latlng">Coordinates Map</option>
              <option value="statewise">State Heatmap</option>
              <option value="timeseries_line">Line Chart</option>
              <option value="multiline">Multi-Line Chart</option>
              <option value="timeseries_bar">Bar Chart</option>
              <option value="timeseries_area">Area Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="doughnut">Doughnut Chart</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Source</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Tags (Comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <input
            type="checkbox"
            id="downloadEnabledEdit"
            checked={downloadEnabled}
            onChange={(e) => setDownloadEnabled(e.target.checked)}
            className="rounded border-slate-300 text-slate-900 focus:ring-slate-800"
          />
          <label htmlFor="downloadEnabledEdit" className="text-xs font-semibold text-slate-700 cursor-pointer">
            Enable public CSV dataset download for users
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded text-xs shadow flex items-center justify-center space-x-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save & Resubmit for Approval</span>
        </button>
      </form>
    </div>
  );
};

export default EditDataset;
