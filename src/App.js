import './App.css';
import "./Styles/Themes.css"
import LandingPage from './Components/LandingPage/LandingPage';
import AuthMenu from './Components/Menus/Auth/AuthMenu';
import { useDispatch, useSelector } from 'react-redux';
import CheckOutPage from './Components/Content/Checkout/CheckOutPage';
import { HashRouter, Route, Routes} from 'react-router-dom';
import { useEffect } from 'react';
import {database, setCourseData, setCoursesData, setSelectedSetData, setSelectedSetID, setSets, setUserData, setUserID } from './App/DbSlice';
import Dashboard from './Components/Content/Dashboards/Dashboard';
import { onValue, ref, set, update } from 'firebase/database';
import { setLoading } from './App/AppSlice';
import Course from './Components/Content/Course/Course';
import About from './Components/LandingPage/About';
import Cart from './Components/Menus/Cart/Cart';
import Support from './Components/Menus/Support/Support';
import SetsDash from './Components/Sets/SetsDash';
import LandingPageSet from './Components/LandingPage/LandingPageSet';
import LandingPage2 from './Components/LandingPage/LandingPage2';



// TODO
/*      
================================================================================
2023-8-22


create sets page
   load sets in App.js and put them in state
     can use sample data initially, or put that sample data in the db under sets/
   show them on this page
create and view sets
  create a new set in the db that is loaded in App.js and displayed in sets page
  can click button on the set and it sets url to show /set/setID
    all of the regular functionality will work there but this will be implemented later
edit set
  can click detail view that will show info about the set
  all the data values in the object showin in App.js can be edited with an edit popup menu
  prebiew is also shown here with ability to edit landing page

then create sets/setID/ for landing page
and other functionality from there
===============

course set page
create a set of courses that go together
user can view all sets of courses that they have access to (created or are admins for) 

a home page creator
image, upload or url
formatable text for home page

url that has app route to that homepage
might be slower than a static page though

can select from users to set types of admins

admin charts for all of the sets a user owns combined

route /sets brings to the sets admin page
they are stored as the metadata for the set and display as cards
user can create new onees or edit existing
there is a edit homepage option that brings up an overlay 
  allows image upload or url paste
  text editor
  prebiew of all of it
  saves automatically
go to course button on the card
brings user to the course via a route using the setID instead of the url in case the url is not set up
from there can get to all of the app pages such as dashboard, home, etc
same as if there was a custom url/dashboard = localhost/set/setID/dashboard

can save set data in local storage for faster loading when user returns

================================================================================
2023-7-2
________________________________________________________________________________
  Currently working on:

  testing:            
  full walkthgough of the app
  create a course, go through it, create an account, checkout, complete the course, view and email the report and certificate, view the dashboard, view the admin dashboard

  create a production course  

  bugs:     
  if user refreshes course it does not go to the furthest section, if they go there from the landing page it does though
  if user has same course open in multiple tabs is counts time multiple times per second

  additional features:
  language translation
  ckeditor 4 text align center button
  auto generate and email course report with cert to admin email
  user created courses 
  same app on different domains with different landing pages and course lists
  moblie styling
  others listed below  

  ________________________________________________________________________________
  Done:

    bugs:
    DONE
    course says view certificate (in user dash cart course) even when it is not complete   
    updated cart course completion status function
    DONE
    the remaining time state was only being calculated if there was required time, now it calculates either way
    time component not working properly
      was saying still time on section w no time when being on next section then back to prev w no time  
    DONE
    first section was not selectable
    updated function that determines if a section selection is valid so the first section in a course is always valid
    DONE 
    it was the firebase rules
    ladnding page does not show available and enrolled courses for anon user
    DONE
    when refreshing course it does not go to the furthest section
    DONE
    course went right to cert when course was not complete

    DONE
    card element

    userData input fields:
    DONE
    option to create that field in the elementEditBlock
    DONE
    user can specify the key that will correspond to the userData.accountData key
    DONE
    the intput field is displayed
    DONE
    the default value of the input field corresponds to userData.accountData[key]
    if there is a value it may not be editable depending on the key (email should not be editable)
    DONE
    the value saves into userData.accountData[key]

    Timer component
    DONE
    put in new place in the db
    DONE
    retrieve from new place in the db in timer component

    DONE
    when section row is selected in edit mode the wrong data appears

    DONE
    when a chapter is not selected the section completion status is not showing

  ================================================================================

  courses 3
  main page with the ourse tiles 
  the tiles will only have a view button
  when user clicks view it opens the course
  there is a title then a description saying anything they do WILL  be saved as progress towars completion of the course
  and at a point in the course they will be given an opportuinty to enter details
  and that their responses are saved initially in the browser so if they retrurn they should use the same browser on the same device and not to clear their local cache
  initial section will be a very short video with fun questions
  and it will give positive feedback on each question and maybe gamify it somehow or have fun positive feedback animations
  when user returns the course will be moved into the my courses section on the landing page with a continue button
  when they enter details in the input fields it will save into the user data under the key associated with that input field and repopulate if they get to the same page in another course
  webcam module will be one of these and will not show before the details page, they will have the option to put a profile picture there via the webcam
  maybe save their payment info (with a secure 3rd party)

  put cheap or affordable or something similar in the name of the company and have competitive prices
  Affordable Parenting Courses
  options for a payment amount
  another payment amount (more) on credit
  and the option to repay in another way
  can have an in person component to certain courses. When a user completes an online component they become eligable to enroll in the in person part
  have the video and instructions then responses or challenge assignments
  make it so if they already know the material they can just do the assigmnemt without having to go through the instruction parts
  maybe a scroller section with random interesting reddit posts and in that there are randomly posts with challenges that give them points

  maybe a social feature to make it more engageing and/or gamify it
  progres chart over a timespan
  points form completing questions and floating fading emojis when response is saved
  occasional randomity in getting more points like a slot machine
  quote bar with cycling positive quotes that are most likely to get them to keep going in the course
  if they get a certain number of points they get a discout so they care about the points
  maybe they aren't charged until the end except a confirmation amount (don't need confirmation amount, just charge at end)
  the initial amount they pay is only a very small amount and the rest is carged at the end, tell them this at the payment section

  multiple websites pointing to the same app but with different images and default landing page courses or other content based on which domain they are on
  and an option to search all courses that will show all of them
  and a button to show all of their courses including the ones from other domains

  payment page is not til the end and factors in points for some courses
  points are explaned in the frist page in the course
  points are awarded with a slot machine scrolling window on completion of a section and there is an excedingly unlikley option for the whole course to be free
  option to enable points so the user is interacting and choosing it
  maybe an info modal window describing it and showing the points scroller with the whole course free option showing noticibly in the description animation/video
  maybe this even just shows in the main course first section so they always see that the course might be free if they continue
    so the maximum number of people that get to this page choose this course site
  finish early option for some courses
    they pay an extra fee and can finish a few sections early (after they completed the required amount)
  payment description page for some coureses
  no payments needed until after the course is complete for some courses is one of the things listed in the landing page
  maybe put the points description in the landing page too in case they don't click view course
  and for the price put a range from free to the full cost with an info button that shows a modal reitterating the points system
  points system that could make teh course FREE as one of the top points in the landing page with an info modal button

  at payment page (either at end or part way through) timer with discount if they buy in the time window
  if part way say congrats you are 50% done. Pay within the next 10 minutes, recieve $5 off and complete the course

  
  auto generated things:
  users have the ability to create their own courses (this is what I went to type)
  maybe a chat bot for support
  maybe a chat bot for support that is a character that is a parent and the user is a child and they are talking to the parent about their problems 
  and the parent is giving them advice and support and the user is getting points for it and the parent is getting points for it and the parent is getting points for it

  no timers before the section where payment is required
  ability to create pay wall as a section so it can be created anywhere in the course 
  stuff before it shouldj be fun and easy
  and it will show the percent completion at the checkout page if its a lot, or some way to bring attention to the amount that was completed
  in first page of course it explains the pay part way through system, maybe gives an option to pay now

  this data will need to be saved with an anonymous account or locally
  then transferred when they create an account
  option to create account now to save progress and also option to pay now. They are nnot both required at the same time

  before this finish courses 2 (to a point that it is useable as it is, a minimum viable product)
  
  maybe view certificates button on the dashboard

  edit course button gives user the ability to set domains that point to the app
  and edit the landing page for each domain
  will be the standard layout but the background image, text, and available courses can be edited 
  landing page preview option or just show the landing page with edit icons on it
  any user can create courses if they have the correct account type
  main landing page will be for creating courses
  and there will be other projects pointing to the app that have different course types and landing pages

  users can generate courses
  saved under their userID
  they can edit them
  they can appoint types of admins

  DONE
  1) generate certificate as a pdf and save it in storage then save storage link in user data
     check this before generating a new certificate
  
  THIS CAN BE PUT OFF UNTIL LATER
  2) firebase rules protecting user data
     user data encryption (can add later)
     will need users that create a course to have ability to edit course data
     admins will also need ability to edit user data

  DONE (for now till account is upgraded)
  3) auto emails/texts
      DONE
      set up api
      DONE
      send email from the site 
      DONE
      send email to a user  
      DONE    
      send email when user signs up
      (this happens in the certificate component which only shows when user completes the course)
      send email when user completes a course to user and default addresses (if there has not already been one sent)
      PARTIALLY DONE, PAYWALL
      create and attach the certificate to that email
      save the certificate in storage in user data in link in user data, check this before generating or sending a duplicate
      
      Email JS
      https://www.emailjs.com/docs/examples/reactjs/
      https://medium.com/@patienceadajah/how-to-send-emails-from-a-react-application-without-a-backend-server-1dd8718ceedd 
      https://www.youtube.com/watch?v=bMq2riFCF90&t=274s

  4) description of each component and file at the top. spoken note describing the app flow
    revert to doing this if getting stuck at other points

  ?) To create the cartless flow:
    1) Create checkout element that will display as a section and allow the user to checkout and create an account if needed
    2) Save response data in db with the anonymous user ID saved in local storage
    3) When they create an account this data is reliable transferred to their new account
       make sure to mention this in the first page so they know to create an account or use the same browser until then
    4) when a course on the landing page is clicked it goes directly to the course

  5) auth doesn't work in all cases. If an account is logged in it is still trying to create an account in checkout and doesn't work 
  6) multiple domains to same app but with different landing pages (can host same code base under different projects to test this initially) 
  7) ggl translate
     paywall with personal card
    set up the account and translate using the api
    create a cache that saves the inputs and outputs of this in realtime database
    this can be checked before using the api and can also be saved in local storage if its small enough for instant translations (not important initially)
    translationCache:{
      firstsentenceAsKey: {
        randomKey: {
          full message: ""
          es: "",
          fr: "",
          ...
        },
        ...
      },
      ...
    }
  8) create a course
     copy from existing course
     add own research output and videos
  9) card system
  cors for generating reports with user images (can do later if that functionality is necessary)
  
  only send welcome email if not already sent (save something in user data showing it has already been sent)
  when cert is generated save it in storage and save link in user data
  send the cert in an email to 2 emails at the same time when user finishes course
  maybe put meta data at the bottom like completion date and course name
  sort out the double auth issue between account menu and checkout (can maybe do this when changing the checkout page)


  
    
  ggl
    DONE
    create and link new account for firebase
    
  IN PROGRESS
  multi language support  
    so add a language selector in the text elements and paste in the translated version. Will need to have this for any videos too
    this is working, need to update it everywehre text is displayed
      landing page, course edit, course display, course report, certificate, checkout page, support page, account page, dashboard, navbar, cart
    when a languae is selected first it looks in local cache for translation, then in the db, if not found uses the api
    then stores those translations in the db and local storage
    db is set up as the first part put together without spaces as a key then under that random keys with the various language parts 
    firstpartoftext: {
      randomKey: {
        en: "first part of text for full input",
        es: "(in spanish) first part of text for full input",
        ...
      },
      ...
    }
    when looking for text the first part is used to get this data structure then a function goes through it and gets the proper tranlation
    this data structure is in the db and a stringified json in local storage for the translations the user has seen already
    probably just in the db initially though as it will still be very fast and won't require much to pull it from the db

  set up firebase rules
    user read and write
    admin read and write
      firebase rules for admin
      basically coppying the user id of the admins and putting them in a function in the rules
      https://stackoverflow.com/questions/55951307/add-admin-privilege-to-firebase-rules  

  look into firebase cors for so the images can be used for the course report and certificate

  mess with firebase functions    

  email
    crete snedgrid with lm email
    or find another provider

  security (linked to above bc will need to login)
    set up firebase rules so only a user or an admin can update their own data    
    cors in storage

  Style
    checkoutInputThird and Half style changes on screen resize 
    mobile view
    check all pages and menus with different window sizes and in mobile view

  (on hold because of send grid)
  create with lm email
  email 
    got it working but it can only to the support email address, cant send to user, looking at other options
    this library (emailJS) looks good: 
    https://stackoverflow.com/questions/55795125/how-to-send-email-from-my-react-web-application
    

    sendgrid react (1)
    https://www.youtube.com/watch?v=jnTodzIlrE8

    sendgrid attachments 8:30 (2)
    https://www.youtube.com/watch?v=FFDGcroAJ4A

    fireship firebase functions twillio sendgrid (3)
    https://www.youtube.com/watch?v=vThujL5-fZQ

    smtpjs:
    https://www.youtube.com/watch?v=kWEDY0rjS30

    nodemailer 
    specifies to and attachment
    https://www.youtube.com/watch?v=eF8j-xujbJI

    auto email certificate to address based on user data and maybe another one based on selection    
    email when they sign up to give them a link to their dashboard and course info
    support page input sends an email to the support email address

  support page
    send email to support email address from SendGrid
    can log this as a user event
    maybe have a chat bot                                  


  dashboards       
    admin       
      user reports                     
        view / download certificate button if complete        
          maybe as a pdf instead of just an image with text overlayed over it, and can save that pdf in the user data 
          can do this after the cors setup is complete       
        webcam images in course report 
          maybe check on firebase cors settings to allow the images to be loaded, this is not super important though
          CORS error when trying to load webcam images          
          maybe download all the images into a folder as something that will accompany the course report
      ability for admin to manually set a users password and email in admin user menu 
        maybe not possible because it needs the user to be logged in and the user object
        firebase manage users https://firebase.google.com/docs/auth/web/manage-users  

  Course
    when user completes a course
    create a certificate with their name and course name
    email the certificate to the user and any other emails (use your own as a placeholder)    
    save the certificate in the user data

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
        
  Application usage flow:

    Normal User:
      user visits the url 
      user views landing page
        (maybe) user clicks more information on a course title
      user clicks view course, takes them to the course
        they make easy progress initally
      user progresses through course until payment page
      user pays on payment page
      user continues course until completion
      user downloads course certificate    

    Admin User:
      redirected to dashboard
      options:
        create a new course (and edit it)
        edit a course
        create a new set (and edit it)
        edit a set 
          landing page shows in window 
          ability to add courses there
          ability to create new course, creates it, adds it, and opens the editor 

  ________________________________________________________________________________

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


/*
================================================================================
|                                   App.js
================================================================================

    Loads courses meta data that is used to display available course tiles
    Loads user data
    Loads course data when a course is selected

    auth menu component is always available and displays based on global state
      auth menu listens for auth state change and sets userID even when its not displaying the menu
    support menu and cart menu are always available and also display based on a global state variable

    Router displays pages based on the url
    Pages are: landing, about (redirects to landing), checkout, dashboard, course, and course with a specified course ID

    Links:
    https://mail.google.com/mail/u/0/#inbox/FMfcgzGtvsRJsTJFPVLWRBPBsLvKGtdD
    https://cloud.google.com/translate
    https://dashboard.emailjs.com/admin/templates/4a8xxml/attachments
    https://www.emailjs.com/docs/examples/reactjs/
    https://console.firebase.google.com/project/courses-app-8efb5/storage/courses-app-8efb5.appspot.com/files
    https://code.visualstudio.com/docs/editor/userdefinedsnippets

*/
function App() {    
    const userID = useSelector(state => state.dbslice.userID)
    const theme = useSelector(state => state.dbslice.userData?.accountData?.theme)
    const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
    const dispatcher = useDispatch()   

    // Loads the courses meta data on start
    useEffect(() => {   
      loadSet()
      loadCoursesData()
      logDB()
    }, [])

    // When the userID changes loads there data
    useEffect(() => {   
      loadUserData()
    }, [userID])
  
    // Loads the data for the selected course when a course is selected
    useEffect(() => {   
      loadCourseData(selectedCourseID)
    }, [selectedCourseID])

    function loadSet(){
      // Load predefined urls, couls also load all homepage data and scan through it so not waiting for 2 requests
      // Load this data into state along with the setID that is found in this function
      // const setTemplate = {
      //   // Id comes from the key and is inserted when the json in converted to an arrray
      //   name: "Test Set",
      //   url: "url",
      //   owner: "userID",
      //   admins: ["userID", "userID"],
      //   landingPage: {
      //     bannerUrl: "http://localhost:3000/static/media/momAndChildBackground.71c13dcb3be4fb143c2b.jpg",
      //     topImgUrl: "url for top image",
      //     title: "Title",
      //     description: "Description of the courses set",
      //     content1: "The text that will show on the landing page before the courses",
      //     content2: "The text that will show on the landing page after the courses",
      //   }        
      // }
      
      // let set1 = {...setTemplate}
      // set1.url = "localhost"
      // set1.name = "Localhost Test Set"
      // set1.landingPage.title = "Localhost Set Title"
      // set1.landingPage.description = "This is the set description for the localhost set"
      
      // let set2 = {...setTemplate}
      // let set3 = {...setTemplate}
      // let set4 = {...setTemplate}

      // // Simulating getting it from the db
      // const setData = {
      //   setID1: set1,
      //   setID2: set2,
      //   setID3: set3, 
      //   setID4: set4,
      // }

      // Put the initial data in the database
      // update(ref(database, "coursesApp/sets/"), setData)

      // Load the data from the database
      onValue(ref(database, "coursesApp/sets"), snap => {
        let setData = snap.val()
        console.log("loaded set data from database:")
        // console.log(snap.val())       
        
        setTimeout(() => {
          dispatcher(setSets(snap.val()))
        }, 250)
        // Put all of the set dat in the store
        

        // Compare the url to the predefined urls
        const currentUrl = window.location.href

        let selectedSetID = null
        let firstSetID = null        
        // Save the data for the selected set to be displayed (based on the url)
        Object.entries(setData).forEach(setData => {
          // Get the first one as a default
          if(!firstSetID)
            firstSetID = setData[0]

          // Maybe organize the sets by length first so the longer ones are checked first
          console.log("looking at setDataUrl: " + setData[1]?.url)

          // If the url matches the url that this set object is for save it
          if(!selectedSetID && currentUrl.includes(setData[1]?.url)){
            console.log("matched")
            selectedSetID = setData[0]
          }
          
        })

        // If none was found use the first one as a default
        if(!selectedSetID){
          selectedSetID = firstSetID
        }

        // If there is a valid set data object save it to the store to be displayed
        if(selectedSetID)
          setTimeout(() => {          
            dispatcher(setSelectedSetID(selectedSetID))
          }, 250)
      })
    }

    // Loads the meta data so all of the course tiles can be displayed
    function loadCoursesData(){      
      onValue(ref(database, 'coursesApp/coursesMetaData'), (snapshot) => {
        const data = snapshot.val();   
        if(!data) return
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
      console.log("logging entire db: ")
      onValue(ref(database, 'coursesApp'), (snapshot) => {
        console.log("Entire DB:")
        console.log(snapshot.val())

      })
    }

  return (
    <div className={theme}>      
      <HashRouter>
        <Routes>
          <Route path='/' Component={LandingPage2}></Route>
          {/* <Route path='/landing' Component={LandingPage}></Route> */}
          <Route path='/Sets' Component={SetsDash}></Route>
          <Route path=' ' Component={LandingPageSet}></Route>
          <Route path='/About' Component={About}></Route>
          {/* <Route path='/Checkout' Component={CheckOutPage}></Route> */}
          <Route path='/Dashboard' Component={Dashboard}></Route>
          <Route path='/Course' Component={Course}></Route>
          <Route path='/Course/:courseID' Component={Course}></Route>
          <Route path=':default' Component={LandingPage2}></Route>
          {/* default lost page */}
        </Routes>
        <AuthMenu></AuthMenu>
        <Support></Support>
        <Cart></Cart>
      </HashRouter>
    </div>
  );
}

export default App;
