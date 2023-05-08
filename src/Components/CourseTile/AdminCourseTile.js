import React, { useRef, useState } from 'react'
import "./CartCourse.css"
import { priceString } from '../../App/functions'
import { useDispatch, useSelector } from 'react-redux'
import { setEditMode} from '../../App/AppSlice'
import { copyCourse, deleteCourse, selectCourse, updateCourseInfo } from '../../App/DbSlice'
import HamburgerMenu from '../../Utils/HamburgerMenu'
import ConfirmationBox from '../../Utils/ConfirmationBox'
import { useNavigate } from 'react-router-dom'
import AdminCourseTileEdit from './AdminCourseTileEdit'
import CartCourseMoreInfo from './CartCourseMoreInfo'

function AdminCourseTile({course}) {
    const userData = useSelector(state => state.dbslice.userData)
    const fullAdmin = useSelector(state => state.dbslice.userData?.accountData?.fullAdmin)
    const courseAdmin = useSelector(state => state.dbslice.userData?.accountData?.courseAdmin)
    const [confirmDeleteMessage, setConfirmDeleteMessage] = useState()
    const [editing, setEditing] = useState()
    const [showMoreInfo, setShowMoreInfo] = useState(false)
    const courseDescriptionInputRef = useRef()
    const courseNameInputRef = useRef()
    const navigate = useNavigate()
    const dispatcher = useDispatch()

   // When the user clicks on the tile, open the course (if not editing)
   function openCourse(){
    if(editing) return        
    editCourseFunction()
}

function updateCourse(){
    var newName = courseNameInputRef.current.value
    var newDescription = courseDescriptionInputRef.current.value
    dispatcher(updateCourseInfo({courseID: course.id, newName: newName, newDescription: newDescription}))
    setEditing(false)
}

function confirmDelete(){
    setConfirmDeleteMessage("Are you sure you want to delete this course? ("+course.name+")")
}

function viewCourseFunction(){    
    // dispatcher(selectCourse(course.id))
    dispatcher(setEditMode(false))    
    navigate("/course/"+course.id)

}
function editCourseFunction(){
    // dispatcher(selectCourse(course.id))
    dispatcher(setEditMode(true))
    navigate("/course/"+course.id)

}

  return (
    <>
        <div className={'cartCourse'} >
            {(fullAdmin || (courseAdmin && courseAdmin.includes(course.id))) && 
                <HamburgerMenu height="190px">            
                    <div className="hamburgerMenuOption" onClick={()=>setEditing(!editing)}>Edit Tile</div>
                    <div className="hamburgerMenuOption" onClick={editCourseFunction}>Edit Course</div>
                    <div className="hamburgerMenuOption" onClick={viewCourseFunction}>View Course</div>                            
                    <div className="hamburgerMenuOption" onClick={()=>dispatcher(copyCourse(course.id))}>Copy</div>                            
                    <div className="hamburgerMenuOption" onClick={confirmDelete}>Delete</div>                            
                </HamburgerMenu>            
            }
            <div className='cartCourseImage'>
                <img src={course?.image}></img>
            </div>
            <div className='cartCourseText'>
                <div className='cartCourseName'>
                    {course?.name}
                </div>
                <div className='cartCourseDescription'>
                    {course?.description}
                </div>
                <div className={`priceBox priceText ${(fullAdmin || (courseAdmin && courseAdmin.includes(course.id))) ? "priceBoxAdmin":""}`}>
                    {priceString(course?.price)}
                </div>
            </div>
            <div className='cartCourseButtons adminCartCourseButtons'>
            <>
                <button onClick={viewCourseFunction}>View</button>
                <button onClick={editCourseFunction}>Edit</button>
                <button onClick={()=>setShowMoreInfo(true)}>More Info</button>
            </>
            </div>
        </div>
        <ConfirmationBox 
            message={confirmDeleteMessage}
            cancel={() => {setConfirmDeleteMessage()}}
            confirm={() => {dispatcher(deleteCourse(course.id))}}
        ></ConfirmationBox>
        {editing && 
            <AdminCourseTileEdit course={course} close={()=>setEditing(false)}></AdminCourseTileEdit>
        }
        {showMoreInfo &&
            <CartCourseMoreInfo courseData={course} close={()=>setShowMoreInfo(false)}></CartCourseMoreInfo>
        }
    </>
  )
}
export default AdminCourseTile