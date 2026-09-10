import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { Layers, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('Climate');
  const [description, setDescription] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDomain, setEditDomain] = useState('Climate');
  const [editDesc, setEditDesc] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Category name is required');
    try {
      await API.post('/categories', { name, domain, description });
      toast.success('Category created successfully');
      setName('');
      setDescription('');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create category');
    }
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat._id || cat.id);
    setEditName(cat.name);
    setEditDomain(cat.domain || 'Climate');
    setEditDesc(cat.description || '');
  };

  const handleSaveEdit = async (id) => {
    try {
      await API.put(`/categories/${id}`, {
        name: editName,
        domain: editDomain,
        description: editDesc,
      });
      toast.success('Category updated');
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Category Management</h1>
          <p className="text-xs text-slate-500">Create, manage, and classify dataset categories across Climate, Energy, and Power</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Category Form */}
        <form onSubmit={handleCreate} className="bg-white p-5 rounded border border-slate-200 space-y-4 h-fit">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <Plus className="w-4 h-4 text-slate-700" />
            <span>Add New Category</span>
          </h2>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Category Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Carbon Emissions"
              className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Domain Classification</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full p-2 text-xs rounded border border-slate-300 bg-white font-medium"
            >
              <option value="Climate">Climate</option>
              <option value="Energy">Energy</option>
              <option value="Power">Power</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what datasets fall into this category..."
              className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded shadow transition-colors flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Category</span>
          </button>
        </form>

        {/* Categories List Table */}
        <div className="lg:col-span-2 bg-white rounded border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-slate-700" />
              <span>Configured Categories ({categories.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No categories found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Category Name</th>
                    <th className="p-3">Domain</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {categories.map((cat) => {
                    const cId = cat._id || cat.id;
                    const isEditing = editingId === cId;
                    return (
                      <tr key={cId} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="p-1 border border-slate-300 rounded text-xs w-full"
                            />
                          ) : (
                            cat.name
                          )}
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <select
                              value={editDomain}
                              onChange={(e) => setEditDomain(e.target.value)}
                              className="p-1 border border-slate-300 rounded text-xs"
                            >
                              <option value="Climate">Climate</option>
                              <option value="Energy">Energy</option>
                              <option value="Power">Power</option>
                              <option value="General">General</option>
                            </select>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {cat.domain || 'General'}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              className="p-1 border border-slate-300 rounded text-xs w-full"
                            />
                          ) : (
                            cat.description || '-'
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={() => handleSaveEdit(cId)}
                                className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
                                title="Save"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1 bg-slate-300 text-slate-700 rounded hover:bg-slate-400"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleStartEdit(cat)}
                                className="text-slate-600 hover:text-slate-900 p-1"
                                title="Edit Category"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(cId)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete Category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
