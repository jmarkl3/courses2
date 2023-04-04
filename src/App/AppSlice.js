import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "appslice",
    initialState: {
        // Determines if the sidenav will show along with other corresponding css classes
        sideNavOpen: false,
        // Preview mode is when the user is editing and can view a course as a student would
        previewMode: false,
        // Admin mode is when the user is viewing a course without timers
        adminMode: false,
        // When this is true the user is editing a course
        courseEditMode: true,
        // When this is true the user is editing a course but viewing it as a student would
        courseEditPreviewMode: false,
    },
    reducers: {
        // Determines if the sidenav will show along with other corresponding css classes
        setSideNavOpen(state, action) {
            state.sideNavOpen = action.payload;
        },
        // Determines if the sidenav will show along with other corresponding css classes
        setPreviewMode(state, action) {
            state.previewMode = action.payload;
        },
        // Determines if the sidenav will show along with other corresponding css classes
        setAdminMode(state, action) {
            state.adminMode = action.payload;
        },
        setCourseEditMode(state, action) {
            state.courseEditMode = action.payload;
        },
        setCourseEditPreviewMode(state, action) {
            state.courseEditPreviewMode = action.payload;
        }

    }
})
export const appSliceReducer = appSlice.reducer;
export const {setSideNavOpen, setPreviewMode, setAdminMode, setCourseEditMode, setCourseEditPreviewMode} = appSlice.actions;