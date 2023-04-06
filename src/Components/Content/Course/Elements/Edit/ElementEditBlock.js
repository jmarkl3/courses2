import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import expandIcon from "../../../../../Images/expandIcon.png"
import ConfirmationBox from '../../../../../Utils/ConfirmationBox'

function ElementEditBlock({elementData}) {

  const elementContentRef = useRef()
  const elementTypeRef = useRef()
  const elementNameRef = useRef()  
  const [expanded, setExpanded] = useState(true)
  const [confirmationBoxMessage, setConfirmationBoxMessage] = useState()
  const minimizeAll = useSelector((state) => state.appslice.minimizeAll);

  useEffect(() => {
    setExpanded(minimizeAll)
  }, [minimizeAll])    

  function confirmationBoxFunction(){

  }
  const dispacher = useDispatch()

  function elemetContentChanged(){

  }
  function elemetNameChanged(){

  }
  function confirmDelete(){

  }
  function copyElementFunction(){

  }
  function addElementFunction(){
    //dispacher(addElement({afterID: elementData.id}))
  }
  // This will imediately update element/propertyName ex: element/name = "new name"
  function updateElementProperty(propertyName){

  }

  function displayContent(){
    if (elementData?.type === "Text")
        return (
            <div className='elementTextDisplay'>
                {/* <Tiptap elementData={elementData} elemetContentChanged={elemetContentChanged}></Tiptap>                     */}
            </div>
            // <textarea defaultValue={elementData?.content} ref={elementContentRef} onChange={elemetContentChanged} placeholder="Message to display"></textarea>
        )
    if (elementData?.type === "Title" || elementData?.type === "Title 2" || elementData?.type === "Title 3")
        return (
            <div className='urlInput' >
                <input 
                  defaultValue={elementData?.content} 
                  ref={elementContentRef} 
                  onChange={elemetContentChanged} 
                  placeholder="Title"
                ></input>
            </div>
        )
    else if(elementData?.type === "Video")
        return (
            <>
                <div className='urlInput'>
                    <input 
                      className='urlInput' 
                      placeholder='video Source'
                      title='Click on share on youtube, then copy the url where it says src="url"'  
                      defaultValue={elementData?.content} 
                      ref={elementContentRef} 
                      onChange={elemetContentChanged}
                     ></input>
                </div>
                <iframe width="560" height="315" src={elementData?.content} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </>
        )
    else if(elementData?.type === "Image")
        return (
            <>
                <div className='urlInput'>
                    <input 
                      className='urlInput' 
                      placeholder='Image Source' 
                      title='Click on share on youtube, then copy the url where it says src="url"'  
                      defaultValue={elementData?.content} 
                      ref={elementContentRef} 
                      onChange={elemetContentChanged}
                    ></input>
                </div>
                <div className='elementImage'>
                    <img src={elementData?.content}></img>
                </div>
            </>
        )
    else if(elementData?.type === "Text Input")
        return (                   
            <div className='promptTextArea'>
                <textarea 
                  defaultValue={elementData?.content} 
                  ref={elementContentRef} 
                  onChange={elemetContentChanged} 
                  placeholder="Question Prompt"
                ></textarea>
            </div>                
        )
        else if(elementData?.type === "Input Field")
        return (                   
            <div className='promptTextArea'>
                <input 
                  defaultValue={elementData?.content2} 
                  ref={elementContentRef} 
                  placeholder="Input Title"
                  ></input>
                <select title='Input Type'>
                    <option>Text</option>
                    <option>Select</option>
                </select>
                <select title='Input Size'>
                    <option>Half</option>
                    <option>Whole</option>
                    <option>Third</option>                        
                </select>
            </div>                
        )
    else if(elementData?.type === "Multiple Choice")
        return (
            <div className='multipleChoiceTextArea'>
                {/* <textarea 
                  defaultValue={elementData?.content} 
                  ref={elementContentRef} 
                  onChange={elemetContentChanged} 
                  placeholder="Question Prompt"
                ></textarea>
                <button 
                  // onClick={addMultipleChoiceOption}
                >
                  Add Answer Choice
                </button>
                <select 
                  ref={elementQuestionTypeRef} 
                  onChange={()=>{questionTypeChanged(elementData.id)}} 
                  defaultValue={elementData.questionType}
                  >
                    <option title="Feedback and correctness will display when the user makes a selection.">Show Feedback</option>
                    <option title="Feedback and correctness will display when the user makes a selection.">No Feedback</option>                        
                    
                </select>
                {itemsArray(elementData?.answerChoices).map(answerChoice => (
                    <div key={answerChoice.id} className='answerChoice' draggable onDragOver={e=>e.preventDefault()} onDragStart={()=>{answerToMoveIDRef.current = answerChoice.id}} onDrop={()=>updateQuestionChoiceOrderFunction(answerChoice.id)}>
                        <div className='inlineBlock width80'>
                            <input 
                                defaultValue={answerChoice?.content} 
                                onChange={()=>updateAnswerText(answerChoice.id)}
                                id={"answerChoiceText" + answerChoice.id + elementData.id}
                                placeholder={"Answer Choice Prompt"}
                            >
                            </input>
                            <input 
                                defaultValue={answerChoice.feedback} 
                                onChange={()=>updateAnswerFeedback(answerChoice.id)}
                                id={"answerChoiceFeedback"+answerChoice.id + elementData.id}
                                placeholder={"Answer Choice Feedback"}
                            >
                            </input>
                        </div>
                        <div className='answerChoiceCorrect'>
                            <input 
                                id={"answerChoiceCorrect"+answerChoice.id}
                                style={{width: "100%",}}
                                title={"Set As Correct Option"} 
                                type={"checkbox"} 
                                defaultChecked={answerChoice.correct}
                                onChange={()=>updateAnswerCorrect(answerChoice.id)}
                            >
                            </input> 
                            <div title="Delete Answer Choice" onClick={()=>deleteAnswerChoice(answerChoice.id)}>X</div>
                        </div>
                    </div>
                ))} */}
            </div>
        )   
    else
        return (
            <textarea 
              defaultValue={elementData?.content} 
              ref={elementContentRef} 
              onChange={elemetContentChanged} 
              placeholder="Message to display"
            ></textarea>
        )
  }

  return (
    <>
      <div className='elementDisplay bottomPadding5'>                  
        <div className='elementEditOptions'>
          <input 
            className='' 
            defaultValue={elementData?.name} 
            ref={elementNameRef} 
            onChange={elemetNameChanged}
          ></input>
          <select 
            ref={elementTypeRef} 
            // onChange={elementTypeChanged} 
            defaultValue={elementData?.type}
          >
              <option>Text</option>
              <option>Title</option>
              <option>Title 2</option>
              <option>Title 3</option>
              <option>Video</option>
              <option>Image</option>
              <option>Multiple Choice</option>
              <option>Text Input</option>
              <option>Input Field</option>
          </select>
          <button onClick={confirmDelete}>Delete</button>
          <button onClick={copyElementFunction}>Copy</button>
        </div>
        {expanded && displayContent()}
          <div 
          className='bottomLeft expandButton'
          title={expanded ? "Minimize":"Expand"}
          onClick={()=>setExpanded(!expanded)}
        >
          <img src={expandIcon}></img>
        </div>
      </div>
      <ConfirmationBox message={confirmationBoxMessage} confirm={confirmationBoxFunction} close={()=>setConfirmationBoxMessage(null)}></ConfirmationBox>
      <button style={{margin: "0px", width: "100%"}} onClick={addElementFunction}>Add Element</button>        
    </>
  )
}
 
export default ElementEditBlock