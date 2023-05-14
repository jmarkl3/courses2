import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./ElementDisplayComponents.css"
import { saveUserSectionData2 } from '../../../../../../App/DbSlice'
import { getUserData, timeString } from '../../../../../../App/functions'

/*
    Checks to see if the page is visible and if this section is selected
    if so starts the timer

    incrementTimer is recursibely called on a useTimeout every second and increments the currentTime state and ref

    syncTime is called when the timer is paused
    saves the current time in userData
*/
function TimeDisplay({sectionData, chapterID, viewOnly, setRemainingTime}) {
    const [currentTime, setCurrentTime] = useState(0)
    const currentTimeRef = useRef(0)
    const sectionActiveRef = useRef()
    const sectionRequiredTimeRef = useRef(0)
    const selectedSectionID = useSelector(state => state.dbslice.selectedSectionID)
    const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
    const timerSaveCounter = useSelector(state => state.dbslice.timerSaveCounter)
    const userID = useSelector(state => state.dbslice.userID)
    const userData = useSelector(state => state.dbslice.userData)
    const timerTimeoutRef = useRef()
    const activeRef = useRef(false)
    const dispatcher = useDispatch()    

    // Leave page listener pauses and resumes the timer when the user leaves the page or returns to it
    useEffect(()=>{
        leavePageListener()

        // A return in useEffects runs on dismount
        return ()=>{pauseTimer()}

    },[])

    // Gets sectionData?.requiredTime
    useEffect(()=>{
        // If the section has a required time, use that
        if(sectionData?.requiredTime)
            sectionRequiredTimeRef.current = sectionData?.requiredTime

    },[sectionData])
  
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
    useEffect(() => {
        // Save this in a ref so it can be accessed on resume if the user leaves the page and comes back
        sectionActiveRef.current = (selectedSectionID === sectionData?.id)
    
        // If the section is selected start the timer 
        if(sectionActiveRef.current)
            setTimeout(() => {
                resumeTimer()            
            }, 500);

        // Else pause the timer
        else
            pauseTimer()        

    },[selectedSectionID, sectionData])

    // When the user data changes (and on start) get the remaining time from userData
    useEffect(() => {       
        // Get the time spent in this section from userData
        var locationString = "courses/"+selectedCourseID+"/chapterData/"+chapterID+"/sectionData/"+selectedSectionID+"/userTime"
        var userCurrentTime = getUserData(userData, locationString)

        // If a time value was found set the state and ref to it
        if(userCurrentTime){            
            currentTimeRef.current = userCurrentTime
        }
        setCurrentTime(currentTimeRef.current)

    },[userData])

    useEffect(() => {
        //syncTime()
    },[timerSaveCounter])

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
        syncTime()

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
        incrementTime()
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
        {countdownTimeString(currentTime)}
    </div>
  )
}

TimeDisplay.defaultProps = {
    setRemainingTime: ()=>{}
}

export default TimeDisplay