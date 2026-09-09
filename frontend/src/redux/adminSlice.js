import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchAdmins = createAsyncThunk(
  'admins/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/admin/users');
      return response.data.admins;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch admin users');
    }
  }
);

export const createAdminUser = createAsyncThunk(
  'admins/create',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await API.post('/admin/users', adminData);
      return response.data.admin;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create admin user');
    }
  }
);

export const toggleAdminStatus = createAsyncThunk(
  'admins/toggleStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/admin/users/${id}/status`);
      return { id, isActive: response.data.isActive };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update admin status');
    }
  }
);

export const deleteAdminUser = createAsyncThunk(
  'admins/delete',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/admin/users/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete admin account');
    }
  }
);

const adminSlice = createSlice({
  name: 'admins',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(toggleAdminStatus.fulfilled, (state, action) => {
        const item = state.list.find(a => (a._id || a.id) === action.payload.id);
        if (item) item.isActive = action.payload.isActive;
      })
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.list = state.list.filter(a => (a._id || a.id) !== action.payload);
      });
  },
});

export default adminSlice.reducer;
