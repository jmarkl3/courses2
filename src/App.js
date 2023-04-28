import './App.css';
import "./Styles/Themes.css"
import LandingPage from './Components/Pages/LandingPage';
import AuthMenu from './Components/Auth/AuthMenu';
import { useDispatch, useSelector } from 'react-redux';
import CheckOutPage from './Components/Checkout/CheckOutPage';
import { HashRouter, Route, Routes, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database, setCourseData, setCoursesData, setUserData, setUserID } from './App/DbSlice';
import Dashboard from './Components/Content/Dashboards/Dashboard';
import { onValue, ref } from 'firebase/database';
import { setLoading } from './App/AppSlice';
import Course from './Components/Content/Course/Course';
import About from './Components/Pages/About';

/*  
    
  dashboards
  show user course progress in cart course component
  user information
  styling like the example site

  only enroll user in a course if they are not already enrolled
  filter available courses for ones the user is not enrolled in

  cart course more info button

  Style changes
  admin dash new course button same shape and size as cart course component
  checkoutInputThird and Half style changes on screen resize 
  show password checkbox on right
  flexbox for checkout options space between
  admin cart course price can move to the left so the hamburger menu can be on the right
  mobile view

  when there is an admin user signed in they can go to the edit courses page
  this will show all of the courses that they have created
  when there is a non admin user signed in they can go 
    their dashboard
    a course they are signed up for

  need to user router
  if user is in checkout and clicks back it leaves the page
  also need to be able to link to a course from the landing page

  need a place to set the course image, price, extended description
  pull for the actual courses to show in the landing page
  connection from landing page to course

  landing page
  this is a good one:
  https://parentingafterdivorce.org/
  :
  other examples
  https://www.onlineparentingprograms.com/support/how-it-works.html
  https://co.onlineparentingprograms.com/district-18-coparenting-programs.html
  https://healthychildrenofdivorce.com/
  https://www.courtparentclass.com/
  https://www.factcolorado.com/

  sign up page
    user signs up for course

  account page
    current classes with completion data
    themes

  multi language support

  user search
  user reports

  auth
    forgot password button


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
  const userID = useSelector(state => state.dbslice.userID)
  const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
  const dispatcher = useDispatch()   
  const { courseID } = useParams();

  // Calls authListener which sets the user id in state on auth state change
  // Also loads the courses meta data
  useEffect(() => {   
    authListener()
    loadCoursesData()

  }, [])

    // when the userID changes load there data
    useEffect(() => {   
      loadUserData()
    }, [userID])
  
    // Load the data for the selected course
    useEffect(() => {   
      loadCourseData(selectedCourseID)
    }, [selectedCourseID])
  

    // Listen for auth state changes and puts userID in state
    function authListener(){
      onAuthStateChanged(auth, (user) => {
        dispatcher(setUserID(user?.uid))
        if(!user) 
          dispatcher(setUserData(null))
      })
    }

    // Loads the meta data so all of the course tiles can be displayed
    function loadCoursesData(){
      onValue(ref(database, 'coursesApp/coursesMetaData'), (snapshot) => {
        const data = snapshot.val();      
        setTimeout(() => {
          dispatcher(setCoursesData(data))
        }, 250)
      })    
    }
 
    // Loads the user data in to state
    function loadUserData(){
      if(!userID) return
      onValue(ref(database, 'coursesApp/userData/'+userID), (snapshot) => {
        const data = snapshot.val();   
        setTimeout(() => {
          dispatcher(setUserData(data))
        }, 250)
      })    
    }

    // Loads data for the selected course
    function loadCourseData(courseID){
      if(!courseID || courseID === "") return
      onValue(ref(database, 'coursesApp/coursesData/'+courseID), (snapshot) => {
        const data = snapshot.val();   
        setTimeout(() => {
          dispatcher(setCourseData(data))
          dispatcher(setLoading(false))

        }, 250)
      })    
    }

  return (
    <>      
      <HashRouter>
        <Routes>
          <Route path='/' Component={LandingPage}></Route>
          <Route path='/About' Component={About}></Route>
          <Route path='/Checkout' Component={CheckOutPage}></Route>
          <Route path='/Dashboard' Component={Dashboard}></Route>
          <Route path='/Course' Component={Course}></Route>
          <Route path='/Course/:courseID' Component={Course}></Route>
        </Routes>
        <AuthMenu></AuthMenu>
      </HashRouter>
    </>
  );
}

export default App;
