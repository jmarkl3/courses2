import './App.css';
import "./Styles/Themes.css"
import LandingPage from './Components/Pages/LandingPage';
import AuthMenu from './Components/Auth/AuthMenu';
import { useDispatch, useSelector } from 'react-redux';
import CheckOutPage from './Components/Checkout/CheckOutPage';
import { HashRouter, Route, Routes} from 'react-router-dom';
import { useEffect } from 'react';
import {database, setCourseData, setCoursesData, setUserData, setUserID } from './App/DbSlice';
import Dashboard from './Components/Content/Dashboards/Dashboard';
import { onValue, ref } from 'firebase/database';
import { setLoading, setViewAsAdmin } from './App/AppSlice';
import Course from './Components/Content/Course/Course';
import About from './Components/Pages/About';
import Cart from './Components/Cart/Cart';

/*  
    
  support page
  cart course more info button

  view as admin button
  admin state stays but another variable is set to show the admin view
  edit rights are a seperate variable
  so there can be admins that cna just view the courses as an admin without the ability to edit

  dashboards
  show user course progress in cart course component
  user information
  styling like the example site

  
  time component 
  restes sometimes
  background color from theme. Currently its clear and the title in the sidemenu can overlap

  multi language support
    on landing page and other hard coded text locations
    in course edit have inputs for multiple languages  

  firebase rules so only a user can update their own data
  or an admin

  generate completion certificate
  
  email 
  auto email certificate to address based on user data
  their email and maybe another one based on selection
  email when they sign up to give them a link to their dashboard
  also for course signup information

  Style changes
  checkoutInputThird and Half style changes on screen resize 
  mobile view

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
  const changedViewAdmin = useSelector(state => state.appslice.changedViewAdmin)
  const dispatcher = useDispatch()   

  // Calls authListener which sets the user id in state on auth state change
  // Also loads the courses meta data
  useEffect(() => {   
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
          // If the user is an admin default the view to admin          
          if(data?.accountData?.isAdmin && !changedViewAdmin)
            dispatcher(setViewAsAdmin(true))            

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
        <Cart></Cart>
      </HashRouter>
    </>
  );
}

export default App;
