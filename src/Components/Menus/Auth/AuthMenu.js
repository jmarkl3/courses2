import React, { useEffect, useRef, useState } from 'react'
import "./Auth.css"
import { useDispatch, useSelector } from 'react-redux'
import { setShowAuthMenu, toggleShowAuthMenu} from '../../../App/AppSlice'
import "../../../Styles/Themes.css"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, clearAllCourseData, clearAllUserData, clearEnrolledCourses, enrollUserInCourses, saveUserAccountData, setUserData, setUserID, toggleTheme } from '../../../App/DbSlice'
import { useNavigate } from 'react-router-dom'

function AuthMenu() {
  const showAuthMenu = useSelector(state => state.appslice.showAuthMenu)
  const fullAdmin = useSelector(state => state.dbslice.userData?.accountData?.fullAdmin)
  const sideNavOpen = useSelector(state => state.appslice.sideNavOpen)
  const theme = useSelector(state => state.dbslice.userData?.accountData?.theme)
  const userID = useSelector(state => state.dbslice.userID)
  const [createNew, setCreateNew] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const emailInput = useRef()
  const passInput = useRef()
  const dispatcher = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    authListener()
  },[])
  

  function signIn(){
    var email = emailInput.current.value
    var pass = passInput.current.value

    signInWithEmailAndPassword(auth, email, pass).then( user =>{
      }).catch(err=>{
        displayErrorMessage(err.message)
      })
  }
  function signUp(){
    var email = emailInput.current.value
    var pass = passInput.current.value
    
    createUserWithEmailAndPassword(auth, email, pass).then( user =>{
      // Save their user ID in state
      dispatcher(setUserID(user.user.uid))
      
      // Put some stuff in their user data so it loads
      let date = new Date()
      dispatcher(saveUserAccountData({kvPairs: {creationDate: date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate()}}))

      }).catch(err=>{
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
        
        // Doing this in a timeout so the auth menu has time to close before navigating
        if(!window.location.href.toLocaleLowerCase().includes("Course"))
          // console.log("going to dashboard")
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

    return (
        <div className={theme}>
            {showAuthMenu && 
                // <div className={`authMenu ${sideNavOpen ? "sideNavAuthLeftAdjust":""}`}>
                <div className={`authMenu`}>
                    <div className='closeButton' onClick={()=>dispatcher(toggleShowAuthMenu())}>x</div>
                    <>
                        {userID ? 
                        <>
                            <div>Account Actions</div>
                            {/* {(isAdmin || canEdit) &&
                              <>                          
                                <button onClick={()=>dispatcher(setViewAsAdmin(!viewAsAdmin))}>{`View As ${viewAsAdmin ? "User": "Admin"}`}</button>                            
                              </>
                            } */}
                            <button onClick={goToDashboard}>Your Courses / Dashboard</button>                            
                            <button onClick={()=>dispatcher(toggleTheme())}>{theme === "lightTheme" ? "Dark Theme" : "Light Theme"}</button>                                                                                
                            <button onClick={()=>dispatcher(saveUserAccountData({kvPairs: {fullAdmin: !fullAdmin}}))}>Toggle fullAdmin {" "+fullAdmin}</button>                                                                                                               
                            <button onClick={signOutUser}>Log Out</button>
                            {fullAdmin &&
                              <>
                                <button onClick={()=>dispatcher(clearAllCourseData())}>Clear Courses</button>                                                        
                                <button onClick={()=>dispatcher(clearAllUserData())}>Clear all user data</button>                                                                                                               
                              </>
                            }
                        </>
                        :
                        <>
                            <div 
                            className='authTitle'
                            title={"If the browser cache is cleared all local data will be lost.\nAn account allows data to be saved and used on multiple devices."}
                            >
                                {createNew ? "Create Account" : "Login"}
                            </div>         
                            <div>
                                <input placeholder='email'  ref={emailInput}></input>
                            </div>
                            <div>
                                <input placeholder='pass' type={"password"} ref={passInput}></input>
                            </div>
                            {createNew && <input placeholder='pass confirmation'></input>}
                            <div>
                                {
                                createNew ?
                                <button onClick={signUp}>Create Account</button>
                                :
                                <button onClick={signIn}>Log In</button>
                                } 
                            </div>
                            <div className='loginBottomText'>
                                <div className='errorMessage'>
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
                                    <div>
                                        New Here? 
                                        <a onClick={()=>creatingNew(true)}>
                                            Sign Up now
                                        </a>                
                                    </div>                
                                }
                                <div>
                                  <a>Forgot Password?</a>
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