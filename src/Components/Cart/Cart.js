import React, { useEffect, useRef, useState } from 'react'
import "./Cart.css"
import CartCourse from './CartCourse'
import { priceString } from '../../App/functions'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartCourse, setPage } from '../../App/AppSlice'
import Checkout from '../Checkout/Checkout'
import { useNavigate } from 'react-router-dom'

function Cart({close, inCheckout}) {
    // The array of selected courses
    const [selectedCourses, setSelectedCourses] = useState([])
    const [viewAvailable, setViewAvailable] = useState()
    const [cartTotal, setCartTotal] = useState(0)
    const selectedCourseIDs = useSelector(state => state.appslice.selectedCourseIDs)
    const draggingCourseID = useSelector(state => state.appslice.draggingCourseID)
    //const sampleCourses = useSelector(state => state.appslice.sampleCourses)
    const coursesArray =useSelector(state => state.dbslice.coursesArray)
    const navigate = useNavigate();
    const dispacher = useDispatch()

    useEffect(()=>{
        fadeIn()
        loadCartCourses()
    },[])

    // If the array of selected course IDs changes update the array of selected courses
    useEffect(()=>{
        filterSelectedCourses()

    },[selectedCourseIDs])
    // When the array of selected courses changes update the cart total
    useEffect(()=>{
        cartTotalFunction()
    },[selectedCourses])

    // If there are previously selected courses in localStroage load them
    function loadCartCourses(){        
        const previouslySelectedCourseIDsString = window.localStorage.getItem("selectedCourseIDs")        
     
        if(previouslySelectedCourseIDsString){
            let previouslySelectedCourseIDs = previouslySelectedCourseIDsString.split(",")            
            dispacher(selectCartCourse(previouslySelectedCourseIDs))            
        }
    }

    // Filter the sample courses to only include the selected courses
    function filterSelectedCourses(){
        setSelectedCourses(coursesArray.filter(courseData => selectedCourseIDs.includes(courseData?.id)))
    }

    function cartTotalFunction(){
        setCartTotal(priceString(selectedCourses.reduce((total, courseData) => total + courseData?.price, 0)))        
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
    function openCheckOut(){            
        if(selectedCourses.length > 0)
            navigate("/Checkout")

    }


  return (
    <div className='cartMenu' ref={cartMenuRef}>        
        <div className='closeButton' onClick={close}>x</div>
        <div className={'cartSection yourCart ' + ((viewAvailable || selectedCourseIDs.length < 1) ? "":"cartSectionTall")} onDragOver={(e)=>e.preventDefault()} onDrop={dragDropCourse}>
            <div className='cartMenuTitle'>Your Cart</div>
            <div className='yourCartButtons'>
                <button className='checkoutButton checkoutButtonSize checkoutButtonBlue' onClick={()=>setViewAvailable(!viewAvailable)}>
                    {selectedCourses.length > 0 ? 
                        (
                            viewAvailable ? 
                                <div className='smallButtonText'>
                                    Hide Other Available Courses
                                </div>
                                :
                                <div className='smallButtonText'>
                                    View Other Available Courses
                                </div>
                        )
                        :
                        <div className='smallButtonText'>
                            Drag up a course from below or click 'Add To Cart'
                        </div>
                    }                  
                </button>
                <button className='checkoutButton checkoutButtonSize checkoutButtonBlue' onClick={openCheckOut}>
                    {selectedCourses.length > 0 ? 
                        <>
                            <span>
                                {"Check Out "}
                            </span>                    
                            <div className='checkoutButtonPrice priceText'>{" (Total: " + cartTotal + ")"}</div>    
                        </>
                        :
                        <div className='smallButtonText'>
                            Drag up a course from below or click 'Add To Cart'
                        </div>
                    }
                </button>
            
                </div>
            <div className={'cartMenuItems '} >
                {selectedCourses.map((courseData, index)=>(
                    <CartCourse courseData={courseData} selected key={courseData.id}></CartCourse>
                ))} 
                {selectedCourses.length === 0 && 
                    <div className='cartMenuItemsMessage'>                    
                        Drag a course from below or click 'Add To Cart'                    
                    </div>
                }
            </div>
    
        </div>
        <div className='cartDivider'></div>
        {(viewAvailable || selectedCourseIDs.length < 1) ? 
            <div className='cartSection'>
                <div className='cartMenuTitle'>Available Courses</div>
                <div className='cartMenuItems cartMenuItemsAvailable'>
                    {coursesArray.map((courseData, index)=>(
                        <CartCourse courseData={courseData} addedClass={"cartCourseAvailable"} priceString={priceString} draggable  key={courseData.id}></CartCourse>
                    ))}               
                </div>
            </div>
            :
            <div className='avaialableCoursesButton'>
                
            </div>

        }

    </div>
  )
}

export default Cart