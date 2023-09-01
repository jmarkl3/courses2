import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./ElementDisplayComponents.css"
import { database, incrementUserSectionTime, saveUserSectionData2 } from '../../../../../../App/DbSlice'
import { getUserData, timeString } from '../../../../../../App/functions'
import { off, onValue, ref } from 'firebase/database'

/*
    Calls startValueListener which starts an onValue listener for the time corresponding with this section in useEffect 
    this value is used to calculate a displayValue which is displayed 

    Calls startTimer or Pause timer in useEffect based on if the selected section matches the section this is on and the viewOnly props value

    Calls leavePageListener which will pause the incrementer if the user leaves the page

    startTimer sets variables and calls incrementTimer
    incrementTimer dispatches an action that increments the userTime in the db and recursively calls itself every second

    The one in the sidenav sections is view only and the one in sectionbuttons increments

*/
function TimeDisplay2({sectionData, chapterID, viewOnly, setRemainingTime}) {
   
    // Used to get the userTime value (the amount of time the user has been actively in the section)
    const userID = useSelector(state => state.dbslice.userID)
    const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
    const selectedSectionID = useSelector(state => state.dbslice.selectedSectionID)
    // The time required to complete the section
    const requiredTimeRef = useRef(sectionData?.requiredTime)
    // Sets the timer on or off so it does'nt start unexpectedly
    const activeRef = useRef(false)
    const dispatcher = useDispatch()

    function log(item){
        if(!viewOnly)
            console.log(item)
    }

    useEffect(()=>{
        // This will run when the component dismounts
        return () => {
            if(typeof unsubscribeRef.current === "function")        
                unsubscribeRef.current()
        }
    },[])

    // When the course, chapter, or section ID change listen for the time stored in the corresponding location
    useEffect(() => {       
        if(typeof unsubscribeRef.current === "function")        
            unsubscribeRef.current()
        
        startValueListener()        

    },[selectedCourseID, chapterID, selectedSectionID, sectionData?.id])

   // When the selected section changes check to the section data, if they match start the timer
   const selectedSectionIDRef = useRef()
   useEffect(() => {
        if(viewOnly)
            return
            
       // Save this in a ref so it can be accessed in the leavePageListener
       selectedSectionIDRef.current = selectedSectionID

       // Save this in a ref so it can be acecssed by the countdownTimeString function
       requiredTimeRef.current = sectionData?.requiredTime
        if(!requiredTimeRef.current || typeof requiredTimeRef.current !== "string"){
            requiredTimeRef.current = 0
        }        
   
        calculateCountdownTimeString2(requiredTimeRef.current)

       // If the timer is on the selected section start the timer, else pause it
       if(selectedSectionID === sectionData?.id && !viewOnly){
           startTimer()
       }else{
           pauseTimer()
       }

   },[selectedSectionID, sectionData])

    // Sets up a listener to pause and resume the timer if the user leaves the page or returns
    useEffect(() => {
        leavePageListener()
        
        // When the comonent is unmounted stop the timer
        return () => {pauseTimer()}

    },[])

    const unsubscribeRef = useRef()

    // Listens for the time stored in the corresponing location
    function startValueListener(){
        // If all of the data is not loaded and available return, it will be called again
        if(!userID || !selectedCourseID || !chapterID || !sectionData   ){
            setRemainingTime(0)
            return
        }

        // coursesApp/userDataTimes/userID/courses/courseID/chapterData/chapterID/sectionData/sectionID/userTime
        let dbString = "coursesApp/userDataTimes/" + userID + "/courses/" + selectedCourseID + "/chapterData/" + chapterID + "/sectionData/" + sectionData?.id+"/userTime"        
        unsubscribeRef.current =  onValue(ref(database, dbString), snap => {
            // Calculates display time value and sets it to be displayed
            calculateCountdownTimeString2(snap.val())
        })
    }

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
        
        if(viewOnly)
            return

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
        
        //if(!userData) return
        dispatcher(incrementUserSectionTime())

    }

    const [displayTime, setDisplayTime] = useState()
    // Calculates the difference in required time and user time
    function calculateCountdownTimeString2(userTime){
        // For some reason it sets to this for a few miliseconds before the real value every time, sjkipping this prevents the stutter
        if(userTime == 1)
            return
 
        // If the required time is being stored as a string convert it into an intiger
        // if(typeof requiredTimeRef.current === "string")
        //     requiredTimeRef.current = parseInt(requiredTimeRef.current)

        // If ther is no required time for this section return an empty string (this component will still keep track of the time the user spent in thes section though)
        if(!requiredTimeRef.current)
            return ""

        // Calculate the difference between required time and the the time the user has spent in the section
        let remainingTime = 0
        if(userTime && requiredTimeRef.current)
            remainingTime = requiredTimeRef.current - userTime
        else if (requiredTimeRef.current)
            remainingTime = requiredTimeRef.current
        else
            remainingTime = 0

        // Create a time string with the difference (hh:mm:ss)
        setDisplayTime(timeString(remainingTime))

        // Set it in the SectionButtons component (if thats where this component is embeded)
        setRemainingTime(remainingTime)

    }

  return (
    <div className='timeDisplay'>      
        {displayTime}     
    </div>
  )
}

TimeDisplay2.defaultProps = {
    setRemainingTime : ()=>{}
}

export default TimeDisplay2