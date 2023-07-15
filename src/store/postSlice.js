import {createSlice} from '@reduxjs/toolkit';

const postSlice = createSlice({
  name:'posts',
  initialState:{
    userPosts: null,
    Ids : null
  }, 
  reducers:{
    setPosts(state, action){
      state.userPosts = action.payload
    },
    setDocId(state, action){
      state.Ids = action.payload
    }
  }
})

export const {setPosts, setDocId} = postSlice.actions;
export default postSlice;