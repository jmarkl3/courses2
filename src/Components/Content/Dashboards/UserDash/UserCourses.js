import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CartCourse from '../../../CourseTile/CartCourse'

function UserCourses({userDataOverride}) {
    const coursesArray = useSelector(state => state.dbslice.coursesArray)
    const userData = useSelector(state => state.dbslice.userData)
  
    useEffect(() => {
      generateEnrolledCoursesArray()
    }, [userData, coursesArray, userDataOverride])

    const [enrolledCoursesArray, setEnrolledCoursesArray] = useState([])
    function generateEnrolledCoursesArray(){
      // Get an array of courseIDs that the user is enrolled in
      let tempEnrolledCoursesArray = []
      
      // Look through each course in their data      
      const userDataTemp = userDataOverride?.courses || userData?.courses  
      if(!userDataTemp || typeof userDataTemp !== "object") return
      Object.entries(userDataTemp).forEach(([courseID, courseUserData]) => {
     
          // If there enrolled in it add the id to the array
          if(courseUserData.enrolled)
              tempEnrolledCoursesArray.push(courseID)
      })

      // Put the array in state to be displayed 
      setEnrolledCoursesArray(tempEnrolledCoursesArray)
      
  }

  return (
    <>
        {coursesArray.filter(courseData => enrolledCoursesArray.includes(courseData.id)).map(courseData => (
            <CartCourse courseData={courseData} draggable={false} key={courseData.id} adminInfoMode userDataOverride={userDataOverride}></CartCourse>
        ))}
    </>
  )
}

export default UserCourses