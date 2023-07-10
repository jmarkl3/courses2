import React, { useEffect, useRef, useState } from 'react'
import "./ElementDisplayComponents.css"
import { useDispatch, useSelector } from 'react-redux'
import { database, saveUserSectionData, saveUserSectionData2, selectNextSection, selectPreviousSection } from '../../../../../../App/DbSlice'
import TimeDisplay from './TimeDisplay'
import SaveIndicator from './SaveIndicator'
import { getUserData, objectToArray } from '../../../../../../App/functions'
import FadeMessage from './FadeMessage'
import { ref, set } from 'firebase/database'
import TimeDisplay2 from './TimeDisplay2'

function SectionButtons({sectionData, chapterID, checkoutSection}) {
    const [remainingTime, setRemainingTime] = useState(0)
    const [message, setMessage] = useState()
    const [messageRefreshCount, seMessageRefreshCount] = useState(0)
    const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
    const sectionArray = useSelector(state => state.dbslice.sectionArray)
    const userID = useSelector(state => state.dbslice.userID)
    const selectedChapterID = useSelector(state => state.dbslice.selectedChapterID)
    const selectedSectionID = useSelector(state => state.dbslice.selectedSectionID)
    const fullAdmin = useSelector(state => state.dbslice.userData?.accountData?.fullAdmin)
    const dispacher = useDispatch()

    const userData = useSelector(state => state.dbslice.userData)

    useEffect(() => {
        // This solved an issue where the remaining time was not being set to 0 when there was no section data
        if(!sectionData?.id)
            setRemainingTime(0)
    },[sectionData])

    /**
     * Check to see if the user has answered all questions and if there is still remaining time, aff all requirements are met go to the next section
     */
    function nextSection(){



        // Check to see if the user has answered all questions     
        const responseDataLocationString = "courses/"+selectedCourseID+"/chapterData/"+selectedChapterID+"/sectionData/"+selectedSectionID+"/responseData"
        var userResponseData = getUserData(userData, responseDataLocationString)   

        // var userResponseData = getUserData(userData, "responses/"+selectedCourseID+"/"+selectedChapterID+"/"+selectedSectionID)
        if(!allInputsComplete(userResponseData, sectionData)){
            setMessage("Please respond to all questions")
            seMessageRefreshCount(messageRefreshCount + 1)
            return
        }
        
        // Check to see if there is still remaining time
        if(remainingTime > 0){
            //console.log("remaining time: ", remainingTime)  
            setMessage("There is still remaining time")
            seMessageRefreshCount(messageRefreshCount + 1)
            return
        }  

        // Saving the completion status to show the user has completed the sectin
        dispacher(saveUserSectionData2({sectionID: sectionData?.id, chapterID: chapterID, kvPairs: {complete: true}}))
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
            if(item?.type === "Text Input" || item?.type === "Multiple Choice"){
                if(!userResponseData || !userResponseData[item.id]){
                    allComplete = false
                }
            }
            if(item?.type === "Input Field"){
                // Check to see if there is input for this input field
                if(!userResponseData || !userResponseData[item.id]){
                    // Check to see if its a multiple choice input
                    if(item?.inputType === "Select"){
                        // If it is and there is no user response data for it save the default respose    

                        // This is where the data for the response is saved
                        let responseLocation = "coursesApp/userData/"+userID+"/courses/"+selectedCourseID+"/chapterData/"+selectedChapterID+"/sectionData/"+selectedSectionID+"/responseData/"+item?.id
                        
                        // Get the default response (the first choice)
                        let defaultResponse = item?.content2
                        if(defaultResponse && typeof defaultResponse === "string")
                            defaultResponse = defaultResponse.split(",")[0]

                        // Create the response data object
                        let responseData = {
                            response: defaultResponse,
                            elementData: item,
                        }

                        // Save it in the db
                        set(ref(database, responseLocation), responseData)  
                    }
                    // If its not a select input and there is no response data for it, its not complete
                    else{
                        allComplete = false
                    }
                }
                
                
            }
        })        
        return allComplete
    }
    function setRemainingTimeFunction(remainingTime){
        // console.log("setting remaining time: ", remainingTime)
        setRemainingTime(remainingTime)
    }

  return (
    <>
        {!checkoutSection ?
            <div className='sectionButtons'>
                <div className='nextButtonTimer'>    
                    <TimeDisplay2 sectionData={sectionData} chapterID={chapterID} setRemainingTime={setRemainingTimeFunction}></TimeDisplay2>                        
                </div>
                <button onClick={()=>dispacher(selectPreviousSection())}>Back</button>
                <div className='sectionButtonMessage'>            
                    <FadeMessage message={message} refreshCount={messageRefreshCount} backgroundColor={"rgb(197, 119, 119)"}></FadeMessage>
                </div>
                <button onClick={nextSection}>Next</button>
                <button onClick={()=>console.log(sectionArray)}>Log SectionArray</button>
                <button onClick={()=>console.log(userData)}>Log User Data</button>
            </div>
            :
            <div>
                <TimeDisplay2 sectionData={sectionData} chapterID={chapterID} setRemainingTime={setRemainingTimeFunction}></TimeDisplay2>                        
            </div>
        }
    </>
  )
}

export default SectionButtons