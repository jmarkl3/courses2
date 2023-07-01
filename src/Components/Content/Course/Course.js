import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setEditMode, setLoading, setSideNavOpen } from '../../../App/AppSlice'
import SideNav from '../../Sidebar/SideNav'
import ElementMapper from './Elements/ElementMapper'
import DisplayPage from '../DisplayPage'
import { useParams } from 'react-router-dom'
import { saveUserChapterData, saveUserCourseData, selectCourse } from '../../../App/DbSlice'
import "./Course.css"
import certificateImage from "../../../Images/certificateNoName.jpg"
import Certificate from './Elements/Display/Components/Certificate'
import { getUserData, removeUndefined } from '../../../App/functions'

/*
================================================================================
|                                 Course.js
================================================================================

    This component id embeded in the DisplayPage component and displays the course content within that component

    if the course is complete and the certificate should be displayed it displays that 
    othwerwise it displays the sidenav and ElementMapper component which displays the course content

*/

function Course() {
  const userData = useSelector(state => state.dbslice.userData)
  const userDataOverride = useSelector(state => state.dbslice.userDataOverride)
  const courseData = useSelector(state => state.dbslice.courseData)
  const editMode = useSelector(state => state.appslice.editMode)
  const [courseComplete, setCourseComplete] = useState()
  const [displayCertificate, setDisplayCertificate] = useState()
  const displayCertificateOverride = useRef()
  const dispatcher = useDispatch()
  const { courseID } = useParams();  
  
  useEffect(() => {
    // This triggers a use effect in App.js that loads the course data. ElementMapper.js and SideNav.js pick it up with a selector and display it
    dispatcher(selectCourse(courseID))
    dispatcher(setLoading(true))

    
  },[courseID])
  
  // When the course data is loaded compare to the courseID from use params, then check if userData has the course data 
  useEffect(() => { 
    // if the loaded course data matches the courseID 
    if(courseData && courseData?.id === courseID){
      // check the user data to see if the course data has been loaded into their user data
      let savedCourseData = getUserData(userData, "courses/"+courseID+"/savedCourseData")

      /*

        take the courseData and create this coursePartialData object:
        let coursePartialData = {
          name: "Course Name",
          chapterData: {
            chapterID: {
              name: "Chapter Name",              
              sectionData: {
                sectionID: {
                  name: "Section Name",                  
                  numberOfResponseElements: <number>
                },
                ...sections
              },
              ... chapters
            }
          }
        }
        then call 
        dispatcher(saveUserCourseData({kvPairs: {savedCourseData: true, courseData: coursePartialData}, courseID: courseID}))

      */

      // Generate an object to represent the course data in the user data
      // It will contain an object with chapterIDs
      // In the chapters there will be complete status, name, and an object with sectionIDs  
      // for each section object there will be a complete status and name
      // This will save in the same place the course data completion is currently saved in the user data
      // When displaying this data we will show the name of the chapter or section, and the completion status (complete / total) or (complete)
      // They will be displayed as components for chapters with sub components for sections with element components for responses

      // If it has not been loaded, load it
      if(userData && !savedCourseData){
        let coursePartialData = generatePartialData(courseData)
        let kvPairs = {savedCourseData: true, name: coursePartialData.name, chapterData: coursePartialData.chapterData}
        kvPairs = removeUndefined(kvPairs)
        console.log("kvPairs")
        console.log(kvPairs)
        dispatcher(saveUserCourseData({kvPairs: kvPairs, courseID: courseID}))
      }

    }
    
  },[courseData])
  
  useEffect(() => {
    console.log("in use effect")
    console.log(courseID)
    console.log(userData)

    checkIfComplete()
    if(userData && userData.accountData && !(userData.accountData.fullAdmin || userData.accountData.isCourseAdmin))
      dispatcher(setEditMode(false))
  },[courseID, userData])

  function checkIfComplete(){
    if(!userData?.courses || !userData?.courses[courseID] || editMode || displayCertificateOverride.current)
      return false

    let complete = userData?.courses[courseID]?.complete
    setCourseComplete(complete)
    if(complete)
      showCertificate()

    completionEmail()
  }
  function completionEmail(){
    // check to see if the email has already been sent
    // check to see if certificate has been generated
    // generate the certificate if needed
    // send the email

  }
  function showCertificate(){    
    setDisplayCertificate(true)
    dispatcher(setSideNavOpen(false))
  }

  function generatePartialData(courseData){
    let coursePartialData = {
      name: courseData.name,
      chapterData: {}
    }

    // Get the chapter data
    let chapterData = courseData.items
    // Make sure its valid
    if(!chapterData || typeof chapterData !== "object")
      return coursePartialData

    // Loop through each chapter
    Object.entries(chapterData).forEach(([chapterKey, chapterData]) => {
      // Get the name
      let tempChapterData = {
        name: chapterData.name,
        sectionData: {}
      }
      // Put the chapter with the name in the coursePartialData
      coursePartialData.chapterData[chapterKey] = tempChapterData
      
      // Skip this part if this chapter has no section data
      if(!chapterData.items || typeof chapterData.items !== "object")
        return
      
      // Loop through each section
      Object.entries(chapterData.items).forEach(([sectionKey, sectionData]) => {
        // Get the name and set default numberOfInputElements value
        let tempSectionData = {
          name: sectionData.name,
          numberOfInputElements: 0,
          requiredTime: sectionData.requiredTime
        }

        // Save it in coursePartialData 
        coursePartialData.chapterData[chapterKey].sectionData[sectionKey] = tempSectionData

        // Skip this part if this section has no element items
        if(!sectionData.items || typeof sectionData.items !== "object")
          return

        // Loop through each element item and count them
        let inputElementCount = 0
        Object.entries(sectionData.items).forEach(([elementKey, elementData]) => {
          // Get the name and set default numberOfInputElements value
          if(elementData.type === "Multiple Choice" || elementData.type === "Text Input" || elementData.type === "Input Field") 
          inputElementCount++
        })

        // Update the number of onput elements
        tempSectionData.numberOfInputElements = inputElementCount

        // Save it in coursePartialData 
        coursePartialData.chapterData[chapterKey].sectionData[sectionKey] = tempSectionData

      })
    })
    return coursePartialData
  }

  function certificateName(){
    let firstName = (userDataOverride?.accountData?.firstName || userData?.accountData?.firstName)
    let lastName = (userDataOverride?.accountData?.lastName || userData?.accountData?.lastName)
    return firstName+" "+lastName
  }

  function hideCertificate(){
    displayCertificateOverride.current = true
    setDisplayCertificate(false)
  }

  return (
    <DisplayPage>
        {/* <Certificate></Certificate> */}
        {displayCertificate ? 
          <>
            <Certificate></Certificate>
            <div>
              <button onClick={hideCertificate}>View Course</button>
            </div>
          </>  
          :
          <>
            <SideNav></SideNav>
            <div className='course'>
              {courseComplete &&
                <button onClick={()=>{showCertificate(true)}}>View Certificate</button>
              }
              <ElementMapper></ElementMapper>
            </div>
          </>  
        }
    </DisplayPage>
  )
}

export default Course