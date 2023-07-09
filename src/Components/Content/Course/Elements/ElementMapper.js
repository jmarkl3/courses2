import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getItem, objectToArray } from '../../../../App/functions';
import ConfirmationBox from '../../../../Utils/ConfirmationBox';
import Element from './Element.js';
import SectionEditOptions from './Edit/Components/SectionEditOptions';
import SectionButtons from './Display/Components/SectionButtons';
import TimedWebcam from '../../../Webcam/TimedWebcam';
import { useNavigate } from 'react-router-dom';
import { setSideNavOpen } from '../../../../App/AppSlice';

/*
================================================================================
|                                 ElementMapper.js
================================================================================

    This component is rendered in Course.js and maps the course elements to the screen
    it can be in display mode or edit mode

    in display mode it mapps the elements to the screen with their content
    users can view or interact with the content based on the element type

    there are is also the SectionButton component which displays the
    next and last buttons that allow the user to navigate to the next or previous section if they have completed the requirements for the current section

    in edit mode it displays the editable version of elements that allow the user to edit the content of the element
    it also displays some additional components that allow the user to edit the section and course options

    The sidenav which is displayed in Course.js is also different in edit mode and allows the user to take edit actions 
    such as adding items such as sections or elements

    There is also a timed webcam component that is displayed in the bottom right corner of the screen
    this component allows the users presence to be verified with their webcam in case that is a requirement

*/

function ElementMapper() {
    const courseData = useSelector((state) => state.dbslice.courseData);
    const selectedChapterID = useSelector((state) => state.dbslice.selectedChapterID);
    const selectedSectionID = useSelector((state) => state.dbslice.selectedSectionID);
    const editMode = useSelector((state) => state.appslice.editMode);
    const loading = useSelector((state) => state.appslice.loading);
    const [elementsArray, setElementsArray] = useState([])
    const [sectionData, setSectionData] = useState()
    const dispatcher = useDispatch()
    const navitage = useNavigate()
    const [checkoutSection, setCheckoutSection] = useState(false)

  // Open the sidebar after the page has loaded
  useEffect(() => {
    if(!sectionData){
        dispatcher(setSideNavOpen(false))
        return
    }
    setTimeout(() => {
        dispatcher(setSideNavOpen(true))
    
    }, 100)
  }, [sectionData])

    useEffect(() => {
        var sectionData = getItem(courseData, selectedChapterID, selectedSectionID)
        setSectionData(sectionData)
        var elementsArrayTemp = objectToArray(sectionData?.items)
        setElementsArray(elementsArrayTemp)

    }, [courseData, selectedChapterID, selectedSectionID])

    useEffect(() => {
        checkIfCheckoutSection()

    }, [elementsArray])    

    // Checks to see if this a checkout section so it can display the section buttons differently if it is
    function checkIfCheckoutSection(){  
        console.log("in checkIfCheckoutSection")      
        let hasCheckoutElement = false
        elementsArray.forEach(element => {
            console.log(element.type)
            if(element.type === "Checkout"){
                hasCheckoutElement = true
                console.log(hasCheckoutElement)
            }
        })
        setCheckoutSection(hasCheckoutElement)
    }

    return (
        <>
            {sectionData ? 
                <>
                    {editMode &&
                        <SectionEditOptions></SectionEditOptions>
                    }
                    {elementsArray.map(element => (  
                        <Element elementData={element} key={element.id}></Element>                
                    ))}
                    {!editMode &&
                        <SectionButtons sectionData={sectionData} chapterID={selectedChapterID} checkoutSection={checkoutSection}></SectionButtons>
                    }            
                </>
                :
                <>
                    {loading ?
                    <>
                        <div className='loadingMessage'>Loading...</div>
                    </>
                    :
                    <>
                        <div className='noCourseMessage'>
                            No course with url ID. Please return to dashboard and select a course.
                        </div>
                        <button onClick={()=>navitage("/Dashboard")}>Go to Dashboard</button>
                    </>
                }
                </>

            }
            {!editMode && <TimedWebcam sectionData={sectionData}></TimedWebcam>}
        </>
    )
}

export default ElementMapper