import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./ElementDisplayComponents.css"
import { saveRemainingSectionTime, saveRemainingSectionTime2, saveUserSectionData } from '../../../../../../App/DbSlice'
import { getUserData } from '../../../../../../App/functions'

function TimeDisplay({sectionData, chapterID, viewOnly, setRemainingTime}) {
    const [currentTime, setCurrentTime] = useState(0)
    const currentTimeRef = useRef(0)
    const sectionActiveRef = useRef()
    const sectionRequiredTimeRef = useRef(0)
    const selectedSectionID = useSelector(state => state.dbslice.selectedSectionID)
    const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
    const timerSaveCounter = useSelector(state => state.dbslice.timerSaveCounter)
    const userData = useSelector(state => state.dbslice.userData)
    const timerTimeoutRef = useRef()
    const activeRef = useRef(false)
    const dispacher = useDispatch()

    // Gets sectionData?.requiredTime, listens for visibility changes, and saves the time on component dismount
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

    // Checks ot see if the section is selected and starts or pauses the timer
    useEffect(() => {
        // Savge this in a ref so it can be accessed on resume if the user leaves the page and comes back
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
        var userCurrentTime = getUserData(userData, "responses/"+selectedCourseID+"/"+chapterID+"/"+sectionData?.id+"/sectionTime")
        // If a time value was found set the state and ref to it
        if(userCurrentTime){            
            currentTimeRef.current = userCurrentTime
        }
        setCurrentTime(currentTimeRef.current)

    },[userData])

    useEffect(() => {
        syncTime()
    },[timerSaveCounter])

    /**
     * Adds a listener to the window to detect when the user changes tabs or closes the browser
     */
    function leavePageListener(){
        // Whenever the user changes or closes the tab or browser this will be called
        window.addEventListener("visibilitychange", (event) => {
            if (document.visibilityState === "visible") {
                // If this is the active section, resume the timer
                if(sectionActiveRef.current)
                    resumeTimer()

            } else {
                // When the user leaves the page pause the timer
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
        
        // Clear this so the timer doesn't keep incrementing
        clearTimeout(timerTimeoutRef.current)

        // If the timer is active save the current remaining time in userData. Use the sectionData?.id and chapterID props because the selectedSectionID may not correspond ot this one                
        dispacher(saveUserSectionData({sectionID: sectionData?.id, chapterID: chapterID, value: currentTimeRef.current, property: "sectionTime"}))
        
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

    /**
     * Turns the raw time value from seconds into a hh:mm:ss string
     */
    function timeString(secondsRaw){
        // Calcluate the parts of the time string
        var seconds = secondsRaw % 60
        var minutes = Math.floor(secondsRaw / 60) % 60
        var hours = Math.floor(secondsRaw / 3600)

        // If the time requirement has been met display this
        if(secondsRaw <= 0){
            return "✔"
        }

        // If there are seconds but no minutes or hours, return the unpadded seconds
        if(seconds >= 0 && minutes == 0 && hours == 0){
            return seconds
        }
        // If there are seconds and minutes but no hours, return m:ss
        else if(seconds >= 0 && minutes > 0 && hours == 0){
            return minutes + ":" + pad(seconds)
        }
        // If there are seconds, minutes and hours, return h:mm:ss
        else{
            return hours + ":" + pad(minutes) + ":" + pad(seconds)
        }
    }
    
    /**
     * Makes a number 2 digits long by adding a leading 0 if needed
     */
    function pad(number){
        // return number
        if(!number || number == 0)
            return "00"
        if(number < 10) {
            return "0"+number
        }
        else 
            return number
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