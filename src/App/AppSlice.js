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
        sampleCourses: [
            {
                id: "1",
                name: "Course 1",
                description: "This is a course about parenting",
                price: 28.25,
                image: "https://imgs.search.brave.com/dn99u3fgXHBh-xtK2LmKtz-vKKFaXW4WCe9BGBYP5fQ/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGFyZW50aW5n/Lm1kcGNkbi5jb20v/c2l0ZXMvcGFyZW50/aW5nLmNvbS9maWxl/cy9zdHlsZXMvZmFj/ZWJvb2tfb2dfaW1h/Z2UvcHVibGljLzEx/MDBfc3RvcnlfUGFy/ZW50c19vZl9zdWNj/ZXNzZnVsX2tpZHMu/anBnP2l0b2s9OTJK/THJZNlg",
            },
            {
                id: "2",
                name: "Course 2",
                description: "This is another course about parenting",
                price: 38.50,
                image: "https://static-ssl.businessinsider.com/image/55c9f359dd089592618b457e-5184-3456/shutterstock_267541034.jpg",
            },
            {
                id: "3",
                name: "Course 1",
                description: "This is a course about parenting",
                price: 10.00,
                image: "https://imgs.search.brave.com/dn99u3fgXHBh-xtK2LmKtz-vKKFaXW4WCe9BGBYP5fQ/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGFyZW50aW5n/Lm1kcGNkbi5jb20v/c2l0ZXMvcGFyZW50/aW5nLmNvbS9maWxl/cy9zdHlsZXMvZmFj/ZWJvb2tfb2dfaW1h/Z2UvcHVibGljLzEx/MDBfc3RvcnlfUGFy/ZW50c19vZl9zdWNj/ZXNzZnVsX2tpZHMu/anBnP2l0b2s9OTJK/THJZNlg",
            },
            {
                id: "4",
                name: "Course 2",
                description: "This is another course about parenting",
                price: 10.00,
                image: "https://static-ssl.businessinsider.com/image/55c9f359dd089592618b457e-5184-3456/shutterstock_267541034.jpg",
            },
            {
                id: "5",
                name: "Course 1",
                description: "This is a course about parenting",
                price: 10.00,
                image: "https://imgs.search.brave.com/dn99u3fgXHBh-xtK2LmKtz-vKKFaXW4WCe9BGBYP5fQ/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGFyZW50aW5n/Lm1kcGNkbi5jb20v/c2l0ZXMvcGFyZW50/aW5nLmNvbS9maWxl/cy9zdHlsZXMvZmFj/ZWJvb2tfb2dfaW1h/Z2UvcHVibGljLzEx/MDBfc3RvcnlfUGFy/ZW50c19vZl9zdWNj/ZXNzZnVsX2tpZHMu/anBnP2l0b2s9OTJK/THJZNlg",
            },
            {
                id: "6",
                name: "Course 2",
                description: "This is another course about parenting",
                price: 10.00,
                image: "https://static-ssl.businessinsider.com/image/55c9f359dd089592618b457e-5184-3456/shutterstock_267541034.jpg",
            },
        ],
        page: "landing",
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
        setPage(state, action) {
            state.page = action.payload;
        },
       
        // #endregion General App Controls

        // ================================================================================
        // #region Cart

        selectCartCourse: (state, action) => {
            // Even if it has a duplicate id it will be ok becasue the filter adds it from all courses based on if the id is in this array
            if(!state.selectedCourseIDs.includes(action.payload)){
                // Create the new array of selected cart courses
                let newSelectedCourseIDs = [...state.selectedCourseIDs];   
                if(Array.isArray(action.payload)){
                    // Filter out undefined values
                    var tempArray = []
                    action.payload.forEach(courseID => {
                        if(courseID !== "undfined")
                            tempArray.push(courseID)
                    })
                    newSelectedCourseIDs.push(...tempArray)
                }             
                else
                    newSelectedCourseIDs.push(action.payload)

                // Save in local storage
                window.localStorage.setItem("selectedCourseIDs", newSelectedCourseIDs)                
                
                // Update the state
                state.selectedCourseIDs = newSelectedCourseIDs
            }
        },
        removeCartCourse: (state, action) => {
            // Create the new array of selected cart courses
            let newSelectedCourseIDs = state.selectedCourseIDs.filter( courseID => (courseID != action.payload && courseID != "undefined"));                
            // Save in local storage
            window.localStorage.setItem("selectedCourseIDs", newSelectedCourseIDs)
            // Update the state
            state.selectedCourseIDs = newSelectedCourseIDs
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
export const {toggleShowAuthMenu, setTheme, toggleLanguage, toggleTheme, setPage} = appSlice.actions;
// Cart
export const {selectCartCourse, removeCartCourse, setDraggingCourse} = appSlice.actions;
// #endregion Exports