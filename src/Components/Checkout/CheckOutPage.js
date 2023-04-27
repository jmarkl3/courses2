import React, { useEffect, useRef, useState } from 'react'
import "./CheckOutPage.css"
import topImage from "../../Images/topImage.jpg"
import Navbar from '../Navbar/Navbar'
import Cart from '../Cart/Cart'
import { useDispatch, useSelector } from 'react-redux'
import CartCourse from '../Cart/CartCourse'
import { priceString } from '../../App/functions'
import { useNavigate } from 'react-router-dom'
import DisplayPage from '../Content/DisplayPage'
import { setSideNavOpen, toggleShowAuthMenu } from '../../App/AppSlice'
import { auth, enrollUserInCourses, saveUserAccountData, setUserID } from '../../App/DbSlice'
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
  const [showCart, setShowCart] = useState()
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
  const hearAboutInput = useRef()
  const addressInput = useRef()
  const adress2Input = useRef()
  const emailInput = useRef()
  const passInput = useRef()
  const passRetypeInput = useRef()
  const dispatcher = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    dispatcher(setSideNavOpen(false))
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
    if(selectedCourses.length == 0)    
      return

    // If there is a user account
    if(userData){
      // Enroll user in course
      dispatcher(enrollUserInCourses({userID: userID, courseIDArray: selectedCourseIDs}))          
      // Go to first course
      navigate("/Course/"+selectedCourses[0].id)
      
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

      // Name
      let firstName = name1Input.current.value
      let lastName = name2Input.current.value
      if(!firstName || !lastName){
        setErrorMessage("Please enter a first and last name")
        return
      }
           
      // Address
      let address = addressInput.current.value+" "+adress2Input.current.value
      if(!address){
        setErrorMessage("Please enter an address")
        return
      }

      // Case Number
      let caseNumber = caseNInput.current.value
      let hearAbout  = hearAboutInput .current.value
      

      // Create user account
      createUserWithEmailAndPassword(auth, email, pasword).then( user =>{
        
        if(!user.uid){
          console.log("Error creating user account")
          setErrorMessage("Error creating user account")
          return
        }

        // Save user input data to user account
        dispatcher(saveUserAccountData({userID: user.uid, property: "", value: {
          firstName: firstName,
          lastName: lastName,
          address: address,
          caseNumber: caseNumber,
          hearAbout: hearAbout
        }}))

        // Enroll user in course
        dispatcher(enrollUserInCourses({userID: user.uid, courseIDArray: selectedCourseIDs}))    
              
        // Go to first course
        navigate("/Course/"+selectedCourses[0].id)

      }).catch(err=>{        
        setErrorMessage(errToErrorMessage(err.message))
      })
    }
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
    setCartTotal(priceString(selectedCourses.reduce((total, courseData) => total + courseData?.price, 0)))        
  }

  return (
    <>    
      <DisplayPage>
        <>
          <h2>Checkout</h2>
          {userData ?
            <>
              {"< Account Info >"}
            </>
            :
            <div className='checkout'>        
              <div className='checkoutInput'>
                  First Name
                  <input placeholder='First Name' ref={name1Input}></input>
              </div>
              <div className='checkoutInput'>
                  Last Name
                  <input placeholder='First Name' ref={name2Input}></input>
              </div>   
              <div className='checkoutInput'>
                  Case Number (optional)
                  <input placeholder='Case Number' ref={caseNInput}></input>
              </div>   
              <div className='checkoutInput'>
                  How did you hear about us? (optional)
                  <input ref={hearAboutInput}></input>
              </div>  
              <div className='checkoutInput checkoutInputW100'>
                  Address
                    <input ref={addressInput}></input>
              </div>   
              <div className='checkoutInput checkoutInputW100'>
                  Address 2
                  <input ref={adress2Input}></input>
              </div>   
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
                <button onClick={()=>dispatcher(toggleShowAuthMenu())}>Have an account? Login</button>
              </div>
            </div>
          }
          
          <div className='box'>
              <div className='checkoutErrorMessage'>{errorMessage}</div>
              <button className='checkoutButton checkoutButtonSize' onClick={()=>setShowCart(true)}>Edit Cart</button>    
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
      {showCart &&
        <Cart close={()=>setShowCart(false)} inCheckout></Cart>
      }
  </>
  )
}

export default CheckOutPage