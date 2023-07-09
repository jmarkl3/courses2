import React, { useEffect, useRef, useState } from 'react'
import AccountElement from './AccountElement'
import Card from './Card'
import ElementDisplayBlock from '../ElementDisplayBlock'
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth, database, saveUserAccountData, saveUserEvent } from '../../../../../../App/DbSlice'
import { useDispatch, useSelector } from 'react-redux'
import { get, onValue, ref, set } from 'firebase/database'
import "./Checkout.css"

/*

    Want user to be able to input all info, including userData, account, and card
    and it will all be saved at the same time with on click

    maybe could put the create user function in here
    then inside of that it will look for local data, update it for input data
    and save that into the new account
    Then the card component will be checked

    Will have to check use cases
    like whey they have good internet, bad internet, fill out the account info before the other info, card declines, account email is already in use, etc    
    if user signes in using the auth menu while in the checkout page
    if the user has an existing account and logs in while in the checkout page
    if the user is signed in and signs out while in the checkout page
    if the user is already signed in when they get to the checkout page

    need user data fields to save data somewher even if there is no user signed in
    also need other elements to do the same
    and it needs to be saved in a place that can be easilly accessed by the checkout page
    Then don't need to gather the data after they sign in, just need to access it and move it to the new account
    :
    This happens in saveUserAccountData and saveUserResponse in DbSlice.js
    
    create a function to create an anonymous account
      push to a place in the db like anonAccounts and the key will be the userID
    and a function to look for that account
    the data will then need to be loaded from the anon account (unless there is a real account)

    If the user has anon data, then creates an account, adds data, then signs out
    the anon data should not still show
    so maybe delete it after transferring or/and remove the anonID from local storage

    when the user starts a course they will be assigned an anonID if they don't already have an anonID or a userID

    ================================================================================

    in CartCourse.js
    there is a button to view the course
    when this is clicked it calls anonViewCourse which dispatches enrollUserInCourseAnon in DbSlice.js
      enrollUserInCourseAnon in DbSlice.js
        if there is a user signed in it enrolls them in the course
        if not it creates an anon account and enrolls them in the course
      this new anon User ID will be retrieved in onValueListener in AuthMenu.js if there is no user signed in
        then it saves the anonID in userID and anonID so data is loaded and saved normally with the existing functions
    then it navigates to the course
    
    when the user checks out the onAuthStateChanged listener in Checkout.js is called 
    on successful login this transferres the data from the anonID to the userID
    it then removes the anonID from local storage
    
    the onAuthStateChanged listener in AuthMenu.js knows not to take some actions if ther is a anonID in state in addition to userID

    when the user is enrolled in the course the CartCourse will show a button to go to the course
    
    as the userDataInputs are filled in the responses are saved in the db under the anonID if ther is no ID becauset the anonID is in state as the userID


*/
function Checkout({elementData}) {
    // To see if an account needs to be created
    const userID = useSelector(state => state.dbslice.userID)    
    const anonID = useSelector(state => state.dbslice.anonID)
    const userData = useSelector(state => state.dbslice.userData)    
    const [errorMessage, setErrorMessage] = useState("")
    const [messageColor, setMessageColor] = useState("red")
    const emailInput = useRef()
    const passInput = useRef()
    const passConfirmInput = useRef()    
    const dispatcher = useDispatch()        

    function checkout(){    
      // If there is a anonID or no userID then create an account
      if(!userID || anonID)
        // This checks hasRequiredData()
        signUpFunction()
      // If there is already an account
      else{        
        // Check the required intputs
        if(!hasRequiredData())
          return
        
        // Then check the card stuff

        // If all good then move to the next step

      }
    }

    function signUpFunction(){
      var email = emailInput.current.value
      var pass = passInput.current.value
      var pass2 = passConfirmInput.current.value

      if(!email || !pass || !pass2){
        displayErrorMessage("please enter account fields (email, password, password re-type)", true)
        return
      }
      if(pass !== pass2){
        setMessageColor('red')
        displayErrorMessage("pasword re-type does not match password", true)
        return
      }
      
      createUserWithEmailAndPassword(auth, email, pass).then( user =>{
      
          if(!user) return        
          
          // Put some stuff in their user data so it loads
          let date = new Date()      
          let datestring = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
          
          // This saves some date in the user's account data such as the date, their email, and default states
          dispatcher(saveUserAccountData({kvPairs: {creationDate: datestring, email: email, webcamModule: true}}))

          // This is for the user event log
          dispatcher(saveUserEvent({userID: user.uid, eventData: {type: "New Users", userID: user.uid, eventNote: "New user " + email + " created"}}))

          // Now check the inputs
          if(!hasRequiredData())
            return          

          // Then the card stuff

          // If all good then move to the next step

      }).catch(err=>{
          setMessageColor("red")
          displayErrorMessage(err.message)
          // Clear the error message after 3 seconds
          setTimeout(() => {
            displayErrorMessage("")
          }, 5000);
      })
  }

  function hasRequiredData(){
    if(!userData?.accountData?.firstName){      
      displayErrorMessage("Please fill out first name field", true)
      return false
    }
    if(!userData?.accountData?.lastName){
      displayErrorMessage("Please fill out last name field", true)
      return false
    }
    if(!userData?.accountData?.phone){      
      displayErrorMessage("Please fill out phone field", true)
      return false
    }
    if(!userData?.accountData?.address1){      
      displayErrorMessage("Please fill out address field", true)
      return false
    }
    setErrorMessage("")
    return true
  }

    // Turns a raw error message from firebase auth to something to display to the user
  function displayErrorMessage(message, passthrough){
    if(passthrough){
      setErrorMessage(message)
    }
    else{
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
    // Remove error message after 4 seconds
    setTimeout(() => {
      setErrorMessage("")
    }, 4000);
  }

  return (
    <div>

        <div>
          {(userID && !anonID)?
            <>
            </>
            : 
            <div className='checkoutAuthMenu'>
                <div>
                    Create an Account
                </div>
                <input type="text" placeholder="Email" ref={emailInput} defaultValue={userData?.email}/>
                <input type="text" placeholder="Password" ref={passInput}/>
                <input type="text" placeholder="Password re-type" ref={passConfirmInput}/>
            </div>
          }             
        </div>
        <div className='checkoutInputs'>
            <div>
                User Data
            </div>
            <ElementDisplayBlock
                elementData={{type: "User Data Field", content: "First Name", content3: "firstName", inputSize: "Half"}}
            ></ElementDisplayBlock>
            <ElementDisplayBlock
                elementData={{type: "User Data Field", content: "Last Name", content3: "lastName", inputSize: "Half"}}
            ></ElementDisplayBlock>
            <ElementDisplayBlock
                elementData={{type: "User Data Field", content: "Case Number (optional)", content3: "caseNumber", inputSize: "Half"}}
            ></ElementDisplayBlock>
            <ElementDisplayBlock
                elementData={{type: "User Data Field", content: "Phone", content3: "phone", inputSize: "Half"}}
            ></ElementDisplayBlock>
            <ElementDisplayBlock
                elementData={{type: "User Data Field", content: "Address", content3: "address1", inputSize: "Whole"}}
            ></ElementDisplayBlock>
            <ElementDisplayBlock
                elementData={{type: "User Data Field", content: "How did you find us?", content3: "customerSource", inputSize: "Whole"}}
            ></ElementDisplayBlock>
        </div>
        <Card elementData={elementData}></Card>
        <div>
          <div className='errorMessageContainer'>
              <div className={`errorMessage ${messageColor === "red" ? "messageRed":""} ${messageColor === "green" ? "messageGreen":""}`}>
                  {errorMessage}
              </div>
          </div>
          <button onClick={checkout}>Checkout</button>            
        </div>
    </div>
  )
}

export default Checkout