import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCases, fetchCaseDetails, openCase } from '../../api/client';
import { addInventoryItem } from './inventorySlice';

// PUBLIC_INTERFACE
export const loadCases = createAsyncThunk('cases/loadCases', async () => {
  /** Fetch all cases */
  return await fetchCases();
});

// PUBLIC_INTERFACE
export const loadCaseDetails = createAsyncThunk('cases/loadCaseDetails', async (id) => {
  /** Fetch a single case detail */
  return await fetchCaseDetails(id);
});

// PUBLIC_INTERFACE
export const openCaseThunk = createAsyncThunk('cases/openCase', async (id, { dispatch }) => {
  /** Open a case and dispatch inventory update with the result. */
  const result = await openCase(id);
  if (result?.item) {
    dispatch(addInventoryItem(result.item));
  }
  return result;
});

const casesSlice = createSlice({
  name: 'cases',
  initialState: {
    items: [],
    selected: null,
    status: 'idle',
    error: null,
    opening: false,
    lastResult: null
  },
  reducers: {
    // PUBLIC_INTERFACE
    clearOpenResult(state) {
      /** Clear last open result. */
      state.lastResult = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCases.pending, (state) => { state.status = 'loading'; })
      .addCase(loadCases.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
      })
      .addCase(loadCases.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loadCaseDetails.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(openCaseThunk.pending, (state) => { state.opening = true; state.lastResult = null; })
      .addCase(openCaseThunk.fulfilled, (state, action) => {
        state.opening = false;
        state.lastResult = action.payload || null;
      })
      .addCase(openCaseThunk.rejected, (state, action) => {
        state.opening = false;
        state.error = action.error.message;
      });
  }
});

export const { clearOpenResult } = casesSlice.actions;

export const selectCases = (state) => state.cases.items;
export const selectCaseById = (id) => (state) => state.cases.items.find(c => String(c.id) === String(id)) || null;
export const selectSelectedCase = (state) => state.cases.selected;
export const selectOpening = (state) => state.cases.opening;
export const selectLastResult = (state) => state.cases.lastResult;

export default casesSlice.reducer;
