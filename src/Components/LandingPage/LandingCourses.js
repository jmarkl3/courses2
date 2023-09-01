import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import CartCourse from '../CourseTile/CartCourse'
import { getEnrolledCourses } from '../../App/functions'

function LandingCourses() {

    const coursesArray = useSelector(state => state.dbslice.coursesArray)
    const userData = useSelector(state => state.dbslice.userData)
    const [availableCourses, setAvailableCourses] = useState([])
    const [enrolledCoursesArray, setEnrolledCoursesArray] = useState([])

    useEffect(() => {
        let tempAvailableCourses = coursesArray?.filter(courseData => !userData?.enrolledCourses?.includes(courseData.id))
        if(Array.isArray(tempAvailableCourses))
            setAvailableCourses(tempAvailableCourses)
        setEnrolledCoursesArray(getEnrolledCourses(userData))
         // console.log("coursesArray:")
         // console.log(coursesArray)
    }, [coursesArray, userData])

  return (
    <>
        {userData &&
            <div className={"landingPageTextSection"}>
                <h3 className='center'>
                    {"Your Courses"}
                </h3>  
                <hr></hr>
                <div>
                    {coursesArray.filter(courseData => enrolledCoursesArray.includes(courseData.id)).map(courseData => (
                        <CartCourse courseData={courseData} draggable={false} key={courseData.id}></CartCourse>
                    ))}
                    {/* {coursesArray.filter(courseData => userData?.enrolledCourses?.includes(courseData.id)).map(courseData => (
                        <CartCourse courseData={courseData} draggable={false} key={courseData.id}></CartCourse>
                    ))} */}
                </div>
            </div>
        }
        
        {availableCourses.length > 0 ?                        
            <div className={"landingPageTextSection"}>
                <h3 className='center'>
                    {"Available Courses"}
                </h3>  
                <hr></hr>
                <div>
                {coursesArray.filter(courseData => !enrolledCoursesArray.includes(courseData.id)).map(courseData => (
                    <CartCourse courseData={courseData} draggable={false} key={courseData.id}></CartCourse>
                ))}
                </div>
            </div>
            :
            <div>
                {userData &&
                    <div>
                        <hr></hr>
                        <h3 className='center'>
                            {"You have enrolled in all available courses"}
                        </h3>  
                        <hr></hr>
                    </div>
                }
            </div>
        }
    </>
  )
}

export default LandingCourses