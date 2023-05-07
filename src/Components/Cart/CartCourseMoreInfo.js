import React, { useEffect, useState } from 'react'
import "./CartCourseMoreInfo.css"
import { useDispatch, useSelector } from 'react-redux'
import { selectCartCourse, setShowCart } from '../../App/AppSlice'
import { useNavigate } from 'react-router-dom'

function CartCourseMoreInfo({courseData, close}) {

    const userData = useSelector(state => state.dbslice.userData)
    const dispacher = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        checkIfIsEnrolledInCourse()
    } ,[])

    const [isEnrolledInCourse, setIsEnrolledInCourse] = useState(false)
    function checkIfIsEnrolledInCourse(){
        if(userData?.enrolledCourses && Array.isArray(userData?.enrolledCourses))
            setIsEnrolledInCourse(userData?.enrolledCourses?.includes(courseData.id))
        else    
            setIsEnrolledInCourse(false)
    }

    function selectCourse(){
        dispacher(setShowCart(true))
        dispacher(selectCartCourse(courseData.id))
        close()
    }

  return (
    <div className='box cartCourseMoreInfo'>
        <div className='closeButton' onClick={close}>x</div>
        <div className='courseInfoImage'><img src={courseData?.image}></img></div>
        <div className='textSection'>
            <div className='nameDisplay'>{courseData.name}</div>
            <div className='descriptionDisplay'>{courseData.descriptionLong}</div>
        </div>
        {isEnrolledInCourse ? 
            <button className='courseInfoBottomButton' onClick={()=>navigate("/Course/"+courseData.id)}>Go to Course</button>
            :
            <button className='courseInfoBottomButton' onClick={selectCourse}>Add to Cart</button>        
        }
    </div>
  )
}

export default CartCourseMoreInfo