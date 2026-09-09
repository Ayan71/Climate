import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchPublicDatasets = createAsyncThunk(
  'datasets/fetchPublic',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await API.get('/public', { params });
      return response.data.datasets;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch public datasets');
    }
  }
);

export const fetchDomainDatasets = createAsyncThunk(
  'datasets/fetchDomain',
  async (domain, { rejectWithValue }) => {
    try {
      const response = await API.get(`/public/${domain.toLowerCase()}`);
      return { domain, datasets: response.data.datasets };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || `Failed to fetch ${domain} datasets`);
    }
  }
);

export const fetchAdminDatasets = createAsyncThunk(
  'datasets/fetchAdmin',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await API.get('/datasets', { params });
      return response.data.datasets;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch admin datasets');
    }
  }
);

export const createDataset = createAsyncThunk(
  'datasets/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post('/datasets', formData, {
        headers: {
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });
      return response.data.dataset;
    } catch (err) {
      return rejectWithValue({
        error: err.response?.data?.error || 'Failed to upload dataset',
        validationErrors: err.response?.data?.validationErrors || [],
      });
    }
  }
);

export const approveDataset = createAsyncThunk(
  'datasets/approve',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/datasets/${id}/approve`);
      return response.data.dataset;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to approve dataset');
    }
  }
);

export const rejectDataset = createAsyncThunk(
  'datasets/reject',
  async ({ id, rejectionReason }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/datasets/${id}/reject`, { rejectionReason });
      return response.data.dataset;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to reject dataset');
    }
  }
);

export const deleteDataset = createAsyncThunk(
  'datasets/delete',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/datasets/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete dataset');
    }
  }
);

const datasetSlice = createSlice({
  name: 'datasets',
  initialState: {
    publicList: [],
    domainLists: {
      Climate: [],
      Energy: [],
      Power: [],
    },
    adminList: [],
    currentDataset: null,
    loading: false,
    error: null,
    validationErrors: [],
  },
  reducers: {
    clearDatasetErrors: (state) => {
      state.error = null;
      state.validationErrors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Public
      .addCase(fetchPublicDatasets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPublicDatasets.fulfilled, (state, action) => {
        state.loading = false;
        state.publicList = action.payload;
      })
      .addCase(fetchPublicDatasets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Domain
      .addCase(fetchDomainDatasets.fulfilled, (state, action) => {
        state.domainLists[action.payload.domain] = action.payload.datasets;
      })
      // Fetch Admin Datasets
      .addCase(fetchAdminDatasets.fulfilled, (state, action) => {
        state.adminList = action.payload;
      })
      // Create Dataset
      .addCase(createDataset.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = [];
      })
      .addCase(createDataset.fulfilled, (state, action) => {
        state.loading = false;
        state.adminList.unshift(action.payload);
      })
      .addCase(createDataset.rejected, (state, action) => {
        state.loading = false;
        if (typeof action.payload === 'object') {
          state.error = action.payload.error;
          state.validationErrors = action.payload.validationErrors || [];
        } else {
          state.error = action.payload;
        }
      })
      // Approve / Reject
      .addCase(approveDataset.fulfilled, (state, action) => {
        const idx = state.adminList.findIndex(d => d._id === action.payload._id || d.id === action.payload.id);
        if (idx !== -1) state.adminList[idx] = action.payload;
      })
      .addCase(rejectDataset.fulfilled, (state, action) => {
        const idx = state.adminList.findIndex(d => d._id === action.payload._id || d.id === action.payload.id);
        if (idx !== -1) state.adminList[idx] = action.payload;
      })
      // Delete
      .addCase(deleteDataset.fulfilled, (state, action) => {
        state.adminList = state.adminList.filter(d => (d._id || d.id) !== action.payload);
      });
  },
});

export const { clearDatasetErrors } = datasetSlice.actions;
export default datasetSlice.reducer;
