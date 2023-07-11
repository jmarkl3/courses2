import React, { useEffect, useRef, useState } from 'react'
import "./CartCourse.css"
import { priceString } from '../../App/functions'
import { useDispatch, useSelector } from 'react-redux'
import { removeCartCourse, selectCartCourse, setDraggingCourse, setShowCart} from '../../App/AppSlice'
import { useNavigate } from 'react-router-dom'
import CartCourseMoreInfo from './CartCourseMoreInfo'
import HamburgerMenu from '../../Utils/HamburgerMenu'
import { enrollUserInCourseAnon, unEnrollUserInCourses2 } from '../../App/DbSlice'
import CourseReport from '../Content/Dashboards/AaminDash/DashMenus/CourseReport/CourseReport'

function CartCourse({courseData, selected, draggable, readOnly, userDataOverride}) {
    const userData = useSelector(state => state.dbslice.userData)
    const [showMoreInfo, setShowMoreInfo] = useState(false)
    const [showCourseReport, setShowCourseReport] = useState(false)
    const dispatcher = useDispatch()    
    const navigate = useNavigate()

    useEffect(()=>{
        checkIfIsEnrolledInCourse()
        checkCourseProgress()
    }, [userData])

    function selectCourse(){
        dispatcher(setShowCart(true))
        dispatcher(selectCartCourse(courseData.id))
    }

    const [isEnrolledInCourse, setIsEnrolledInCourse] = useState(false)
    /**
     * Checks to see if course is in userData.courses and enrolled == true     
     */
    function checkIfIsEnrolledInCourse(){
        if(!userData?.courses || typeof userData?.courses !== "object") 
            return 

        let isEnrolled = false
        Object.entries(userData?.courses).forEach(course => {
            if(course[0] === courseData.id && course[1].enrolled)
                isEnrolled = true
        })

        if(isEnrolled){
            setIsEnrolledInCourse(true)
        }
        else    
            setIsEnrolledInCourse(false)
    }

    const [courseCompletionString, setCourseCompletionString] = useState()
    const [courseCompletionTitleString, setCourseCompletionTitleString] = useState()
    function checkCourseProgress(){ 
        
        let sectionsArray = []
        let chaptersData = userData?.courses?.[courseData.id]?.chapterData
        if(!chaptersData || typeof chaptersData !== "object"){
          //console.log("no userCourseData")
          return
        }
    
        Object.entries(chaptersData).forEach(([chapterID, chapterData]) => {
          let userSectionsData = chapterData?.sectionData
          if(!userSectionsData || typeof userSectionsData !== "object"){
            console.log("no userSectionsData for chapter " + chapterID)
            return
          }
          
          Object.entries(userSectionsData).forEach(([sectionID, sectionData]) => {
            // If the object does not have a name it is not a valid section
            if(sectionData.name){
              sectionsArray.push({
                id: sectionID,
                chapterID: chapterID,
                name: sectionData.name,
                complete: sectionData.complete
              })
            }
          })      
        })

        let total = 0
        let complete = 0
        sectionsArray.forEach(section => {
            total ++
            if(section.complete)
                complete++
        })

        if(courseData?.complete){
            // The string that shows on the tile
            setCourseCompletionString("✔")            
            // The tooltip that shows on hover
            setCourseCompletionTitleString("Course Completed")
        }
        else{
            // The string that shows on the tile
            setCourseCompletionString(complete + " / " + total)
            // The tooltip that shows on hover
            setCourseCompletionTitleString("Completed " + complete + " of " + total + " sections")
        }    


        return
        let completedSections = 0
        // If there is a valid userData.courses object (meaning the user is enrolled in the course)
        if(userData && userData?.courses && userData?.courses[courseData.id]){
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
        if(courseData?.complete){
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

    function anonViewCourse(){
        // Creates an account if there is not one already and enrolls the user in the course
        dispatcher(enrollUserInCourseAnon({courseID: courseData.id}))

        // Display the course
        navigate("/Course/"+courseData.id)
    }

    function buttonsDisplay(){
        // This is for when the course is in the admin dash un a users menu 
        if(userDataOverride){
            return(
                <button onClick={()=>setShowCourseReport(true)}>View Course Report</button>
            )
        }
        // When a user is enrolled in the course
        else if(isEnrolledInCourse){
            return (
                <>
                    <button onClick={()=>navigate("/Course/"+courseData.id)}>{(courseCompletionString === "✔") ? "View Certificate":"Go To Course"}</button>
                    <button onClick={()=>setShowMoreInfo(true)}>More Info</button>
                </>
            )
        }
        // When the user is not enrolled in the course
        else{
            // When the course is selected into the cart
            if(selected){
                // If in checkout it will be read only (meaning the user can't remove it)
                if(readOnly){
                    return(
                        <button onClick={()=>setShowMoreInfo(true)}>More Info</button>
                    )
                }
                // If not in checkout it will be editable (meaning the user can remove it)    
                else{
                    return(
                        <>
                            <button onClick={()=>dispatcher(removeCartCourse(courseData.id))}>Remove</button>
                            <button onClick={()=>setShowMoreInfo(true)}>More Info</button>                            
                        </>                            
                    )
                }    
            }
            else{
                return (
                    <>
                        {/* <button onClick={selectCourse}>Add To Cart</button> */}
                        {/* <button onClick={()=>setShowMoreInfo(true)}>More Info</button> */}
                        <button onClick={anonViewCourse}>View</button>
                    </>
                )
            }
        }
    }

    function courseStatus(){
        if(userDataOverride){
            return(
                <>                
                    <HamburgerMenu>
                        <div className="hamburgerMenuOption" onClick={()=>dispatcher(unEnrollUserInCourses2({userID: userDataOverride.id, courseIDArray: [courseData.id]}))}>Un-Enroll User</div>
                        <div className="hamburgerMenuOption" >View Course Report</div>      
                    </HamburgerMenu>
                    <div className='priceBox priceText priceBoxAdmin'>
                        {priceString(courseData?.price)}
                    </div>
                </>
            )
        }else{
            if(isEnrolledInCourse){
                return(
                    <div className='priceBox' title={courseCompletionTitleString} style={{cursor: "pointer"}}>
                        {courseCompletionString}
                    </div>
                )
            }else{
                return(
                    <div className='priceBox priceText'>
                        {priceString(courseData?.price)}
                    </div>
                )
            }
        }
    }

  return (
    <div 
        className={'cartCourse ' + (draggable ? "draggable":"")} 
        draggable={!selected && draggable} 
        onDragStart={()=>dispatcher(setDraggingCourse(courseData.id))}
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
            {courseStatus()}
        </div>
        <div className='cartCourseButtons'>
            {buttonsDisplay()}
        </div>
        {showMoreInfo &&
            <CartCourseMoreInfo courseData={courseData} close={()=>setShowMoreInfo(false)}></CartCourseMoreInfo>
        }
        {showCourseReport &&
            <CourseReport userData={userData} courseData={courseData} close={()=>setShowCourseReport(false)}></CourseReport>
        }
    </div>
  )
}

export default CartCourse