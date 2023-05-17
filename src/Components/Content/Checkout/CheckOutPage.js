import React, { useEffect, useRef, useState } from 'react'
import "./CheckOutPage.css"
import { useDispatch, useSelector } from 'react-redux'
import CartCourse from '../../CourseTile/CartCourse'
import { priceString } from '../../../App/functions'
import { useNavigate } from 'react-router-dom'
import DisplayPage from '../DisplayPage'
import { clearCartCourses, setCheckingOut, setShowCart, setSideNavOpen, toggleShowAuthMenu } from '../../../App/AppSlice'
import { auth, enrollUserInCourses, enrollUserInCourses2, saveUserAccountData, saveUserEvent, setUserID } from '../../../App/DbSlice'
import { createUserWithEmailAndPassword } from 'firebase/auth'
/*
  if there is no user account 
    shows input fields including password
    creates user account
    adds courseID to user account
  if there is a user account
    adds courseID to user account
    
  when course is put in user account it is removed from cart
  when course is in user account the cart course changes to show progress and has a button to go to the course
  in landing page the courses that the user is enrolled in will show in a diferent section

  in Course check to see if user is enrolled in course (or is an admin)

*/
function CheckOutPage() {
  const [selectedCourses, setSelectedCourses] = useState([])
  const selectedCourseIDs = useSelector(state => state.appslice.selectedCourseIDs)
  const coursesArray = useSelector(state => state.dbslice.coursesArray)
  const userData = useSelector(state => state.dbslice.userData)
  const userID = useSelector(state => state.dbslice.userID)
  const [cartTotal, setCartTotal] = useState(0)
  const [showPassword, setShowPassword] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const showPasswordCheckbox = useRef()
  const name1Input = useRef()
  const name2Input = useRef()
  const caseNInput = useRef()
  const heardAboutInput = useRef()
  const addressInput = useRef()
  const address2Input = useRef()
  const emailInput = useRef()
  const passInput = useRef()
  const passRetypeInput = useRef()
  const dispatcher = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    dispatcher(setSideNavOpen(false))
    // This changes the way the cart is displayed
    dispatcher(setCheckingOut(true))
    dispatcher(setShowCart(false))
  },[])

  // If the array of selected course IDs changes update the array of selected courses
  useEffect(()=>{
    filterSelectedCourses()

  },[selectedCourseIDs])
  
  // When the array of selected courses changes update the cart total
  useEffect(()=>{
    cartTotalFunction()
  },[selectedCourses])

  function checkout(){
    // If there are no selected courses don't continue with checkout
    if(selectedCourses.length == 0)  {
      setErrorMessage("Please edit cart and select at least one course")
      return
    }  

    // If there is a user account
    if(userData){
      // Update the user data if it has changed
      let userInputData = gatherUserData()
      dispatcher(saveUserAccountData({kvPairs: userInputData}))

      // Enroll user in course
      //dispatcher(enrollUserInCourses({userID: userID, courseIDArray: selectedCourseIDs}))
      dispatcher(enrollUserInCourses2({userID: userID, courseIDArray: selectedCourseIDs}))
      dispatcher(clearCartCourses())          
      goToCourses()
      
    }else{

      // Auth
      let email = emailInput.current.value
      let pasword = passInput.current.value
      let paswordRetype = passRetypeInput.current.value
      if(!email){
        setErrorMessage("Please enter an email address")
        return
      }
      if(!pasword || !paswordRetype){
        setErrorMessage("Please enter a valid password into both inputs")
        return
      }
      if(pasword != paswordRetype){
        setErrorMessage("Password and password retype do not match")
        return
      }

      // Other input values
      let userInputData = gatherUserData()

      // Check values
      if(!userInputData.firstName || !userInputData.lastName){
        setErrorMessage("Please enter a first and last name")
        return
      }
      if(!userInputData.address1){
        setErrorMessage("Please enter an address")
        return
      }
      if(!userInputData.address2){
        setErrorMessage("Please enter an address")
        return
      }
      
      userInputData.webcamModule = true

      // Save the user creation date
      userInputData.accountCreationDate = new Date().getTime()

      // Create user account
      createUserWithEmailAndPassword(auth, email, pasword).then( user =>{
        
        if(!user.uid){
          console.log("Error creating user account")
          setErrorMessage("Error creating user account")
          return
        }


        dispatcher(saveUserEvent({userID: user.uid, eventData: {type: "New Users", userID: user.uid, eventNote: "New user "+userInputData.firstName+" "+user.uid+" created"}}))

        /*
          userEvents: {
            // Allows O1 for the chart
            date: {
              randomKey: {
                userID: <userID>,
                type: "new user, enrollment, completed course, amount",
                time: <time>,
                eventNote: "<user id> signed up for <course name>, completed <section name> in <course name>"
              }
            }
          }

          also put in their userData
          userData: {
            accountData: {...},
            courses: {...},
            events: {
              date: {
                randomKey: {
                  time: <time>,
                  type: <signed up, enrolled in course, completed section ,course>,
                  eventNote: "signed up for <course name>, completed <section name> in <course name>"
                }
            }
          }

        */

        // dispatcher(userStats({userID: user.uid, type: "new user"}))

        // Save user input data to user account
        dispatcher(saveUserAccountData({userID: user.uid, kvPairs: userInputData}))
        selectedCourses.forEach(courseData => {
          dispatcher(saveUserEvent({userID: user.uid, eventData: {type: "Enrollments", userID: user.uid, eventNote: "User "+userInputData.firstName+" enrolled in "+courseData.name}}))
        });

        // Enroll user in course
        //dispatcher(enrollUserInCourses({userID: user.uid, courseIDArray: selectedCourseIDs})) 
        dispatcher(enrollUserInCourses2({userID: userID, courseIDArray: selectedCourseIDs}))   
        dispatcher(clearCartCourses())          
        goToCourses()

      }).catch(err=>{        
        setErrorMessage(errToErrorMessage(err.message))
      })
    }
  }
  function gatherUserData(){
    // Name
    let firstName = name1Input.current.value
    let lastName = name2Input.current.value
    let address1 = addressInput.current.value
    let address2 = address2Input.current.value
    let caseNumber = caseNInput.current.value
    let heardAbout  = heardAboutInput .current.value
    
    var returnObject = {}
    if(firstName)
      returnObject.firstName = firstName
    if(lastName)
      returnObject.lastName = lastName
    if(address1)
      returnObject.address1 = address1
    if(address2)
      returnObject.address2 = address2
    if(caseNumber)
      returnObject.caseNumber = caseNumber
    if(heardAbout)
      returnObject.heardAbout = heardAbout

    return returnObject

  }
  /**
   * If there is only one course it will go directly there
   * If there is more than one course goes to the dashboard
   */
  function goToCourses(){
    // If thre is only one course go directly to that course
    if(selectedCourses.length == 1)    
      navigate("/Course/"+selectedCourses[0].id)
    // Else go to the dashboard
    else
      navigate("/Dashboard")
    
  }

  /**
   * Converts an error message to a more user friendly error message
   */ 
  function errToErrorMessage(err){
    if(err === "Firebase: Error (auth/invalid-email).")
      return "Please enter a valid email address"
    return err
  }

  // Filter the sample courses to only include the selected courses
  function filterSelectedCourses(){
    setSelectedCourses(coursesArray.filter(courseData => selectedCourseIDs.includes(courseData?.id)))
  }
  function cartTotalFunction(){
    let total = 0
    selectedCourses.forEach(courseData => {
        total += parseFloat(courseData?.price)
    })
    setCartTotal(priceString(total))
  }

  return (
    <>    
      <DisplayPage>
        <>
          <h2>Checkout</h2>
          <div className='checkout'>        
            <div className='checkoutInput'>
                First Name
                <input placeholder='First Name' ref={name1Input} defaultValue={userData?.accountData?.firstName}></input>
            </div>
            <div className='checkoutInput'>
                Last Name
                <input placeholder='First Name' ref={name2Input} defaultValue={userData?.accountData?.lastName}></input>
            </div>   
            <div className='checkoutInput'>
                Case Number (optional)
                <input placeholder='Case Number' ref={caseNInput} defaultValue={userData?.accountData?.caseNumber}></input>
            </div>   
            <div className='checkoutInput'>
                How did you hear about us? (optional)
                <input ref={heardAboutInput}></input>
            </div>  
            <div className='checkoutInput checkoutInputW100'>
                Address
                  <input ref={addressInput} defaultValue={userData?.accountData?.address1}></input>
            </div>   
            <div className='checkoutInput checkoutInputW100'>
                Address 2
                <input ref={address2Input} defaultValue={userData?.accountData?.address2}></input>
            </div>   
            {!userData &&
              <>
                <div className='checkoutInput checkoutInputThird'>
                    Email
                    <input ref={emailInput}></input>
                </div>   
                <div className='checkoutInput checkoutInputThird'>
                  Create Password                               
                  <input type={showPassword ? '' : 'password'} placeholder='Password' ref={passInput}></input>
                </div>               
                <div className='checkoutInput checkoutInputThird'>
                  Create Password (retype)
                  <input type={showPassword ? '' : 'password'}  placeholder='Password (retype)' ref={passRetypeInput}></input>
                </div>  
                <div className='checkoutOptions'>
                  <button onClick={()=>dispatcher(toggleShowAuthMenu())}>Have an account? Login</button>
                  <label htmlFor={showPasswordCheckbox} className='checkoutInputCheckbox'>
                    <span className='labelText'>
                      Show Password
                    </span>
                    <input 
                      type='checkbox'                     
                      ref={showPasswordCheckbox}
                      onChange={()=>setShowPassword(showPasswordCheckbox.current.checked)}
                    ></input> 
                  </label>  
                </div>
              </>              
            }
          </div>                    
          <div className='box'>
              <div className='checkoutErrorMessage'>{errorMessage}</div>
              <button className='checkoutButton checkoutButtonSize' onClick={()=>dispatcher(setShowCart(true))}>Edit Cart</button>    
              <button className='checkoutButton checkoutButtonSize checkoutButtonBlue' onClick={checkout}>
                <>
                    <span>
                        {"Check Out "}
                    </span>                    
                    <div className='checkoutButtonPrice priceText'>{" (Total: " + cartTotal + ")"}</div>    
                </>                     
              </button> 
          </div> 
          <div className='box'>
            <h3>Cart Summary</h3>
            <div>
              {selectedCourses.map((courseData, index)=>(
                <CartCourse courseData={courseData} selected key={courseData.id} readOnly></CartCourse>
              ))} 
            </div>
          </div> 
        </>
      </DisplayPage>
    </>
  )
}

export default CheckOutPage