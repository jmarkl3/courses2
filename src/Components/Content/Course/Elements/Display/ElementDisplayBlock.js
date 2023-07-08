import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./ElementDisplayBlock.css"
import MulltipleChoiceDisplay from './Components/MulltipleChoiceDisplay'
import HTMLReactParser from 'html-react-parser'
import { database, saveUserAccountData, saveUserResponse } from '../../../../../App/DbSlice'
import { getUserData, isEmptyString, languageContent, languageContent2 } from '../../../../../App/functions'
import SaveIndicator from './Components/SaveIndicator'
import { ref, set } from 'firebase/database'
import FadeMessage from './Components/FadeMessage'
import AccountElement from './Components/AccountElement'
import Card from './Components/Card'
import Checkout from './Components/Checkout'

/*
================================================================================
|                              ElementDisplayBlock.js
================================================================================

    This component is renderd from Element.js or ElementEdit.js and displays the element data in the appropriate way
    
    There are several types of elements including text, video, multiple choice, etc.

    If this is an input element such as a multiple choice element the user resonse data is saved in user data
    if the user has already responded to an input element their responses are loaded from user data and displayed

*/

function ElementDisplayBlock({elementData, responseDataOverride}) {
  
    const userData = useSelector(state => state.dbslice.userData)
    // const userDataOverride = useSelector(state => state.appslice.userDataOverride)
    const [userResponse, setUserResponse] = useState()
    const language = useSelector(state => state.dbslice?.language)
    const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
    const selectedChapterID = useSelector(state => state.dbslice.selectedChapterID)
    const selectedSectionID = useSelector(state => state.dbslice.selectedSectionID)
    const dispatcher = useDispatch()

  useEffect(() => {
    if(responseDataOverride){
        setUserResponse(responseDataOverride.response)
        elementData = responseDataOverride.elementData
        console.log("elementData")
        console.log(elementData)
    }else{
        const responseDataLocationString = "courses/"+selectedCourseID+"/chapterData/"+selectedChapterID+"/sectionData/"+selectedSectionID+"/responseData/"+elementData?.id
        var userResponseData = getUserData(userData, responseDataLocationString)
        if(userResponseData)
            setUserResponse(userResponseData.response)
    }

  }, [userData, selectedSectionID, responseDataOverride, elementData])

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
  // So the save comoonent will rerender if the message is the same
  const [saveIndicatorMessageCount, setSaveIndicatorMessageCount] = useState(0)
  function saveUserResponseFunction(response){
    // If this is being viewed in the admin dash for another person don't change the response
    if(responseDataOverride)
        return
    var responseData = {
        response: response,
        elementData: elementData,
    }
    
    // If there is no response then set the responseData to null (will remove that response from the database)
    if(isEmptyString(response))
        responseData = null    
    
    // This is where the data for the response is saved
    let responseLocation = "coursesApp/userData/"+userID+"/courses/"+selectedCourseID+"/chapterData/"+selectedChapterID+"/sectionData/"+selectedSectionID+"/responseData/"+elementData?.id

    // Fetching from random API to see if there is an internet connection
    fetch("https://v2.jokeapi.dev/joke/Any").then(res => {
        set(ref(database, responseLocation), responseData)  
            // The save was successful
            .then(m => {
                setSaveIndicatorMessage("Saved")
                setSaveIndicatorMessageCount(saveIndicatorMessageCount+1)

            })       
            // There is an error (This doesn't fire when there is no connection)
            .catch(error => {
                setSaveIndicatorMessage("Save Error")
                setSaveIndicatorMessageCount(saveIndicatorMessageCount+1)
    
            }
        )

    })
    // If there is no connection show save error indicator
    .catch(error => {
        setSaveIndicatorMessage("Check Connection")
        setSaveIndicatorMessageCount(saveIndicatorMessageCount+1)

    })


  }
  
  // After 500ms of inactivity after typing into the response box save the result
  const userDataInputTimeoutRef = useRef()
  const userDataInputRef = useRef()
  function userDataNeedsSave(){                
        console.log("userDataNeedsSave")
        clearTimeout(userDataInputTimeoutRef.current)
        userDataInputTimeoutRef.current = setTimeout(()=>{
            if(!elementData.content3){
                console.log("error saving user data, invalid key")
                return
            }
            console.log("saveUserAccountData in "+elementData.content3)
            dispatcher(saveUserAccountData({kvPairs: {[elementData.content3]: userDataInputRef.current.value}}))
        },500)

  }


  function displayContent(){
    
    if(elementData?.type === "Text"){
        return (
            <div className='elementViewDisplay'>
                {(elementData?.content || elementData?.contentEs) && <div className='richText'>
                    {HTMLReactParser(languageContent(language, elementData))}
                </div>}
                <div className='elementTextDisplay'>
                </div>
            </div>
        )
    }
    else if(elementData?.type === "Title"){
        return (
            <div className='elementViewDisplay'>
                <div className='elementDisplayTitle'>
                   {languageContent(language, elementData)}
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
                    {languageContent(language, elementData)}
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
                    {languageContent(language, elementData)}
                </div>
                {elementData?.inputType === "Select" ?
                    <select 
                        ref={responseSelectRef}
                        onChange={()=>saveUserResponseFunction(responseSelectRef.current.value)}
                        defaultValue={userResponse}

                    >
                        {languageContent2(language, elementData)?.split(",").map(optionValue => (
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
    else if(elementData?.type === "User Data Field"){        
        return (
            <div className={`inputElement inputElement${elementData.inputSize}`} style={{display: "inline-block"}}>
                <div className='elementInputLabel'>
                    {languageContent(language, elementData)}
                </div>
                {elementData?.inputType === "Select" ?
                    <select 
                        ref={responseSelectRef}
                        onChange={()=>saveUserResponseFunction(responseSelectRef.current.value)}
                        defaultValue={userResponse}

                    >
                        {languageContent2(language, elementData)?.split(",").map(optionValue => (
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
                        ref={userDataInputRef} 
                        onChange={userDataNeedsSave}                         
                        defaultValue={userData?.accountData && userData?.accountData[elementData.content3]}
                    ></input>                    
                }
            </div>
        )
    }
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
    else if(elementData?.type === "Account")
        return (
            <>
                <AccountElement
                    elementData={elementData} 
                ></AccountElement>
            </>
        ) 
    else if(elementData?.type === "Card")
        return (
            <>
                <Card
                    elementData={elementData} 
                ></Card>
            </>
        ) 
    else if(elementData?.type === "Checkout")
        return (
            <>
                <Checkout
                    elementData={elementData} 
                ></Checkout>
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
        
        {elementData?.type === "Input Field" || elementData?.type === "User Data Field" ?
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