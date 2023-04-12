import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import "./TimedWebcam.css"
import { useSelector } from 'react-redux'

function TimedWebcam({timeArray}) {
    const webcamRef = useRef()
    const webcamOuterRef = useRef()
    const timeRef = useRef(0)
    const [showWebcam, setShowWebcam] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const [message, setMessage] = useState("Hey")
    const [currentScreenshot, setCurrentScreenshot] = useState("Hey")
    const selectedSectionID = useSelector((state) => state.dbslice.selectedSectionID);

    // Start the timer
    useEffect(() => {
        incrementTimer()
    },[])

    // Reset the timer and hide the webcam if the section changes
    useEffect(() => {
        timeRef.current = 0
        // Hide the webcam immediately (function is on a timer)
        setShowWebcam(false)
        setShowImage(false)
    },[selectedSectionID])

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
        }
    }
    /**
     * Shows the webcam then uses a timer to add a class to the webcam to fade it in
     */
    function showWebcamFunction(){
        // Show the webcam
        setShowWebcam(true)
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
        // Remove the fade in class so it fades out
        webcamOuterRef.current.classList.remove("fadeIn")
        // After it has faded out, hide the webcam, also hide the image so it is the webcam that fades in
        setTimeout(() => {
            setShowWebcam(false)
            setShowImage(false)
        }, 5000);
    }

    /**
     * Given the numbe of seconds the user has been on the section, take appropriate actions
     */
    function timeActions(seconds){
        console.log(seconds)
        // Show the webcam at 20 seconds
        if(seconds == 5){
            showWebcamFunction()
            setMessage()

        }
        // Show the countdown
        if(seconds == 17){
            setMessage("3")
        }
        if(seconds == 18){
            setMessage("2")
        }
        if(seconds == 19){
            setMessage("1")
        }
        // At 30 secons take an image and show it
        if(seconds == 20){
            // Save and display the image
            saveImage()
            // Remove the message
            setMessage("Refresh")
        }
        // Hide the webcam at 45 seconds
        if(seconds == 30){
            console.log("hiding the webcam")
            hideWebcamFunction()
            timeRef.current = 0
        }
    }

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
                {/* <button onClick={buttonPress}>{`${showImage ? "Show Webcam": "Save Image"}`}</button> */}
            </div>
        }
    </>
  )
}

TimedWebcam.defaultProps = {
    timeArray: [5, 10, 120]
}

export default TimedWebcam