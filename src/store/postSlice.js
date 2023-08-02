import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const postSlice = createSlice({
  name:'posts',
  initialState:{
    userPosts: [],
    Ids : null,
    reload: false
  }, 
  reducers:{
    setPosts(state, action){
      state.userPosts = action.payload
    },
    setDocId(state, action){
      state.Ids = action.payload
    },
    setReload(state, action){
     state.reload = action.payload
    }
  },
})

export const {setPosts, setDocId, setReload} = postSlice.actions;
export default postSlice;