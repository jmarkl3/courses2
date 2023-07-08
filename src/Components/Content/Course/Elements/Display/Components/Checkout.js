import React, { useEffect, useRef, useState } from 'react'
import AccountElement from './AccountElement'
import Card from './Card'
import ElementDisplayBlock from '../ElementDisplayBlock'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, database, saveUserAccountData } from '../../../../../../App/DbSlice'
import { useDispatch, useSelector } from 'react-redux'
import { get, onValue, ref, set } from 'firebase/database'

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
    //const userID = useSelector(state => state.dbslice.userID)

    const anonID = useSelector(state => state.dbslice.anonID)
    const userData = useSelector(state => state.dbslice.userData)
    const [attemptSignInCounter, setAttemptSignInCounter] = useState(0)
    const createNewAccountRef = useRef()
    const dispatcher = useDispatch()

    useEffect(()=>{
        authListener()
    },[])
    
    const [hasAccount, setHasAccount] = useState()
    // useEffect(()=>{
    //     if(userID)
    //         setHasAccount(true)
    // },[userID])

    // When a user signs in of signs up while in the checkout section
    function authListener(){
        onAuthStateChanged(auth, (user) => {          
          // Gather and save the user's data into the new or existing account
          if(user && user.uid) {            
            // If is currently an anon user save the data from the anon userID, then remove the anon userID
            if(anonID){
                // Save the account data from the anon account
                // dispatcher(saveUserAccountData({userID: user.uid, kvPairs: userData?.accountData}))
                
                // If they just created a new account, save all the data from the anon account, there is no reason to worry about overriting because it is a new accouunt
                if(createNewAccountRef.current){
                    set(ref(database, "coursesApp/userData/" + user.uid), userData)
                    
                          // coursesApp/userDataTimes/userID/courses/courseID/chapterData/chapterID/sectionData/sectionID/userTime
                    let dbString = "coursesApp/userDataTimes/" + anonID

                    // Copy the anon user section times into the new account sections times in the db
                    onValue(ref(database, dbString), snap => {
                        // Calculates display time value and sets it to be displayed
                        set(ref(database, "coursesApp/userDataTimes/" + user.uid), userData)                                            
                    }, {
                        onlyOnce: true
                    })

                }

                // Save the course data from the anon account

                // Remove the anonID from local storage
                localStorage.removeItem("anonID")
            }

          }          
          else{
            // The account creation section was not completed, so the user will have to update that to contiue

          }
        })
      }

      function checkout(){
        // This will cause the AccountElement to attempt to sign in or sign up the user up if they are not logged in already
        setAttemptSignInCounter(attemptSignInCounter + 1)
      }

  return (
    <div>
        <>
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
        </>
        <AccountElement elementData={elementData} attemptSignInCounter={attemptSignInCounter} createNewAccountRef></AccountElement>
        <Card elementData={elementData}></Card>
        <div>
            <button onClick={checkout}>Checkout</button>            
        </div>
    </div>
  )
}

export default Checkout