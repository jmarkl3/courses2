import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CartCourse from '../../../CourseTile/CartCourse'

function UserCourses() {
    const coursesArray = useSelector(state => state.dbslice.coursesArray)
    const userData = useSelector(state => state.dbslice.userData)
  
    useEffect(() => {
      generateEnrolledCoursesArray()
    }, [userData, coursesArray])

    const [enrolledCoursesArray, setEnrolledCoursesArray] = useState([])
    function generateEnrolledCoursesArray(){
      if(!userData || !userData?.courses || typeof userData?.courses !== "object") {            
          setEnrolledCoursesArray([])
          return
      }

      // Get an array of courseIDs that the user is enrolled in
      let tempEnrolledCoursesArray = []
      // Look through each course in their data
      Object.entries(userData?.courses).forEach(course => {
          // If there enrolled in it add the id to the array
          if(course[1].enrolled)
              tempEnrolledCoursesArray.push(course[0])
      })

      // Put the array in state to be displayed 
      setEnrolledCoursesArray(tempEnrolledCoursesArray)
      
  }

  return (
    <>
        {coursesArray.filter(courseData => enrolledCoursesArray.includes(courseData.id)).map(courseData => (
            <CartCourse courseData={courseData} draggable={false} key={courseData.id}></CartCourse>
        ))}
    </>
  )
}

export default UserCourses