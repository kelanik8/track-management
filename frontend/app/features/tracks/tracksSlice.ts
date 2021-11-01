import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import TracksDataService from '../../services/Tracks';

interface Track {
  id: number;
  talk: string;
  duration: number;
  time: string;
}

export type TracksState = {
  tracks: Array<Track[]>;
  pending: boolean;
  error: string | undefined;
};

const initialState: TracksState = {
  tracks: [],
  pending: false,
  error: ''
};

export const submitTrackData = createAsyncThunk(
  "tracks/submit",
  async (csvFile: any, { rejectWithValue }) => {
    try {
      const res = await TracksDataService.postData(csvFile.file);
      return res.data.payload;
    } catch (error: any) {
     return rejectWithValue(error.response.data);
    }
  }
);

export const tracksSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(submitTrackData.pending, state => {
        state.pending = true
      })
      .addCase(submitTrackData.fulfilled, (state, action) => {
        state.pending = false
        state.tracks = action.payload
      })
      .addCase(submitTrackData.rejected, (state, action: any) => {
        state.pending = false
        state.error = action.payload.message
      })
  }
});

export default tracksSlice.reducer;
