import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./ElementDisplayBlock.css"

function ElementDisplayBlock({elementData}) {
  
  const userData = useSelector(state => state.dbslice.userData)
  const dbSliceData = useSelector(state => state.dbslice)
  const [userResponse, setUserResponse] = useState()
  const [showSaveIndicator, setShowSaveIndicator] = useState()
  const [showSaveErrorIndicator, setShowSaveErrorIndicator] = useState()
  const [saveIndicatorFade, setSaveIndicatorFade] = useState()
  const responseInputRef = useRef()
  const dispatcher = useDispatch()

  useEffect(() => {
    console.log ("elementData")
    console.log (elementData)
  }, [])

  // After 500ms of inactivity after typing into the response box save the result
  const responseSaveTimeoutRef = useRef()
  function responseNeedsSave(){
      clearTimeout(responseSaveTimeoutRef.current)
      responseSaveTimeoutRef.current = setTimeout(()=>{
          saveUserResponseFunction()
      },500)
  }

  function saveUserResponseFunction(){

  }

  function displayContent(){
    
    if(elementData?.type === "Text"){
        return (
            <div className='elementViewDisplay'>
                <div className='elementTextDisplay'>
                  {elementData?.content}
                </div>
                {/* <pre className='elementTextDisplay'>
                   {HTMLReactParser(elementData?.content)}
                </pre> */}
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
    else if(elementData?.type === "Title 2"){
        return (
            <div className='elementViewDisplay'>
                <div className='elementDisplayTitle2'>
                   {elementData?.content}
                </div>
            </div>
        )
    }
    else if(elementData?.type === "Title 3"){
        return (
            <div className='elementViewDisplay'>
                <div className='elementDisplayTitle3'>
                   {elementData?.content}
                </div>
            </div>
        )
    }
    else if(elementData?.type === "Video")
        return (
            <div className='elementViewDisplay'>
                <iframe width="100%" height="450px" src={elementData?.content} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
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
            <>
                <>
                    {elementData?.content}
                </>
                <textarea placeholder='Type your answer here' ref={responseInputRef} onChange={responseNeedsSave} defaultValue={userResponse?.content}></textarea>
            </>
        )
    else if(elementData?.type === "Input Field")
        return (
            <div className='elementInput'>
                <div className='elementTextDisplay quizElementPrompt'>
                    {elementData?.content}
                </div>
                <input placeholder='Type your answer here' ref={responseInputRef} onChange={responseNeedsSave} defaultValue={userResponse?.content}></input>
            </div>
        )
    else if(elementData?.type === "Multiple Choice")
        return (
            <>
                {/* <MulltipleChoiceDisplay elementData={elementData} userResponse={userResponse} saveUserResponseLocal={saveUserResponseLocal}></MulltipleChoiceDisplay> */}
            </>
        ) 
    else {
      return(
        <div>
          element
          {elementData?.name}
        </div>
      )
    }
  
  }
  
  return (
    <div>   
        {displayContent()}
    </div>
  )
}

export default ElementDisplayBlock