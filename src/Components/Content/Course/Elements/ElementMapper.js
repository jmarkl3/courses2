import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { getItem, objectToArray } from '../../../../App/functions';
import ConfirmationBox from '../../../../Utils/ConfirmationBox';
import Element from './Element.js';
import SectionEditOptions from './Edit/Components/SectionEditOptions';
import SectionButtons from './Display/Components/SectionButtons';

function ElementMapper() {
    const courseData = useSelector((state) => state.dbslice.courseData);
    const selectedChapterID = useSelector((state) => state.dbslice.selectedChapterID);
    const selectedSectionID = useSelector((state) => state.dbslice.selectedSectionID);
    const editMode = useSelector((state) => state.appslice.editMode);
    const [elementsArray, setElementsArray] = useState([])
    const [sectionData, setSectionData] = useState()

    useEffect(() => {
        var sectionData = getItem(courseData, selectedChapterID, selectedSectionID)
        setSectionData(sectionData)
        var elementsArrayTemp = objectToArray(sectionData?.items)
        setElementsArray(elementsArrayTemp)
    
    }, [courseData, selectedChapterID, selectedSectionID])

    return (
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
    )
}

export default ElementMapper