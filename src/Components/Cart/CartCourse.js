import React, { useRef } from 'react'
import "./CartCourse.css"
import { priceString } from '../../App/functions'
import { useDispatch } from 'react-redux'
import { removeCartCourse, selectCartCourse, setDraggingCourse} from '../../App/AppSlice'

function CartCourse({courseData, selected, allowRemove, draggable, showCart, readOnly}) {
    const dispacher = useDispatch()

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
        {!selected ?
            <>
                <button onClick={selectCourse}>Add To Cart</button>
                <button>More Info</button>
            </>:
            <>
                {!readOnly &&
                    <button onClick={()=>dispacher(removeCartCourse(courseData.id))}>Remove</button>
                }
                <button>More Info</button>
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