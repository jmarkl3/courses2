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
        editMode: true,
        // When this changes the element edit component will minimize or expand based on the value
        minimizeAll: false,
        showAuthMenu: false,
    },
    reducers: {
        // Determines if the sidenav will show along with other corresponding css classes
        setSideNavOpen(state, action) {
            state.sideNavOpen = action.payload;
        },
        // Puts the course in edit mode
        setEditMode(state, action) {
            state.editMode = action.payload;
        },
        // Determines if the sidenav will show along with other corresponding css classes
        setPreviewMode(state, action) {
            state.previewMode = action.payload;
        },
        // Determines if the sidenav will show along with other corresponding css classes
        setAdminMode(state, action) {
            state.adminMode = action.payload;
        },
        toggleMinimizeAll(state, action) {
            state.minimizeAll = !state.minimizeAll;
        },
        togglePreviewMode(state, action) {
            state.previewMode = !state.previewMode;
        },
        toggleShowAuthMenu(state, action) {
            state.showAuthMenu = !state.showAuthMenu;
        }


    }
})
export const appSliceReducer = appSlice.reducer;
export const {setSideNavOpen, setPreviewMode, setAdminMode, setEditMode, toggleMinimizeAll, togglePreviewMode, toggleShowAuthMenu} = appSlice.actions;