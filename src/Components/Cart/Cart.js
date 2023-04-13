import React, { useEffect, useRef, useState } from 'react'
import "./Cart.css"
import CartCourse from './CartCourse'
import { priceString } from '../../App/functions'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartCourse } from '../../App/AppSlice'
import Checkout from './Checkout'

function Cart({close, sampleCourses}) {
    // The array of selected courses
    const [selectedCourses, setSelectedCourses] = useState([])
    const [checkingOut, setCheckingOut] = useState(false)
    const [cartTotal, setCartTotal] = useState(0)
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
    // When the array of selected courses changes update the cart total
    useEffect(()=>{
        cartTotalFunction()
    },[selectedCourses])

    // Filter the sample courses to only include the selected courses
    function filterSelectedCourses(){
        setSelectedCourses(sampleCourses.filter(courseData => selectedCourseIDs.includes(courseData?.id)))
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


  return (
    <div className='cartMenu' ref={cartMenuRef}>        
        <div className='closeButton' onClick={close}>x</div>
        <div className={'cartSection yourCart ' + (checkingOut ? " cartSectionCheckingOut":"")} onDragOver={(e)=>e.preventDefault()} onDrop={dragDropCourse}>
            <div className='cartMenuTitle'>Your Cart</div>
            {!checkingOut && 
                <div className='yourCartButtons'>
                    <button className='checkoutButton checkoutButtonSize' onClick={()=>setCheckingOut(true)}>
                        {selectedCourses.length > 0 ? 
                            <>
                                <span>
                                    {"Check Out "}
                                </span>                    
                                <div className='checkoutButtonPrice priceText'>{" (Total: " + cartTotal + ")"}</div>    
                            </>
                            :
                            <div className='smallButtonText'>
                                Drag a course from below or click 'Add To Cart'
                            </div>
                        }
                    </button>
                </div>
            }
            <div className={'cartMenuItems ' + (checkingOut ? " cartMenuItemsCheckingOut":"")} >
                {selectedCourses.map((courseData, index)=>(
                    <CartCourse courseData={courseData} selected></CartCourse>
                ))} 
                {selectedCourses.length === 0 && 
                    <div className='cartMenuItemsMessage'>                    
                        Drag a course from below or click 'Add To Cart'                    
                    </div>
                }
            </div>
    
        </div>
        {checkingOut?
            <div className='checkoutContiner'>
                <Checkout back={()=>setCheckingOut(false)} cartTotal={cartTotal}></Checkout>
            </div>
            :
            <div className='cartSection'>
                <div className='cartMenuTitle'>Available Courses</div>
                <div className='cartMenuItems cartMenuItemsAvailable'>
                    {sampleCourses.map((courseData, index)=>(
                        <CartCourse courseData={courseData} addedClass={"cartCourseAvailable"} priceString={priceString}></CartCourse>
                    ))}               
                </div>
            </div>
        }
    </div>
  )
}

export default Cart