import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const initialState = {
  projects: [],
  project: null,
  stats: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get token from state
const getConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all projects
export const getProjects = createAsyncThunk(
  'projects/getAll',
  async (filters = {}, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const queryString = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `${API_URL}/projects${queryString ? `?${queryString}` : ''}`,
        config
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get project by ID
export const getProjectById = createAsyncThunk(
  'projects/getById',
  async (id, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.get(`${API_URL}/projects/${id}`, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create project
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.post(`${API_URL}/projects`, projectData, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, projectData }, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.put(`${API_URL}/projects/${id}`, projectData, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      await axios.delete(`${API_URL}/projects/${id}`, config);
      return id;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update milestone
export const updateMilestone = createAsyncThunk(
  'projects/updateMilestone',
  async ({ projectId, milestoneId, milestoneData }, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.put(
        `${API_URL}/projects/${projectId}/milestone/${milestoneId}`,
        milestoneData,
        config
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get project stats
export const getProjectStats = createAsyncThunk(
  'projects/getStats',
  async (_, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.get(`${API_URL}/projects/stats/summary`, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Upload file
export const uploadFile = createAsyncThunk(
  'projects/uploadFile',
  async ({ projectId, file }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const formData = new FormData();
      formData.append('file', file);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.post(
        `${API_URL}/projects/${projectId}/upload`,
        formData,
        config
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearProject: (state) => {
      state.project = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get projects
      .addCase(getProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get project by ID
      .addCase(getProjectById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.project = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.project = action.payload;
        const index = state.projects.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update milestone
      .addCase(updateMilestone.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.project = action.payload;
      })
      // Get stats
      .addCase(getProjectStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjectStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stats = action.payload;
      })
      .addCase(getProjectStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearProject } = projectSlice.actions;
export default projectSlice.reducer;
