import React, { useEffect, useState } from 'react'
import Course from '../../../Course/Course'
import { useDispatch } from 'react-redux'
import { setUserDataOverride } from '../../../../../App/AppSlice'
import ElementMapper from '../../../Course/Elements/ElementMapper'
import "../AdminDash.css"
import ElementDisplayBlock from '../../../Course/Elements/Display/ElementDisplayBlock'
import { objectToArray } from '../../../../../App/functions'
import { type } from '@testing-library/user-event/dist/type'
import { set } from 'firebase/database'

function CourseReport({userData, courseData, close}) {
    // Display completion on in progress status
    // Display certificate if there is one
    // Organize by section
    // Display all of the questions and answers for a course
    // Display webcam image catures
    // Display section times


    /*

      See note in Course.js

      want to display:
        all of thr chapters and sections, even the ones the user has not started
        the completion status of each chapter and section
        the resopnse data for each element
      
      options:
        downlad the course data when the course report is opened
        save this data in the user data when the enroll in, and are working on the course
          when they enroll and the course is opened for the first time the relivant course data into the user data
            to do this put a flag in the db (savedCourseData set to false) saying they have not loaded the initial course date into their user data yet
            when the course opens and the course data loads check this value, if it is not true load the initial data
              to see if the correct corresponding course data has been loaded check the course ID to the course ID in the url params
          when they complete a section, update the course data for that section in the user data          

    */
    const [chaptersArray, setChaptersArray] = useState([])
    const dispatcher = useDispatch()

  useEffect(()=>{
    // Set userDataOverride to the user data passed in
    //dispatcher(setUserDataOverride(userData))

    // For when component dismountes 
    return () => {
      // Set userDataOverride back to null
      //dispatcher(setUserDataOverride(null))
    } 


  },[])

  useEffect(() => {
    generateChaptersReportObject()
  },[userData])

  // Create an array of chapter objects with the chapter data and and array of section data objects
  function generateChaptersReportObject(){
    console.log("userData")
    console.log(userData)

    // Make sure there is a valid courseData object
    if (!userData?.courses || !userData?.courses[courseData?.id] || typeof userData?.courses[courseData?.id].chapterData !== "object") 
      return

    // Add each chapter data object to the array
    let tempChapters = []
    Object.entries(userData?.courses[courseData?.id]?.chapterData).forEach(([chapterKey, chapterData]) => {
      // The base chapter data object
      let chapterObject = {
        name: chapterData?.name,
        complete: chapterData?.complete,
        sectionsArray: []
      }
      
      // Add each section data object to the array
      let sectionData = chapterData?.sectionData
      if(sectionData && typeof sectionData === "object"){
        console.log("there is section data")
        Object.entries(sectionData).forEach(([sectionKey, sectionData]) => {
          let tempSectionData = {
            name: sectionData?.name,
            complete: sectionData?.complete,
            responsesArray: []
          }
          
          let tempResponsesArray = []
          let responseData = sectionData.responseData
          if(responseData && typeof responseData === "object"){
            Object.entries(sectionData.responseData).forEach(([responseKey, responseDataObject]) => {
              tempResponsesArray.push(responseDataObject)
            })       
            tempSectionData.responsesArray = tempResponsesArray  
          }

          // All of the section data will be added to the array
          chapterObject.sectionsArray.push(tempSectionData)

        })
      }

      // Add the completed chapter object to the array
      tempChapters.push(chapterObject)
      console.log("chapterObject")
      console.log(chapterObject)
      // setChaptersArray(chapterObject)

    })
  }

  return (

    <div className='box courseReport'>

      <div className='closeButton' onClick={close}>x</div>
      <div className='courseReportInner'>
        <h3>{courseData?.courseName}</h3>
        <div>          
          {chaptersArray.map(chapterDataObject => (
            <div className='courseReportChapter'>
              <hr></hr>
              <div>
                {"Chapter "}
                {"Complete: "+chapterDataObject?.complete}
              </div>
              {chapterDataObject?.sectionsArray?.map(sectionDataObject => (
                <div className='courseReportSection'>               
                  <hr></hr>
                  <div>
                    {"Section "}
                    {"Complete: "+sectionDataObject?.complete}
                  </div>
                  {sectionDataObject?.responsesArray?.map(responseDataObject => (
                    <>
                      {/* <div>Element</div> */}
                      <ElementDisplayBlock elementData={responseDataObject.elementData} responseDataOverride={responseDataObject.response} userDataOverride={userData}></ElementDisplayBlock>
                    </>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default CourseReport