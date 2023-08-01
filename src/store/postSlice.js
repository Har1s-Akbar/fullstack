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
    setReload(state){
      if(state.reload){
        state.reload = false
      }else{
        state.reload =true
      }
    }
  },
})

export const {setPosts, setDocId, setReload} = postSlice.actions;
export default postSlice;