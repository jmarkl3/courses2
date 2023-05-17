import './App.css';
import "./Styles/Themes.css"
import LandingPage from './Components/LandingPage/LandingPage';
import AuthMenu from './Components/Menus/Auth/AuthMenu';
import { useDispatch, useSelector } from 'react-redux';
import CheckOutPage from './Components/Content/Checkout/CheckOutPage';
import { HashRouter, Route, Routes} from 'react-router-dom';
import { useEffect } from 'react';
import {database, setCourseData, setCoursesData, setUserData, setUserID } from './App/DbSlice';
import Dashboard from './Components/Content/Dashboards/Dashboard';
import { onValue, ref } from 'firebase/database';
import { setLoading, setViewAsAdmin } from './App/AppSlice';
import Course from './Components/Content/Course/Course';
import About from './Components/LandingPage/About';
import Cart from './Components/Menus/Cart/Cart';
import Support from './Components/Menus/Support/Support';

// TODO
/*      

  account amounts
  call co court
    update address
    link account to case
  vall seal lw    
  bp for med
  pay med
  talk to hml ppl          

  Course Report
    showing undefined for chapter and section in chapters and sections after the first one

  dashboards       
    admin       
      user reports                     
        view / download certificate button if complete        
          maybe as a pdf instead of just an image with text overlayed over it, and can save that pdf in the user data        
        webcam images in course report 
          maybe check on firebase cors settings to allow the images to be loaded, this is not super important though
          CORS error when trying to load webcam images          
          maybe download all the images into a folder as something that will accompany the course report
      ability for admin to manually set a users password and email in admin user menu 
        maybe not possible because it needs the user to be logged in and the user object
      firebase manage users https://firebase.google.com/docs/auth/web/manage-users   

  email 
    this library (emailJS) looks good: https://stackoverflow.com/questions/55795125/how-to-send-email-from-my-react-web-application
    auto email certificate to address based on user data and maybe another one based on selection    
    email when they sign up to give them a link to their dashboard and course info
    support page input sends an email to the support email address

  support page
    send email to support email address, show confirmation message after it sends
    can log this as a user event
    maybe have a chat bot

  multi language support
      need ggl key
      this looks cool https://www.npmjs.com/package/react-auto-translate
      on landing page add hard coded text that changes based on language
      in course edit have inputs for multiple languages, or could have an auto translate feaure                                    

  security
    firebase rules so only a user can update their own data
    or an admin

  Style
    checkoutInputThird and Half style changes on screen resize 
    mobile view
    check all pages and menus with different window sizes and in mobile view

  ________________________________________________________________________________
  After dev work is done

  Support page
  update supoort page info
  
  Landing page
  title, description, about, quote
  maybe random background images 

  Courses
  create courses

  Navbar
  the logo in the middle of the page
  the phone number in the top left

  ________________________________________________________________________________
  Bugs

  If use has multiple browser tabs in different windows the TimeDisplay2 timer double counts

  the course is showing view certificate even though the course is not complete

  time component resets sometimes
  cart items go to available after user enrolls (only shows in admin view)
    cart component could use some cleanup

  test the app in different browsers doing different things in different ways
  maybe get someone else to test it too

*/
// DB Structure
/* 

  coursesApp: {

    courses: {unused},

    coursesMetaData: {
      courseID: {
        id: string, (this should not be here, and on coppy it will be inaccurate)
        description: string,       
        descriptionLong: string,
        image: url sttring,
        name: string
        price: string,
      },
      ...
    },

    coursesData: {
      courseID: {
        id: string, (this should not be here),
        also don't need the name, description, etc
        webcam: true/false (add this)
        items: {
          chapterID: {
            id: string, (should not be in there)
            name: string,
            index: number,
            items: {
              sectionID: {
                id: string, (should not be in there)
                name: string,
                index: number,
                requiredTime: 10000 (optional parameter, showing as a string, should be a number),
                webcam: true/false (add this, optional parameter, if not present should default to course setting),
                webcamTimes: [10000] (add this, optional parameter, array of numbers that override the default webcam times),
                items: {
                  elementID: {
                    id: string, (should not be in there)
                    name: string,
                    index: number,
                    type: string,
                    content: string,
                    ...other properties based on type
                  },
                  ...elements
                }
              },
              ...sections
            },
          },
          ...chapters
        }
      }
    },

    userData: {
      userID: {      
        accountData: {
          (need to update these four)
          fullAdmin: true/false, (optional, gives ability to view and edit user data and reports, edit user data, edit all courses, view charts)
          courseAdmin: [courseIDs], (optional, gives ability to edit courses in the array, or all if set to all)
          userAdmin: true/false, (optional, gives ability to view and edit user data and reports)
          previewMode: true/false, (optional, ability to go through courses without completing sections)          
          theme: string, (optional)
          language: string, (optional)
          data from input fields such as name, email, etc (created in checkout page)
        },
        The way it maybe should be structures
        courses: {
          courseID: {
            enrolled: true/false,
            complete: true/false,
            certificate: url string,
            chapterData: {
              chapterID: {
                complete: true/false,
                sectionData: {
                  sectionID: {
                    complete: true/false,
                    completionTime: number,
                    webcamImages: [url strings],
                    responseData: {
                      elementID: {
                        response: string,
                        elementData: {element data including the correct answer if there is one}
                      },
                      ...elements
                    }
                  },
                  ...sections
                }
              }
            }
            
          },
          ...courses
        }
      }
    },

  }


*/
// Misc Notes
/*
  ________________________________________________________________________________
  Misc notes
        
  ability to show only a portion of the content in a section at a time with a continue button to show the next part
  so the user only has a small amount of data at a time and it is easier to digest

  ability to embed webgl games
  could possibly just host it somewhere else and embed it in an iframe

  other ct courses
  ins
  reale
  code

  ability for user to updload a file

  account creation data
  last active date set when user logs in
  users in admin dash are sorted by last active date

  when course opens it goes the the last section the user has not completed

  when clicking a section in the left menu
    from the section row calls selectSectionIfValid which is in dbslice
      selectSectionIfValid looks in user data to see if the section is complete, this needs to be updated
      also the location where it is saving the completion data needs to be updated

  can have multiple custom domanes that point to this app
  based on the domain it can display different images and courses
  there will be a main on that shows all courses
  and the coparenting thing, maybe a dev one, and others if they come up

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

________________________________________________________________________________
  For CRM app:
  
  security

  // load the first 2 buckets so between 10 and 20 log entries are loaded
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
    const theme = useSelector(state => state.dbslice.userData?.accountData?.theme)
    const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
    const changedViewAdmin = useSelector(state => state.appslice.changedViewAdmin)
    const dispatcher = useDispatch()   

    // Loads the courses meta data on start
    useEffect(() => {   
      loadCoursesData()
      //logDB()
    }, [])

    // When the userID changes loads there data
    useEffect(() => {   
      loadUserData()
    }, [userID])
  
    // Loads the data for the selected course when a course is selected
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
          // // If the user is an admin default the view to admin          
          // if(data?.accountData?.isAdmin && !changedViewAdmin)
          //   dispatcher(setViewAsAdmin(true))            

        }, 250)
      })    
    }

    // Loads data for the selected course
    function loadCourseData(courseID){
      if(!courseID || courseID === "") return
      onValue(ref(database, 'coursesApp/coursesData/'+courseID), (snapshot) => {
        const data = snapshot.val();   
        // Ensure an accurate course ID
        data.id = snapshot.key   
        setTimeout(() => {
          dispatcher(setCourseData(data))
          dispatcher(setLoading(false))

        }, 250)
      })    
    }

    function logDB(){
      onValue(ref(database, 'coursesApp'), (snapshot) => {
        console.log("Entire DB:")
        console.log(snapshot.val())

      })
    }

  return (
    <div className={theme}>      
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
        <Support></Support>
        <Cart></Cart>
      </HashRouter>
    </div>
  );
}

export default App;
