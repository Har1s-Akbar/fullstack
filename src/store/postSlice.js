import {createSlice} from '@reduxjs/toolkit';

const postSlice = createSlice({
  name:'posts',
  initialState:{
    userPosts: null
  }, 
  reducers:{
    setPosts(state, action){
      state.userPosts = action.payload
    }
  }
})

export const {setPosts} = postSlice.actions;
export default postSlice;