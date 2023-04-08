import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { getItem, objectToArray } from '../../../../App/functions';
import ConfirmationBox from '../../../../Utils/ConfirmationBox';
import Element from './Element.js';
import SectionEditOptions from './SectionEditOptions';

function ElementMapper() {
    const courseData = useSelector((state) => state.dbslice.courseData);
    const selectedChapterID = useSelector((state) => state.dbslice.selectedChapterID);
    const selectedSectionID = useSelector((state) => state.dbslice.selectedSectionID);
    const editMode = useSelector((state) => state.appslice.editMode);
    const [elementsArray, setElementsArray] = useState([])

    useEffect(() => {
        var sectionData = getItem(courseData, selectedChapterID, selectedSectionID)
        // setSectionData(sectionData)
        var elementsArrayTemp = objectToArray(sectionData?.items)
        setElementsArray(elementsArrayTemp)
    
    }, [courseData, selectedChapterID, selectedSectionID])

    return (
        <div>
            {(editMode) &&
                <SectionEditOptions></SectionEditOptions>
            }
            {elementsArray.map(element => (                
                <Element elementData={element} key={element.id}></Element>                
            ))}
        </div>
    )
}

export default ElementMapper