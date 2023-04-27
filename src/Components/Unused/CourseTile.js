import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { copyCourse, deleteCourse, selectCourse, updateCourseInfo } from '../../App/DbSlice'
import "./CourseTile.css"
// import "../../../Styles/Slider.css"
import ConfirmationBox from '../../Utils/ConfirmationBox'
import HamburgerMenu from '../../Utils/HamburgerMenu'
import { setAdminMode, setEditMode } from '../../App/AppSlice'


function CourseTile({course}) {
    const [editing, setEditing] = useState()
    const [confirmDeleteMessage, setConfirmDeleteMessage] = useState()
    const courseNameInputRef = useRef()
    const courseDescriptionInputRef = useRef()
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
        dispatcher(selectCourse(course.id))
        dispatcher(setEditMode(false))
        dispatcher(setAdminMode(false))

    }
    function editCourseFunction(){
        console.log(course.id)
        dispatcher(selectCourse(course.id))
        dispatcher(setEditMode(true))
        // dispatcher(setAdminMode(false))

    }
    function viewCourseAsAdminFunction(){
        dispatcher(selectCourse(course.id))
        dispatcher(setEditMode(false))
        dispatcher(setAdminMode(true))

    }

  return (
    <div 
        className='courseTile' 
        key={course.id}
        onClick={openCourse}
    >
        <HamburgerMenu height="190px">            
            <div className="hamburgerMenuOption" onClick={()=>setEditing(!editing)}>Edit Tile</div>
            <div className="hamburgerMenuOption" onClick={editCourseFunction}>Edit Course</div>
            <div className="hamburgerMenuOption" onClick={viewCourseAsAdminFunction}>View Course (admin)</div>
            <div className="hamburgerMenuOption" onClick={viewCourseFunction}>View Course</div>                            
            <div className="hamburgerMenuOption" onClick={()=>dispatcher(copyCourse(course.id))}>Copy</div>                            
            <div className="hamburgerMenuOption" onClick={confirmDelete}>Delete</div>                            
        </HamburgerMenu>
        {editing ?
            <div>
                <label className="switch" title="Title">
                    <input type="checkbox"/>
                    <span className="slider round"></span>
                </label>
                <label className="switch" title="Title">
                    <input type="checkbox"/>
                    <span className="slider round"></span>
                </label>
                <div className='courseTileTitleEdit'>
                    <input defaultValue={course.name} ref={courseNameInputRef}></input>
                </div>
                <div className='courseTileDescription'>
                    <textarea defaultValue={course.description} ref={courseDescriptionInputRef}></textarea>
                </div>
                <div className='buttonHolder'>
                    <button onClick={()=>setEditing(false)}>Cancel</button>
                    <button onClick={updateCourse}>Save</button>
                </div>
            </div>
            :
            <div>
                <div className='courseTileTitle'>
                    {course.name}
                </div>
                <div className='courseTileDescription'>
                    {course.description}
                </div>
            </div>
        }
        <ConfirmationBox 
            message={confirmDeleteMessage}
            cancel={() => {setConfirmDeleteMessage()}}
            confirm={() => {dispatcher(deleteCourse(course.id))}}
        ></ConfirmationBox>
    </div>
  )
}

export default CourseTile