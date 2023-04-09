import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./ElementDisplayBlock.css"
import MulltipleChoiceDisplay from './MulltipleChoiceDisplay'

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
            <div className='textInputDisplay'>
                <div className='textInputDisplayPrompt'>
                    {elementData?.content}
                </div>
                <textarea placeholder='Type your answer here' ref={responseInputRef} onChange={responseNeedsSave} defaultValue={userResponse?.content}></textarea>
            </div>
        )
    else if(elementData?.type === "Input Field")
        return (
            <div className={`inputElement inputElement${elementData.inputSize}`}>
                <div className='elementInputLabel'>
                    {elementData?.content}
                </div>
                {elementData?.inputType === "Select" ?
                    <select>
                        {/* {console.log("elementData?.content?.split(",")")}
                        {console.log(elementData?.content2?.split(","))} */}
                        {elementData?.content2?.split(",").map(optionValue => (
                            <option>{optionValue}</option>
                        ))}
                    </select>
                    :
                    <input placeholder='Type your answer here' ref={responseInputRef} onChange={responseNeedsSave} defaultValue={userResponse?.content}></input>                    
                }
            </div>
        )
    else if(elementData?.type === "Multiple Choice")
        return (
            <>
                <MulltipleChoiceDisplay elementData={elementData} userResponse={userResponse}></MulltipleChoiceDisplay>
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
  
  return (
    <>   
        {displayContent()}
    </>
  )
}

export default ElementDisplayBlock