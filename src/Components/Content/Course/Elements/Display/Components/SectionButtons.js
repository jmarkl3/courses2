import React, { useRef, useState } from 'react'
import "./ElementDisplayComponents.css"
import { useDispatch, useSelector } from 'react-redux'
import { saveUserSectionData, selectNextSection, selectPreviousSection } from '../../../../../../App/DbSlice'
import TimeDisplay from './TimeDisplay'
import SaveIndicator from './SaveIndicator'
import { getUserData, objectToArray } from '../../../../../../App/functions'
import FadeMessage from './FadeMessage'

function SectionButtons({sectionData, chapterID}) {
    const [remainingTime, setRemainingTime] = useState(0)
    const [message, setMessage] = useState()
    const [messageRefreshCount, seMessageRefreshCount] = useState(0)
    const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
    const selectedChapterID = useSelector(state => state.dbslice.selectedChapterID)
    const selectedSectionID = useSelector(state => state.dbslice.selectedSectionID)
    const dispacher = useDispatch()

    const userData = useSelector(state => state.dbslice.userData)

    /**
     * Check to see if the user has answered all questions and if there is still remaining time, aff all requirements are met go to the next section
     */
    function nextSection(){
        // Check to see if the user has answered all questions        
        var userResponseData = getUserData(userData, "responses/"+selectedCourseID+"/"+selectedChapterID+"/"+selectedSectionID)
        if(!allInputsComplete(userResponseData, sectionData)){
            setMessage("Please respond to all questions")
            seMessageRefreshCount(messageRefreshCount + 1)
            return
        }
        
        // Check to see if there is still remaining time
        if(remainingTime > 0){
            setMessage("There is still remaining time")
            seMessageRefreshCount(messageRefreshCount + 1)
            return
        }        

        // Saving the completion status to show the user has completed the sectin
        dispacher(saveUserSectionData({sectionID: sectionData?.id, chapterID: chapterID, value: true, property: "complete"}))
        // Save the index to easily check the index of the last completed section
        // dispacher(saveUserSectionData({sectionID: sectionData?.id, chapterID: chapterID, value: sectionData?.index, property: "index"}))

        // Go to the next section
        dispacher(selectNextSection())
    }

    /**
     * Check to see if all of the elements that require input have a corresponding userData entry
     */

    function allInputsComplete(userResponseData, sectionData){
        var itemsArray = objectToArray(sectionData.items)
        var allComplete = true
        itemsArray.forEach(item => {
            if(item?.type === "Input Field" || item?.type === "Text Input" || item?.type === "Multiple Choice"){
                if(!userResponseData[item.id]){
                    console.log("item not complete")
                    console.log(item)
                    allComplete = false
                }
            }
        })        
        return allComplete
    }

  return (
    <div className='sectionButtons'>
        <div className='nextButtonTimer'>
            <TimeDisplay sectionData={sectionData} chapterID={chapterID} setRemainingTime={setRemainingTime}></TimeDisplay>
        </div>
        <button onClick={()=>dispacher(selectPreviousSection())}>Back</button>
        <div className='sectionButtonMessage'>            
            <FadeMessage message={message} refreshCount={messageRefreshCount} backgroundColor={"rgb(197, 119, 119)"}></FadeMessage>
        </div>
        <button onClick={nextSection}>Next</button>
    </div>
  )
}

export default SectionButtons