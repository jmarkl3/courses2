import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import CartCourse from '../CourseTile/CartCourse'
import { getEnrolledCourses } from '../../App/functions'

function LandingCourses2({setID}) {

    // Array of data objects for all of the courses for all sets
    const coursesArray = useSelector(state => state.dbslice.coursesArray)
    // The user data containint which courses the user is enrolled in
    const userData = useSelector(state => state.dbslice.userData)
    // Data for all of the sets
    const setsData = useSelector(state => state.dbslice.setData)
    // Data for just the set that pertains to the landing page this component is on
    const thisSetData = setsData[setID]

    // The arrays that hold sets of data to be displayed
    const [availableCourses, setAvailableCourses] = useState([])
    const [enrolledCoursesArray, setEnrolledCoursesArray] = useState([])

    useEffect(() => {


        
        // ================================================================================
        // Find the courses the user is enrolled in that are in this set
        let tempEnrolledCourses = []
        
        // Create an array of the courseIDs of the courses the user is enrolled in        
        let enrolledCourseIDs = []
        // If there are courses in the user data
        if(typeof userData?.courses === "object"){
            // Convert the object into an array of courseID strings
            enrolledCourseIDs = Object.entries(userData.courses).map(courseDataPair => {return courseDataPair[0]})            
        }

        // Now filter those enrolled course IDs to the set data

        // Make sure there is valid set data and user data
        if(typeof thisSetData?.courseIDs === "object"){
            // An array of course IDs that are in the set and the user is enrolled in            
            enrolledCourseIDs = enrolledCourseIDs.filter(courseID => thisSetData.courseIDs.includes(courseID))
            tempEnrolledCourses = coursesArray.filter(courseData => enrolledCourseIDs.includes(courseData.id))   
        }
        setEnrolledCoursesArray(tempEnrolledCourses)


        // ================================================================================
        // This is an array of course data objects for courses that are in the set and that the user is not already enrolled in
        let tempAvailableCourses = []
        // Make sure there is valid set data with an array of courseIDs in it
        if(thisSetData && typeof thisSetData.courseIDs === "object"){
            // Filter out the course IDs that the user is already enrolled in
            let filteredCourses = thisSetData.courseIDs.filter(courseID => tempEnrolledCourses.includes(courseID))

            // Filter all the courses in all sets to just include the ones that are in this set (determined by an array of IDs on the set data object)
            tempAvailableCourses = coursesArray.filter(course => filteredCourses.includes(course.id))
            
        }
        // Save it in state to be displayed
        setAvailableCourses(tempAvailableCourses)

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
                    {enrolledCoursesArray.map(courseData => (
                        <CartCourse courseData={courseData} draggable={false} key={courseData.id}></CartCourse>
                    ))}
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
                {availableCourses.map(courseData => (
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

export default LandingCourses2