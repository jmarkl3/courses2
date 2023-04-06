import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toggleMinimizeAll, togglePreviewMode } from '../../../../App/AppSlice';
import { objectToArray } from '../../../../App/functions';
import ConfirmationBox from '../../../../Utils/ConfirmationBox';
import Element from './Element.js';

function ElementMapper() {
    const courseData = useSelector((state) => state.dbslice.courseData);
    const selectedChapterID = useSelector((state) => state.dbslice.selectedChapterID);
    const selectedSectionID = useSelector((state) => state.dbslice.selectedSectionID);
    const previewMode = useSelector((state) => state.appslice.courseEditPreviewMode);
    const editMode = useSelector((state) => state.appslice.editMode);
    const [confirmationBoxMessage, setConfirmationBoxMessage] = useState()
    const [elementsArray, setElementsArray] = useState([])
    const dispacher = useDispatch()

    // On start and whenever the selected chapter or section changes, update the elements array
    useEffect(() => {
        var elementsArrayTemp = objectToArray(courseData?.items[selectedChapterID]?.items[selectedSectionID]?.items)
        setElementsArray(elementsArrayTemp)
    
    }, [courseData, selectedChapterID, selectedSectionID])

    return (
        <div>
            {(editMode && !previewMode) &&
                <>
                    <div className='elementDisplay bottomPadding5'>
                        <div className='elementEditOptions'>  
                            <select 
                                // ref={sectionTypeRef} 
                                title="Section Type"
                            >
                                <option>Default</option>
                                <option title={"Question feedback will not be displayed"}>Quiz</option>
                            </select>
                            <input placeholder='Section Title' title='Section Title'></input>                            
                            <input placeholder='Section Time' title='The minimum amount of time the user will need to be in the section before the can proceed'></input>
                        </div>

                        <div className='elementEditOptions'>
                            <button onClick={()=>dispacher(toggleMinimizeAll())}>Minimize All</button>
                            <button onClick={()=>dispacher(togglePreviewMode())}>Preview Mode</button>
                        </div>
                        <div className='elementEditOptions'>
                            <button>Copy Section</button>
                            <button onClick={()=>setConfirmationBoxMessage("Delete Section?")}>Delete Section</button>
                        </div>
                    </div> 
                    <button style={{margin: "0px", width: "100%"}} >Add Element</button>                        
                </>
            }
            {elementsArray.map(element => (                
                <Element elementData={element} key={element.id}></Element>                
            ))}
            <ConfirmationBox message={confirmationBoxMessage} cancel={()=>setConfirmationBoxMessage()}></ConfirmationBox>
        </div>
    )
}

export default ElementMapper