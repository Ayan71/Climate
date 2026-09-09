import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';

const EditDataset = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Climate');
  const [chartType, setChartType] = useState('timeseries_line');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDs = async () => {
      try {
        const res = await API.get(`/datasets/${id}`);
        const d = res.data.dataset;
        setTitle(d.title);
        setDescription(d.description || '');
        setDomain(d.domain);
        setChartType(d.chartType);
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
      await API.put(`/datasets/${id}`, { title, description, domain, chartType });
      toast.success('Dataset updated and reset to pending review!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dataset...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button onClick={() => navigate('/admin/dashboard')} className="p-2 rounded-xl text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Edit Pending Dataset</h1>
          <p className="text-xs text-slate-500">Update metadata or visualization type</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Chart Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold"
            >
              <option value="Climate">Climate</option>
              <option value="Energy">Energy</option>
              <option value="Power">Power</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold"
            >
              <option value="latlng">Latitude / Longitude Map</option>
              <option value="statewise">State-wise Heatmap</option>
              <option value="timeseries_line">Time-Series Line Chart</option>
              <option value="timeseries_bar">Time-Series Bar Chart</option>
              <option value="timeseries_area">Time-Series Area Chart</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs shadow-lg flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save & Resubmit for Approval</span>
        </button>
      </form>
    </div>
  );
};

export default EditDataset;
