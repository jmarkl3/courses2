import React, { useEffect, useRef, useState } from 'react'
import "./Cart.css"
import CartCourse from './CartCourse'
import { priceString } from '../../App/functions'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartCourse } from '../../App/AppSlice'

function Cart({close, sampleCourses}) {
    // The array of selected courses
    const [selectedCourses, setSelectedCourses] = useState([])
    const selectedCourseIDs = useSelector(state => state.appslice.selectedCourseIDs)
    const draggingCourseID = useSelector(state => state.appslice.draggingCourseID)
    const dispacher = useDispatch()

    useEffect(()=>{
        fadeIn()
    },[])

    // If the array of selected course IDs changes update the array of selected courses
    useEffect(()=>{
        filterSelectedCourses()

    },[selectedCourseIDs])

    // Filter the sample courses to only include the selected courses
    function filterSelectedCourses(){
        setSelectedCourses(sampleCourses.filter(courseData => selectedCourseIDs.includes(courseData?.id)))
    }

    function cartTotal(){
        return priceString(selectedCourses.reduce((total, courseData) => total + courseData?.price, 0))
    }

    const cartMenuRef = useRef()
    function fadeIn(){
        setTimeout(() => {
            cartMenuRef.current.style.opacity = 1
            
        }, 100);
    }

    function dragDropCourse(e){
        dispacher(selectCartCourse(draggingCourseID))
    }


  return (
    <div className='cartMenu' ref={cartMenuRef}>        
        <div className='closeButton' onClick={close}>x</div>
        <div className='cartSection yourCart' onDragOver={(e)=>e.preventDefault()} onDrop={dragDropCourse}>
            <div className='cartMenuTitle'>Your Cart</div>
            <div className='cartMenuItems'>
                {selectedCourses.map((courseData, index)=>(
                    <CartCourse courseData={courseData} selected></CartCourse>
                ))} 
            </div>
            <div className='yourCartButtons'>
                <button className='checkoutButton'>
                    <span>
                        {"Checkout "}
                    </span>                    
                    <div className='checkoutButtonPrice priceText'>{" (Total: "+cartTotal()+")"}</div>    
                </button>
            </div>
        </div>
        <div className='cartSection'>
            <div className='cartMenuTitle'>Available Courses</div>
            <div className='cartMenuItems'>
                {sampleCourses.map((courseData, index)=>(
                    <CartCourse courseData={courseData} addedClass={"cartCourseAvailable"} priceString={priceString}></CartCourse>
                ))}               
            </div>
        </div>
    </div>
  )
}

export default Cart