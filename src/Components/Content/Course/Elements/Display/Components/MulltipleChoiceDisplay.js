import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { objectToArray } from '../../../../../../App/functions'
// import { itemsArray, saveUserResponse } from '../../../../../App/DBSlice'

function MulltipleChoiceDisplay({elementData, userResponse, saveUserResponseFunction}) {
    const [questionFeedback, setQustionFeedback] = useState()
    const [questionCorrect, setQuetionCorrect] = useState()
    const [selectedAnswerChoices, setselectedAnswerChoices] = useState()
    const [selectedAnswerID, setselectedAnswerID] = useState()
    const dispatcher = useDispatch()

    useEffect(()=>{
        if(userResponse){
            setSelectedAnswer(getAnswerDataByID(userResponse?.answerChoiceID))
        }
    },[userResponse])

    function getAnswerDataByID(answerID){
        var answerChoices = elementData.answerChoices
        if(!answerChoices){

            return
        }
        var answerData = {...answerChoices[answerID]}
        answerData.id = answerID
        return answerData        

    }
    /**
     * Sets the local state to display the selection
     */
    function setSelectedAnswer(answerData){   
        if(!answerData)     
            return               
        setQuetionCorrect(answerData.correct)
        setQustionFeedback(answerData.feedback)
        setselectedAnswerID(answerData.id)
    }
    /**
     * When the user selects an answer this function is called
     */
    function selectedAnswer(answerData){
        setSelectedAnswer(answerData)        
        saveUserResponseLocal(answerData)

    }
 
    /**
     * Makes a response object {correct: , answerChoiceID: } and calls the saveUserResponseFunction      
     */
    function saveUserResponseLocal(answerData){
        var responseObject = {
            correct: (answerData.correct == true || answerData.correct === "on") || false,
            answerChoiceID: answerData.id,

        }
        saveUserResponseFunction(responseObject)
    }

    /**
     * If the selected answer id matches it returns a class based on correct or incorrect
     */
    function selectedAnswerClass(answerID){

        if(answerID !== selectedAnswerID || elementData?.questionType === "No Feedback")
            return ""
        if(questionCorrect)
            return " correctFeedback"
        else
            return " incorrectFeedback"

    }

    function answerIsSelected(answerID){
        if(selectedAnswerID === answerID){
            return true
        }
        return false
    }

  return (
    <div className='multipleChoice'>
        <div className='quizElementPrompt'>
            {elementData.content}
        </div>
        {objectToArray(elementData?.answerChoices).map(answerChoice => (
            <div 
                key={answerChoice.id} 
                className={'answerChoiceDisplay '+selectedAnswerClass(answerChoice.id)} 
            >
                <input 
                    type="radio" 
                    name={"question"+elementData.id} 
                    onChange={()=>selectedAnswer(answerChoice)} 
                    checked={answerIsSelected(answerChoice.id)
                }></input>
                <div className='answerChoiceDisplayText'>
                    {answerChoice.content}
                </div>
            </div>
        ))}
        <div className={"feedback "+(questionCorrect ? "correctFeedback" : "")}>{questionFeedback}</div>
    </div>
  )
}

export default MulltipleChoiceDisplay