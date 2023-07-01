import React, { useEffect, useRef, useState } from 'react'
import "./Auth.css"
import { useDispatch, useSelector } from 'react-redux'
import { setShowAuthMenu, toggleShowAuthMenu} from '../../../App/AppSlice'
import "../../../Styles/Themes.css"
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateEmail } from 'firebase/auth'
import { auth, clearAllCourseData, clearAllUserData, clearEnrolledCourses, enrollUserInCourses, saveUserAccountData, saveUserEvent, setUserData, setUserID, toggleTheme } from '../../../App/DbSlice'
import { useNavigate } from 'react-router-dom'
import { languageConverter } from '../../../App/functions'
import emailjs from '@emailjs/browser'

/*
================================================================================
|                                 AuthMenu.js
================================================================================

When the global state variable showAuthMenu is true this component is rendered and the component is active even when this state is false

the rendered component contains 
when their is no user logged in:
email and password input for sign in and account creation
when there is a user logged in:
buttons to go to dashboard, log out, and other account actions

authListener function contains onAuthStateChanged and listens to see if there is a user signed in currently and also is triggered when a user signs in or out
this function saves the userID in state which triggers other actions like loading user data
when a user is signed in the component redirects the user to their dashboard

there are functions to sign in, sign up, and sign out users


*/

