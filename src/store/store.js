import {configureStore, combineReducers} from '@reduxjs/toolkit';
import userReducer from './slice'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userSlice from './slice';

const persistConfig = {
  key: 'root',
  storage: storage,
}

const rootreducer = combineReducers({
  reducer : userSlice.reducer
})

const persistedReducer = persistReducer(persistConfig, rootreducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
export default store;