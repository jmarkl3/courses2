import React, { useEffect, useRef, useState } from 'react'
import "./Cart.css"
import CartCourse from '../../CourseTile/CartCourse'
import { getEnrolledCourses, priceString } from '../../../App/functions'
import { useDispatch, useSelector } from 'react-redux'
import { clearCartCourses, loadCartCourses, selectCartCourse, setShowCart, setUserDataOverride } from '../../../App/AppSlice'
import { useNavigate } from 'react-router-dom'
import { enrollUserInCourses2 } from '../../../App/DbSlice'

function Cart() {
    const selectedCourseIDs = useSelector(state => state.appslice.selectedCourseIDs)
    const draggingCourseID = useSelector(state => state.appslice.draggingCourseID)
    const checkingOut = useSelector(state => state.appslice.checkingOut)
    const showCart = useSelector(state => state.appslice.showCart)
    //const sampleCourses = useSelector(state => state.appslice.sampleCourses)
    const coursesArray =useSelector(state => state.dbslice.coursesArray)
    const theme = useSelector(state => state.dbslice.userData?.accountData?.theme)
    // The array of selected courses
    const [selectedCourses, setSelectedCourses] = useState([])
    const [viewAvailable, setViewAvailable] = useState()
    const [cartTotal, setCartTotal] = useState(0)
    const userData = useSelector(state => state.dbslice.userData)
    const userDataOverride = useSelector(state => state.appslice.userDataOverride)
    // The list of courses the user is not enrolled in and has not selected 
    const [availableCourses, setAvailableCourses] = useState([])

    const navigate = useNavigate();
    const dispatcher = useDispatch()

    useEffect(()=>{
        fadeIn()        
        dispatcher(loadCartCourses())
        filterSelectedCourses()
    },[])

    // If the array of selected course IDs changes update the array of selected courses
    useEffect(()=>{
        filterSelectedCourses()

    },[selectedCourseIDs, coursesArray])
    
    // When the array of selected courses changes update the cart total
    useEffect(()=>{
        cartTotalFunction()
    },[selectedCourses])

    useEffect(() => {
        checkAvailableCourses()
    }, [coursesArray, userData, userDataOverride, selectedCourseIDs, selectedCourses])

    function checkAvailableCourses(){
        // An array of all course IDs
        let tempAvailableCourses = coursesArray
        // An array of the course IDs that the user is enrolled in
        let enrolledCourses = getEnrolledCourses((userDataOverride || userData))        
        console.log(enrolledCourses)
        console.log("enrolledCourses")
        
        // An array of the courses IDs that the user has already selected
        let selectedCourseIDs = selectedCourses.map(courseData => courseData.id)

        // Filter out the ones the user is already enrolled in and the ones that are already selected
        tempAvailableCourses = tempAvailableCourses?.filter(courseData => (!enrolledCourses.includes(courseData.id) && !selectedCourseIDs.includes(courseData.id)))

        // Set the available courses state
        setAvailableCourses(tempAvailableCourses)
    }

    function close(){
        dispatcher(setShowCart(false))
        dispatcher(setUserDataOverride(null))

    }

    // Filter the sample courses to only include the selected courses
    function filterSelectedCourses(){
        if(!selectedCourseIDs || !Array.isArray(selectedCourseIDs))
            setSelectedCourses([])
        else
            setSelectedCourses(coursesArray.filter(courseData => selectedCourseIDs.includes(courseData?.id)))
    }

    function cartTotalFunction(){
        let total = 0
        selectedCourses.forEach(courseData => {
            total += parseFloat(courseData?.price)
        })
        setCartTotal(priceString(total))
    }

    const [opacityStyle, setOpacityStyle] = useState()
    function fadeIn(){
        setTimeout(() => {
            setOpacityStyle(1)
            
        }, 100);
    }

    function dragDropCourse(e){
        dispatcher(selectCartCourse(draggingCourseID))
    }
    function openCheckOutOrEnroll(){        
        if(userDataOverride){
            // enroll the user in the selected courses (code for that is in CheckoutPage.js)
            dispatcher(enrollUserInCourses2({userID: userDataOverride.id, courseIDArray: selectedCourseIDs}))   
            dispatcher(clearCartCourses())          

        }
        else{
            if(checkingOut)    
                close()
            if(selectedCourses.length > 0)
                navigate("/Checkout")
        }

    }
    function checkoutButtonText(){
        if(userDataOverride){
            return (
                <div>Enroll User</div>
            )
        }
        else if(selectedCourses.length > 0){
            return(
                <>
                    <span>
                        {`${checkingOut ? "Return to Check Out":"Check Out"}  `}
                    </span>                    
                    <div className='checkoutButtonPrice priceText'>{" (Total: " + cartTotal + ")"}</div> 
                </>
            )
        }else{
            return(
                <div className='smallButtonText'>
                    Drag up a course from below or click 'Add To Cart'
                </div>
            )
        }
    }


  return (
    <>
        {showCart &&         
            <div className={theme}>
                <div className='cartMenu' style={{opacity: opacityStyle}}>        
                    <div className='closeButton' onClick={close}>x</div>
                    <div className={'cartSection yourCart ' + ((viewAvailable || selectedCourseIDs.length < 1) ? "":"cartSectionTall")} onDragOver={(e)=>e.preventDefault()} onDrop={dragDropCourse}>
                        <div className='cartMenuTitle'>{`${userDataOverride ? userDataOverride?.accountData?.firstName+"'s":"Your" }`} Cart</div>
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
                            <button className='checkoutButton checkoutButtonSize checkoutButtonBlue' onClick={openCheckOutOrEnroll}>
                                {checkoutButtonText()}
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
                                    You have selected or enrolled in all available courses
                                </h3>
                            }
                        </div>
                        :
                        <div className='avaialableCoursesButton'>
                            
                        </div>
                    }
                </div>
            </div>
        }
    </>
  )
}

export default Cart