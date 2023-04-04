import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { objectToArray } from '../../../../App/functions';
import Element from './Element.js';

function ElementMapper() {
    const courseData = useSelector((state) => state.dbslice.courseData);
    const selectedChapterID = useSelector((state) => state.dbslice.selectedChapterID);
    const selectedSectionID = useSelector((state) => state.dbslice.selectedSectionID);
    const [elementsArray, setElementsArray] = useState([])
  
    // On start and whenever the selected chapter or section changes, update the elements array
    useEffect(() => {
        var elementsArrayTemp = objectToArray(courseData?.items[selectedChapterID]?.items[selectedSectionID]?.items)
        setElementsArray(elementsArrayTemp)
    
    }, [courseData, selectedChapterID, selectedSectionID])

    return (
        <div>
            {elementsArray.map(element => (
                <Element element={element} key={element.id}></Element>
            ))}
        </div>
    )
}

export default ElementMapper