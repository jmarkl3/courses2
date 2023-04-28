import React, { useEffect, useRef, useState } from 'react'
import "./Cart.css"
import CartCourse from './CartCourse'
import { priceString } from '../../App/functions'
import { useDispatch, useSelector } from 'react-redux'
import { loadCartCourses, selectCartCourse, setShowCart } from '../../App/AppSlice'
import { useNavigate } from 'react-router-dom'

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
    const userData =useSelector(state => state.dbslice.userData)
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
        let tempAvailableCourses = coursesArray?.filter(courseData => !userData?.enrolledCourses?.includes(courseData.id))
        tempAvailableCourses = tempAvailableCourses?.filter(courseData => !selectedCourseIDs.includes(courseData.id))
        setAvailableCourses(tempAvailableCourses)
    }, [coursesArray, userData, selectedCourseIDs])

    function close(){
        dispatcher(setShowCart(false))
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

    const [opacityStyle, setOpacityStyle] = useState()
    function fadeIn(){
        setTimeout(() => {
            setOpacityStyle(1)
            
        }, 100);
    }

    function dragDropCourse(e){
        dispatcher(selectCartCourse(draggingCourseID))
    }
    function openCheckOut(){        
        if(checkingOut)    
            close()
        if(selectedCourses.length > 0)
            navigate("/Checkout")

    }


  return (
    <>
        {showCart &&         
            <div className={theme}>
                <div className='cartMenu' style={{opacity: opacityStyle}}>        
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