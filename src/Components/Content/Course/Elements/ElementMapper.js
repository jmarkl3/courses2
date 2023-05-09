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
                        <SectionButtons sectionData={sectionData} chapterID={selectedChapterID}></SectionButtons>
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
            {/* <TimedWebcam sectionData={sectionData}></TimedWebcam> */}
        </>
    )
}

export default ElementMapper