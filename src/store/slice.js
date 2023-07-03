import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState:{
    userdata:null,
    isAuthenticated: false,
  },
  reducers:{
    setUser(state, action){
      state.userdata = action.payload
    },
    AuthSuccess(state){
      state.isAuthenticated = true
    },
    AuthFail(state){
      state.isAuthenticated = false
    },
  }
});

export const {setUser, AuthSuccess,AuthFail} = userSlice.actions;
export default userSlice;