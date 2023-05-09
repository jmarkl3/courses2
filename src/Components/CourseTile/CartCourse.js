import React, { useEffect, useRef, useState } from 'react'
import "./CartCourse.css"
import { getUserData, priceString } from '../../App/functions'
import { useDispatch, useSelector } from 'react-redux'
import { removeCartCourse, selectCartCourse, setDraggingCourse, setShowCart} from '../../App/AppSlice'
import { useNavigate } from 'react-router-dom'
import CartCourseMoreInfo from './CartCourseMoreInfo'
import { type } from '@testing-library/user-event/dist/type'

function CartCourse({courseData, selected, draggable, readOnly}) {
    const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
    const userData = useSelector(state => state.dbslice.userData)
    const [showMoreInfo, setShowMoreInfo] = useState(false)
    const dispacher = useDispatch()    
    const navigate = useNavigate()

    useEffect(()=>{
        checkIfIsEnrolledInCourse()
        checkCourseProgress()
    }, [userData])

    function selectCourse(){
        dispacher(setShowCart(true))
        dispacher(selectCartCourse(courseData.id))
    }

    const [isEnrolledInCourse, setIsEnrolledInCourse] = useState(false)
    /**
     * Checks to see if course is in userData.courses and enrolled == true     
     */
    function checkIfIsEnrolledInCourse(){
        if(!userData.courses || typeof userData.courses !== "object") 
            return 

        let isEnrolled = false
        Object.entries(userData.courses).forEach(course => {
            if(course[0] === courseData.id && course[1].enrolled)
                isEnrolled = true
        })

        if(isEnrolled){
            console.log("user is enrolled in "+courseData.name)
            setIsEnrolledInCourse(true)
        }
        else    
            setIsEnrolledInCourse(false)
    }

    const [courseCompletionString, setCourseCompletionString] = useState()
    const [courseCompletionTitleString, setCourseCompletionTitleString] = useState()
    function checkCourseProgress(){        
        let completedSections = 0
        // If there is a valid userData.courses object (meaning the user is enrolled in the course)
        if(userData && userData?.courses[courseData.id]){
            // Get an object that containes {chapterID: chapterData, ...}
            let chaptersDataObject = userData?.courses[courseData.id]?.chapterData
            // If there is a valid chaptersDataObject
            if(chaptersDataObject && typeof chaptersDataObject === "object"){
                // For each chapter get an object that containes {sectionID: sectionData, ...}
                Object.values(chaptersDataObject).forEach(chapterData => {
                    let sectionsDataObject = chapterData?.sectionData
                    // If there is a valid sectionsDataObject
                    if(sectionsDataObject && typeof sectionsDataObject === "object"){
                        // Look at each section to see if it is completed
                        Object.values(sectionsDataObject).forEach(sectionData => {
                              if(sectionData.complete)
                                completedSections++
                        })
                        
                    }
                })
            }

        }

        // If the user has completed all the sections show a check and give user ability to view certificate
        if(courseData?.totalSections == completedSections){
            // The string that shows on the tile
            setCourseCompletionString("✔")            
            // The tooltip that shows on hover
            setCourseCompletionTitleString("Course Completed")
        }
        // If the user has not completed all the sections show the progress
        else{
            // The string that shows on the tile
            setCourseCompletionString(completedSections +" / "+ courseData?.totalSections)
            // The tooltip that shows on hover
            setCourseCompletionTitleString("Completed "+completedSections +" of "+ courseData?.totalSections+" sections")
        }        
        
    }

  return (
    <div 
        className={'cartCourse ' + (draggable ? "draggable":"")} 
        draggable={!selected && draggable} 
        onDragStart={()=>dispacher(setDraggingCourse(courseData.id))}
    >
        <div className='cartCourseImage'>
            <img src={courseData?.image}></img>
        </div>
        <div className='cartCourseText'>
            <div className='cartCourseName'>
                {courseData?.name}
            </div>
            <div className='cartCourseDescription'>
                {courseData?.description}
            </div>
            {isEnrolledInCourse ?
                <div className='priceBox' title={courseCompletionTitleString} style={{cursor: "pointer"}}>
                    {courseCompletionString}
                </div>
                :           
                <div className='priceBox priceText'>
                    {priceString(courseData?.price)}
                </div>
            }
        </div>
        <div className='cartCourseButtons'>
        {isEnrolledInCourse?
            <>                
                <button onClick={()=>navigate("/Course/"+courseData.id)}>{courseCompletionString ? "View Certificate":"Go To Course"}</button>
                <button onClick={()=>setShowMoreInfo(true)}>More Info</button>
            </>
            :
            <>
                {selected ?
                    <>
                        {!readOnly &&
                            <button onClick={()=>dispacher(removeCartCourse(courseData.id))}>Remove</button>
                        }
                        <button onClick={()=>setShowMoreInfo(true)}>More Info</button>
                    </>
                    :
                    <>
                        <button onClick={selectCourse}>Add To Cart</button>
                        <button onClick={()=>setShowMoreInfo(true)}>More Info</button>
                    </>
                }
            </>
        }        
        </div>
        {showMoreInfo &&
            <CartCourseMoreInfo courseData={courseData} close={()=>setShowMoreInfo(false)}></CartCourseMoreInfo>
        }
    </div>
  )
}

export default CartCourse