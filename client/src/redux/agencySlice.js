import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/agencies';

// Get token from state
const getConfig = (getState) => {
  const token = getState().auth.user?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all agencies
export const getAgencies = createAsyncThunk(
  'agencies/getAll',
  async (filters = {}, { getState, rejectWithValue }) => {
    try {
      const config = getConfig(getState);
      const params = new URLSearchParams();
      
      if (filters.type) params.append('type', filters.type);
      if (filters.state) params.append('state', filters.state);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);

      const response = await axios.get(`${API_URL}?${params.toString()}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch agencies'
      );
    }
  }
);

// Get single agency
export const getAgencyById = createAsyncThunk(
  'agencies/getById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getConfig(getState);
      const response = await axios.get(`${API_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch agency'
      );
    }
  }
);

// Create agency
export const createAgency = createAsyncThunk(
  'agencies/create',
  async (agencyData, { getState, rejectWithValue }) => {
    try {
      const config = getConfig(getState);
      const response = await axios.post(API_URL, agencyData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create agency'
      );
    }
  }
);

// Update agency
export const updateAgency = createAsyncThunk(
  'agencies/update',
  async ({ id, agencyData }, { getState, rejectWithValue }) => {
    try {
      const config = getConfig(getState);
      const response = await axios.put(`${API_URL}/${id}`, agencyData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update agency'
      );
    }
  }
);

// Delete agency
export const deleteAgency = createAsyncThunk(
  'agencies/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getConfig(getState);
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete agency'
      );
    }
  }
);

const agencySlice = createSlice({
  name: 'agencies',
  initialState: {
    agencies: [],
    selectedAgency: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearSelectedAgency: (state) => {
      state.selectedAgency = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all agencies
      .addCase(getAgencies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAgencies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.agencies = action.payload;
      })
      .addCase(getAgencies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get agency by ID
      .addCase(getAgencyById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAgencyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedAgency = action.payload;
      })
      .addCase(getAgencyById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create agency
      .addCase(createAgency.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAgency.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.agencies.push(action.payload);
        state.message = 'Agency created successfully';
      })
      .addCase(createAgency.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update agency
      .addCase(updateAgency.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAgency.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.agencies = state.agencies.map((agency) =>
          agency._id === action.payload._id ? action.payload : agency
        );
        state.selectedAgency = action.payload;
        state.message = 'Agency updated successfully';
      })
      .addCase(updateAgency.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete agency
      .addCase(deleteAgency.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAgency.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.agencies = state.agencies.filter(
          (agency) => agency._id !== action.payload
        );
        state.message = 'Agency deleted successfully';
      })
      .addCase(deleteAgency.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearSelectedAgency } = agencySlice.actions;
export default agencySlice.reducer;
