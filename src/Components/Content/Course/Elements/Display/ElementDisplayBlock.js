import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./ElementDisplayBlock.css"
import MulltipleChoiceDisplay from './Components/MulltipleChoiceDisplay'
import HTMLReactParser from 'html-react-parser'
import { database, saveUserResponse } from '../../../../../App/DbSlice'
import { getUserData, isEmptyString } from '../../../../../App/functions'
import SaveIndicator from './Components/SaveIndicator'
import { ref, set } from 'firebase/database'
import FadeMessage from './Components/FadeMessage'

function ElementDisplayBlock({elementData}) {
  
  const userData = useSelector(state => state.dbslice.userData)
  const [userResponse, setUserResponse] = useState()
  const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
  const selectedChapterID = useSelector(state => state.dbslice.selectedChapterID)
  const selectedSectionID = useSelector(state => state.dbslice.selectedSectionID)

  useEffect(() => {

    var userResponseData = getUserData(userData, "responses/"+selectedCourseID+"/"+selectedChapterID+"/"+selectedSectionID+"/"+elementData?.id)

    if(!userResponseData)
        return

    setUserResponse(userResponseData.response)

  }, [userData, selectedSectionID])

  // After 500ms of inactivity after typing into the response box save the result
  const responseSaveTimeoutRef = useRef()
  const responseInputRef = useRef()
  function responseNeedsSave(){        
        clearTimeout(responseSaveTimeoutRef.current)
        responseSaveTimeoutRef.current = setTimeout(()=>{
            saveUserResponseFunction(responseInputRef.current.value)
        },500)

  }

  const responseSelectRef = useRef()
  const userID = useSelector(state => state.dbslice.userID)
  const [saveIndicatorMessage, setSaveIndicatorMessage] = useState()
  // So the comoonent will rerender if if the message is the same
  const [saveIndicatorMessageCount, setSaveIndicatorMessageCount] = useState(0)
  function saveUserResponseFunction(response){
    //dispatcher(saveUserResponse({elementData: elementData, response: response}))
    var locationString = 'coursesApp/userData/'+userID+'/responses/'+
        selectedCourseID+'/'+
        selectedChapterID+'/'+
        selectedSectionID+'/'+
        elementData.id

    var responseData = {
        response: response,
        elementData: elementData,
    }

    // If there is no response then set the responseData to null (will remove that response from the database)
    if(isEmptyString(response))
        responseData = null    

    // Fetching from random API to see if there is an internet connection
    fetch("https://v2.jokeapi.dev/joke/Any ").then(res => {
        set(ref(database, locationString), responseData)  
            // The save was successful
            .then(m => {
                setSaveIndicatorMessage("Saved")
                setSaveIndicatorMessageCount(saveIndicatorMessageCount+1)

            })       
            // There is an error (This doesn't fire when there is no connection)
            .catch(error => {
                setSaveIndicatorMessage("Save Error")
                setSaveIndicatorMessageCount(saveIndicatorMessageCount+1)
    
            })

    })
    // If there is no connection show save error indicator
    .catch(error => {
        setSaveIndicatorMessage("Check Connection")
        setSaveIndicatorMessageCount(saveIndicatorMessageCount+1)

    })


  }

  
  function displayContent(){
    
    if(elementData?.type === "Text"){
        return (
            <div className='elementViewDisplay'>
                <div className='richText'>
                {HTMLReactParser(elementData?.content)}

                </div>
                <div className='elementTextDisplay'>
                </div>
            </div>
        )
    }
    else if(elementData?.type === "Title"){
        return (
            <div className='elementViewDisplay'>
                <div className='elementDisplayTitle'>
                   {elementData?.content}
                </div>
            </div>
        )
    }    
    else if(elementData?.type === "Video")
        return (
            <div className='elementViewDisplay'>
                <iframe src={elementData?.content} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
        )
    else if(elementData?.type === "Image")
        return (
            <div className='elementViewDisplay'>
                <img src={elementData?.content}></img>
            </div>
        )
    else if(elementData?.type === "Text Input")
        return (
            <div className='textInputDisplay'>
                <div className='textInputDisplayPrompt'>
                    {elementData?.content}
                </div>
                <textarea 
                    placeholder='Type your answer here' 
                    ref={responseInputRef} 
                    onChange={responseNeedsSave} 
                    defaultValue={userResponse}
                ></textarea>
            </div>
        )
    else if(elementData?.type === "Input Field")
        return (
            <div className={`inputElement inputElement${elementData.inputSize}`}>
                <div className='elementInputLabel'>
                    {elementData?.content}
                </div>
                {elementData?.inputType === "Select" ?
                    <select 
                        ref={responseSelectRef}
                        onChange={()=>saveUserResponseFunction(responseSelectRef.current.value)}
                        defaultValue={userResponse}

                    >
                        {elementData?.content2?.split(",").map(optionValue => (
                            <option 
                                selected={(userResponse && (typeof userResponse === "string") && optionValue && (typeof optionValue === "string")) && (userResponse?.trim() === optionValue?.trim())}
                                key={optionValue.id}
                            >
                                {optionValue}
                            </option>
                        ))}
                    </select>
                    :
                    <input 
                        placeholder='Type your answer here' 
                        ref={responseInputRef} 
                        onChange={responseNeedsSave} 
                        defaultValue={userResponse}
                    ></input>                    
                }
            </div>
        )
    else if(elementData?.type === "Multiple Choice")
        return (
            <>
                <MulltipleChoiceDisplay 
                    elementData={elementData} 
                    userResponse={userResponse}
                    saveUserResponseFunction={saveUserResponseFunction}
                ></MulltipleChoiceDisplay>
            </>
        ) 
    else {
      return(
        <>
          {elementData?.name}
        </>
      )
    }
  
  }
  // if elementData.type === "Input Field" just <> else <div className='elementViewDisplay'> because the input field needs to display inline and the element innerHtml needs an outer width
  return (
    <>   
        {elementData?.type === "Input Field" ?
            <>
                {displayContent()}
                <div className='bottomLeftFadeMessage'> 
                    <FadeMessage 
                        message={saveIndicatorMessage} 
                        refreshCount={saveIndicatorMessageCount}
                        backgroundColor={saveIndicatorMessage === "Saved" ? "green" : "red"}
                    ></FadeMessage>
                </div>
            </>
            :
            <div className='element'>
                {displayContent()}
                <div className='bottomLeftFadeMessage'> 
                    <FadeMessage 
                        message={saveIndicatorMessage} 
                        refreshCount={saveIndicatorMessageCount}
                        backgroundColor={saveIndicatorMessage === "Saved" ? "green" : "red"}
                    ></FadeMessage>
                </div>
            </div>
        }
    </>
  )
}

export default ElementDisplayBlock