import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import "./TimedWebcam.css"
import { useDispatch, useSelector } from 'react-redux'
import { pushToUserSectionData2, saveUserAccountData, saveUserSectionData2, storage } from '../../App/DbSlice';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
/*

    timeArrayRef keeps track of the times that a webcame image should be taken
    the default value is [25, 70] (25 seconds and 70 seconds)
    it is paresd from a string and set in useEffect when section data changes: timeArrayRef.current = sectionData.camTimes

    inrementTime is called in useEffect
    it increments the time then calls timeActions to check if there are any actions that should be taken at that time

    when the time is a number of seconds from the image time the webcam fades in slowly with showWebcamFunction
    and when it is a number of seconds from the image time the webcam fades out slowly with hideWebcamFunction
    at the image time it calls saveImage

    TODO
    save the images to user data
    display them in the course report
*/
function TimedWebcam({sectionData, once, removeDisplay}) {
    
    // ================================================================================
    // #region variables
    const webcamModule = useSelector(state => state.dbslice.userData?.accountData?.webcamModule)
    const selectedSectionID = useSelector((state) => state.dbslice.selectedSectionID);
    const userID = useSelector((state) => state.dbslice.userID);
    const profileImageUrl = useSelector((state) => state.dbslice.userData?.accountData?.profileImageUrl);
    const [currentScreenshot, setCurrentScreenshot] = useState()
    const [message, setMessage] = useState("Take Image")
    const [showWebcam, setShowWebcam] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const timeArrayRef = useRef([])
    const showWebcamRef = useRef(false)
    const webcamOuterRef = useRef()
    const timeOffset = useRef(0)
    const webcamRef = useRef()
    const timeRef = useRef(0)
    const active = useRef(true)
    const dispatcher = useDispatch()
    // #endregion variables

    // ================================================================================
    // #region useEffects
    // Start the timer
    useEffect(() => {
        if(once){            
            showWebcamFunction()
            return
        } 
        // If the user has not enabled the webcam module, hide the webcam, stop the timer, and return
        if(!webcamModule){
            hideWebcamFunction()
            active.current = false
        }
        
        // If the user has enabled the webcam module set the webcam to active and start the timer
        active.current = true
        incrementTimer()
        return () => {
            clearTimeout(timerRef.current)
        }

    },[webcamModule])

    // Update the section data times
    useEffect(() => {
        if(once) return
        // If there are times, set the time array ref (else will default to [25, 70])
        if(sectionData?.camTimes){
            // Split the array into an array of numbers and set the ref
            let parsedCamTimes = sectionData.camTimes.split(",").map(Number)
            timeArrayRef.current = parsedCamTimes
        }
    },[sectionData])

    // Reset the timer and hide the webcam if the section changes
    useEffect(() => {
        if(once) return
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
        if(!webcamModule || !active.current) return
        
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
        // This is retrning a base64 encoded string of the image: https://www.npmjs.com/package/react-webcam
        const imageSrc = webcamRef.current.getScreenshot()
        
        // Save the image to state to be displayed
        setCurrentScreenshot(imageSrc)
        setShowImage(true)

        // Converting the base 64 string to a blob so it can be converted to a file and uploaded to storage: https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f        
        fetch(imageSrc).then(res => res.blob()).then(
            blob => {

                // Create a file name 
                let date = new Date()
                let fileName = userID+"_timedWebcamImage_"+timeOffset.current+"_"+date.getFullYear()+"_"+date.getMonth()+"_"+date.getDate()+"_"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
                
                // Create a file from the blob
                let file = new File([blob], fileName, {type: "image/png"})                
                
                // Define the path and name for the webcam image
                let imageNamePath = 'courseWebcamImages/'+fileName        
                
                // Upload the image to storage                
                const webcamImageRef = ref(storage, imageNamePath);
                uploadBytes(webcamImageRef, file).then((snapshot) => {
        
                    // Get the download url
                    console.log("getting download url:")       
                    getDownloadURL(snapshot.ref).then((url) => {                        
                        // Push the image download url to the array of webcam images in userData for this section
                        if(!profileImageUrl || once)
                            dispatcher(saveUserAccountData({kvPairs: {profileImageUrl: url}}))

                        // Doing this for now to test before creating the db action 
                        dispatcher(pushToUserSectionData2({sectionID: sectionData?.id, arrayName: "webcamImages", valueArray: [url]}))

                        if(once)
                            removeDisplay()

                    })   
                
                });
                

            }
            
        )
        // let blobImage = imageSrc.blob()
        // console.log(blobImage)
        

        
        
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
        console.log("show webcam function")
        // Show the webcam
        setShowWebcam(true)
        showWebcamRef.current = true
        // Hide the image
        setShowImage(false)
        if(once){
            setTimeout(() => {
                if(!webcamOuterRef.current) return
                webcamOuterRef.current.classList.add("fadeInFast")                
            }, 500);
            return
        }
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
            if(once)
                active.current = false
        }, 5000);
    }
    // #endregion webcam functions

    // ================================================================================
    // #region DOM
    return (
        <>
            {showWebcam &&
                <div className='webcam' ref={webcamOuterRef}> 
                    {once && <div className='closeButton'>x</div>}
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