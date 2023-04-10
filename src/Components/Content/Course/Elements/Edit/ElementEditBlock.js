import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import expandIcon from "../../../../../Images/expandIcon.png"
import ConfirmationBox from '../../../../../Utils/ConfirmationBox'
import { addElement, copyElement, deleteElement, updateItemInfo } from '../../../../../App/DbSlice'
import MultipleChoiceEdit from './Components/MultipleChoiceEdit'
import { CKEditor } from 'ckeditor4-react'
// import { CKEditor } from 'ckeditor5-react'

function ElementEditBlock({elementData}) {
  const [expanded, setExpanded] = useState(true)
  const [confirmationBoxMessage, setConfirmationBoxMessage] = useState()
  const minimizeAll = useSelector((state) => state.appslice.minimizeAll);
  const selectedChapterID = useSelector((state) => state.dbslice.selectedChapterID);
  const selectedSectionID = useSelector((state) => state.dbslice.selectedSectionID);
  const selectedElementID = useSelector((state) => state.dbslice.selectedElementID);
  const inputTypeInputRef = useRef()
  const inputSizeInputRef = useRef()

  useEffect(() => {
    setExpanded(!minimizeAll)
  }, [minimizeAll])    
  
  const elementEditBlockRef = useRef()
  useEffect(() => {
    if(selectedElementID === elementData.id){
      setExpanded(true)
      //elementEditBlockRef.current?.scrollIntoView()

    }
    
  }, [selectedElementID]) 

  function confirmationBoxFunction(){
    dispacher(deleteElement({chapterID: selectedChapterID, sectionID: selectedSectionID, elementID: elementData.id }))
    setConfirmationBoxMessage()
  }
  const dispacher = useDispatch()

  const updateContentTimer = useRef()
  const contentInputRef = useRef()
  function elemetContentChanged(){
    clearTimeout(updateContentTimer.current)
    updateContentTimer.current = setTimeout(() => {
      dispacher(updateItemInfo({chapterID: selectedChapterID, sectionID: selectedSectionID, elementID: elementData.id, type: "content", value: contentInputRef.current.value}))
    }, 1000)
  }
  const updateContent2Timer = useRef()
  const content2InputRef = useRef()
  function elemetContent2Changed(){
    clearTimeout(updateContent2Timer.current)
    updateContent2Timer.current = setTimeout(() => {
      dispacher(updateItemInfo({chapterID: selectedChapterID, sectionID: selectedSectionID, elementID: elementData.id, type: "content2", value: content2InputRef.current.value}))
    }, 1000)
  }
  const updateNameTimer = useRef()
  const nameInputRef = useRef()
  function elemetNameChanged(){
    console.log("name changed")
    clearTimeout(updateNameTimer.current)
    updateNameTimer.current = setTimeout(() => {
      dispacher(updateItemInfo({chapterID: selectedChapterID, sectionID: selectedSectionID, elementID: elementData.id, type: "name", value: nameInputRef.current.value}))

    }, 1000)
  }
  const typeInputRef = useRef()
  function elemetTypeChanged(){
      dispacher(updateItemInfo({chapterID: selectedChapterID, sectionID: selectedSectionID, elementID: elementData.id, type: "type", value: typeInputRef.current.value}))

  }
  function confirmDelete(){
    setConfirmationBoxMessage("Are you sure you want to delete this element?")

  }
  function copyElementFunction(){
    dispacher(copyElement({chapterID: selectedChapterID, sectionID: selectedSectionID, elementToCopy: elementData}))
  
  }
  function addElementFunction(){
    dispacher(addElement({chapterID: selectedChapterID, sectionID: selectedSectionID, afterID: elementData.id}))
    
  }
  // This will imediately update element/propertyName ex: element/name = "new name"
  function updateElementProperty(propertyName, propertyValue){
    if(!propertyName)
      return
    if(propertyValue == undefined || propertyValue == null)
      return
    dispacher(updateItemInfo({chapterID: selectedChapterID, sectionID: selectedSectionID, elementID: elementData.id, type: propertyName, value: propertyValue}))
  }
  
  const updateEditorContentTimer = useRef()
  function elemetEditorContentChanged(event){
    clearTimeout(updateEditorContentTimer.current)
    updateEditorContentTimer.current = setTimeout(() => {
      dispacher(updateItemInfo({chapterID: selectedChapterID, sectionID: selectedSectionID, elementID: elementData.id, type: "content", value: event.editor.getData()}))
    }, 1000)
  }

  function displayContent(){
    if (elementData?.type === "Text")
        return (
            <div className='elementTextDisplay'>
              <CKEditor
                initData={elementData?.content}
                onChange={elemetEditorContentChanged}                                 
            />
              {/* <textarea onChange={elemetContentChanged}  defaultValue={elementData?.content}></textarea> */}
              {/* <Tiptap elementData={elementData} elemetContentChanged={elemetContentChanged}></Tiptap>                     */}
            </div>
        )
    if (elementData?.type === "Title" || elementData?.type === "Title 2" || elementData?.type === "Title 3")
        return (
            <div className='urlInput' >
                <input 
                  defaultValue={elementData?.content} 
                  ref={contentInputRef} 
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
                      placeholder='Video Source. In youtube click share, then <embed> then copy the url where it says src="url"'
                      title='Click on share on youtube, then copy the url where it says src="url"'  
                      defaultValue={elementData?.content} 
                      ref={contentInputRef} 
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
                      ref={contentInputRef} 
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
                  ref={contentInputRef} 
                  onChange={elemetContentChanged} 
                  placeholder="Question Prompt"
                ></textarea>
            </div>                
        )
        else if(elementData?.type === "Input Field")
        return (                   
            <div >
              <div className='elementEditOptions'>
                <input 
                  defaultValue={elementData?.content} 
                  ref={contentInputRef} 
                  placeholder="Input Label"
                  onChange={elemetContentChanged} 
                ></input>
                <select 
                  title='Input Type'
                  ref={inputTypeInputRef}
                  onChange={()=>updateElementProperty("inputType", inputTypeInputRef.current.value)}
                  defaultValue={elementData?.inputType}
                >
                    <option>Text</option>
                    <option>Select</option>
                </select>
                <select 
                  title='Input Size'
                  ref={inputSizeInputRef}
                  onChange={()=>updateElementProperty("inputSize", inputSizeInputRef.current.value)}
                  defaultValue={elementData?.inputSize}
                >
                    <option>Whole</option>
                    <option>Half</option>
                    <option>Third</option>                        
                    <option>Quarter</option>                        
                </select>
              </div>
              <div>
                {elementData.inputType === "Select" &&
                  <input 
                    defaultValue={elementData?.content2} 
                    ref={content2InputRef} 
                    placeholder="Select Options (seperated by commas)"
                    onChange={elemetContent2Changed} 
                  ></input>
                }
              </div>
            </div>                
        )
    else if(elementData?.type === "Multiple Choice")
        return (
            <div className='multipleChoiceTextArea'>
               <MultipleChoiceEdit elementData={elementData} contentInputRef={contentInputRef} elemetContentChanged={elemetContentChanged}></MultipleChoiceEdit>
            </div>
        )   
    else
        return (
            <textarea 
              defaultValue={elementData?.content} 
              ref={contentInputRef} 
              onChange={elemetContentChanged} 
              placeholder="Message to display"
            ></textarea>
        )
  }

  return (
    <>
      <div className='elementDisplay bottomPadding5' ref={elementEditBlockRef}>                  
        <div className='elementEditOptions'>
          <input 
            className='' 
            defaultValue={elementData?.name} 
            ref={nameInputRef} 
            onChange={elemetNameChanged}
          ></input>
          <select 
            ref={typeInputRef} 
            onChange={elemetTypeChanged} 
            defaultValue={elementData?.type}
          >
              <option>Text</option>
              <option>Title</option>
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
          className='bottomLeft expandButton hoverOpacity'
          title={expanded ? "Minimize":"Expand"}
          onClick={()=>setExpanded(!expanded)}
        >
          <img src={expandIcon}></img>
        </div>
      </div>
      <ConfirmationBox message={confirmationBoxMessage} confirm={confirmationBoxFunction} cancel={()=>setConfirmationBoxMessage(null)}></ConfirmationBox>
      <button style={{margin: "0px", width: "100%"}} onClick={addElementFunction}>Add Element</button>        
    </>
  )
}
 
export default ElementEditBlock