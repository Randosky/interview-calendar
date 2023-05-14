import { configureStore } from '@reduxjs/toolkit';
import calendarSlice from "./calendarSlice";

export default configureStore({
    reducer: {
        calendar: calendarSlice,
    }
});