import React from 'react'
import "./CourseSelectorRow.css"
import { runTransaction, ref, remove  } from 'firebase/database'
import { database } from '../../App/DbSlice'


function CourseSelectorRow({setID, courseID, courseData, inSet}) {

    function removeCourseFromSet(_courseID){
        if(!setID){
            console.log("addCourseToSet no set ID")
            return
        }

        runTransaction(ref(database, "coursesApp/sets/"+setID+"/courseIDs"), item => {
            if(!item)
                item = []

            if(!item.includes(_courseID))
                return item

            item = item.filter(tempCourseID => tempCourseID !== _courseID)

            return item
        })
    }

    function addCourseToSet(_courseID){
        if(!setID){
            console.log("addCourseToSet no set ID")
            return
        }

        runTransaction(ref(database, "coursesApp/sets/"+setID+"/courseIDs"), item => {
            if(!item)
                item = []

            if(item.includes(_courseID))
                return item

            item.push(_courseID)

            return item
        })
    }

  return (
    <div className='box courseSelectorRow'>
        {courseData.name}   
        <div className='courseSelectorButtonContainer'>
            {inSet ? 
                <button title="Remove Course From Set" onClick={()=>removeCourseFromSet(courseID)}>-</button>
                :
                <button title="Add Course To Set" onClick={()=>addCourseToSet(courseID)}>+</button>
            }
            <button title="View Course Details">V</button>
        </div>
    </div>
  )
}

export default CourseSelectorRow