import React from 'react'
import App from './App.jsx';
import './index.css';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import store from './store/store.js'

const persistor = persistStore(store)


export const createApp = () => {
    return    <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
}