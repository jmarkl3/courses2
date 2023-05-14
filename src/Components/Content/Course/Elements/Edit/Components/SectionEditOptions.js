import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toggleMinimizeAll, togglePreviewMode } from '../../../../../../App/AppSlice';
import { getItem, objectToArray } from '../../../../../../App/functions';
import ConfirmationBox from '../../../../../../Utils/ConfirmationBox';
import { addElement, copySection, deleteSection, updateItemInfo } from '../../../../../../App/DbSlice';

function SectionEditOptions() {
    const courseData = useSelector((state) => state.dbslice.courseData);
    const minimizeAll = useSelector((state) => state.appslice.minimizeAll);
    const selectedChapterID = useSelector((state) => state.dbslice.selectedChapterID);
    const selectedSectionID = useSelector((state) => state.dbslice.selectedSectionID);
    const [confirmationBoxMessage, setConfirmationBoxMessage] = useState()
    const [sectionData, setSectionData] = useState({})
    const dispacher = useDispatch()

    // On start and whenever the selected chapter or section changes, update the elements array
    useEffect(() => {
        var sectionData = getItem(courseData, selectedChapterID, selectedSectionID)
        setSectionData(sectionData)
    
        console.log("sectionData?.camTimes")
        console.log(sectionData?.camTimes)

    }, [courseData, selectedChapterID, selectedSectionID])

    // Have to manually set this, for some reason it doesnt update when the section data changes
    useEffect(() => {
        if(sectionData?.camTimes)
            sectionWebcamTimesInputRef.current.value = sectionData?.camTimes
        else
            sectionWebcamTimesInputRef.current.value = ""
    }, [sectionData])

    const sectionNameChangeTimer = useRef(null)
    const sectionNameInputRef = useRef()
    function sectionNameChange(){
        clearTimeout(sectionNameChangeTimer.current)
        sectionNameChangeTimer.current = setTimeout(() => {
            dispacher(updateItemInfo({chapterID: selectedChapterID, sectionID: selectedSectionID, type: "name", value: sectionNameInputRef.current?.value}))
        }, 500);
    }
    const sectionTimeInputRef = useRef()
    function sectionTimeChange(){
        dispacher(updateItemInfo({chapterID: selectedChapterID, sectionID: selectedSectionID, type: "requiredTime", value: sectionTimeInputRef.current?.value}))

    }
    const sectionTypeInputRef = useRef()
    function sectionTypeChange(){
        dispacher(updateItemInfo({chapterID: selectedChapterID, sectionID: selectedSectionID, type: "type", value: sectionTypeInputRef.current?.value}))

    }
    function copySectionFunction(){
        dispacher(copySection({sectionToCopy: sectionData, chapterID: selectedChapterID}))
    }
    function deleteSectionFunction(){
        dispacher(deleteSection({chapterID: selectedChapterID, sectionID: selectedSectionID}))
        setConfirmationBoxMessage()
    }
    function addElementFunction(){
        dispacher(addElement({chapterID: selectedChapterID, sectionID: selectedSectionID, afterID: -1}))

    }
 
    const sectionWebcamChangeTimer = useRef(null)
    const sectionWebcamTimesInputRef = useRef()
    function sectionWebcamTimesChange(){
        clearTimeout(sectionWebcamChangeTimer.current)
        sectionWebcamChangeTimer.current = setTimeout(() => {
            dispacher(updateItemInfo({chapterID: selectedChapterID, sectionID: selectedSectionID, type: "camTimes", value: sectionWebcamTimesInputRef.current?.value}))
        }, 500);
    }
  return (
    <>
        <div className='elementDisplay bottomPadding5' key={selectedSectionID}>
            <div className='elementEditOptions'>  
                <select 
                    // ref={sectionTypeRef} 
                    title="Section Type"
                    value={sectionData?.type || "Default"}
                    ref={sectionTypeInputRef}
                    onChange={sectionTypeChange}
                >
                    <option>Default</option>
                    <option title={"Question feedback will not be displayed"}>Quiz</option>
                </select>
                <input 
                    placeholder='Section Title' 
                    title='Section Title'
                    defaultValue={sectionData?.name}
                    ref={sectionNameInputRef}
                    onChange={sectionNameChange}
                ></input>                            
                <input 
                    placeholder='Section Time' 
                    title='The minimum amount of time the user will need to be in the section before the can proceed'
                    defaultValue={sectionData?.requiredTime}
                    ref={sectionTimeInputRef}
                    onChange={sectionTimeChange}
                    key={selectedSectionID}
                ></input>
                <input 
                    placeholder='Webcam Times' 
                    title='The times in seconds that the webcam will take pictures of users'
                    defaultValue={sectionData?.camTimes}                    
                    ref={sectionWebcamTimesInputRef}
                    onChange={sectionWebcamTimesChange}    
                    key={selectedSectionID}                
                ></input>
            </div>

            <div className='elementEditOptions'>
                <button onClick={()=>dispacher(toggleMinimizeAll())}>{minimizeAll ? "Maximize All" : "Minimize All"}</button>
                <button onClick={()=>dispacher(togglePreviewMode())}>Preview Mode</button>
            </div>
            <div className='elementEditOptions'>
                <button onClick={copySectionFunction}>Copy Section</button>
                <button onClick={()=>setConfirmationBoxMessage("Delete Section?")}>Delete Section</button>
            </div>
        </div> 
        <button style={{margin: "0px", width: "100%"}} onClick={addElementFunction}>Add Element</button> 
        <ConfirmationBox message={confirmationBoxMessage} cancel={()=>setConfirmationBoxMessage()} confirm={deleteSectionFunction}></ConfirmationBox>                       
    </>
  )
}

export default SectionEditOptions