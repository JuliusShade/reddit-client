import { combineReducers, configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import postFilterReducer from './slices/filterSlice';

const rootReducer = combineReducers({
  filter: filterReducer,
  postFilter: postFilterReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
