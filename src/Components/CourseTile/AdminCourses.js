import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCourse } from '../../App/DbSlice'
import { objectToArray } from '../../App/functions'
import "./Courses.css"
import AdminCourseTile from './AdminCourseTile'
import SearchPager from '../Utility/SearchPager'

// Mapping the coursesData to CourseTile components
function Courses() {
    const coursesData = useSelector(state => state.dbslice.coursesData)
    const [coursesDataArray, setCoursesDataArray] = useState([])
    const dispacher = useDispatch()

  return (
    <div>    
      <h3>Courses</h3>  
      <SearchPager 
        dataObject={coursesData} 
        searchKey="name" 
        setFilteredDataArray={setCoursesDataArray}
      ></SearchPager>
      {coursesDataArray.map((course, index) => (
          <AdminCourseTile course={course} key={course.id +""+ index}></AdminCourseTile>
      ))}
      <div className='cartCourse newCourseButton' onClick={()=>dispacher(addCourse())}>
        New Course
      </div>

    </div>
  )
}

export default Courses