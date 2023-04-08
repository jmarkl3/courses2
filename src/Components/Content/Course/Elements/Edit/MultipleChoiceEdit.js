import React, { useEffect, useRef, useState } from 'react'
import { insertItem, objectToArray } from '../../../../../App/functions'
import { push, ref, set } from 'firebase/database'
import { useDispatch, useSelector } from 'react-redux'
import { database, updateItemInfo } from '../../../../../App/DbSlice'

function MultipleChoiceEdit({elementData, contentInputRef, elemetContentChanged}) {

    const elementQuestionTypeRef = useRef()
    const selectedCourseID = useSelector((state) => state.dbslice.selectedCourseID);
    const selectedSectionID = useSelector((state) => state.dbslice.selectedSectionID);
    const selectedChapterID = useSelector((state) => state.dbslice.selectedChapterID);
    const baseUrlRef = useRef()
    const dispacher = useDispatch()

    useEffect(() => {
        baseUrlRef.current = "coursees/" + selectedCourseID + "/chapters/" + selectedChapterID + "/sections/" + selectedSectionID + "/items/" + elementData?.id
    },[selectedCourseID, selectedSectionID, selectedChapterID, elementData])

    function addMultipleChoiceOption(){
        // Create a ref to put the new answer choice in
        var dbString = 'coursesApp/coursesData/'+selectedCourseID+'/items/'+selectedChapterID+'/items/'+selectedSectionID+'/items/'+elementData.id+'/answerChoices'
        var newAnswerChoiceDbRef = push(ref(database, dbString))

        // This will be a default answer choice
        var newAnswerChoice = {
            content: "Answer choice",
            index: objectToArray(elementData.answerChoices).length,
        }

        // Put it in the db
        set(newAnswerChoiceDbRef, newAnswerChoice)

    }
    
    function questionTypeChanged(answerChoice){
        dispacher(updateItemInfo({
            chapterID: selectedChapterID, 
            sectionID: selectedSectionID, 
            elementID: elementData?.id, 
            type: "questionType", 
            value: elementQuestionTypeRef.current.value
        }))

        // const setUrl = baseUrlRef.current + "questionType"
        // set(ref(database, setUrl), elementQuestionTypeRef.current.value)
    }


    function updateQuestionChoiceOrderFunction(answerChoiceDestination){
        var answerChoicesUpdated = insertItem(elementData.answerChoices, dragStartChoiceRef.current, answerChoiceDestination.id)  
        dispacher(updateItemInfo({chapterID: selectedChapterID, sectionID: selectedSectionID, elementID: elementData.id, type: "answerChoices", value: answerChoicesUpdated}))
    
    }
    // Save the data for the choice being dragged
    const dragStartChoiceRef = useRef()
    function choiceDragStart(answerChoice){     
        dragStartChoiceRef.current = answerChoice

    }

    const updateAnswerTextTimerRef = useRef()
    function answerTextChanged(answerChoice){
        clearTimeout(updateAnswerTextTimerRef.current)
        updateAnswerTextTimerRef.current = setTimeout(()=>updateAnswerText(answerChoice), 500)
    }
    function updateAnswerText(answerChoice){
        dispacher(updateItemInfo({
            chapterID: selectedChapterID, 
            sectionID: selectedSectionID, 
            elementID: elementData?.id, 
            additionalPathString:"/answerChoices/"+answerChoice.id, 
            type: "content", 
            value: document.getElementById("answerChoiceContent" + answerChoice.id + elementData?.id).value
        }))
    
    }
    const updateAnswerFeedbackTimerRef = useRef()
    function answerFeedbackChanged(answerChoice){
        clearTimeout(updateAnswerFeedbackTimerRef.current)
        updateAnswerFeedbackTimerRef.current = setTimeout(()=>updateAnswerFeedback(answerChoice), 500)
    }
    function updateAnswerFeedback(answerChoice){
        dispacher(updateItemInfo({
            chapterID: selectedChapterID, 
            sectionID: selectedSectionID, 
            elementID: elementData?.id, 
            additionalPathString:"/answerChoices/"+answerChoice.id, 
            type: "feedback", 
            value: document.getElementById("answerChoiceFeedback" + answerChoice.id + elementData?.id).value
        }))
    }
    function updateAnswerCorrect(answerChoice){
        var checked = document.getElementById("answerChoiceCorrect" + answerChoice.id + elementData?.id).checked
        dispacher(updateItemInfo({
            chapterID: selectedChapterID, 
            sectionID: selectedSectionID, 
            elementID: elementData?.id, 
            additionalPathString:"/answerChoices/"+answerChoice.id, 
            type: "correct", 
            value: checked,
        }))

    }
    function deleteAnswerChoice(answerChoice){
        dispacher(updateItemInfo({
            chapterID: selectedChapterID, 
            sectionID: selectedSectionID, 
            elementID: elementData?.id, 
            additionalPathString:"/answerChoices/"+answerChoice.id, 
            type: "delete", 
            value: "delete"
        }))

    }

    return (
    <>
        <textarea 
            defaultValue={elementData?.content} 
            ref={contentInputRef} 
            onChange={elemetContentChanged} 
            placeholder="Question Prompt"
        ></textarea>
        <button 
            onClick={addMultipleChoiceOption}
        >
            Add Answer Choice
        </button>
        <select 
            ref={elementQuestionTypeRef} 
            onChange={()=>{questionTypeChanged(elementData?.id)}} 
            defaultValue={elementData?.questionType}
            >
            <option title="Feedback and correctness will display when the user makes a selection.">Show Feedback</option>
            <option title="Feedback and correctness will display when the user makes a selection.">No Feedback</option>                        
            
        </select>
        {objectToArray(elementData?.answerChoices).map(answerChoice => (
            <div key={answerChoice.id} className='answerChoice' draggable onDragOver={e=>e.preventDefault()} onDragStart={()=>choiceDragStart(answerChoice)} onDrop={()=>updateQuestionChoiceOrderFunction(answerChoice)}>
                <div className='inlineBlock width80'>
                    <input 
                        defaultValue={answerChoice?.content} 
                        onChange={()=>answerTextChanged(answerChoice)}
                        id={"answerChoiceContent" + answerChoice.id + elementData?.id}
                        placeholder={"Answer Choice Prompt"}
                    >
                    </input>
                    <input 
                        defaultValue={answerChoice.feedback} 
                        onChange={()=>answerFeedbackChanged(answerChoice)}
                        id={"answerChoiceFeedback"+answerChoice.id + elementData?.id}
                        placeholder={"Answer Choice Feedback"}
                    >
                    </input>
                </div>
                <div className='answerChoiceCorrect'>
                    <input 
                        id={"answerChoiceCorrect"+answerChoice.id + elementData?.id}                        
                        title={"Set As Correct Option"} 
                        type={"checkbox"} 
                        defaultChecked={answerChoice.correct}
                        onChange={()=>updateAnswerCorrect(answerChoice)}
                        className='answerChoiceCorrectInput'
                    >
                    </input> 
                    <div className='closeButton' title="Delete Answer Choice" onClick={()=>deleteAnswerChoice(answerChoice)}>
                        X
                    </div>
                </div>
            </div>
        ))}
    </>
  )
}

export default MultipleChoiceEdit