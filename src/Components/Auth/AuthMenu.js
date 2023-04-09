import React, { useEffect, useRef, useState } from 'react'
import "./Auth.css"
import { useDispatch, useSelector } from 'react-redux'
import { toggleShowAuthMenu } from '../../App/AppSlice'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../../App/DbSlice'


function AuthMenu() {
  const showAuthMenu = useSelector(state => state.appslice.showAuthMenu)
  const dispatcher = useDispatch()

  const userId = useSelector(state => state.dbslice.userId)
  const [createNew, setCreateNew] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const emailInput = useRef()
  const passInput = useRef()
    
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
        <>
            {showAuthMenu && 
                <div className='authMenu'>
                    <div className='closeButton' onClick={()=>dispatcher(toggleShowAuthMenu())}>x</div>
                    <>
        {(userId) ? 
          <>
            <div>Account Actions</div>
            <button onClick={signOutUser}>Log Out</button>
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
                {
                    createNew ?
                    <div>
                        Already a member? 
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
              </div>
          </>
        }     
      </>
                </div>
            } 
        </>
  )
}

export default AuthMenu