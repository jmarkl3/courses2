import React, { useEffect, useState } from 'react'
import Course from '../../../Course/Course'
import { useDispatch } from 'react-redux'
import { setUserDataOverride } from '../../../../../App/AppSlice'
import ElementMapper from '../../../Course/Elements/ElementMapper'
import "../AdminDash.css"
import ElementDisplayBlock from '../../../Course/Elements/Display/ElementDisplayBlock'
import { objectToArray } from '../../../../../App/functions'

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

    generateCourseDataObject()
    // For when component dismountes 
    return () => {
      // Set userDataOverride back to null
      //dispatcher(setUserDataOverride(null))
    } 


  },[])

  useEffect(() => {
    //generateChaptersArray()
  },[userData])

  function generateCourseDataObject(){
    console.log(courseData)
  }

  function generateChaptersArray(){



    let chaptersData = userData?.courses[courseData.id]?.chapterData
    if(!chaptersData)
      return

    let tempChaptersArray = []
    if(userData?.courses[courseData.id]?.chapterData && typeof userData?.courses[courseData.id]?.chapterData === "object"){
      
      Object.entries(chaptersData).forEach(([chapterID, chapterDataObject]) => {
        let tempChapter = {...chapterDataObject}
        tempChapter.id = chapterID
        tempChapter.sectionsArray = generateSectionsArray(chapterDataObject?.sectionData)
        tempChaptersArray.push(tempChapter)
      })
    }

    console.log("tempChaptersArray")
    console.log(tempChaptersArray)
    setChaptersArray(tempChaptersArray)

  }
  function generateSectionsArray(sectionData){
    if(!sectionData || typeof sectionData !== "object")
      return []

    let tempSectionsArray = objectToArray(sectionData)
    tempSectionsArray.forEach((sectionDataObject, index) => {
      tempSectionsArray[index].elementsArray = objectToArray(sectionDataObject?.responseData)
    })
    // Object.entries(sectionData).forEach(([sectionID, sectionDataObject]) => {
    //   let tempSection = {...sectionDataObject}
    //   tempSection.id = sectionID
    //   tempSection.elementsArray = objectToArray(sectionDataObject?.responseData)
    //   tempSectionsArray.push(tempSection)
    // })

    return tempSectionsArray
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
                  {sectionDataObject?.elementsArray?.map(elementDataObject => (
                    <>
                      {/* <div>Element</div> */}
                      <ElementDisplayBlock elementData={elementDataObject.elementData} userDataOverride={userData}></ElementDisplayBlock>
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