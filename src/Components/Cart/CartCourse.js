import React, { useEffect, useRef, useState } from 'react'
import "./CartCourse.css"
import { priceString } from '../../App/functions'
import { useDispatch, useSelector } from 'react-redux'
import { removeCartCourse, selectCartCourse, setDraggingCourse, setShowCart} from '../../App/AppSlice'
import { useNavigate } from 'react-router-dom'
import CartCourseMoreInfo from './CartCourseMoreInfo'

function CartCourse({courseData, selected, draggable, readOnly}) {
    const userData = useSelector(state => state.dbslice.userData)
    const [showMoreInfo, setShowMoreInfo] = useState(false)
    const dispacher = useDispatch()    
    const navigate = useNavigate()

    useEffect(()=>{
        checkIfIsEnrolledInCourse()
    }, [userData])

    function selectCourse(){
        dispacher(setShowCart(true))
        dispacher(selectCartCourse(courseData.id))
    }
    const [isEnrolledInCourse, setIsEnrolledInCourse] = useState(false)
    function checkIfIsEnrolledInCourse(){
        if(userData?.enrolledCourses && Array.isArray(userData?.enrolledCourses))
            setIsEnrolledInCourse(userData?.enrolledCourses?.includes(courseData.id))
        else    
            setIsEnrolledInCourse(false)
    }

  return (
    <div 
        className={'cartCourse ' + (draggable ? "draggable":"")} 
        draggable={!selected && draggable} 
        onDragStart={()=>dispacher(setDraggingCourse(courseData.id))}
    >
        <div className='cartCourseImage'>
            <img src={courseData?.image}></img>
        </div>
        <div className='cartCourseText'>
            <div className='cartCourseName'>
                {courseData?.name}
            </div>
            <div className='cartCourseDescription'>
                {courseData?.description}
            </div>
            {isEnrolledInCourse ?
                <div className='priceBox'>
                    Progress Status
                </div>
                :           
                <div className='priceBox priceText'>
                    {priceString(courseData?.price)}
                </div>
            }
        </div>
        <div className='cartCourseButtons'>
        {isEnrolledInCourse?
            <>
                <button onClick={()=>navigate("/Course/"+courseData.id)}>Go To Course</button>
                <button onClick={()=>setShowMoreInfo(true)}>More Info</button>
            </>
            :
            <>
                {selected ?
                    <>
                        {!readOnly &&
                            <button onClick={()=>dispacher(removeCartCourse(courseData.id))}>Remove</button>
                        }
                        <button onClick={()=>setShowMoreInfo(true)}>More Info</button>
                    </>
                    :
                    <>
                        <button onClick={selectCourse}>Add To Cart</button>
                        <button onClick={()=>setShowMoreInfo(true)}>More Info</button>
                    </>
                }
            </>
        }        
        </div>
        {showMoreInfo &&
            <CartCourseMoreInfo courseData={courseData} close={()=>setShowMoreInfo(false)}></CartCourseMoreInfo>
        }
    </div>
  )
}

export default CartCourse