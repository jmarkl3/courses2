import { createSlice } from "@reduxjs/toolkit";
import {initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { get, getDatabase, push, ref, remove, runTransaction, set, update } from "firebase/database";
import { gePreviousItem, getFirstItem, getItem, getLastItemID, getNextItem, getUserData, insertItem, newIDsObject, nItemsInObject, objectToArray, removeItem, removeUndefined } from "./functions";
import { act } from "react-dom/test-utils";

// #region firebase config

// The config file
const firebaseConfig = {
    apiKey: "AIzaSyBDWCKZwSBi_Qp4U0u3D2tKrcIU290IrDE",
    authDomain: "defaultproject-c023e.firebaseapp.com",
    databaseURL: "https://defaultproject-c023e-default-rtdb.firebaseio.com",
    projectId: "defaultproject-c023e",
    storageBucket: "defaultproject-c023e.appspot.com",
    messagingSenderId: "147977670881",
    appId: "1:147977670881:web:fe1532718095f374bbe7a0",
    measurementId: "G-VY1DMS0BKY"
}
// The firebase app
const app = initializeApp(firebaseConfig)

// Auth Object
export const auth = getAuth(app)
// Database Object
export const database = getDatabase(app)

// #endregion  firebase config

const defaultElement = {
    name: "new element",
    index: 0,    
    type: "Text",
}

const defaultSection = {
    name: "new section",    
    index: 0,    
    items: {
        //elementOneID: defaultElement,
    },
}

const defaultChapter = {
    name: "new chapter",    
    index: 0,    
    items: {
        //sectionOneID: defaultSection,
    },
}

function dragTypeFunction(elementID, sectionID, chapterID){
    if(elementID) return "element"
    if(sectionID) return "section"
    if(chapterID) return "chapter"
}

const dbslice = createSlice({
    name: "dbslice",
    initialState: {
        // The courses data from the database with title, description, etc.
        coursesData: {},
        // The course data from the database with the lessons, etc.
        courseData: null,
        coursesArray: [],
        // The user data from the database
        userData: null,
        // The selected IDs
        selectedCourseID: null,
        selectedChapterID: null,
        selectedSectionID: null,
        selectedElementID: null,
        // The IDs of the chapter, section, and element being dragged
        dragStartIDs: {},
        // Determines if the bar is shown
        sidenavHoverItemID: null,
        // The type of item being dragged determines the type of drop and how the bottom bars are displayed
        dragItemType: null,
        userID: null,
        // This is used to get user resopnse data
        responsePath: null,
        saveStatus: null,
        timerSaveCounter: 0,
        theme: "lightTheme",
        language: "English",
    },
    reducers: {
        // #region loading data

        // The loading data actions put data into the store when it is loaded from the database

        // Set the courses data (metadata for all courses including title, description, etc.)
        setCoursesData (state, action) {        
            state.coursesData = action.payload;
            if(typeof action.payload === "object"){
                var tempArray = []
                Object.entries(action.payload).forEach(([key, value]) => {
                    var dataObject = {...value}
                    dataObject.id = key
                    tempArray.push(dataObject)
                })
                state.coursesArray = tempArray
            }
        },
        // Set the course data for a selected course
        setCourseData (state, action) {        
            state.courseData = action.payload;
        },        
        
        // #endregion  loading data

        // #region user data
        setUserID(state, action){
            state.userID = action.payload;
        },   
        // action.payload = userData
        setUserData(state, action){

            // Save the user data in state
            state.userData = action.payload;
            
            // Set the theme if one is saved
            if(action.payload?.accountData?.theme)
                state.theme = action.payload?.accountData?.theme

            // Set the language if one is saved
            if(action.payload?.accountData?.language)
                state.language = action.payload?.accountData?.language

        },
        // This saves the user's response to a section
        // var locationString = "coursesApp/userData/"+state.userID+"/responses/"+state.selectedCourseID+"/"+action.payload.chapterID+"/"+action.payload.sectionID+"/"+action.payload.property
        saveUserSectionData(state, action){
            console.log("saveUserSectionData depreciated")
            return
            if(!action.payload.sectionID || !action.payload.chapterID || action.payload.value == undefined || !action.payload.property){
                console.log("Error: saveRemainingSectionTime: missing data")
                return
            }
            // This is the location that the remaining time will be saved
            var locationString = "coursesApp/userData/"+state.userID+"/responses/"+state.selectedCourseID+"/"+action.payload.chapterID+"/"+action.payload.sectionID+"/"+action.payload.property
            // Save the remaining time in the db
            set(ref(database, locationString), action.payload.value)
        },


        // New: saveUserCourseData (for enrolled, completed, and certificate path)
        saveUserCourseData(state, action){
            if(!action.payload.kvPairs){
                console.log("saveUserCourseData missing info")
                return
            }
            
            // This is the location that the key value pair will be stored
            var locationString = "coursesApp/userData/"+state.userID+
                "/courses/"+(action.payload.courseID || state.selectedCourseID)

            // Save the key value pair in the db
            update(ref(database, locationString), action.payload.kvPairs)
        },
        // New: saveUserChapterData (for chapter complete)
        saveUserChapterData(state, action){
            if(!action.payload.kvPairs){
                console.log("saveUserChapterData missing info")
                return
            }
            
            // This is the location that the key value pair will be stored
            var locationString = "coursesApp/userData/"+state.userID+
                "/courses/"+(action.payload.courseID || state.selectedCourseID)+
                "/chapterData/"+(action.payload.chapterID || state.selectedChapterID)

            // Save the key value pair in the db
            update(ref(database, locationString), action.payload.kvPairs)
        },
        // New: saveUserSectionData (for section complete, time it took to complete, image capture urls)
        saveUserSectionData2(state, action){
            if(!action.payload.kvPairs || typeof action.payload.kvPairs !== "object"){
                console.log("saveUserSectionData2 missing info")
                return
            }
            
            // This is the location that the key value pair will be stored
            var locationString = "coursesApp/userData/"+state.userID+
            "/courses/"+(action.payload.courseID || state.selectedCourseID)+
            "/chapterData/"+(action.payload.chapterID || state.selectedChapterID)+
            "/sectionData/"+(action.payload.sectionID || state.selectedSectionID)
            console.log("saving")
            console.log(locationString)
            console.log(action.payload.kvPairs)

            // Save the key value pair in the db
            update(ref(database, locationString), action.payload.kvPairs)
        },

        // New: saveUserResponse (for answered questions)
        saveUserResponse(state, action){
            if(!action.payload.kvPairs || !action.payload.elementID){
                console.log("saveUserResponse missing info")
                return
            }
            
            // This is the location that the key value pair will be stored
            var locationString = "coursesApp/userData/"+state.userID+
            "/courses/"+(action.payload.courseID || state.selectedCourseID)+
            "/chapterData/"+(action.payload.chapterID || state.selectedChapterID)+
            "/sectionData/"+(action.payload.sectionID || state.selectedSectionID)+
            "/responseData/"+action.payload.elementID
            
            // Save the key value pair in the db
            update(ref(database, locationString), action.payload.kvPairs)
        },




        // New action.payload.kvPairs = ex:{property: "isAdmin", value: true}
        saveUserAccountData(state, action){            
            if(action.payload.kvPairs == undefined){
                console.log("Error: saveUserAccountData: missing data")
                return
            }

            // This is the location that the remaining time will be saved
            var locationString = "coursesApp/userData/"+( action.payload.userID || state.userID)+"/accountData"          

            // Save the remaining time in the db (shouldnt overwrite other data)
            update(ref(database, locationString), action.payload.kvPairs)
        },
        // depreciated
        enrollUserInCourses(state, action){
            if(!action.payload || !action.payload.userID || !Array.isArray(action.payload.courseIDArray)) {
                console.log("Error: enrollUserInCourses: missing data")
                return
            }

            // Update the user ID if needed
            if(state.userID != action.payload.userID)
                state.userID = action.payload.userID

            // return

            // Update the array of enrolled courses
            runTransaction(
                // Where they will be stored
                ref(database, "coursesApp/userData/"+action.payload.userID+"/enrolledCourses"), 
                // Access the enrolled courses array from the db
                (enrolledCourses) => {
                    // If this is the first time the user has enrolled in a course create the array in the db
                    if(!enrolledCourses)
                        enrolledCourses = []
                    
                    // Filter out any duplicates by turning it into a set then back into an array
                    let coursesToAdd = [...new Set(action.payload.courseIDArray)];

                    // Filter out the ones the user is already enrolled in 
                    coursesToAdd = coursesToAdd.filter(courseID => !enrolledCourses.includes(courseID))
                    
                    console.log("enrolling user " + action.payload.userID + "in courses: ")
                    console.log(action.payload.courseIDArray)

                    // Add the new ones
                    enrolledCourses = enrolledCourses.concat(coursesToAdd)

                    console.log("they are now enrolled in ")
                    console.log(enrolledCourses)

                    // Return the new array to update the db
                    return enrolledCourses
                }
            )
        },

        // New: enrollUserInCourses2
        enrollUserInCourses2(state, action){
            if(!action.payload || !action.payload.userID || !Array.isArray(action.payload.courseIDArray)) {
                console.log("Error: enrollUserInCourses: missing data")
                return
            }
            // For each course ID in the array
            action.payload.courseIDArray.forEach(courseID => {
                // Update the enrolled state to true
                update(ref(database, "coursesApp/userData/"+action.payload.userID+"/courses/"+courseID), {enrolled: true})

            })

        },
        // New: Sets all courses to not enrolled
        clearEnrolledCourses(state, action){
            if(!action.payload || !action.payload.userID)
                return

            // set(ref(database, "coursesApp/userData/"+state.userID+"/enrolledCourses"), null)
            runTransaction(ref(database, "coursesApp/userData/"+action.payload.userID+"/courses"), item => {
                if(!item) return item

                var tempObject = {}
                // Go through each course
                Object.entries(item).forEach(courseDataItem => {
                    // Create a new object with the same data but enrolled set to false
                    let tempCourseDataItem = {...courseDataItem[1]}
                    tempCourseDataItem.enrolled = false
                    // Add the new object to the temp object
                    tempObject[courseDataItem[0]] = {...tempCourseDataItem}
                })

                // This is how the object will be stored now, with all of the same data but the user will not be enrolled in any courses
                return tempObject

            })
        },
        // New: Clears all course data for the given user
        clearAllCourseData(state, action){
            if(!action.payload || !action.payload.userID)
                return
            set(ref(database, "coursesApp/userData/"+action.payload.userID+"/courses"), null)

        },
        // New: Clears all user data for the given user
        clearAllUserData(state, action){

            set(ref(database, "coursesApp/userData/"+(action.payload?.userID || state.userID)), null)
        },
        toggleTheme(state, action) {
            var newTheme 
            if(state.theme === "darkTheme")
                newTheme = "lightTheme";
            else
                newTheme = "darkTheme";  
            
            console.log("setting theme to ", newTheme)

            // Save the new value in state (will update when userData changes anyway)
            state.theme = newTheme

            // This is the location in the db that the language will be saved
            var locationString = "coursesApp/userData/" + state.userID + "/accountData"            
            // Save the new language in the db
            update(ref(database, locationString), {theme: newTheme})
        },
        toggleLanguage(state, action) {
            var newLanguage 
            if(state.language === "English")
                newLanguage = "Español";
            else
                newLanguage = "English";  
            
            // Save the new value in state
            state.language = newLanguage

            // This could be updated on the landing page even if there is no signe in user
            if(state.userData){
                // This is the location in the db that the language will be saved
                var locationString = "coursesApp/userData/" + state.userID + "/accountData"            
                // Save the new language in the db
                update(ref(database, locationString), {language: newLanguage})
            }
        },
        // #endregion user data

        // #region selections
        // The selections actions select items such as chapters, sections, and elements based on their ID
        
        selectCourse(state, action) {  
            state.selectedCourseID = action.payload;
            //console.log(state.coursesData)          
            // if(state.coursesArray.find(course => course.id))
            //     // Set the selected course ID
            //     state.selectedCourseID = action.payload;
            // else
            //     console.log(action.payload + " is not a valid course ID")

        },
        selectChapter(state, action) {
            state.selectedChapterID = action.payload;

        },
        selectSection(state, action) {
            console.log("selectSection depreciated")
            return
            state.selectedSectionID = action.payload;
            state.responsePath = "responses/"+state.selectedCourseID+"/"+state.selectedChapterID+"/"+state.selectedSectionID

        },
        selectElement(state, action) {
            state.selectedElementID = action.payload;
            // This is used to get user resopnse data
            state.responsePath = "responses/"+state.selectedCourseID+"/"+state.selectedChapterID+"/"+state.selectedSectionID

        },
        selectFirst(state, action) {
      
            // If there is no course data, return
            if(!state.courseData)
                return
            
            // If there is a specified first chapter, use that
            var firstChapter = null
            if(action?.payload?.chapterID){
                firstChapter = getItem(state.courseData, action?.payload?.chapterID)
            }
            // Else just get the first one
            else{
                firstChapter = getFirstItem(state.courseData.items)
            }
            // If there was no first chapter found there may be no chapters in the course
            if(!firstChapter)
                return

            // Set the selected chapter to the specied one or the first one
            state.selectedChapterID = firstChapter.id

            // Get the first section in the chapter (or the specified one)
            var firstSection = null
            if(action?.payload?.sectionID && action?.payload?.chapterID){
                firstSection = getItem(state.courseData, action?.payload?.chapterID, action?.payload?.sectionID)
            }else{
                firstSection = getFirstItem(firstChapter.items)
            }                        
            if(!firstSection)
                return
            state.selectedSectionID = firstSection.id

            // This is used to get user resopnse data
            state.responsePath = "responses/"+state.selectedCourseID+"/"+firstChapter.id+"/"+firstSection.id

            // Get the first element in the chapter (or the specified one)
            var firstElement = null
            if(action?.payload?.sectionID && action?.payload?.chapterID && action?.payload?.elementID){
                firstElement = getItem(state.courseData, action?.payload?.chapterID, action?.payload?.sectionID, action?.payload?.elementID)
            }else{
                firstElement = getFirstItem(firstSection.items)
            }                        
            if(!firstElement)
                return
            state.selectedElementID = firstElement.id
            
        },
        selectSectionIfValid(state, action) {
            // Look into the userData to see if the specified section has the complted property set to true
            var sectionIsCompleted = getUserData(state.userData, "courses/"+state.selectedCourseID+"/chapterData/"+state.selectedChapterID+"/sectionData/"+action.payload.sectionID+"/complete")

            // If it is select it
            if(sectionIsCompleted == true){
                state.selectedSectionID = action.payload.sectionID
                return
            }
  
            // Get the array of sections
            var chapter = getItem(state.courseData, state.selectedChapterID)
            var sectionArray = objectToArray(chapter.items)

            // Check to see if the index is the one after the index of the last completed section
            var previousComplete = true            
            sectionArray.forEach(section => {
                // If the previous section was completed and the section is found select it
                if(section.id == action.payload.sectionID && previousComplete){     
                        state.selectedSectionID = action.payload.sectionID
                }
                // Get the user data for this section                
                let userDataForThisSection = getUserData(state.userData, "courses/"+state.selectedCourseID+"/chapterData/"+state.selectedChapterID+"/sectionData/"+section?.id)
                // Set the flag based on the section is completed property
                if(userDataForThisSection?.complete){                    
                    previousComplete = true
                }
                else {                    
                    previousComplete = false                
                }
            })

        },
        selectNextSection(state, action) {
            var chapterID = state.selectedChapterID
            var sectionID = state.selectedSectionID

            // Get the object with the sections in it
            var chapterSections = getItem(state.courseData, chapterID).items
            // Look for the section after the currently selected section
            var nextSection = getNextItem(chapterSections, sectionID)

            // If there is no next section, get the first section in the next chapter. Also mark chapter as complete (if all sections are complete)
            if(!nextSection){
                var nextChapter = getNextItem(state.courseData.items, chapterID)
                // If there is no next chapter the course is complete
                if(!nextChapter){
                    // Mark the course as complete
                    update(ref(database, 'coursesApp/userData/'+state.userID+'/courses/'+state.selectedCourseID), {complete: true})
                    return
                }
                // Look for the first section in the next chapter
                nextSection = getFirstItem(nextChapter.items)
            }

            // Save the ID of the next section
            state.selectedSectionID = nextSection.id

        },
        selectPreviousSection(state, action) {
            var chapterID = state.selectedChapterID
            var sectionID = state.selectedSectionID

            // Get the object with the sections in it
            var chapterSections = getItem(state.courseData, chapterID).items
            // Look for the section before the currently selected section
            var previousSection = gePreviousItem(chapterSections, sectionID)

            // If there is no last section, get the first section in the next chapter
            if(!previousSection){
                console.log("!previousSection")
                return
                var previousChapter = gePreviousItem(state.courseData.items, chapterID)
                // If there is no previous chapter the user is at the first section of the first chapter
                if(!previousChapter)
                    return
                // Look for the first section in the last chapter
                previousSection = getFirstItem(previousChapter.items)
            }

            // Save the ID of the next section
            state.selectedSectionID = previousSection.id

        },

        // #endregion selections

        // #region course actions
        // The course actions are actions pertaining to the course such as adding, deleting, copying, or updating a course

        addCourse(state, action){
             // Get a ref to the places the new course data will be stored
            var metaDataRef = push(ref(database, 'coursesApp/coursesMetaData'));
            
            // Create an object to represent the new course
            var newCourse = {
                name: "new course",
                description: "new course description",
            }

            // Put the data in the metaData section
            set(metaDataRef, newCourse)
            
            // Add a place to store the chapters
            newCourse.items = {
                //chapterOneID: defaultChapter
            }

            // Put the data in the courseData section (with the same id as the metaData section)
            set(ref(database, 'coursesApp/coursesData/'+metaDataRef.key), newCourse)
        },
        deleteCourse(state, action){
            if(!action.payload) return
            set(ref(database, 'coursesApp/coursesMetaData/'+action.payload), null)
            set(ref(database, 'coursesApp/coursesData/'+action.payload), null)
        },
        copyCourse(state, action){   
            // find the course to copy
            var coursesArray = objectToArray(state.coursesData)
            var courseToCopy = coursesArray.find(course => course.id === action.payload)
            if(!courseToCopy) {
                console.log("copyCourse: no course found with id " + action.payload)
                return
            }        
            var tempCourse = {...courseToCopy}

            // Change the name of the course to show it is a copy
            tempCourse.name = tempCourse.name + " copy"
            
            // Get a ref to the places the new course data will be stored
            var metaDataRef = push(ref(database, 'coursesApp/coursesMetaData'));
            
            // Put the meta data in the metaData section
            set(metaDataRef, tempCourse)

            // Will need to get and add the items array for the course data copy
            get(ref(database, 'coursesApp/coursesData/'+action.payload)).then((snapshot) => {
                if (snapshot.exists()) {

                    // Add the items object to the tempCourse object
                    tempCourse.items = snapshot.val().items
                    
                    // Put the data in the courseData section
                    set(ref(database, "coursesApp/coursesData/"+metaDataRef.key), tempCourse)

                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

        },
        updateCourseInfo (state, action) {  
            // Make sure the payload is valid
            if(!action.payload || !action.payload.courseID || !action.payload.newName) return
            // Update the course info (will only change the name and description, will not affect the items or other data)
            update(ref(database, 'coursesApp/coursesMetaData/'+action.payload.courseID), {name: action.payload.newName, description: action.payload.newDescription})
            update(ref(database, 'coursesApp/coursesData/'+action.payload.courseID), {name: action.payload.newName, description: action.payload.newDescription})            
        },
        updateCourseInfo2 (state, action) {  
            console.log("updateCourseInfo2")
            console.log(action.payload.valuesObject)
            // Make sure the payload is valid
            if(!action.payload || !action.payload.courseID || !action.payload.valuesObject) return
            // Update the course info
            update(ref(database, 'coursesApp/coursesMetaData/'+action.payload.courseID), action.payload.valuesObject)            
            update(ref(database, 'coursesApp/coursesData/'+action.payload.courseID), action.payload.valuesObject)            
        },

        // #endregion course actions

        // #region chapter actions
        // The chapter actions are actions pertaining to the course such as adding, deleting, or copying a chapter

        addChapter(state, action){

            // Get a ref to the places the new course data will be stored
            var newDbLocationRef = push(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items'))
            
            // Create an object to represent the new chapter
            var newItem = {...defaultChapter}

            // Set the name and index of the new chapter
            newItem.index = nItemsInObject(state.courseData.items)     
            if(newItem.index != 0)                           
                newItem.name = newItem.name + " "+newItem.index
            newItem.id = newDbLocationRef.key

            // Add it to the db
            set(newDbLocationRef, newItem)
            
        },
        deleteChapter(state, action){
            if(!action.payload) return            
            set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload), null)
        },
        copyChapter(state, action){
            // The chapter to copy is the payload
            var chapter = action.payload         
            // Updaet the IDs of the chapter and all of its children           
            var chapterWithNewIDs = newIDsObject(chapter)
            // Update the name of the chapter to show it is a copy
            chapterWithNewIDs.name = chapterWithNewIDs.name + " copy"

            // Add the new chapter to the course data items object (representing chapters)
            var updatedChapters = insertItem(state.courseData.items, chapterWithNewIDs, action.payload.id)
            
            // Select the new chapter
            state.selectedChapterID = chapterWithNewIDs.id
            // Select the first section in the new chapter
            var firstSection = getFirstItem(chapterWithNewIDs.items)?.id
            state.selectedSectionID = firstSection.id
            // Select the first element in the first section of the new chapter
            state.selectedElementID = getFirstItem(firstSection.items)?.id

            // state.debug2 = chapterWithNewIDs
            set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items'), updatedChapters)

        },

        // #endregion chapter actions
       
        // #region section actions
        // The section actions are actions pertaining to the section such as adding, deleting, or copying a chapter        
        addSection(state, action){
            if(!action.payload || !action.payload.chapterID) return

            // Calculate the new number of sections
            let chapters = state.courseData.items                      
            if(chapters && typeof chapters === "object"){
                let totalSections = 0                
                Object.entries(chapters).forEach(([key, value]) => {
                    totalSections += Object.entries(value?.items).length
                })    
    
                // Save the new number of sections in the db
                update(ref(database, 'coursesApp/coursesMetaData/'+state.selectedCourseID), {totalSections: totalSections+1})
            }
            // If there are no chapters or sections yet there will now be one section
            else{
                // Save the new number of sections in the db
                update(ref(database, 'coursesApp/coursesMetaData/'+state.selectedCourseID), {totalSections: 1})
            }

            // Get a ref to the places the new course data will be stored
            var newDbLocationRef = push(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload.chapterID+'/items'))
            
            // Create an object to represent the new section
            var newItem = {...defaultSection}

            // If there is an index in the payload, add it to the new element
            if(action.payload.index){
                newItem.index = action.payload.index
                newItem.name = newItem.name + " "+action.payload.index
            }
            newItem.id = newDbLocationRef.key

            // Add it to the db
            set(newDbLocationRef, newItem)
            
        },
        deleteSection(state, action){
            if(!action.payload || !action.payload.sectionID || !action.payload.chapterID) return            

            let foundSection = false

            // Calculate the new number of sections
            let chapters = state.courseData.items                      
            if(chapters && typeof chapters === "object"){
                let totalSections = 0                
                Object.entries(chapters).forEach(([key, value]) => {
                    Object.entries(value?.items).forEach(([sectionID, sectionData]) => {                        
                        // Check to see if this is the section being deleted
                        if(sectionID === action.payload.sectionID)
                            foundSection = true
                        // Increment the total sections count if this section is not being deleted
                        else
                            totalSections = totalSections + 1                                                    
                    })
                })    
    
                // Save the new number of sections in the db (if it changed)
                if(foundSection)
                    update(ref(database, 'coursesApp/coursesMetaData/'+state.selectedCourseID), {totalSections: totalSections})
            }

            // Delete the section from the db (if it is there)
            if(foundSection)
                set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload.chapterID+"/items/"+action.payload.sectionID), null)

            
        },
        copySection(state, action){
            if(!action.payload || !action.payload.sectionToCopy || !action.payload.chapterID) return            

            // Calculate the new number of sections
            let chapters = state.courseData.items                      
            if(chapters && typeof chapters === "object"){
                let totalSections = 0                
                Object.entries(chapters).forEach(([key, value]) => {
                    totalSections += Object.entries(value?.items).length
                })    
    
                // Save the new number of sections in the db
                update(ref(database, 'coursesApp/coursesMetaData/'+state.selectedCourseID), {totalSections: totalSections+1})
            }

            // Updaet the IDs of the section and all of its children           
            var sectionWithNewIDs = newIDsObject(action.payload.sectionToCopy)
            // Update the name of the section to show it is a copy
            sectionWithNewIDs.name = sectionWithNewIDs.name + " copy"

            // Get the chapter that the section is in so the new section can be added to it at the correct index
            var chapter = getItem(state.courseData, action.payload.chapterID)

            // Add the new chapter to the course data items object (representing chapters)
            var updatedSections = insertItem(chapter.items, sectionWithNewIDs, action.payload.sectionToCopy.id)

            // Select the new section
            state.selectedSectionID = sectionWithNewIDs.id
            // Select the first element in the new section (if there is one)
            state.selectedElementID = getFirstItem(sectionWithNewIDs.items)?.id

            // state.debug2 = chapterWithNewIDs
            set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload.chapterID+"/items"), updatedSections)

        },

        // #endregion section actions

        // #region element actions
        // The element tttttare actions pertaining to the element such as adding, deleting, or copying a chapter
  
        addElement(state, action){
            if(!action.payload || !action.payload.chapterID || !action.payload.sectionID) return
                        
            // Get a ref to the places the new course data will be stored
            var newDbLocationRef = push(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload.chapterID+'/items/'+action.payload.sectionID+'/items'))
        
            // Create an object to represent the new section
            var newItem ={...defaultElement}

            // If there is an index in the payload, add it to the new element
            if(action.payload.index){
                newItem.index = action.payload.index
                newItem.name = newItem.name + " "+action.payload.index
            }
            newItem.id = newDbLocationRef.key

            if(action.payload.afterID){
                // Get the section items object
                var section = getItem(state.courseData, action.payload.chapterID, action.payload.sectionID)
                var updatedElements = insertItem(section.items, newItem, action.payload.afterID)
                updatedElements = removeUndefined(updatedElements)
                
                // Insert it into the section items object if the index is not the last one
                set(ref(database, "coursesApp/coursesData/"+state.selectedCourseID+"/items/"+action.payload.chapterID+"/items/"+action.payload.sectionID+"/items"), updatedElements)
            }
            else{
                // Insert it into the section items object if the index is not the last one
            // if(action.payload.index < nItemsInObject(state.courseData.items[action.payload.chapterID].items[action.payload.sectionID].items)){
                
                
            // }
    
                // Add it to the db
                set(newDbLocationRef, newItem)

            }

            // Select the new element
            //state.selectedElementID = newItem.id
        },
        deleteElement(state, action){
            if(!action.payload || !action.payload.sectionID || !action.payload.chapterID || !action.payload.elementID) return            
            set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload.chapterID+"/items/"+action.payload.sectionID+"/items/"+action.payload.elementID), null)
       
        },
        copyElement(state, action){
            if(!action?.payload || !action.payload?.chapterID || !action?.payload?.sectionID || !action?.payload?.elementToCopy) return
       
            // Get a spot for the new element
            var newElementRef = push(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload.chapterID+'/items/'+action.payload.sectionID+'/items'))
            
            // Adjust the name of the element to show it is a copy
            var copiedElement = {...action.payload.elementToCopy}
            copiedElement.name = copiedElement.name + " copy"
            copiedElement.id = newElementRef.key
                        
            // Insert it into the section items object
            var section = getItem(state.courseData, action.payload.chapterID, action.payload.sectionID)
            var updatedSectionItems = insertItem(section.items, copiedElement, action.payload.elementToCopy.id)
            
            // Select the new element
            state.selectedElementID = copiedElement.id

            // Put it in the database
            set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload.chapterID+'/items/'+action.payload.sectionID+'/items'), updatedSectionItems)

        },
        
        // #endregion element actions
        
        // #region drag and drop actions
        // The drag and drop actions are called when a sidebar element is dragged, dropped, or hovered over

        // Saves the drag start chapterID, sectionID, and elementID
        sidenavDragStart(state, action){
            state.dragStartIDs = action.payload

            // Check to see what type of item is being dragged
            if(action.payload.elementID){{
                // If there is an element ID, it is an element
                state.dragItemType = "element"
            }
            }else if(action.payload.sectionID){
                // If there is no element ID but there is a section ID, it is a section
                state.dragItemType = "section"
            }
            else if(action.payload.chapterID){
                // If there is no section ID but there is a chapter ID, it is a chapter
                state.dragItemType = "chapter"
            }
        },
        // Uses the drag start IDs to get the item them move it based on drag end IDs
        sidenavDragEnd(state, action){
            state.sidenavHoverItemID = null

            // Check to see what type of item is being dragged            
            var dragType = dragTypeFunction(state.dragStartIDs.elementID, state.dragStartIDs.sectionID, state.dragStartIDs.chapterID)

            // Check to see what type of item is being dropped onto
            var dropOntoType = dragTypeFunction(action.payload.elementID, action.payload.sectionID, action.payload.chapterID)

            // Check to see if the item is being dropped onto itself
            if(state.dragStartIDs.elementID == action.payload.elementID && state.dragStartIDs.sectionID == action.payload.sectionID && state.dragStartIDs.chapterID == action.payload.chapterID){
                // console.log("Dropped onto itself")
                return
            }
            
            // If the item being dragged is an element
            if(dragType === "element"){        
                // And its being dropped onto an element           
                if(dropOntoType === "element"){
                    // Element to element in new chapter
                    if(state.dragStartIDs.chapterID != action.payload.chapterID){
                        // Get the element
                        var elementToMove = getItem(state.courseData, state.dragStartIDs.chapterID, state.dragStartIDs.sectionID, state.dragStartIDs.elementID)
                        var originSection = getItem(state.courseData, state.dragStartIDs.chapterID, state.dragStartIDs.sectionID)
                        var destinationChapter = getItem(state.courseData, action.payload.chapterID)
                        // Remove the element from the origin
                        var updatedSectionItemsOrigin = removeItem(originSection.items, state.dragStartIDs.elementID)
                        // Get the last section in the destination chapter
                        var destinationSectionID = getLastItemID(destinationChapter.items)
                        var destinationSection = getItem(state.courseData, action.payload.chapterID, destinationSectionID)
                        // Move the element to the end of the destination section
                        var updatedSectionItemsDestination = insertItem(destinationSection.items, elementToMove, action.payload.elementID)

                        // Save the updated data for both
                        set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+state.dragStartIDs.chapterID+'/items/'+state.dragStartIDs.sectionID+'/items'), updatedSectionItemsOrigin)
                        set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload.chapterID+'/items/'+destinationSectionID+'/items'), updatedSectionItemsDestination)

                    }
                    // // Element to element in new section
                    else if(state.dragStartIDs.sectionID != action.payload.sectionID){
                        // get the element
                        var elementToMove = getItem(state.courseData, state.dragStartIDs.chapterID, state.dragStartIDs.sectionID, state.dragStartIDs.elementID)
                        var originSection = getItem(state.courseData, state.dragStartIDs.chapterID, state.dragStartIDs.sectionID)
                        var destinationSection = getItem(state.courseData, action.payload.chapterID, action.payload.sectionID)

                        // remove the element from the origin
                        var updatedSectionItemsOrigin = removeItem(originSection.items, state.dragStartIDs.elementID)

                        // Move the element to the end of the destination section
                        var updatedSectionItemsDestination = insertItem(destinationSection.items, elementToMove, action.payload.elementID)
                        
                        // Save the updated data for both
                        set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+state.dragStartIDs.chapterID+'/items/'+state.dragStartIDs.sectionID+'/items'), updatedSectionItemsOrigin)
                        set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload.chapterID+'/items/'+action.payload.sectionID+'/items'), updatedSectionItemsDestination)

                    }
                    // Element to element in same section
                    else{                        
                        // Get the section
                        var section = getItem(state.courseData, state.dragStartIDs.chapterID, state.dragStartIDs.sectionID)
                       
                        // Get the element
                        var elementToMove = {...section.items[state.dragStartIDs.elementID]}
                        elementToMove.id = state.dragStartIDs.elementID                      
                        
                        // Remove the element from the section
                        var updatedSectionItems = removeItem(section.items, state.dragStartIDs.elementID)                                            
 
                        // Insert the element into the section
                        updatedSectionItems = insertItem(updatedSectionItems, elementToMove, action.payload.elementID)

                        // Update the database
                        set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+state.dragStartIDs.chapterID+'/items/'+state.dragStartIDs.sectionID+'/items'), updatedSectionItems)
                    }

                } 
                // Element dropped onto a section
                if(dropOntoType === "section"){
                    // If the element is being dropped into the same section do nothing
                    if(state.dragStartIDs.sectionID === action.payload.sectionID)
                        return
                    
                    // get the element
                    var elementToMove = getItem(state.courseData, state.dragStartIDs.chapterID, state.dragStartIDs.sectionID, state.dragStartIDs.elementID)
                    var originSection = getItem(state.courseData, state.dragStartIDs.chapterID, state.dragStartIDs.sectionID)
                    var destinationSection = getItem(state.courseData, action.payload.chapterID, action.payload.sectionID)

                    // remove the element from the origin
                    var updatedSectionItemsOrigin = removeItem(originSection.items, state.dragStartIDs.elementID)

                    // Move the element to the end of the destination section (it will just add it to the end of the array because action.payload.elementID is undefined)
                    var updatedSectionItemsDestination = insertItem(destinationSection.items, elementToMove, action.payload.elementID)
                    
                    // Save the updated data for both
                    set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+state.dragStartIDs.chapterID+'/items/'+state.dragStartIDs.sectionID+'/items'), updatedSectionItemsOrigin)
                    set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload.chapterID+'/items/'+action.payload.sectionID+'/items'), updatedSectionItemsDestination)
                }
                // Element dropped onto a chapter
                if(dropOntoType === "chapter"){
                    // Get the element
                    var elementToMove = getItem(state.courseData, state.dragStartIDs.chapterID, state.dragStartIDs.sectionID, state.dragStartIDs.elementID)
                    var originSection = getItem(state.courseData, state.dragStartIDs.chapterID, state.dragStartIDs.sectionID)
                    var destinationChapter = getItem(state.courseData, action.payload.chapterID)
                    // Remove the element from the origin
                    var updatedSectionItemsOrigin = removeItem(originSection.items, state.dragStartIDs.elementID)
                    // Get the last section in the destination chapter
                    var destinationSectionID = getLastItemID(destinationChapter.items)
                    var destinationSection = getItem(state.courseData, action.payload.chapterID, destinationSectionID)
                    // Move the element to the end of the destination section (it will just add it to the end of the array because action.payload.elementID is undefined)
                    var updatedSectionItemsDestination = insertItem(destinationSection.items, elementToMove, action.payload.elementID)

                    // Save the updated data for both
                    set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+state.dragStartIDs.chapterID+'/items/'+state.dragStartIDs.sectionID+'/items'), updatedSectionItemsOrigin)
                    set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload.chapterID+'/items/'+destinationSectionID+'/items'), updatedSectionItemsDestination)
                }
            }
            // If the item being dragged is a section
            else if(dragType === "section"){
                // Check to see if the section is being dropped onto a different chapter
                if(state.dragStartIDs.chapterID != action.payload.chapterID){
                    // Get the section that is going to be moved
                    var sectionToMove = getItem(state.courseData, state.dragStartIDs.chapterID, state.dragStartIDs.sectionID)
                    
                    // Get the chapter objects that need to be adjusted
                    var originChapter = getItem(state.courseData, state.dragStartIDs.chapterID)
                    var destinationChapter = getItem(state.courseData, action.payload.chapterID)

                    // Remove the section from the origin chapter
                    var updatedOriginChapterItems = removeItem(originChapter.items, state.dragStartIDs.sectionID)

                    // insert the section into the new index
                    var updatedDestinationChapterItems = insertItem(destinationChapter.items, sectionToMove, action.payload.sectionID)
                    
                    // save it
                    set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+state.dragStartIDs.chapterID+'/items'), updatedOriginChapterItems)
                    set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload.chapterID+'/items'), updatedDestinationChapterItems)

                }
                // Section move within same chapter: Move the section to the index after the destination section
                else{
                    // Get the chapter items 
                    var chapter = getItem(state.courseData, state.dragStartIDs.chapterID)
                    // Get the section that is going to be moved
                    var sectionToMove = getItem(state.courseData, state.dragStartIDs.chapterID, state.dragStartIDs.sectionID)

                    // insert the section into the new index
                    var updatedChapterItems = insertItem(chapter.items, sectionToMove, action.payload.sectionID)
                    
                    // save it
                    set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+state.dragStartIDs.chapterID+'/items'), updatedChapterItems)

                }
            }
            // If the item being dragged is a chapter
            else if(dragType === "chapter"){
                // Get the chapter that is going to be moved
                var chapterToMove = getItem(state.courseData, state.dragStartIDs.chapterID)
                // Get the course items
                var course = getItem(state.courseData)
                // insert the chapter into the new index
                var updatedCourseItems = insertItem(course.items, chapterToMove, action.payload.chapterID)
                // save it
                set(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items'), updatedCourseItems)

            }

        },
        sidenavDragOver(state, action){
            state.sidenavHoverItemID = action.payload
        },        
        // #endregion drag and drop actions

        // #region helper actions
        // the helper actions do anything else such as updating specified database values

        updateItemInfo(state, action) { 
            if(!action.payload.chapterID){
                console.log("updateItemInfo: missing payload chapterID")
                return
            }
            if(action.payload.value == undefined || action.payload.value == null){
                console.log("updateItemInfo: missing payload value", action.payload.value)
                return
            }
            if(typeof(action.payload.value) === "string" && action.payload.value.replaceAll(" ", "") === ""){
                console.log("updateItemInfo: payload value empty string", action.payload.value)
                
            }

            var dbString = 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload.chapterID

            if(action.payload.sectionID){
                dbString += "/items/"+action.payload.sectionID
            }
            if(action.payload.elementID){
                dbString += "/items/"+action.payload.elementID
            }
            if(action.payload.additionalPathString){
                dbString += action.payload.additionalPathString
            }
            // If the type is delete remove the specified item, otherwise set the value
            if(action.payload.type === "delete"){
                remove(ref(database, dbString))

            }else{
                // Could have called this property
                dbString += "/"+action.payload.type                

                // Set the value
                set(ref(database, dbString), action.payload.value)

            }
        },
        incrementTimerSaveCounter(state, action){
            state.timerSaveCounter++
        },

        // #endregion helper actions
    }
})

