import { createSlice } from "@reduxjs/toolkit";
import {initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { get, getDatabase, onValue, push, ref, remove, runTransaction, set, update } from "firebase/database";
import { concatUserData, gePreviousItem, getFirstItem, getItem, getLastItemID, getNextItem, getUserData, insertItem, log, newIDsObject, nItemsInObject, objectToArray, removeItem, removeUndefined, validSectionSelection } from "./functions";import { act } from "react-dom/test-utils";

/*
================================================================================
|                                   DbSlice.js
================================================================================

    This is a global redux slice that contains all of the data and actions pertaining to the database 
    including things loaded from the database and actions to save things in the database
    
    It also contains the firebase setup code and variables that are exporteted for global use

    The data contained:
        1. coursesData: metadata for all courses including title, description, etc.
        2. courseData: the course data for the selected course with the lessons, etc.
        3. userData: the user data from the database
        4. selection data such as selected course, chapter, section, and element IDs
        5. App data that may come from user data but sometimes does not such as theme and language
        6. drag and drop data such as the drag start IDs and drag item type

    The actions are seperated into cataegories:
        1. loading data (loading data from the database)
        2. user data (saving and loading user data)
        3. Selections (actions pertaining to selecting chapters, sections, etc to navigate through the course) 
        3. course, chapter, section, and element actions (actions pertaining to adding, removing, and modifying course, chapter, section, and element data)         
        4. drag and drop (state related to keeping track of things to allow dragging and dropping of cart items)
        5. helper actions

*/

// #region firebase config

// The config file
const firebaseConfig = {
    // This is the config for the old db
    // apiKey: "AIzaSyBDWCKZwSBi_Qp4U0u3D2tKrcIU290IrDE",
    // authDomain: "defaultproject-c023e.firebaseapp.com",
    // databaseURL: "https://defaultproject-c023e-default-rtdb.firebaseio.com",
    // projectId: "defaultproject-c023e",
    // storageBucket: "defaultproject-c023e.appspot.com",
    // messagingSenderId: "147977670881",
    // appId: "1:147977670881:web:fe1532718095f374bbe7a0",
    // measurementId: "G-VY1DMS0BKY"

    // This is the config for the new db
    apiKey: "AIzaSyBmvKBB4-qnurQdJrG0WxcnDXLHzK8BENk",
    authDomain: "courses-app-8efb5.firebaseapp.com",
    databaseURL: "https://courses-app-8efb5-default-rtdb.firebaseio.com",
    projectId: "courses-app-8efb5",
    storageBucket: "courses-app-8efb5.appspot.com",
    messagingSenderId: "754361725473",
    appId: "1:754361725473:web:fc236219cf40a3d670e960",
    measurementId: "G-H688PKFR3X"
}
// The firebase app
const app = initializeApp(firebaseConfig)

// Auth Object
export const auth = getAuth(app)
// Database Object
export const database = getDatabase(app)

export const storage = getStorage();

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
        sectionArray: [],
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
        clearUserData: (state, action) => {
            state.userID = null
            state.anonID = null
            state.userData = null
            state.sectionArray = []
            state.selectedCourseID = null
            state.selectedChapterID = null
            state.selectedSectionID = null
            state.selectedElementID = null

        },
        setUserID(state, action){
            state.userID = action.payload;
        },   
        setAnonID(state, action){
            state.anonID = action.payload;
        },
        // action.payload = userData from the db
        setUserData(state, action){

            // Save the user data in state
            state.userData = action.payload;
            
            // Set the theme if one is saved
            if(action.payload?.accountData?.theme)
                state.theme = action.payload?.accountData?.theme

            // Set the language if one is saved
            if(action.payload?.accountData?.language)
                state.language = action.payload?.accountData?.language

            if(action.payload?.accountData?.language)
                state.language = action.payload?.accountData?.language

        },
        // This saves the user's response to a section
        // var locationString = "coursesApp/userData/"+state.userID+"/responses/"+state.selectedCourseID+"/"+action.payload.chapterID+"/"+action.payload.sectionID+"/"+action.payload.property
        saveUserSectionData(state, action){
            //  // console.log("saveUserSectionData depreciated")
            
            if(!action.payload.sectionID || !action.payload.chapterID || action.payload.value == undefined || !action.payload.property){
                //  // console.log("Error: saveRemainingSectionTime: missing data")
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
                //  // console.log("saveUserCourseData missing info")
                return
            }
            
            // This is the location that the key value pair will be stored
            var locationString = "coursesApp/userData/"+state.userID+
                "/courses/"+(action.payload.courseID || state.selectedCourseID)

            // Save the key value pair in the db
            update(ref(database, locationString), removeUndefined(action.payload.kvPairs))
        },
        // New: saveUserChapterData (for chapter complete)
        saveUserChapterData(state, action){
            if(!action.payload.kvPairs){
                //  // console.log("saveUserChapterData missing info")
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
                //  // console.log("saveUserSectionData2 missing info")
                return
            }
            
            // This is the location that the key value pair will be stored
            var locationString = "coursesApp/userData/"+state.userID+
            "/courses/"+(action.payload.courseID || state.selectedCourseID)+
            "/chapterData/"+(action.payload.chapterID || state.selectedChapterID)+
            "/sectionData/"+(action.payload.sectionID || state.selectedSectionID)

            // Save the key value pair in the db
            update(ref(database, locationString), action.payload.kvPairs)
        },
        // ex: action.payload = {arrayName: "webcamImages", valueArray: [imageUrl1, imageUrl2]}
        pushToUserSectionData2(state, action){
            if(!action.payload?.arrayName || !action.payload?.valueArray){
                //  // console.log("pushToUserSectionData2 missing info")
                return
            }
            
            // This is the location that the key value pair will be stored
            var locationString = "coursesApp/userData/"+state.userID+
            "/courses/"+(action.payload.courseID || state.selectedCourseID)+
            "/chapterData/"+(action.payload.chapterID || state.selectedChapterID)+
            "/sectionData/"+(action.payload.sectionID || state.selectedSectionID)

            // Save the key value pair in the db
            //update(ref(database, locationString), action.payload.kvPairs)
            runTransaction(ref(database, locationString), item => {
                if(!item)
                    item = {}
                if(!item[action.payload?.arrayName]){
                    item[action.payload?.arrayName] = []
                }
                item[action.payload?.arrayName].push(...action.payload.valueArray)
                return item
            })
        },
        incrementUserSectionTimeOld(state, action){            
            runTransaction(ref(database, "coursesApp/userData/"+action.payload.userID+"/courses/"+(action.payload?.courseID || state.selectedCourseID)+"/chapterData/"+(action.payload?.chapterID || state.selectedChapterID)+"/sectionData/"+(action.payload?.sectionID|| state.selectedSectionID)), item => {
                if(!item)
                    item = {}
                if(!item.userTime)
                    item.userTime = 0
                if(typeof item.userTime !== "number")
                    item.userTime = Number.parseInt(item.userTime)
                else
                    item.userTime++
                if(action.payload?.requiredTime){
                    if(typeof action?.payload?.requiredTime)
                        item.requiredTime = Number.parseInt(action.payload?.requiredTime)
                    else
                        item.requiredTime = action.payload?.requiredTime
                }

                return item
            })

        },
        incrementUserSectionTime(state, action){         
            runTransaction(ref(database, "coursesApp/userDataTimes/"+state.userID+"/courses/"+(action.payload?.courseID || state.selectedCourseID)+"/chapterData/"+(action.payload?.chapterID || state.selectedChapterID)+"/sectionData/"+(action.payload?.sectionID|| state.selectedSectionID)), item => {
                if(!item)
                    item = {}
                if(!item.userTime)
                    item.userTime = 0
                if(typeof item.userTime !== "number")
                    item.userTime = Number.parseInt(item.userTime)
                else
                    item.userTime++
                if(action.payload?.requiredTime){
                    if(typeof action?.payload?.requiredTime)
                        item.requiredTime = Number.parseInt(action.payload?.requiredTime)
                    else
                        item.requiredTime = action.payload?.requiredTime
                }

                return item
            })

        },
        // New: saveUserResponse (for answered questions)
        saveUserResponse(state, action){
            if(!action.payload.kvPairs || !action.payload.elementID){
                //  // console.log("saveUserResponse missing info")
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
        // New action.payload.kvPairs = ex:{property: "isAdmin", value: true} optional userID value in the payload
        saveUserAccountData(state, action){                   

            if(action.payload.kvPairs == undefined){
                //  // console.log("Error: saveUserAccountData: missing data")
                return
            }

            // Check for a userID, if there is none look for an anonymous userID and save it there
            let tempUserID = action.payload.userID || state.userID

            // This is the location that the remaining time will be saved
            var locationString = "coursesApp/userData/"+ tempUserID +"/accountData"          
            
            //  // console.log("locationString")
            //  // console.log(locationString)
            
            //  // console.log("dbslice saveUserAccountData")
            //  // console.log(action.payload.kvPairs)

            // Save the remaining time in the db (shouldnt overwrite other data)
            update(ref(database, locationString), action.payload.kvPairs)
        },
        // depreciated
        enrollUserInCourses(state, action){
            if(!action.payload || !action.payload.userID || !Array.isArray(action.payload.courseIDArray)) {
                //  // console.log("Error: enrollUserInCourses: missing data")
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
                    
                    //  // console.log("enrolling user " + action.payload.userID + "in courses: ")
                    //  // console.log(action.payload.courseIDArray)

                    // Add the new ones
                    enrolledCourses = enrolledCourses.concat(coursesToAdd)

                    //  // console.log("they are now enrolled in ")
                    //  // console.log(enrolledCourses)

                    // Return the new array to update the db
                    return enrolledCourses
                }
            )
        },
        // New: enrollUserInCourses2
        enrollUserInCourses2(state, action){
            if(!action.payload || !action.payload.userID || !Array.isArray(action.payload.courseIDArray)) {
                //  // console.log("Error: enrollUserInCourses: missing data")
                return
            }
            // For each course ID in the array
            action.payload.courseIDArray.forEach(courseID => {
                // Update the enrolled state to true
                update(ref(database, "coursesApp/userData/"+action.payload.userID+"/courses/"+courseID), {enrolled: true})

            })

        },
        enrollUserInCourseAnon(state, action){
            // Check for a userID, and anon status
            let userID = action.payload?.userID || state.userID
            
            // If there is neither create an anonymous user ID 
            if(!userID){
                let newAnonUserKey = push(ref(database, "coursesApp/userData/"))
                userID = newAnonUserKey.key
                window.localStorage.setItem("anonID", userID)
                state.anonID = userID
                state.userID = userID
            }

            // save user enrollment data in the existing or new ID
            let courseID = action.payload.courseID
            update(ref(database, "coursesApp/userData/"+userID+"/courses/"+courseID), {enrolled: true})
        },
        transferAnonData(state, action){
            //  // console.log("in dbslice transferAnonData")

            // Get both IDs
            let anonID = action.payload?.anonID || state.anonID
            let userID = action.payload?.userID || state.userID

            // If there is no anonID return
            if(!anonID || !userID){
                //  // console.log("dbslice transferAnonData: need both IDs")
                return
            }

            // The object that will hold the concatenated data
            let concatedUserData = {}
            
            // The data currently stored in userData will be the anon data
            let anonData = state.userData

            // Get the data from the main account (if there is any)
            onValue(ref(database, "coursesApp/userData/"+userID), snap => {                
                // If there is no data in the main account, the anon data will be the only data
                if(!snap.val()){
                    concatedUserData = anonData                    
                }                              
                // If there is data in the main account, the anon data will be added to it
                else{
                    // concatedUserData = snap.val()
                    concatedUserData = concatUserData(anonData, snap.val())                  
                }
            }, {
                onlyOnce: true
            })
            
            // Save the concatenated data in the main account
            //set(ref(database, "coursesApp/userData/"+userID), concatUserData)

            // Clear the anon ID so this transfer only happens once
            state.anonID = null
            // window.setItem("anonID", null)

        },
        unEnrollUserInCourses2(state, action){
            if(!action.payload || !action.payload.userID || !Array.isArray(action.payload.courseIDArray)) {
                //console.log("Error: enrollUserInCourses: missing data")
                return
            }
            // For each course ID in the array
            action.payload.courseIDArray.forEach(courseID => {
                // Update the enrolled state to true
                update(ref(database, "coursesApp/userData/"+action.payload.userID+"/courses/"+courseID), {enrolled: false, savedCourseData: false})

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
            set(ref(database, "coursesApp/userData/"+(action.payload?.userID || state.userID)+"/courses"), null)

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
        saveUserEvent(state, action){
            if(!(action?.payload?.userID || state.userID)){
                //  // console.log("saveUserEvent with no userID")
                return
            }

            // Create and modify data
            let date = new Date()
            let datestring = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()
            let timeString = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
            let tempEventData = {...action.payload.eventData}
            tempEventData.time = timeString
            if(!tempEventData.userID)
                tempEventData.userID = state.userID
            
            tempEventData = removeUndefined(tempEventData)

            // Save in global user events (unless specified not to)
            if(!action.payload.saveOnlyInUserData){
                let globalEventsRef =  ref(database, 'coursesApp/userEvents/'+datestring)
                let userEventsRef = push(globalEventsRef)
                set(userEventsRef, tempEventData)
            }

            // Save in user data events
            let userEventsRef = ref(database, 'coursesApp/userData/'+(action?.payload?.userID || state.userID)+'/events/'+datestring)
            let userDataEventsRef = push(userEventsRef)
            set(userDataEventsRef, tempEventData)

        },
        // #endregion user data

        // #region selections
        // The selections actions select items such as chapters, sections, and elements based on their ID
        
        selectCourse(state, action) {  
            state.selectedCourseID = action.payload;
            //  // console.log(state.coursesData)          
            // if(state.coursesArray.find(course => course.id))
            //     // Set the selected course ID
            //     state.selectedCourseID = action.payload;
            // else
            //  // console.log(action.payload + " is not a valid course ID")

        },
        selectChapter(state, action) {
            state.selectedChapterID = action.payload;

        },
        selectSection(state, action) {

            state.selectedSectionID = action.payload;
            //state.responsePath = "responses/"+state.selectedCourseID+"/"+state.selectedChapterID+"/"+state.selectedSectionID

        },
        selectElement(state, action) {
            state.selectedElementID = action.payload;
            // This is used to get user resopnse data
            state.responsePath = "responses/"+state.selectedCourseID+"/"+state.selectedChapterID+"/"+state.selectedSectionID

        },
        // Selects the first incomplete section in the course, or the first incomplete section in the specified chapter, or the last section, or the first section in the chapter
        selectFirst(state, action) {
            //  // console.log("selecting first")
            // If there is no section Array this function will not work so return
            if(!state.sectionArray || state.sectionArray.length == 0){
                //  // console.log("no section array")
                return
            }
            
            // If there are no sections complete
            let firstSection = null
            // If all sections are complete
            let lastSection = null
            // If there is no chapter specified and this is found it will be selected
            let firstIncompleteSection = null
            // If there is no incomplete sections in the chapter this one will be selected
            let firstSectionInChapter = null
            // If there is a chapter specified and an incomplete (and valid) section is found it will be selected
            let firstIncompleteSectionInChapter = null
            // Counter            
            let indexCounter = 0
            // Find all of the above things
            state.sectionArray.forEach(section => {

                // The first section in the course
                if(!firstSection){
                    firstSection = section
                }

                // The first incomplete section in the course
                if(!section.complete && !firstIncompleteSection){                    
                     // console.log(section.name+" complete: ")
                     // console.log(section.complete)
                    firstIncompleteSection = section
                }

                // If there is a chapterID specified
                if(action?.payload?.chapterID && section.chapterID === action.payload.chapterID){
                    // The first section in the chapter
                    if(!firstSectionInChapter){
                        firstSectionInChapter = section  
                    }
                    // The first incomplere section in the chapter
                    if(!section.complete && !firstIncompleteSectionInChapter){
                        firstIncompleteSectionInChapter = section        
                    }
                }

                // The last section in the course
                if(indexCounter == state.sectionArray.length-1){
                    lastSection = section
                }
                
                indexCounter++ 
            })

            // Chose which one is to be selected
            let sectionToSelect = null

            // If there is a chapter specified
            if(action?.payload?.chapterID){
                // If the chapter has an incomplete section
                if(firstIncompleteSectionInChapter)
                    sectionToSelect = firstIncompleteSectionInChapter
                else
                    sectionToSelect = firstSectionInChapter
            }
            else{
                // If the course has an incomplete section
                if(firstIncompleteSection){                    
                    sectionToSelect = firstIncompleteSection
                }
                else{
                    sectionToSelect = lastSection
                }
            }

            //  // console.log("sectionToSelect")
            //  // console.log(sectionToSelect.name)            

            // Make sure its valid
            if(validSectionSelection(state.sectionArray, sectionToSelect?.id)){
                state.selectedSectionID = sectionToSelect?.id
                state.selectedChapterID = sectionToSelect?.chapterID
            }else{
                //  // console.log(sectionToSelect?.id+" is not a valid section to select")
            }                 
        },
        selectSectionIfValid(state, action) {
            //  console.log("selecting section if valid"+action.payload.sectionID)

            // If there is a section specified and it is valid select it
            if(action?.payload?.sectionID){
                if(validSectionSelection(state.sectionArray, action.payload.sectionID)){
                    state.selectedSectionID = action.payload.sectionID
                    state.selectedChapterID = action.payload.chapterID
                }else{
                    //  console.log(action.payload.sectionID+" is not a valid section to select")
                }
            }

            // Look through the sections to see if the ID of the section is valid to be selected
            let prevSectionComplete = false
            let selectedSection = false
            state.sectionArray.forEach(section => {
                // If the section is the one that was passed in
                if(section.id === action.payload?.sectionID){                                    
                    // If the section is complete or the section before it is complete select that section and chapter 
                    if(validSectionSelection(state.sectionArray, section.id)){
                        state.selectedSectionID = section.id
                        state.selectedChapterID = section.chapterID
                        selectedSection = true
                    }
                }
                
                // Set the flag variable based on if this section is complete so the next itteration will know if the previous section was complete
                if (section.complete){
                    prevSectionComplete = true
                }else{
                    prevSectionComplete = false
                }
            })

            // Logging
            // if(selectedSection){
            //     //  // console.log("selected "+action.payload.id)
            // }else{
            //     //  // console.log("section "+action.payload.sectionID+" is not valid to be selected")
            // }
                        
        },
        selectChapterIfValid(state, action) {            
            if(!action?.payload?.chapterID)
                return
                
            // If there is no section Array this function will not work so return
            if(!state.sectionArray){
                //  // console.log("no section array")
                return
            }
                 
            let firstSectionInChapter = null
            let firstIncompleteSectionInChapter = null
            state.sectionArray.forEach(section => {                
                // The first section in the chapter
                if(!firstSectionInChapter)
                    firstSectionInChapter = section

                // The first incomplete section in the chapter
                if(section.chapterID === action.payload.chapterID){
                    if(!section.complete && !firstIncompleteSectionInChapter){
                        firstIncompleteSectionInChapter = section                    
                    }            
                }
            })
            
            // Chose which one is to be selected
            let sectionToSelect = null

            // If there is no incomplete sections in the chapter select the first one
            if(!firstIncompleteSectionInChapter)
                sectionToSelect = firstSectionInChapter
            // If there are incomplete sections select the first incomplete one
            else
                sectionToSelect = firstIncompleteSectionInChapter

            // Make sure its valid
            if(validSectionSelection(state.sectionArray, sectionToSelect?.id)){
                state.selectedSectionID = sectionToSelect?.id
                state.selectedChapterID = sectionToSelect?.chapterID
            }else{
                //  // console.log(sectionToSelect?.id+" is not a valid section to select")
            }   
           
        },
        setSectionArray(state, action){
            state.sectionArray = action.payload
        },
        selectNextSection(state, action) {
            if(!state.sectionArray || typeof state.sectionArray != "object" || state.sectionArray.length == 0)   
                return

            let foundCurrentSection = false
            let selectedNext = false
            let firstIncomplete = null
            state.sectionArray.forEach(section => {                                

                // Save the first incomplete section in case it is needed later
                if(!section.complete && !firstIncomplete)
                    firstIncomplete = section

                // Only select one next section
                if(selectedNext)
                    return

                // If the previous section is the selected one select this one (the next one)
                if(foundCurrentSection){
                    state.selectedSectionID = section.id
                    state.selectedChapterID = section.chapterID
                    selectedNext = true
                }

                // If this is the selected section set the flag
                if(section.id === state.selectedSectionID)
                    foundCurrentSection = true
                else        
                    foundCurrentSection = false
                
            })    
            
            // If there was no next section selected select first incomplete section, if no incomplete sections set course to complere
            if(!selectedNext){
                // If there is an incomplete section select that
                if(firstIncomplete){
                    state.selectedSectionID = firstIncomplete.id
                    state.selectedChapterID = firstIncomplete.chapterID
                }
                // If there is no next section and no incomplete sections set the course to complete
                else{
                    update(ref(database, "coursesApp/userData/"+state.userID+"/courses/"+state.selectedCourseID), {complete: true})
                }
            }
        },
        selectPreviousSection(state, action) {
            
            if(!state.sectionArray)   
                return

            let previousSection = null
            let foundPreviousSection = false
            state.sectionArray.forEach(section => {                                                

                // Only select one previous section
                if(foundPreviousSection)
                    return

                // If this is the selected section select the previous section
                if(section.id === state.selectedSectionID && previousSection){
                    state.selectedSectionID = previousSection.id
                    state.selectedChapterID = previousSection.chapterID
                    foundPreviousSection = true
                }
                
                // Save this section in case the next one is the currently selected one
                previousSection = section

            })     

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
                //  // console.log("copyCourse: no course found with id " + action.payload)
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
                    //  // console.log("No data available");
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
                    if(value?.items)
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
        addSection2(state, action){
            // Currently not in use
            if(!action.payload || !action.payload.chapterID) return

            // Calculate the new number of sections

            let numberOfSections = state.sectionArray.length

            // let chapters = state.courseData.items                      
            // if(chapters && typeof chapters === "object"){
            //     let totalSections = 0                
            //     Object.entries(chapters).forEach(([key, value]) => {
            //         if(value?.items)
            //             totalSections += Object.entries(value?.items).length
            //     })    
    
            //     // Save the new number of sections in the db
            //     update(ref(database, 'coursesApp/coursesMetaData/'+state.selectedCourseID), {totalSections: totalSections+1})
            // }

            // If there are no chapters or sections yet there will now be one section
            // else{
            //     // Save the new number of sections in the db
            //     update(ref(database, 'coursesApp/coursesMetaData/'+state.selectedCourseID), {totalSections: 1})
            // }

            // Get a ref to the places the new course data will be stored
            var newDbLocationRef = push(ref(database, 'coursesApp/coursesData/'+state.selectedCourseID+'/items/'+action.payload.chapterID+'/items'))
            
            // Create an object to represent the new section
            var newItem = {...defaultSection}

            // Set the index and name of the new section
            newItem.index = state.sectionArray.length
            newItem.name = newItem.name + " "+state.sectionArray.length

            // Add an id field for easy access
            newItem.id = newDbLocationRef.key

            // If there is an index in the payload, add it to the new element
            // if(action.payload.index){
                // newItem.index = sectionArray.length
                // newItem.name = newItem.name + " "+sectionArray.length
            // }

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
                //  // console.log("Dropped onto itself")
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

        // updates data on or deletes the specified item (course, chapter, section, or element)
        updateItemInfo(state, action) { 
            if(!action.payload.chapterID){
                //  // console.log("updateItemInfo: missing payload chapterID")
                return
            }
            if(action.payload.value == undefined || action.payload.value == null){
                //  // console.log("updateItemInfo: missing payload value", action.payload.value)
                return
            }
            if(typeof(action.payload.value) === "string" && action.payload.value.replaceAll(" ", "") === ""){
                //  // console.log("updateItemInfo: payload value empty string", action.payload.value)
                
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
        // Increment a global counter to be displayed in timers that are shown in multiple places
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
export const {pushToUserSectionData2, toggleLanguage, toggleTheme, enrollUserInCourses, enrollUserInCourses2, enrollUserInCourseAnon, unEnrollUserInCourses2, clearEnrolledCourses, clearAllCourseData, setUserID, setAnonID, setUserData, saveUserSectionData, saveUserAccountData} = dbslice.actions;
// New User Data actions
export const {
    saveUserCourseData,
    saveUserChapterData,
    saveUserSectionData2,
    saveUserResponse,
    clearAllUserData,
    incrementUserSectionTime,
    saveUserEvent,
    transferAnonData,
    clearUserData,
} = dbslice.actions;
// Selection actions
export const {setSectionArray, selectCourse, selectChapter, selectSection, selectElement, selectNextSection, selectPreviousSection, selectSectionIfValid, selectChapterIfValid} = dbslice.actions;
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
