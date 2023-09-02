import React from 'react'
import { useSelector } from 'react-redux'
import CourseSelectorRow from './CourseSelectorRow'


/*
    This component will be used to select courses that will be added to a set

    this component will handle:
        pulling the courses data and displaying it to be selected, maybe with a name filter search
        saving the coursesID into an array in the set data
        displaying the courses that are saved in the array in the set data
    
    

*/
function CourseSelector({setID}) {

    // The course data for all courses
    const coursesData = useSelector(state => state.dbslice.coursesData)
    // The data for the set the user is looking at
    const setData = useSelector(state => state.dbslice.setData)[setID]
    // The IDs of the courses on the set
    const setCourseIDs = setData.courseIDs || []

    console.log("coursesData")
    console.log(coursesData)

    console.log("setCourseIDs")
    console.log(setCourseIDs)

  return (
    <div>
        Courses In Set:
        {coursesData && typeof coursesData == "object" &&
            setCourseIDs.map(courseID => (
                <div>
                    {/* {coursesData && coursesData[courseID]?.name} */}
                    <CourseSelectorRow courseData={coursesData[courseID]} courseID={courseID} setID={setID} inSet={true}></CourseSelectorRow>
                </div>
            ))
        }
        <hr></hr>
        Available Courses:
        {coursesData && typeof coursesData === "object" && Object.entries(coursesData).map(courseData => (
            <CourseSelectorRow courseData={courseData[1]} courseID={courseData[0]} setID={setID}></CourseSelectorRow>
            
        ))}

    </div>
  )
}

export default CourseSelector