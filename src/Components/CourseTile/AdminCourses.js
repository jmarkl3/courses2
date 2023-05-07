import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCourse } from '../../App/DbSlice'
import { objectToArray } from '../../App/functions'
import "./Courses.css"
import AdminCourseTile from './AdminCourseTile'

// Mapping the coursesData to CourseTile components
function Courses() {
    const coursesData = useSelector(state => state.dbslice.coursesData)
    const [coursesDataArray, setCoursesDataArray] = useState([])
    const dispacher = useDispatch()

    useEffect(() => {
        // Convert the object to an array
        var tempArray = objectToArray(coursesData)
        setCoursesDataArray(tempArray)

    }, [coursesData])

  return (
    <div>
    <div className='cartCourse newCourseButton' onClick={()=>dispacher(addCourse())}>
            New Course
        </div>
        {coursesDataArray.map(course => (
            <AdminCourseTile course={course} key={course.id}></AdminCourseTile>
        ))}
    </div>
  )
}

export default Courses