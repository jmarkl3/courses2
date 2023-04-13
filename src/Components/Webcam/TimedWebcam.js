import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import "./TimedWebcam.css"
import { useSelector } from 'react-redux'

function TimedWebcam({sectionData}) {
    
    // ================================================================================
    // #region variables
    const webcamRef = useRef()
    const webcamOuterRef = useRef()
    const timeRef = useRef(0)
    const timeOffset = useRef(0)
    const timeArrayRef = useRef([25, 70])
    const [showWebcam, setShowWebcam] = useState(false)
    const showWebcamRef = useRef(false)
    const [showImage, setShowImage] = useState(false)
    const [message, setMessage] = useState("Take Image")
    const [currentScreenshot, setCurrentScreenshot] = useState()
    const selectedSectionID = useSelector((state) => state.dbslice.selectedSectionID);
    // #endregion variables

    // ================================================================================
    // #region useEffects
    // Start the timer
    useEffect(() => {
        incrementTimer()
    },[])

    // Update the section data times
    useEffect(() => {
        // If there are times, set the time array ref (else will default to [25, 70])
        if(sectionData?.camTimes){
            timeArrayRef.current = sectionData.camTimes
        }
    },[sectionData])

    // Reset the timer and hide the webcam if the section changes
    useEffect(() => {
        timeRef.current = 0
        // Hide the webcam immediately (function is on a timer)
        setShowWebcam(false)
        setShowImage(false)
    },[selectedSectionID])
    // #endregion useEffects

    // ================================================================================
    // #region timer functions
    const timerRef = useRef()
    /**
     * Increments the timer ref and cals function to take appropriate actions
     */
    function incrementTimer(){
        // Increment the timer
        timeRef.current = timeRef.current + 1
        
        // Take appropriate actions based on the time
        timeActions(timeRef.current)
        
        // In case there is already a timer running, clear it
        clearTimeout(timerRef.current)
        // Increment the timer again in a second
        timerRef.current = setTimeout(() => {
            incrementTimer()
        }, 1000);
    }
    
    /**
     * Given the number of seconds the user has been on the section, take appropriate actions
     */
    function timeActions(seconds){
        // Make sure there is an array of times
        if(!timeArrayRef.current || !Array.isArray(timeArrayRef.current) || timeArrayRef.current.length == 0) {
            console.log("No times set")
            return
        }
        // For each time in the array perform the appropriate action
        timeArrayRef.current.forEach(time => {
            timeActions2(seconds, time)
        })
        
    }

    function timeActions2(seconds, imageTime){
        // This it the time that the image should be taken. Add the time offset to the image time so the user is given extra time if they click the retake image button
        var secondsTillImage = (imageTime + timeOffset.current) - seconds

        // If the webcam is off and the image will be taken within 20 seconds, show the webcam
        if(!showWebcamRef.current && secondsTillImage <= 20 && secondsTillImage > 0){
            webcamActions("showWebcam")
        }

        // If the image will be taken within 5 seconds, show the countdown
        if(secondsTillImage <= 5 && secondsTillImage > 0){
            webcamActions("showMessage", secondsTillImage)
        }

        // Take the iamge at the image time
        if(secondsTillImage == 0){
            webcamActions("saveImage")
        }

        // 20 seconds after the webcam is shown, hide it
        if(secondsTillImage == -20){
            webcamActions("hideWebcam")
        }
    }

    /**
     * Takes an action name and value and performs the appropriate action
     * Action names: showWebcam, hideWebcam, saveImage, showMessage (value is the message to show)
     */
    function webcamActions(actionName, value){
        //console.log("webcam action: ", actionName, value || "")
        if(actionName == "showWebcam"){
            showWebcamFunction()
            setMessage()            
        }else if (actionName == "hideWebcam"){
            hideWebcamFunction()
        }else if (actionName == "saveImage"){
            // Save and display the image
            saveImage()
            // Remove the message
            setMessage("Refresh")
        }else if (actionName === "showMessage"){
            setMessage(value)
        }
    }

    // #endregion timer functions

    // ================================================================================
    // #region webcam functions
    /**
     * Saves an image from the webcam and displays it
     */
    function saveImage(){
        if(!webcamRef.current) return
        const imageSrc = webcamRef.current.getScreenshot()
        setCurrentScreenshot(imageSrc)
        setShowImage(true)
    }
    /**
     * Alternates between showing the webcam and taking a new image
     */
    function buttonPress(){
        if(showImage){
            setShowImage(false)
        }
        else{
            saveImage()
            // Add 10 extra seconds to the timer 
            timeOffset.current = timeRef.current + 10
        }
    }
    /**
     * Shows the webcam then uses a timer to add a class to the webcam to fade it in
     */
    function showWebcamFunction(){
        // Show the webcam
        setShowWebcam(true)
        showWebcamRef.current = true
        // Hide the image
        setShowImage(false)
        // After a timer add the fade in (gives it time to render the webcam)
        setTimeout(() => {
            if(!webcamOuterRef.current) return
                webcamOuterRef.current.classList.add("fadeIn")
        }, 5000);
    }
    /**
     * Removes a class to make the webcam fade out the uses a timer to hide it completely
     */
    function hideWebcamFunction(immediate){
        if(!webcamOuterRef.current) return
        showWebcamRef.current = false
        // Remove the fade in class so it fades out
        webcamOuterRef.current.classList.remove("fadeIn")
        // After it has faded out, hide the webcam, also hide the image so it is the webcam that fades in
        setTimeout(() => {
            setShowWebcam(false)
            setShowImage(false)
            setMessage()
        }, 5000);
    }
    // #endregion webcam functions

    // ================================================================================
    // #region DOM
    return (
        <>
            {showWebcam &&
                <div className='webcam' ref={webcamOuterRef}> 
                    {showImage ?
                        <img src={currentScreenshot}></img>
                        :
                        <Webcam ref={webcamRef} height={200} width={300}></Webcam>
                    }
                    <div className='webcamMessage' onClick={buttonPress}>
                        {message}
                    </div>
                </div>
            }
        </>
    )
    // #endregion DOM

}

export default TimedWebcam