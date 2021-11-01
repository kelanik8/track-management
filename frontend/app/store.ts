import {
  Action,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import trackReducer from './features/tracks/tracksSlice';

export const store = configureStore({
  reducer: {
    tracks: trackReducer
  },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
   ReturnType,
   RootState,
   unknown,
   Action<string>
 >;