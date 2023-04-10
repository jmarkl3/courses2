import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { auth, database, setCourseData, setCoursesData, setUserData, setUserID } from './App/DbSlice';
import DisplayPage from './Components/Content/DisplayPage';
import Navbar from './Components/Navbar/Navbar';
import { onValue } from 'firebase/database';
import { ref } from 'firebase/database';
import "./Themes.css"
import AuthMenu from './Components/Auth/AuthMenu';
import { onAuthStateChanged } from 'firebase/auth';

/*  

  check user status before allowing selction of section in sidebar 
    can set completion status when user completes section
    get index of furthest completed, get index of destination, compare
    or could only let complete oned be clickable
      get userData and look to see if the user has completed the section, check that in on click
      maybe set a flag for the next one too
    
  message fade component
    use it where the save indicator is
    and the next section button message



  timed camera

  account page
    current classes
    themes

  multi language support

  user reports

*/
/*
  ________________________________________________________________________________
  Misc notes

  question parser
    paste question text from page and it will parse what is input into a multiple choice element

  video element display height width ratio css from other app

  when creating a new course there are some initial functinality that could be looked at

  multi select
    starts on long press
    put ID in array
    shows options at top
    cancel, delete all

  security
    firebase rules
    eliptical curve or rsa 
      user needs to log in multiple ways though
      maybe on first login saves private key to local storage

  on sectoin or chapter delete select the previous or next one
  function can look for previous, if no previous look for next

  themes in account page

  when the sceen is large enough that the sidebar wont cover any of the page when its centered center the page

  set the opacity of the the expand button to fade it until the mouse is over it
  same with edit button 
  only show edit button in preview mode
  and have a button for preview mode

  accounts page and other things open in a window over the screen so uesr feels like they save their place
  but pause the timer and resume it when the account page is closed

  admin dashboard with charts on it

  redux dev tools extension
  https://www.youtube.com/watch?v=BYpuigD01Ew
  custom action dispacher in browser
  https://github.com/zalmoxisus/redux-devtools-extension/commit/477e69d8649dfcdc9bf84dd45605dab7d9775c03

  react dev tools extension
  https://www.youtube.com/watch?v=rb1GWqCJid4

  Random things
  Polimer?
  https://www.youtube.com/watch?v=J4i0xJnQUzU
  copilot x (signed up)
  rokid max
  https://fsymbols.com/signs/triangle/


________________________________________________________________________________
  For CRM app:
  
  // load the forst 2 buckets so between 10 and 20 log entries are loaded
  // an array of log bucket refs will be kept in state and when they change the onValue will be called again in useEffect
  // when a new log item is added, check if the current bucket is full

  function pushLogEntry(logItem){
    runTransaction(baseUrl/log/top10, item => {
      if(item.count < 10){

        // push to item.current (the id of the current log bucket)
        newLogItemRef = push(ref(baseUrl/item.currentBucketID))
        set(newLogItemRef, logItem)

        // Increment the count
        item.count++
      }
      // If there are 10 itmes in the log bucket create a new one
      else{
        // push to log buckets to create a new log bucket
        newlogBucketRef
        
        // push to the new log bucket
        newLogItemInNewBucketRef

        // create an object to represent the initial value of the log bucket
        var logBucketInitialValue = {
      
          // put item.current in log bucket as next so it knows where to load from next when user wants to load more log items
          next: item.currentBucketID,

          // put the current log item in the log bucket as the first item
          newLogItemInNewBucketRef.key: logItem,

        }
      
        // Set the initial log bucket value
        set(newlogBucketRef, logBucketInitialValue)

        // The new bucket is now what will be pushed to
        item.currentBucketID = newLogBucketRef.key

        // Reset the counter
        item.count = 0

      }

    })

  }

  When pushing events to the db push to /YYYYMM/DD so only the ones that are needed are loaded
  when putting them into day objects /DD can be used for O(1) access
  this might work for log items too and then they will be able to be loaded as needed and put into day object to be viewed on the calendar
  could put tags on them that could be put on a chart

  can use recharts to show the data instead of the bars thing

  for notes there should be a search bar that searches titles and content

  and can look into retool for texting

*/

function App() {  
  const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
  const userID = useSelector(state => state.dbslice.userID)
  const editMode = useSelector(state => state.appslice.editMode)
  const previewMode = useSelector(state => state.appslice.previewMode)
  const dispatcher = useDispatch()

  // Load the meta data so all of the course tiles can be displayed
  useEffect(() => {   
    authListener()
    loadCoursesData()
  }, [])

  useEffect(() => {   
    loadUserData()
  }, [userID])

  // Load the data for the selected course
  useEffect(() => {   
    loadCourseData(selectedCourseID)
  }, [selectedCourseID])

  // Loads the meta data so all of the course tiles can be displayed
  function loadCoursesData(){
    onValue(ref(database, 'coursesApp/coursesMetaData'), (snapshot) => {
      const data = snapshot.val();      
      setTimeout(() => {
        dispatcher(setCoursesData(data))

      }, 250)

    })    

  }

  // Loads data for the selected course
  function loadCourseData(courseID){
    onValue(ref(database, 'coursesApp/coursesData/'+courseID), (snapshot) => {
      const data = snapshot.val();   
      setTimeout(() => {
        dispatcher(setCourseData(data))

      }, 250)

    })    

  }

  function authListener(){
    onAuthStateChanged(auth, (user) => {
      dispatcher(setUserID(user?.uid))

    })
  }

  function loadUserData(){
    if(!userID) return
    onValue(ref(database, 'coursesApp/userData/'+userID), (snapshot) => {
      const data = snapshot.val();   
      setTimeout(() => {
        dispatcher(setUserData(data))

      }, 250)

    })    

  }

  return (
    <div className="App">
      <Navbar></Navbar>
      <div className={(editMode && !previewMode) ? "darkTheme":""}>
        <DisplayPage></DisplayPage>
      </div>
      <AuthMenu></AuthMenu>
    </div>
  );
}

export default App;
