import React, { useState } from 'react'
import "./ElementDisplayComponents.css"
import { useDispatch } from 'react-redux'
import { selectNextSection, selectPreviousSection } from '../../../../../../App/DbSlice'
import TimeDisplay from './TimeDisplay'
import SaveIndicator from './SaveIndicator'

function SectionButtons({sectionData, chapterID}) {
    const [remainingTime, setRemainingTime] = useState(0)
    const [message, setMessage] = useState()
    const [messageRefreshCount, seMessageRefreshCount] = useState(0)
    const dispacher = useDispatch()
    console.log(sectionData)

  /*
    
    check to see if all user inputs have been submitted
    check if timre requirement has bee met
    display messages if not
      display timer if time not met

  */
  
    function nextSection(){
        // Check to see if there is still remaining time
        if(remainingTime > 0){
            setMessage("There is still remaining time")
            seMessageRefreshCount(messageRefreshCount+1)
            return
        }
        // Check to see if the user has answered all questions
        if(remainingTime > 0){
            setMessage("thre are still some questions to answer")
            seMessageRefreshCount(messageRefreshCount+1)
            return
        }

        // Go to the next section
        dispacher(selectNextSection())
    }

  return (
    <div className='sectionButtons'>
        <div className='nextButtonTimer'>
            <TimeDisplay sectionData={sectionData} chapterID={chapterID} viewOnly setRemainingTime={setRemainingTime}></TimeDisplay>
        </div>
        <button onClick={()=>dispacher(selectPreviousSection())}>Back</button>
        <SaveIndicator saveIndicatorMessage={message} saveIndicatorMessageCount={messageRefreshCount}></SaveIndicator>
        <button onClick={nextSection}>Next</button>
    </div>
  )
}

export default SectionButtons