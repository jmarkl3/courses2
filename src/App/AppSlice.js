// ================================================================================
// #region Imports

import { createSlice } from "@reduxjs/toolkit";

// #endregion Imports

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
        theme: "lightTheme",
        language: "English",
        selectedCourseIDs: [],
        draggingCourseID: null,
    },
    reducers: {
        // ================================================================================
        // #region View Course 

        // Determines if the sidenav will show along with other corresponding css classes
        setSideNavOpen(state, action) {
            state.sideNavOpen = action.payload;
        },
        setAdminMode(state, action) {
            state.adminMode = action.payload;
        },

        // #endregion View Course Controls

        // ================================================================================
        // #region Edit Course 

        // Puts the course in edit mode
        setEditMode(state, action) {
            state.editMode = action.payload;
        },
        toggleMinimizeAll(state, action) {
            state.minimizeAll = !state.minimizeAll;
        },
        togglePreviewMode(state, action) {
            state.previewMode = !state.previewMode;
        },

        // #endregion Edit Course Controls

        // ================================================================================
        // #region General App State        
        
        toggleShowAuthMenu(state, action) {
            state.showAuthMenu = !state.showAuthMenu;
        },
        setTheme(state, action) {
            state.theme = action.payload;
        },
        toggleTheme(state, action) {
            if(state.theme === "Dark Theme")
                state.language = "Light Theme";
            else
                state.language = "Dark Theme";            
        },
        toggleLanguage(state, action) {
            if(state.language === "English")
                state.language = "Español";
            else
                state.language = "English";            
        },
       
        // #endregion General App Controls

        // ================================================================================
        // #region Cart

        selectCartCourse: (state, action) => {
            // Even if it has a duplicate id it will be ok becasue the filter adds it from all courses based on if the id is in this array
            if(!state.selectedCourseIDs.includes(action.payload))
                state.selectedCourseIDs.push(action.payload);
        },
        removeCartCourse: (state, action) => {
            state.selectedCourseIDs = state.selectedCourseIDs.filter( courseID => courseID != action.payload);
        },
        setDraggingCourse(state, action) {
            state.draggingCourseID = action.payload;
        }

        // #endregion Cart
    }
})

// ================================================================================
// #region Exports
export const appSliceReducer = appSlice.reducer;
// View Course
export const {setSideNavOpen, setAdminMode} = appSlice.actions;
// Edit Course
export const {setEditMode, toggleMinimizeAll, togglePreviewMode} = appSlice.actions;
// Geranl App State
export const {toggleShowAuthMenu, setTheme, toggleLanguage, toggleTheme} = appSlice.actions;
// Cart
export const {selectCartCourse, removeCartCourse, setDraggingCourse} = appSlice.actions;
// #endregion Exports