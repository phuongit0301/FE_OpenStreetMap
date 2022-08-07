import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

const initialState = {
  value: 0,
  loading: false,
  updateLoading: false,
  cameraAssets: [],
  cameraAssetsOriginal: [],
  cameraSelected: [],
  cameraAlert: [],
};

export const fetchDataAsync = createAsyncThunk(
  'app/fetchData',
  async (payload) => {
    let url = `http://localhost:8080/api/locations`;
    if (payload?.name) {
      url += `?name=${payload?.name}`;
    }
    const response = await axios.get(url);
    return response.data;
  }
);

export const updateLocationAsync = createAsyncThunk(
  'app/updateData',
  async (payload, thunkAPI) => {
    if (payload) {
      const response = await axios.put(`http://localhost:8080/api/locations/${payload?.id}`, {
        status: payload.status
      });
      if(response.status === 200) {
        thunkAPI.dispatch(fetchDataAsync());
        // payload?.callback && payload?.callback();
        return response.data;
      }
    }
  }
);

export const appSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    search: (state, action) => {
      if (state.cameraAssetsOriginal?.length > 0) {
        const dataFilter = state.cameraAssetsOriginal.filter(x => x?.department?.toLowerCase().includes(action?.payload?.toLowerCase()) || x?.name?.toLowerCase().includes(action?.payload?.toLowerCase()))
        state.cameraAssets = action?.payload.trim() === '' ? state.cameraAssetsOriginal : dataFilter;
      }
    },
  },
  extraReducers: {
      [fetchDataAsync.pending]: (state) => {
        state.loading = true;
      },
      [fetchDataAsync.fulfilled]: (state, action) => {
        state.loading = false;
        if (action.payload?.length > 0) {
          state.cameraSelected = action?.payload?.filter(x => x.status === 2);
          state.cameraAlert = action?.payload?.filter(x => x.status === 1);
        }
        state.cameraAssets = action.payload;
        state.cameraAssetsOriginal = action.payload;
      },
      [updateLocationAsync.pending]: (state) => {
        state.updateLoading = true;
      },
      [updateLocationAsync.fulfilled]: (state, action) => {
        state.updateLoading = false;
        
      },
  },
});

export const { search } = appSlice.actions;

export const selectCamera = (state) => state.camera.value;

export default appSlice.reducer;