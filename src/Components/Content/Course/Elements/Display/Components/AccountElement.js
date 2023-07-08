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
function AccountElement({showButtons, attemptSignInCounter, createNewAccountRef}) {
    const selectedCourseID = useSelector(state => state.dbslice.userID)
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
        var email = emailInput.current.value
        var pass = passInput.current.value
        
        createUserWithEmailAndPassword(auth, email, pass).then( user =>{
        
            if(!user) return
            
            //sendEmail("", email)

            // If this component is in a checkout comopnent this ref will be sent here and set to true so the checkout pages knows how to save the data
            if(createNewAccountRef)
                createNewAccountRef.current = true

            // Save their user ID in state (this is done in the auth listener)
            ///dispatcher(setUserID(user.user.uid))
            
            // Put some stuff in their user data so it loads
            let date = new Date()      
            let datestring = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
            ///console.log("in create user with eail and password, calling saveUserAccountData")      
            // This saves some date in the user's account data such as the date, their email, and default states
            dispatcher(saveUserAccountData({kvPairs: {creationDate: datestring, email: email, webcamModule: true}}))

            // This is for the user event log
            dispatcher(saveUserEvent({userID: user.uid, eventData: {type: "New Users", userID: user.uid, eventNote: "New user " + email + " created"}}))

        }).catch(err=>{
            setMessageColor("red")
            displayErrorMessage(err.message)
        })
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
        {/* {userID ?
        <>
        </>
        : */}
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
    {/* } */}
        
    </div>
  )
}

export default AccountElement