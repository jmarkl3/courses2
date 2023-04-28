import React, { useEffect, useRef, useState } from 'react'
import "./Auth.css"
import { useDispatch, useSelector } from 'react-redux'
import { toggleShowAuthMenu} from '../../App/AppSlice'
import "../../Styles/Themes.css"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, clearEnrolledCourses, enrollUserInCourses, saveUserAccountData, setUserID, toggleTheme } from '../../App/DbSlice'
import { useNavigate } from 'react-router-dom'


function AuthMenu() {
  const showAuthMenu = useSelector(state => state.appslice.showAuthMenu)
  const userData = useSelector(state => state.dbslice.userData)
  const sideNavOpen = useSelector(state => state.appslice.sideNavOpen)
  const theme = useSelector(state => state.dbslice.userData?.accountData?.theme)
  const userID = useSelector(state => state.dbslice.userID)
  const [createNew, setCreateNew] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const emailInput = useRef()
  const passInput = useRef()
  const dispatcher = useDispatch()
  const navigate = useNavigate()
    
  console.log(userData)

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
      dispatcher(enrollUserInCourses({userID: user.user.uid, courseIDArray: []}))

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
  function signOutUser(){
    // Signs the user out and calls onAuthStateChanged in App.js
    signOut(auth).then(msg => { 
      // console.log("user signed out, userId set in Navbar.js")     
    }).catch(err => {
      console.log("sign out error: " + err)
    })     
    
  }

    return (
        <div className={theme}>
            {showAuthMenu && 
                <div className={`authMenu ${sideNavOpen ? "sideNavAuthLeftAdjust":""}`}>
                    <div className='closeButton' onClick={()=>dispatcher(toggleShowAuthMenu())}>x</div>
                    <>
                        {userID ? 
                        <>
                            <div>Account Actions</div>
                            <button onClick={signOutUser}>Log Out</button>
                            <button onClick={()=>dispatcher(toggleTheme())}>{theme === "lightTheme" ? "Dark Theme" : "Light Theme"}</button>                            
                            <button onClick={()=>dispatcher(saveUserAccountData({value: {isAdmin: !userData?.accountData?.isAdmin}}))}>Toggle Admin {" "+userData?.accountData?.isAdmin}</button>                            
                            <button onClick={()=>navigate("/Dashboard")}>Your Courses / Dashboard</button>                            
                            <button onClick={()=>dispatcher(clearEnrolledCourses())}>Clear Courses</button>                                                        
                            <button >Change Email</button>                            
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