import React, { useRef, useState } from 'react'
import "../../Cart/CartCourse.css"
import { priceString } from '../../../App/functions'
import { useDispatch } from 'react-redux'
import { removeCartCourse, selectCartCourse, setAdminMode, setDraggingCourse, setEditMode} from '../../../App/AppSlice'
import { copyCourse, deleteCourse, selectCourse, updateCourseInfo } from '../../../App/DbSlice'
import HamburgerMenu from '../../../Utils/HamburgerMenu'
import ConfirmationBox from '../../../Utils/ConfirmationBox'
import { useNavigate } from 'react-router-dom'
import AdminCourseTileEdit from './AdminCourseTileEdit'

function AdminCourseTile({course}) {
    const [editing, setEditing] = useState()
    const [confirmDeleteMessage, setConfirmDeleteMessage] = useState()
    const courseNameInputRef = useRef()
    const courseDescriptionInputRef = useRef()
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
    dispatcher(setAdminMode(false))
    navigate("/course/"+course.id)

}
function editCourseFunction(){
    dispatcher(selectCourse(course.id))
    dispatcher(setEditMode(true))
    navigate("/course/"+course.id)
    // dispatcher(setAdminMode(false))

}
function viewCourseAsAdminFunction(){
    dispatcher(selectCourse(course.id))
    dispatcher(setEditMode(false))
    dispatcher(setAdminMode(true))

}

  return (
    <>
        <div className={'cartCourse'} >
                <HamburgerMenu height="190px">            
                    <div className="hamburgerMenuOption" onClick={()=>setEditing(!editing)}>Edit Tile</div>
                    <div className="hamburgerMenuOption" onClick={editCourseFunction}>Edit Course</div>
                    <div className="hamburgerMenuOption" onClick={viewCourseAsAdminFunction}>View Course (admin)</div>
                    <div className="hamburgerMenuOption" onClick={viewCourseFunction}>View Course</div>                            
                    <div className="hamburgerMenuOption" onClick={()=>dispatcher(copyCourse(course.id))}>Copy</div>                            
                    <div className="hamburgerMenuOption" onClick={confirmDelete}>Delete</div>                            
                </HamburgerMenu>
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
                <div className='priceBox priceBoxAdmin priceText'>
                    {priceString(course?.price)}
                </div>
            </div>
            <div className='cartCourseButtons'>
            <>
                <button>Add To Cart</button>
                <button>More Info</button>
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
    </>
  )
}
export default AdminCourseTile