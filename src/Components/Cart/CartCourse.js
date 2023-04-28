import React, { useEffect, useRef } from 'react'
import "./CartCourse.css"
import { priceString } from '../../App/functions'
import { useDispatch, useSelector } from 'react-redux'
import { removeCartCourse, selectCartCourse, setDraggingCourse} from '../../App/AppSlice'
import { useNavigate } from 'react-router-dom'

function CartCourse({courseData, selected, allowRemove, draggable, showCart, readOnly}) {
    const userData = useSelector(state => state.dbslice.userData)
    const isEnrolledInCourse = userData?.enrolledCourses?.includes(courseData.id)
    const dispacher = useDispatch()    
    const navigate = useNavigate()

    function selectCourse(){
        showCart()
        dispacher(selectCartCourse(courseData.id))
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
            <div className='priceBox priceText'>
                {priceString(courseData?.price)}
            </div>
        </div>
        <div className='cartCourseButtons'>
        {isEnrolledInCourse?
            <>
                <button onClick={()=>navigate("/Course/"+courseData.id)}>Go To Course</button>
                <button>More Info</button>
            </>
            :
            <>
                {selected ?
                    <>
                        {!readOnly &&
                            <button onClick={()=>dispacher(removeCartCourse(courseData.id))}>Remove</button>
                        }
                        <button>More Info</button>
                    </>
                    :
                    <>
                        <button onClick={selectCourse}>Add To Cart</button>
                        <button>More Info</button>
                    </>
                }
            </>
        }        
        </div>
    </div>
  )
}
CartCourse.defaultProps = {
    showCart: ()=>{},
}
export default CartCourse