// #region exports

export const dbsliceReducer = dbslice.reducer;
// Loading actions
export const {setCourseData, setCoursesData} = dbslice.actions;
// User Data actions
export const {toggleLanguage, toggleTheme, enrollUserInCourses, enrollUserInCourses2, clearEnrolledCourses, setUserID, setUserData, saveUserSectionData, saveUserAccountData} = dbslice.actions;
// New User Data actions
export const {
    saveUserCourseData,
    saveUserChapterData,
    saveUserSectionData2,
    saveUserResponse,
    clearAllUserData} = dbslice.actions;
// Selection actions
export const {selectCourse, selectChapter, selectSection, selectElement, selectNextSection, selectPreviousSection, selectSectionIfValid} = dbslice.actions;
// Course actions
export const {addCourse, deleteCourse, copyCourse, updateCourseInfo, updateCourseInfo2} = dbslice.actions;
// Chapter actions
export const {addChapter, deleteChapter, copyChapter} = dbslice.actions;
// Section actions
export const {addSection, deleteSection, copySection} = dbslice.actions;
// Element actions
export const {addElement, deleteElement, copyElement} = dbslice.actions;
// Sidenav drag and drop actions
export const {sidenavDragStart, sidenavDragEnd, sidenavDragOver} = dbslice.actions;
// Helper actions
export const {updateItemInfo, selectFirst, incrementTimerSaveCounter} = dbslice.actions;

// #endregion exports
