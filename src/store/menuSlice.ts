import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { MenuItem } from '../types';

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  selectedTiming: 'Breakfast' | 'Lunch' | 'Dinner';
  categoryFilter: 'all' | 'veg' | 'nonveg' | 'chef-special';
  searchQuery: string;
}

// Function to get current meal timing based on current local time
const getInitialMealTiming = (): 'Breakfast' | 'Lunch' | 'Dinner' => {
  const hours = new Date().getHours();
  if (hours >= 5 && hours < 12) {
    return 'Breakfast';
  } else if (hours >= 12 && hours < 17) {
    return 'Lunch';
  } else {
    return 'Dinner';
  }
};

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
  selectedTiming: getInitialMealTiming(),
  categoryFilter: 'all',
  searchQuery: '',
};

export const fetchMenu = createAsyncThunk('menu/fetchMenu', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<MenuItem[]>(`${import.meta.env.BASE_URL}api/menu.json`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch menu items');
  }
});

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setSelectedTiming: (state, action: PayloadAction<'Breakfast' | 'Lunch' | 'Dinner'>) => {
      state.selectedTiming = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<'all' | 'veg' | 'nonveg' | 'chef-special'>) => {
      state.categoryFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action: PayloadAction<MenuItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTiming, setCategoryFilter, setSearchQuery } = menuSlice.actions;
export default menuSlice.reducer;
