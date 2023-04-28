import React from 'react'
import "./Dashboards.css"
import { useSelector } from 'react-redux'
import CartCourse from '../../Cart/CartCourse'

function UserDash() {
  const coursesArray = useSelector(state => state.dbslice.coursesArray)
  const userData = useSelector(state => state.dbslice.userData)

  return (
    <div>
      
      <div>
        <h3>
          Your Courses
        </h3>
        <div>
          {coursesArray.filter(courseData => userData?.enrolledCourses?.includes(courseData.id)).map(courseData => (
              <CartCourse courseData={courseData} draggable={false} key={courseData.id}></CartCourse>
          ))}
      </div>
      </div>
    </div>
  )
}

export default UserDash