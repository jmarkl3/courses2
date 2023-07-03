import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./ElementDisplayComponents.css"
import { database, incrementUserSectionTime, saveUserSectionData2 } from '../../../../../../App/DbSlice'
import { getUserData, timeString } from '../../../../../../App/functions'
import { onValue, ref } from 'firebase/database'

/*
================================================================================
|                                TimeDisplay.js
================================================================================

    Rendered from SectionButtons.js or SidenavSectionRow.js

    Checks to see if the section this is in is selected in useEffect
    if so starts the timer with resumeTimer

    resumeTimer clears the timout ref and calls incrementTime2
    incrementTime2 is recursively called on a useTimeout every second 
    dispatches incrementUserSectionTime which saves the userTime and requiredTime
    userTime increments automatically in the action, then updates here from the onValue listener
    requiredTime comes from the sectionData

    syncTime is called when the timer is paused
    saves the current time in userData

    in viewOnly mode it just displays the time and doesn't update it so if there is more thatn one TimeDisplay component on the page they will all display the same time and not double update

*/

function TimeDisplay({sectionData, chapterID, viewOnly, setRemainingTime}) {
    const selectedSectionID = useSelector(state => state.dbslice.selectedSectionID)
    const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
    const timerSaveCounter = useSelector(state => state.dbslice.timerSaveCounter)
    const userID = useSelector(state => state.dbslice.userID)
    const userData = useSelector(state => state.dbslice.userData)    
    const [currentTime, setCurrentTime] = useState(0)
    const currentTimeRef = useRef(0)
    const sectionActiveRef = useRef()
    const sectionRequiredTimeRef = useRef(0)
    const timerTimeoutRef = useRef()
    const activeRef = useRef(false)
    const dispatcher = useDispatch()    

    // Leave page listener pauses and resumes the timer when the user leaves the page or returns to it
    useEffect(()=>{
        // leavePageListener()

        // // A return in useEffects runs on dismount
        // return ()=>{pauseTimer()}

    },[])

    // If the section this is in is selected starts the timer
    useEffect(()=>{
        // Check to see if the section this is in is selected
        if(selectedSectionID === sectionData?.id){
            console.log("starting timer for "+sectionData?.name)
            resumeTimer()
        }

    },[selectedSectionID])

    // Gets sectionData?.requiredTime
    // useEffect(()=>{
    //     // If the section has a required time, use that
    //     // if(sectionData?.requiredTime)
    //     //     sectionRequiredTimeRef.current = sectionData?.requiredTime

    // },[sectionData])
  
    // Put the params in refs because the event callback may not have access to their currnt values
    const sectionDataRef = useRef(sectionData)
    const chapterIDRef = useRef(chapterID)
    const selectedSectionIDRef = useRef(selectedSectionID)
    useEffect(()=>{
        sectionDataRef.current = sectionData
        chapterIDRef.current = chapterID    
        selectedSectionIDRef.current = selectedSectionID
    },[sectionData, chapterID, selectedSectionID])

    // Checks to see if the section is selected and starts or pauses the timer
    // useEffect(() => {
    //     // Save this in a ref so it can be accessed on resume if the user leaves the page and comes back
    //     sectionActiveRef.current = (selectedSectionID === sectionData?.id)
    
    //     // If the section is selected start the timer 
    //     if(sectionActiveRef.current)
    //         setTimeout(() => {
    //             resumeTimer()            
    //         }, 500);

    //     // Else pause the timer
    //     else
    //         pauseTimer()        

    // },[selectedSectionID, sectionData])

    // When the user data changes (and on start) get the remaining time from userData
    const userTime = useRef(0)
    // useEffect(() => {       
    //     console.log("user data updated")
    //     // Get the time spent in this section from userData
    //     var locationString = "courses/"+selectedCourseID+"/chapterData/"+chapterID+"/sectionData/"+selectedSectionID+"/userTime"
    //     var userCurrentTime = getUserData(userData, locationString)        
    //     userTime.current = userCurrentTime

    //     // If a time value was found set the state and ref to it
    //     if(userCurrentTime){            
    //         currentTimeRef.current = userCurrentTime
    //     }
    //     // This just causes the didplay to update
    //     setCurrentTime(currentTimeRef.current)

    // },[userData])

    let variable = 100

    // When the course, chapter, or section ID change listen for the time stored in the corresponding location
    useEffect(() => {       
        startValueListener()

    },[selectedCourseID, chapterID, selectedSectionID])

    // Listens for the time stored in the corresponing location
    function startValueListener(){
        let dbString = "coursesApp/userDataTimes/" + userID + "/" + selectedCourseID + "/chapterData/" + chapterID + "/sectionData/" + selectedSectionID
        onValue(ref(database, dbString), snap => {
            userTime.current = snap.val()
            //currentTimeRef.current = snap.val()
            setCurrentTime(userTime.current)
        })
    }

    // useEffect(() => {
    //     //syncTime()
    // },[timerSaveCounter])

    /**
     * Adds a listener to the window to detect when the user changes tabs or closes the browser
     * When the user leaves the page (when it is not visiabe) the timer is paused, when the page is visible again the timer is resumed
     */
    function leavePageListener(){
        // Whenever the user changes or closes the tab or browser this will be called
        window.addEventListener("visibilitychange", (event) => {

            if(selectedSectionIDRef.current !== sectionData?.id)
                return            

            if (document.visibilityState === "visible") {
                // If this is the active section, resume the timer
                if(sectionActiveRef.current)
                    resumeTimer()

            } else {
                // When the user leaves the page pause the timer (if it is active)
                if(activeRef.current )
                    pauseTimer()

            }
        });
    }

    /**
     * Pauses the timer, sets active ref, and saves the time in userData if the timer is currently active
     */
    function pauseTimer(){
        // If the timer is active and is now becoming inactive, save the current remaining time in userData
        // if(activeRef.current)
        //syncTime()

        // Set this flag so the useEffect knows when to save the time in user data
        activeRef.current = false

        // In case there is already a timeout running, clear it
        clearTimeout(timerTimeoutRef.current)
    }
    /**
     * resume the timer and sets active ref
     */
    function resumeTimer(){
        // Set this flag so the useEffect knows when to save the time in user data
        activeRef.current = true

        // In case there is already a timeout running, clear it
        clearTimeout(timerTimeoutRef.current)

        // Start the timer
        //incrementTime()
        incrementTime2()
    }

    /**
     * Saves the current time in userData and clears the current timer
     */
    function syncTime(){
        // This is a flag that prevents multiple saves for the same section time
        if(viewOnly)
            return

        // Zero time does not need to be saved and may overwrite the actual user time
        if(currentTimeRef.current == 0)
            return  

        // Only save the data if the section is selected
        if(selectedSectionIDRef.current !== sectionData?.id)
            return

        // Clear this so the timer doesn't keep incrementing
        clearTimeout(timerTimeoutRef.current)

        // This location is depreciated
        // If the timer is active save the current remaining time in userData. Use the sectionData?.id and chapterID props because the selectedSectionID may not correspond ot this one                
        dispatcher(saveUserSectionData2({sectionID: sectionData?.id, chapterID: chapterIDRef.current, kvPairs: {userTime: currentTimeRef.current, requiredTime: sectionDataRef.current?.requiredTime}}))
        
    }

    /**
     * Increments the currentTime every second when the selectedSectionID == sectionData?.id (checked in useEffect)
     */
    function incrementTime(){
        // Increment this in a ref because the timeout doesn't have access to the current state
        currentTimeRef.current = currentTimeRef.current + 1
        
        // Set the state to the new value so it displays
        setCurrentTime(currentTimeRef.current)

        // If the timer is no longer active, stop the timer
        if(!activeRef.current)
            return

        // Set a timeout to increment the time again in a second
        timerTimeoutRef.current = setTimeout(() => {
            incrementTime()
        }, 1000);

    }
    function incrementTime2(){
        // Increment this in a ref because the timeout doesn't have access to the current state
        //currentTimeRef.current = currentTimeRef.current + 1

        console.log("in incrementTime2")

        // Another check to make sure the timer is on the selected section, if not it stops
        if(selectedSectionIDRef.current !== sectionData?.id){
            console.log("selectedSectionID !== sectionData?.id so timer not starting")
            return
        }

        // Set the state to the new value so it displays
        //setCurrentTime(currentTimeRef.current)
        dispatcher(incrementUserSectionTime({requiredTime: sectionDataRef.current?.requiredTime}))

        // If the timer is no longer active, stop the timer
        if(!activeRef.current)
            return

        clearTimeout(timerTimeoutRef.current)
        // Set a timeout to increment the time again in a second
        timerTimeoutRef.current = setTimeout(() => {
            incrementTime2()
        }, 1000);
    }

    /**
     * Calculates the remaining time and returns it as a string
     */
    function countdownTimeString(){
        var requiredTime = sectionRequiredTimeRef.current
        var timeLeft = requiredTime - currentTimeRef.current

        // When the user completes the time requirement save it in userData 
        // if(timeLeft == 0)
        //     syncTime()
        
        // Sets an external state value so it can be checked
        setRemainingTime(timeLeft)

        return timeString(timeLeft)
    }

  return (
    <div className='timeDisplay'>
        {timeString(userTime.current)}
    </div>
  )
}

TimeDisplay.defaultProps = {
    setRemainingTime: ()=>{}
}

export default TimeDisplay