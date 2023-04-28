import React, { useEffect, useRef, useState } from 'react'
import "./Cart.css"
import CartCourse from './CartCourse'
import { priceString } from '../../App/functions'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartCourse, setPage } from '../../App/AppSlice'
import Checkout from '../Unused/Checkout'
import { useNavigate } from 'react-router-dom'

function Cart({close, inCheckout}) {
    const selectedCourseIDs = useSelector(state => state.appslice.selectedCourseIDs)
    const draggingCourseID = useSelector(state => state.appslice.draggingCourseID)
    const checkingOut = useSelector(state => state.appslice.checkingOut)
    //const sampleCourses = useSelector(state => state.appslice.sampleCourses)
    const coursesArray =useSelector(state => state.dbslice.coursesArray)
    // The array of selected courses
    const [selectedCourses, setSelectedCourses] = useState([])
    const [viewAvailable, setViewAvailable] = useState()
    const [cartTotal, setCartTotal] = useState(0)
    const userData =useSelector(state => state.dbslice.userData)
    const [availableCourses, setAvailableCourses] = useState([])

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

    useEffect(() => {
        let tempAvailableCourses = coursesArray?.filter(courseData => !userData?.enrolledCourses?.includes(courseData.id))
        if(Array.isArray(tempAvailableCourses))
            setAvailableCourses(tempAvailableCourses)
    }, [coursesArray, userData])

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
        let total = 0
        selectedCourses.forEach(courseData => {
            total += parseFloat(courseData?.price)
        })
        setCartTotal(priceString(total))
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
        if(checkingOut)    
            close()
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
                                {`${checkingOut ? "Return to Check Out":"Check Out"}  `}
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
                {availableCourses.length > 0 ?
                    <>
                        <div className='cartMenuTitle'>Available Courses</div>
                        <div className='cartMenuItems cartMenuItemsAvailable'>
                            {availableCourses.map((courseData, index)=>(
                                <CartCourse courseData={courseData} addedClass={"cartCourseAvailable"} priceString={priceString} draggable  key={courseData.id}></CartCourse>
                            ))}               
                        </div>
                    </>
                    :
                    <h3 className='center'>
                        You have enrolled in all available courses
                    </h3>
                }
            </div>
            :
            <div className='avaialableCoursesButton'>
                
            </div>

        }

    </div>
  )
}

export default Cart