function AuthMenu() {
  const showAuthMenu = useSelector(state => state.appslice.showAuthMenu)
  const language = useSelector(state => state.dbslice?.language)
  const userData = useSelector(state => state.dbslice.userData)
  const fullAdmin = useSelector(state => state.dbslice.userData?.accountData?.fullAdmin)
  const theme = useSelector(state => state.dbslice.userData?.accountData?.theme)
  const userID = useSelector(state => state.dbslice.userID)
  const [createNew, setCreateNew] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [messageColor, setMessageColor] = useState("")
  const [updatingEmail, setUpdatingEmail] = useState("")
  const emailInput = useRef()
  const emailResetInput = useRef()
  const passInput = useRef()
  const dispatcher = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    authListener()    
  },[])
  
  function close(){
    setErrorMessage("")
    setMessageColor("")
    dispatcher(setShowAuthMenu(false))
  }

  function signIn(){
    var email = emailInput.current.value
    var pass = passInput.current.value

    signInWithEmailAndPassword(auth, email, pass).then( user =>{
      }).catch(err=>{
        setMessageColor("red")
        displayErrorMessage(err.message)
      })
  }
  function signUp(){
    var email = emailInput.current.value
    var pass = passInput.current.value
    
    createUserWithEmailAndPassword(auth, email, pass).then( user =>{
      
      if(!user) return
      
      sendEmail("", email)

      // Save their user ID in state
      dispatcher(setUserID(user.user.uid))
      
      // Put some stuff in their user data so it loads
      let date = new Date()      
      let datestring = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
      console.log("in create user with eail and password, calling saveUserAccountData")      
      dispatcher(saveUserAccountData({kvPairs: {creationDate: datestring, email: email, webcamModule: true}}))

      dispatcher(saveUserEvent({userID: user.uid, eventData: {type: "New Users", userID: user.uid, eventNote: "New user " + email + " created"}}))


      }).catch(err=>{
        setMessageColor("red")
        displayErrorMessage(err.message)
      })
  }
  function displayErrorMessage(message){
    if(message === "Firebase: Error (auth/invalid-email).")
      setErrorMessage("Invalid Email")
    else if(message === "Firebase: Error (auth/wrong-password).")
      setErrorMessage("Check Password")
    else if(message === "Firebase: Error (auth/email-already-in-use).")
      setErrorMessage("Email Already in use")
    else if(message === "Firebase: Error (auth/user-not-found).")
      setErrorMessage("There is no account associate with that email")
    else{
      // setErrorMessage(message)
      setErrorMessage("Auth error")  
      console.log("auth error: " + message)
    }
  }
  function creatingNew(bool){
    setCreateNew(bool)
    setErrorMessage("")
  }
  // Listen for auth state changes and puts userID in state
  function authListener(){
    onAuthStateChanged(auth, (user) => {
      dispatcher(setUserID(user?.uid))
      // If the user signs in take them to the dashboard and hide the auth menu 
      if(user) {
        dispatcher(setShowAuthMenu(false))                
          
        // If the user is on the landing page and they log in take them to the dashboard
        if(!window.location.href.toLocaleLowerCase().includes("#"))          
          setTimeout(()=>navigate("/Dashboard"), 250)
      }
      // If the user signed out take them to the home page and clear their user data
      else{
        navigate("/")
        dispatcher(setUserData(null))
      }
    })
  }
  function signOutUser(){
    // Signs the user out and calls onAuthStateChanged in App.js
    signOut(auth).then(msg => { 
      // console.log("user signed out, userId set in Navbar.js")     
    }).catch(err => {
      console.log("sign out error: " + err)
    })     
    
  }

  function goToDashboard(){
    dispatcher(toggleShowAuthMenu(false))
    // Give the state time to update before navigating
    setTimeout(() => {
      navigate("/Dashboard")      
    }, 250);
  }
  function logUserData(){
    console.log(userData)
  }
  function passwordReset(){
    let passwordResetEmail = (emailInput.current?.value || auth?.currentUser?.email)
  
    sendPasswordResetEmail(auth, passwordResetEmail)
    .then(() => {
      setMessageColor("green")
      setErrorMessage("Password reset email sent to "+passwordResetEmail)

    })
    .catch((error) => {      
      setMessageColor("red")      
      displayErrorMessage(error.message)        

    });
  }
  function startEmailChange(){
    setUpdatingEmail(true)
    setCreateNew(false)
  }
  function updateEmailFunction(){
    updateEmail(auth?.currentUser, emailResetInput.current.value).then(() => {
      setUpdatingEmail(false)
      setErrorMessage("Email Updated to "+auth?.currentUser?.email)          
      setMessageColor("green")
    }).catch((error) => {
      setMessageColor("red")
      displayErrorMessage(error.message)      
    });
  }
  // This function sends an email by setting the values of a hidden form and using emailjs to send the form values via email
  const formRef = useRef()  
  const formMessageRef = useRef()  
  const formEmailRef = useRef()  
  function sendEmail(firstName, userEmail){  
    
    formMessageRef.current.value = "Welcome to the courses app "+firstName+"!"
    formEmailRef.current.value = userEmail
    //formEmailRef.current.value = "abeapple@protonmail.com"
    
    emailjs.sendForm('service_fepcyns', 'template_bl74n4j', formRef.current, 'jxl1B6Wy4ZMfn1YcQ')
    .then((result) => {
        console.log(result.text);            
    }, (error) => {
        console.log(error.text);            
    });

  }

    return (
        <div className={theme}>
          
            {showAuthMenu && 
                // <div className={`authMenu ${sideNavOpen ? "sideNavAuthLeftAdjust":""}`}>
                <div className={`authMenu`}>
                  <form ref={formRef} className='hidden'>
                    <input name="to_email" ref={formEmailRef}/>
                    <input name="email_subject" value={"Welcome to the courses app"} />
                    <input name="message" ref={formMessageRef} />            
                  </form>
                    <div className='closeButton' onClick={close}>x</div>
                    <>
                        {(userID && !updatingEmail) ? 
                        <>
                            <div>{languageConverter(language, "Account Actions")}</div>
                            {/* {(isAdmin || canEdit) &&
                              <>                          
                                <button onClick={()=>dispatcher(setViewAsAdmin(!viewAsAdmin))}>{`View As ${viewAsAdmin ? "User": "Admin"}`}</button>                            
                              </>
                            } */}
                            <button onClick={goToDashboard}>{languageConverter(language, "Your Courses")} / Dashboard</button>                            
                            <button onClick={()=>dispatcher(toggleTheme())}>{theme === "lightTheme" ? languageConverter(language, "Dark Theme") : languageConverter(language, "Light Theme")}</button>                                                                                
                            <button onClick={()=>dispatcher(saveUserAccountData({kvPairs: {fullAdmin: !fullAdmin}}))}>Toggle fullAdmin {" "+fullAdmin}</button>                                                                                                               
                            {/* <button onClick={passwordReset}>Reset Password</button> */}
                            {/* <button onClick={startEmailChange}>Change Email</button> */}
                            {/* <button onClick={logUserData}>Log User Data</button> */}
                            <button onClick={signOutUser}>{languageConverter(language, "Log Out")}</button>
                            {fullAdmin &&
                              <>
                                <button onClick={()=>dispatcher(clearAllCourseData())}>Clear Courses</button>                                                        
                                <button onClick={()=>dispatcher(clearAllUserData())}>Clear all user data</button>                                                                                                               
                              </>
                            }
                            <div className='loginBottomText'>
                              <div className={`errorMessage ${messageColor === "red" ? "messageRed":""} ${messageColor === "green" ? "messageGreen":""}`}>
                                {errorMessage}
                              </div>
                            </div>
                        </>
                        :
                        <>
                            <div 
                            className='authTitle'
                            title={"If the browser cache is cleared all local data will be lost.\nAn account allows data to be saved and used on multiple devices."}
                            >
                                {createNew ? "Create Account" : "Login"}
                                {updatingEmail && <div className='message'>Email Update requires recent login. Please re-authenticate to continue.</div>}
                            </div>         
                            <div>
                                <input placeholder='email' ref={emailInput} defaultValue={auth?.currentUser?.email}></input>
                            </div>
                            <div>
                                <input placeholder='password' type={"password"} ref={passInput}></input>
                            </div>        
                            {createNew && <input placeholder='password confirmation'></input>}
                            <div>
                                {
                                createNew ?
                                <button onClick={signUp}>Create Account</button>
                                :
                                <button onClick={signIn}>Log In</button>
                                } 
                            </div>
                            {updatingEmail &&
                              <div>
                                <hr></hr>
                                <input placeholder='New Email' ref={emailResetInput}></input>
                                <button onClick={updateEmailFunction}>Update Email</button>
                                <button onClick={()=>setUpdatingEmail(false)}>Cancel Email Update</button>
                              </div>
                            }
                            <div className='loginBottomText'>
                                <div className={`errorMessage ${messageColor === "red" ? "messageRed":""} ${messageColor === "green" ? "messageGreen":""}`}>
                                  {errorMessage}
                                </div>
                                {createNew ?
                                    <div>
                                        Have an account? 
                                        <a onClick={()=>creatingNew(false)}>
                                            Sign In
                                        </a>
                                    </div>
                                    :
                                    !updatingEmail ?
                                      <div>
                                        New Here? 
                                        <a onClick={()=>creatingNew(true)}>
                                            Sign Up now
                                        </a>                
                                      </div>
                                    :
                                    <></>                                                 
                                }
                                <div className='authLink'>
                                  <a onClick={passwordReset}>Forgot Password?</a>
                                </div>
                            </div>
                        </>
                        }     
                    </>
                </div>
            } 
        </div>
  )
}

export default AuthMenu