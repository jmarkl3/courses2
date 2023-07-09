import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { auth, saveUserAccountData, saveUserEvent } from '../../../../../../App/DbSlice'
import { useNavigate } from 'react-router-dom'

/*

    maybe modify the other login component to be a general account component
    use this as a wrapper

    will have a switch to allow user to log in or create an account
    if creating an account will need to gather all the info and save it to the database under the new userID

    maybe set state saying creating a new account, then in an authStateListener in Checkout.js it will gather and save the data, then move user to the next step

*/

// attemptSignInCounter triggers the sign in function when it changes
function AccountElement({showButtons, attemptSignInCounter, createNewAccountRef, signUpFunction}) {
    const userID = useSelector(state => state.dbslice.userID)
    const anonID = useSelector(state => state.dbslice.anonID)
    const [createNew, setCreateNew] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")
    const [messageColor, setMessageColor] = useState("")
    const emailInput = useRef()
    const passInput = useRef()
    const passConfirmInput = useRef()
    const dispatcher = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        if(attemptSignInCounter != 0){
            if(createNew)
                signUp()
            else
                signIn()
          setErrorMessage("")
        }
    },[attemptSignInCounter])

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
      
    }
    // Turns a raw error message from firebase auth to something to display to the user
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

  return (
    <div>
        {(userID && !anonID)?
        <>
        </>
        : 
        <div>
            <div>
                Create an account
            </div>
            <input type="text" placeholder="Email" ref={emailInput}/>
            <input type="text" placeholder="Password" ref={passInput}/>
            <input type="text" placeholder="Password re-type" ref={passConfirmInput}/>
            <div>
                <div className={`errorMessage ${messageColor === "red" ? "messageRed":""} ${messageColor === "green" ? "messageGreen":""}`}>
                    {errorMessage}
                </div>
            </div>
        </div>
     } 
        
    </div>
  )
}

export default AccountElement