import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchInventory } from '../../api/client';

// PUBLIC_INTERFACE
export const loadInventory = createAsyncThunk('inventory/load', async () => {
  /** Fetch inventory from backend. */
  return await fetchInventory();
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    modalOpen: false
  },
  reducers: {
    // PUBLIC_INTERFACE
    addInventoryItem(state, action) {
      /** Add a new item to inventory after a win. */
      if (action.payload) {
        state.items.unshift(action.payload);
      }
    },
    // PUBLIC_INTERFACE
    setInventoryModalOpen(state, action) {
      /** Control the inventory modal visibility. */
      state.modalOpen = !!action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadInventory.pending, (state) => { state.status = 'loading'; })
      .addCase(loadInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
      })
      .addCase(loadInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { addInventoryItem, setInventoryModalOpen } = inventorySlice.actions;

export const selectInventory = (state) => state.inventory.items;
export const selectInventoryModalOpen = (state) => state.inventory.modalOpen;

export default inventorySlice.reducer;
