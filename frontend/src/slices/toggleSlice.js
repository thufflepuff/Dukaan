// slices/toggleSlice.js

import { createSlice } from '@reduxjs/toolkit';

const toggleSlice = createSlice({
  name: 'toggle',
  initialState: false,
  reducers: {
    setIsToggled: (state, action) => action.payload,
  },
});

export const { setIsToggled } = toggleSlice.actions;

export const selectIsToggled = (state) => state.toggle;

export default toggleSlice.reducer;
