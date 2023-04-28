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
        // When this is true the user is editing a course
        editMode: false,
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
        loading: false,
        checkingOut: false,
        showCart: false,
        viewAsAdmin: false,
    },
    reducers: {
        // ================================================================================
        // #region View Course 

        // Determines if the sidenav will show along with other corresponding css classes
        setSideNavOpen(state, action) {
            state.sideNavOpen = action.payload;
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
        setShowAuthMenu(state, action) {            
            state.showAuthMenu = action.payload
        },
        setTheme(state, action) {
            state.theme = action.payload;
        },
         setPage(state, action) {
            state.page = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setCheckingOut(state, action) {
            state.checkingOut = action.payload;
        },
        setShowCart(state, action) {
            state.showCart = action.payload;
        },
        setViewAsAdmin(state, action) {
            state.viewAsAdmin = action.payload
        },
       
        // #endregion General App Controls

        // ================================================================================
        // #region Cart
        loadCartCourses: (state, action) => {
            const previouslySelectedCourseIDsString = window.localStorage.getItem("selectedCourseIDs")        
            if(previouslySelectedCourseIDsString){
                let previouslySelectedCourseIDs = previouslySelectedCourseIDsString.split(",")            

                // Update the state
                state.selectedCourseIDs = previouslySelectedCourseIDs

            }
        },
        selectCartCourse: (state, action) => {
            // Even if it has a duplicate id it will be ok becasue the filter adds it from all courses based on if the id is in this array
            
            // If it is not a duplicate add it to the array
            if(!state.selectedCourseIDs.includes(action.payload)){
                // Create the new array of selected cart courses
                let newSelectedCourseIDs = [...state.selectedCourseIDs];   
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
        clearCartCourses: (state, action) => {
            state.selectedCourseIDs = []
            window.localStorage.setItem("selectedCourseIDs", [])

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
export const {setSideNavOpen} = appSlice.actions;
// Edit Course
export const {setEditMode, toggleMinimizeAll, togglePreviewMode} = appSlice.actions;
// Geranl App State
export const {setViewAsAdmin, setCheckingOut, setLoading, setShowAuthMenu, toggleShowAuthMenu, setTheme, setPage} = appSlice.actions;
// Cart
export const {loadCartCourses, setShowCart, clearCartCourses, selectCartCourse, removeCartCourse, setDraggingCourse} = appSlice.actions;
// #endregion Exports