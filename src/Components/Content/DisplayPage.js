import React from 'react'
import Sidebar from '../Sidebar/SideNav'
import "./DisplayPage.css"
import topImage from "../../Images/topImage.jpg"
import Course from './Course/Course'
import Courses from './Courses/Courses'
import { useSelector } from 'react-redux'

function DisplayPage() {
    const sideNavOpen = useSelector(state => state.appslice.sideNavOpen)
    const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)

//         {/* `displayPagePage ${(sideNavOpen && selectedCourseID) ? "displayPageInnerNavOpen":""} */}


  return (
    <>    
        <div className='pagePackground'>
            <div className='topImage'>
                <img src={topImage}></img>
            </div>        
        </div>
        <div className={`pageOuter ${(sideNavOpen && selectedCourseID) ? "pageOuterNavOpen":""}`}>
            <div className='pageInner'>
                {selectedCourseID ? 
                    <Course></Course>
                    :
                    <Courses></Courses>
                }
            </div>
        </div>  
    </>
  )
}

export default DisplayPage