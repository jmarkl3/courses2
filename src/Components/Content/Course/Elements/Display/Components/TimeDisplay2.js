import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./ElementDisplayComponents.css"
import { incrementUserSectionTime, saveUserSectionData2 } from '../../../../../../App/DbSlice'
import { getUserData, timeString } from '../../../../../../App/functions'
import { string } from '@tensorflow/tfjs'

/*
    Checks to see if the page is visible and if this section is selected
    if so starts the timer

    incrementTimer is recursibely called on a useTimeout every second and increments the currentTime state and ref

    syncTime is called when the timer is paused
    saves the current time in userData

    TODO
    put current time and the timeSectionID in global state
    update the currentTimeRef when the global state changes in a useEffect
    if if selectedSectionID === sectionData?.id      
        if global timeSectionID !== selectedSectionID 
            set the global time to 0 
        start the timer        

    or could update the userData time with a runTransaction so it is in sync automatically even in diferent windows
    then would only want the one in the section to run that, not the one in the sidenav

*/
function TimeDisplay2({sectionData, chapterID, viewOnly, setRemainingTime}) {
   
    const userData = useSelector(state => state.dbslice.userData)
    const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
    const selectedSectionID = useSelector(state => state.dbslice.selectedSectionID)
    const requiredTimeRef = useRef(sectionData?.requiredTime)
    const [userTime, setUserTime] = useState(0)
    const activeRef = useRef(false)
    const dispatcher = useDispatch()

    // Sets up a listener to pause and resume the timer if the user leaves the page or returns
    useEffect(() => {
        leavePageListener()
        
        // When the comonent is unmounted stop the timer
        return () => {pauseTimer()}

    },[])

    // When the users data changes (for example when their userTime for this section updates) update the time
    const userTimeRef = useRef()
    useEffect(() => {
        if(!userData) {
            return
        }

        // Save it in a ref so the functions can acess it
        userTimeRef.current = getUserData(userData, "courses/"+selectedCourseID+"/chapterData/"+chapterID+"/sectionData/"+sectionData?.id+"/userTime")        
        // Update it in state so the component will rerender
        setUserTime(userTimeRef.current)

    },[userData])

    // When the selected section changes check to the section data, if they match start the timer
    const selectedSectionIDRef = useRef()
    useEffect(() => {
        // Save this in a ref so it can be accessed in the leavePageListener
        selectedSectionIDRef.current = selectedSectionID

        // Save this in a ref so it can be acecssed by the countdownTimeString function
        requiredTimeRef.current = sectionData?.requiredTime

        // If the timer is on the selected section start the timer, else pause it
        if(selectedSectionID === sectionData?.id){
            startTimer()
        }else{
            pauseTimer()
        }

    },[selectedSectionID, sectionData])

    function leavePageListener(){
        // Whenever the user changes or closes the tab or browser this will be called
        window.addEventListener("visibilitychange", (event) => {

            // If the section the timer is on is not selected this listener doesn't need to do anything
            if(selectedSectionIDRef.current !== sectionData?.id)
                return            

            // If the page is visible and the timer is not active start the timer
            if (document.visibilityState === "visible") {
                if(!activeRef.current)
                    startTimer()
            } 
            // If the page is not visible and the timer is active pause the timer
            else {
                if(activeRef.current)
                    pauseTimer()
            }
        });
    }

    function startTimer(){
        // If this time display is being used only to view the time don't increment the time so it doesn't double update the db
        if(viewOnly)    
            return

        activeRef.current = true
        clearTimeout(timerRef.current)
        incrementTime()
    }

    function pauseTimer(){
        activeRef.current = false
        clearTimeout(timerRef.current)
    }

    // Increments the time in the db and recursively calls itself every second
    const timerRef = useRef()
    function incrementTime(){
        
        // Increment the user time in the db
        updateUserTime()

        if(!activeRef.current)
            return

        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            incrementTime()
        }, 1000);
    }

    // Updates the time in the db with an action
    function updateUserTime(){
        
        if(!userData) return
        dispatcher(incrementUserSectionTime())

    }

    // Calculates the difference in required time and user time
    function countdownTimeString(){
 
        // If the required time is being stored as a string convert it into an intiger
        if(typeof requiredTimeRef.current === "string")
            requiredTimeRef.current = parseInt(requiredTimeRef.current)

        // If ther is no required time for this section return an empty string (this component will still keep track of the time the user spent in thes section though)
        if(!requiredTimeRef.current)
            return ""

        // Create a time string with the difference (hh:mm:ss)
        if(userTime)
            return timeString(requiredTimeRef.current - userTime)
        else
            return timeString(requiredTimeRef.current)
    }

  return (
    <div className='timeDisplay'>      

        {countdownTimeString()}
    </div>
  )
}

export default TimeDisplay2