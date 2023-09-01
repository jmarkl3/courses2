import React, { useEffect, useRef, useState } from 'react'
import "./LandingPage.css"
import backgroundImage from "../../Images/momAndChildBackground.jpg"
import { useDispatch, useSelector } from 'react-redux'
import { setCheckingOut, setShowSupportMenu, toggleShowAuthMenu } from '../../App/AppSlice'
import CartCourse from '../CourseTile/CartCourse'
import { selectSet, toggleLanguage } from '../../App/DbSlice'
import { getEnrolledCourses, languageConverter } from '../../App/functions'
import EditTextToggle from './EditTextToggle'
import { useParams } from 'react-router-dom'

/*
================================================================================
|                              LandingPage.js
================================================================================

    This is the landing page for the app. It displays information about the app
    There is a menu below the banner with links to the different sections of the page
    these include:
        About, Courses, Contact / Support, Cart, and Account
    
    It also shows available courses and courses the user is enrolled in
    The user has the ability to enroll in courses from this page or go to the course if they are already enrolled

*/
function LandingPageSet({goto, allowEditProp}) {

    const setData = useSelector(state => state.dbslice?.setData)
    const selectedSetData = useSelector(state => state.dbslice?.selectedSetData)

    const language = useSelector(state => state.dbslice?.language)
    const coursesArray = useSelector(state => state.dbslice.coursesArray)
    const userData = useSelector(state => state.dbslice.userData)
    const [availableCourses, setAvailableCourses] = useState([])
    const [enrolledCoursesArray, setEnrolledCoursesArray] = useState([])
    const aboutRef = useRef()
    const coursesRef = useRef()
    const dispatcher = useDispatch()

    // This can be set by a prop or in useEffect by checkign the userID to the selected set data
    const allowEdit = allowEditProp || true

    // The goto prop tells the page to scroll to a specific section
    useEffect(() => {
        if(goto === "about")
        setTimeout(() => {
            scrollToAbout()

        }, 250)
        // This changes the way the cart displays
        dispatcher(setCheckingOut(false))

    }, [])

    useEffect(()=>{
        loadSetID()
        console.log("LandingPageSet.js: selectedSetData")
        console.log(selectedSetData)
    },[setData])

    // Filter and set the courses array so the courses are showing on the page
    useEffect(() => {
        let tempAvailableCourses = coursesArray?.filter(courseData => !userData?.enrolledCourses?.includes(courseData.id))
        if(Array.isArray(tempAvailableCourses))
            setAvailableCourses(tempAvailableCourses)
        setEnrolledCoursesArray(getEnrolledCourses(userData))
         // console.log("coursesArray:")
         // console.log(coursesArray)
    }, [coursesArray, userData])

    const { setID } = useParams()
    // If there is a set ID specified in the url load that one instead of the one based on the url
    function loadSetID(){
        if(setID){
            console.log("LandingPageSet.js: setting setID to:"+setID)        
            dispatcher(selectSet(setID))
        }else{
            console.log("no set ID specified in url params")
        }
    }

    function scrollToAbout(){
        aboutRef.current?.scrollIntoView({behavior: 'smooth'})

    }
    function scrollToCourses(){
        coursesRef.current.scrollIntoView({behavior: 'smooth'})         

    }

  return (
    <div className='testBox'>
        <div className='landingPage'>
            <EditTextToggle 
                value={selectedSetData?.landingPage?.bannerUrl} 
                className={"banner"}
                imgContent
                notRel
                allowEdit={allowEdit}
            ></EditTextToggle>
            <div>
                <div className='landingPageOver'>
                {/* <div className=''> */}
                    <div className='landingPageTitleContainerOuter'>
                        <div className='landingPageTitleContainer'>
                            {/* <div className='landingTitle rel'>
                                {setData?.landingPage?.title} */}
                            <EditTextToggle allowEdit={allowEdit} value={selectedSetData?.landingPage?.title} className={"landingTitle"}></EditTextToggle>
                            {/* </div> */}  
                            <EditTextToggle allowEdit={allowEdit} value={selectedSetData?.landingPage?.description} className={"landingTitleText"}></EditTextToggle>
                            {/* <div className='landingTitleText rel' >
                                {setData?.landingPage?.description}
                                <EditToggleButton edit={editingDescription} setEdit={setDescription}></EditToggleButton>
                            </div> */}
                        </div>
                    </div>
                    <div className='landingNav'>
                        <div className='landingNavButton' onClick={scrollToAbout}>
                            {languageConverter(language, "About")}
                        </div>
                        <div className='landingNavButton' onClick={scrollToCourses}>
                            {languageConverter(language, "Courses")}
                        </div>
                        <div className='landingNavButton' onClick={()=>dispatcher(toggleLanguage())}>
                            {language === "English" ? "Español" : "English"}
                        </div>
                        <div className='landingNavButton' onClick={()=>dispatcher(setShowSupportMenu(true))}>
                            {languageConverter(language, "Contact / Support")}
                        </div>
                        {/* <div className='landingNavButton' onClick={()=>dispatcher(setShowCart(true))}>
                            {languageConverter(language, "Cart")}
                        </div> */}
                        <div className='landingNavButton' onClick={()=>dispatcher(toggleShowAuthMenu())}>
                            {languageConverter(language, "Account")}
                        </div>
                    </div>
                </div>
                <div className='landingContent'>
                    <div className='landingPageText'>
                        <div className={"landingPageTextSection"} ref={aboutRef}>                         
                            <EditTextToggle allowEdit={allowEdit} value={selectedSetData?.landingPage?.content1} content></EditTextToggle>                        
                        </div>
                        {/* This can be a seperate component for the available / user courses */}
                        <div>
                            {userData &&
                                <div className={"landingPageTextSection"} ref={coursesRef}>
                                    <h3 className='center'>
                                        {languageConverter(language, "Your Courses")}
                                    </h3>  
                                    <hr></hr>
                                    <div>
                                        {coursesArray.filter(courseData => enrolledCoursesArray.includes(courseData.id)).map(courseData => (
                                            <CartCourse courseData={courseData} draggable={false} key={courseData.id}></CartCourse>
                                        ))}
                                        {/* {coursesArray.filter(courseData => userData?.enrolledCourses?.includes(courseData.id)).map(courseData => (
                                            <CartCourse courseData={courseData} draggable={false} key={courseData.id}></CartCourse>
                                        ))} */}
                                    </div>
                                </div>
                            }
                            
                            {availableCourses.length > 0 ?                        
                                <div className={"landingPageTextSection"} ref={coursesRef}>
                                    <h3 className='center'>
                                        {languageConverter(language, "Available Courses")}
                                    </h3>  
                                    <hr></hr>
                                    <div>
                                    {coursesArray.filter(courseData => !enrolledCoursesArray.includes(courseData.id)).map(courseData => (
                                        <CartCourse courseData={courseData} draggable={false} key={courseData.id}></CartCourse>
                                    ))}
                                    </div>
                                </div>
                                :
                                <div>
                                    {userData &&
                                        <div>
                                            <hr></hr>
                                            <h3 className='center'>
                                                {languageConverter(language, "You have enrolled in all available courses")}
                                            </h3>  
                                            <hr></hr>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                        <div className={"landingPageTextSection"}>
                            <EditTextToggle allowEdit={allowEdit} value={selectedSetData?.landingPage?.content2} content></EditTextToggle>                        
                        </div>


                    </div>
                </div>

            </div>
        </div>        
    </div>
  )
}

export default LandingPageSet