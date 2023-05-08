import React from 'react'
import { useSelector } from 'react-redux'
import CartCourse from '../../../CourseTile/CartCourse'

function UserCourses() {
    const coursesArray = useSelector(state => state.dbslice.coursesArray)
    const userData = useSelector(state => state.dbslice.userData)
  
  return (
    <>
        {coursesArray.filter(courseData => userData?.enrolledCourses?.includes(courseData.id)).map(courseData => (
            <CartCourse courseData={courseData} draggable={false} key={courseData.id}></CartCourse>
        ))}
    </>
  )
}

export default UserCourses