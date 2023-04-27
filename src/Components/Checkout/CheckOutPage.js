import React, { useEffect, useState } from 'react'
import "./CheckOutPage.css"
import Checkout from './Checkout'
import topImage from "../../Images/topImage.jpg"
import Navbar from '../Navbar/Navbar'
import Cart from '../Cart/Cart'
import { useDispatch, useSelector } from 'react-redux'
import CartCourse from '../Cart/CartCourse'
import { priceString } from '../../App/functions'
import { useNavigate } from 'react-router-dom'
import { selectCourse } from '../../App/DbSlice'

function CheckOutPage() {
  const [showCart, setShowCart] = useState()
  const [selectedCourses, setSelectedCourses] = useState([])
  const selectedCourseIDs = useSelector(state => state.appslice.selectedCourseIDs)
  //const sampleCourses = useSelector(state => state.appslice.sampleCourses)
  const coursesArray = Object.values(useSelector(state => state.dbslice.coursesArray) )
  const [cartTotal, setCartTotal] = useState(0)
  const dispacher = useDispatch()
  const navigate = useNavigate()

  // If the array of selected course IDs changes update the array of selected courses
  useEffect(()=>{
    filterSelectedCourses()

  },[selectedCourseIDs])
  
  // When the array of selected courses changes update the cart total
  useEffect(()=>{
    cartTotalFunction()
  },[selectedCourses])

  function goToCourse(){
    if(selectedCourses.length > 0)    
      navigate("/Course/"+selectedCourses[0].id)
    
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
      <Navbar></Navbar>
      <div className='pagePackground'>
          <div className='topImage'>
              <img src={topImage}></img>
          </div>        
      </div>
      <div className={`pageOuter`}>
            <div className='pageInner'>
            <h2>Checkout</h2>
            <div className='checkout'>        
              <div className='checkoutInput'>
                  First Name
                  <input placeholder='First Name'></input>
              </div>
              <div className='checkoutInput'>
                  Last Name
                  <input placeholder='First Name'></input>
              </div>   
              <div className='checkoutInput'>
                  Case Number (optional)
                  <input placeholder='Case Number'></input>
              </div>   
              <div className='checkoutInput'>
                  How did you hear about us? (optional)
                  <input></input>
              </div>  
              <div className='checkoutInput checkoutInputW100'>
                  Address
                    <input></input>
              </div>   
              <div className='checkoutInput checkoutInputW100'>
                  Address 2
                  <input></input>
              </div>   
              <div className='checkoutInput checkoutInputW100'>
                  Number
                  <input></input>
              </div>   
              <div className='checkoutInput checkoutInputThird'>
                  Number 2
                  <input></input>
              </div>  
              <div className='checkoutInput checkoutInputThird'>
                  Number 3
                  <input></input>
              </div>  
              <div className='checkoutInput checkoutInputThird'>
                  Number 3
                  <input></input>
              </div>    
          </div>
          
          <div className='box'>
              <button className='checkoutButton checkoutButtonSize' onClick={()=>setShowCart(true)}>Edit Cart</button>    
              <button className='checkoutButton checkoutButtonSize checkoutButtonBlue' onClick={goToCourse}>
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
        </div>
      </div>  
      {showCart &&
        <Cart close={()=>setShowCart(false)} inCheckout></Cart>
      }
  </>
  )
}

export default CheckOutPage