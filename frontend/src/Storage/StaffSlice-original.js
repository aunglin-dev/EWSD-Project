import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStaff: null,
  loading: false,
  error: false,
};

export const StaffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentStaff = action.payload;

      console.log(JSON.parse(JSON.stringify(state.currentStaff)));
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    Stafflogout: (state) => {
      state.currentStaff = null;
      state.loading = false;
      state.error = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, Stafflogout } =
  StaffSlice.actions;

export default StaffSlice.reducer;
