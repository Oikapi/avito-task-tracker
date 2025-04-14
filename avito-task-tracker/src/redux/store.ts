import { configureStore } from '@reduxjs/toolkit';
import taskModalReducer from './slices/taskModalSlice.ts';
import tasksReducer from './slices/tasksSlice.ts';
import boardsReducer from './slices/boardsSlice.ts';

export const store = configureStore({
  reducer: {
    taskModal: taskModalReducer,
    tasks: tasksReducer,
    boards: boardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
