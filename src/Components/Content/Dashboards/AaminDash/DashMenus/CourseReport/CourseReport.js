import React, { useEffect, useState } from 'react'
import Course from '../../../../Course/Course'
import { useDispatch } from 'react-redux'
import { setUserDataOverride } from '../../../../../../App/AppSlice'
import ElementMapper from '../../../../Course/Elements/ElementMapper'
import "../../AdminDash.css"
import ElementDisplayBlock from '../../../../Course/Elements/Display/ElementDisplayBlock'
import { objectToArray } from '../../../../../../App/functions'
import { type } from '@testing-library/user-event/dist/type'
import { set } from 'firebase/database'
import CourseReportChapter from './CourseReportChapter'
import json2md from 'json2md'
import Markdown from 'markdown-to-jsx'

function CourseReport({userData, courseData, close}) {
  // Display completion on in progress status
    // Display certificate if there is one
    // Organize by section
    // Display all of the questions and answers for a course
    // Display webcam image catures
    // Display section times


    /*

      See note in Course.js

      want to display:
        DONE
        all of thr chapters and sections, even the ones the user has not started
        DONE
        the completion status of each chapter and section
        DONE
        the resopnse data for each element      
        the required time for each chapter and section
        the time spend in each chapter and section
        webcam images for the sections with timestapms
      
        generate a markdown file for all of this data, maybe in pdf form
        file downlads when admin clicks a button

    */
  const [chaptersArray, setChaptersArray] = useState([])
  const [viewMarkdown, setViewMarkdown] = useState(false)
  const [markdownString, setMarkdownString] = useState(false)
  const dispatcher = useDispatch()

  // Unused
  useEffect(()=>{
    // Set userDataOverride to the user data passed in
    //dispatcher(setUserDataOverride(userData))

    // For when component dismountes 
    return () => {
      // Set userDataOverride back to null
      //dispatcher(setUserDataOverride(null))
    } 


  },[])

  // Generate the chapters report object do be displayed
  useEffect(() => {
    generateChaptersReportObject()
  },[userData])

  // Converting the chapters array into markdown
  useEffect(() => {
    chaptersArrayToMarkdown()
  },[chaptersArray])

  // Create an array of chapter objects with the chapter data and and array of section data objects
  function generateChaptersReportObject(){
    console.log("userData")
    console.log(userData)

    // Make sure there is a valid courseData object
    if (!userData?.courses || !userData?.courses[courseData?.id] || typeof userData?.courses[courseData?.id].chapterData !== "object") 
      return

    // Add each chapter data object to the array
    let tempChapters = []
    Object.entries(userData?.courses[courseData?.id]?.chapterData).forEach(([chapterKey, chapterData]) => {
      // The base chapter data object
      let chapterObject = {
        name: chapterData?.name,
        complete: chapterData?.complete,
        sectionsArray: []
      }
      
      // Add each section data object to the array
      let sectionData = chapterData?.sectionData
      if(sectionData && typeof sectionData === "object"){
        console.log("there is section data")
        Object.entries(sectionData).forEach(([sectionKey, sectionData]) => {
          let tempSectionData = {
            name: sectionData?.name,
            complete: sectionData?.complete,
            index: sectionData?.index,
            responsesArray: [],
            responseCount: 0,
            numberOfInputElements: sectionData.numberOfInputElements
          }
          
          let tempResponsesArray = []
          let responseCount = 0
          let responseData = sectionData.responseData
          if(responseData && typeof responseData === "object"){
            Object.entries(sectionData.responseData).forEach(([responseKey, responseDataObject]) => {
              tempResponsesArray.push(responseDataObject)
              responseCount++
            })       
            tempSectionData.responsesArray = tempResponsesArray  
            tempSectionData.responseCount = responseCount  
          }

          // All of the section data will be added to the array
          chapterObject.sectionsArray.push(tempSectionData)

        })
      }

      // Add the completed chapter object to the array
      tempChapters.push(chapterObject)
      
    })
    
    setChaptersArray(tempChapters)
  }

  // Convert the chapters array into a markdown json
  function chaptersArrayToMarkdown(){
    if(!chaptersArray)
      return

    console.log("chaptersArray")
    console.log(chaptersArray)

    // This will be an array of markdown objects that will be converted with json2md
    let tempMarkdownArray = []
    chaptersArray.forEach(chapter => {
      // The chapter title with competion status
      let chapterObject = {
        h2: chapter.name + " " + (chapter.complete ? "✔":"(Incomplete)"),        
      }
      tempMarkdownArray.push(chapterObject)

      // Generate the section data markdown json if there is any and push it to the markdown array
      if(chapter.sectionsArray){        
        chapter.sectionsArray.forEach(section => {
          // The section title with competion status
          let sectionObject = {
            h3: section.name + " " + (section.complete ? "✔":((section.numberOfInputElements > 0) ? "("+section.responseCount + " / "+section.numberOfInputElements+")" :"(Incomplete)")),
          }
          tempMarkdownArray.push(sectionObject)

        //   // Generate markdown json for each response and push it to the markdown array
          if(section.responsesArray){
            section.responsesArray.forEach(response => {
              tempMarkdownArray.push(elementToMarkdown(response))
            })
          }

        })
      }


    })

    console.log("tempMarkdownArray")
    console.log(tempMarkdownArray)

    var tempMarkdownString = json2md(tempMarkdownArray)
    console.log("tempMarkdownString")
    console.log(tempMarkdownString)

    setMarkdownString(tempMarkdownString)
    createDownloadMarkdownURL(tempMarkdownString)
    createDownloadPDFURL(tempMarkdownString)
  }

  function elementToMarkdown(elementUserData){
    return {p: elementUserData?.elementData?.name + ": " + elementUserData?.response}
  }

  const [markdownDownloadUrl, setMarkdownDownloadUrl] = useState("")
  const [markDownFile, setMarkdownFile] = useState("")
  function createDownloadMarkdownURL(mdString){
    if(!mdString)
      return
    var markDownFileTemp = new Blob([mdString], {type: 'text/plain'});
    var url = URL.createObjectURL(markDownFileTemp);
    
    setMarkdownDownloadUrl(url)
    //setMarkdownFile(markDownFileTemp)
  }
  function openMarkdown(){
    window.open(markdownDownloadUrl)

  }
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState("")
  function createDownloadPDFURL(mdString){
    // create the pdf file
    // generate a url for it
    // put the url in state so when the user clicks the link it will donwload

  }

  return (

    <div className='box courseReport'>

      <div className='closeButton' onClick={close}>x</div>
      <div className='courseReportInner'>
        <button className='third' onClick={()=>setViewMarkdown(!viewMarkdown)}>View {(viewMarkdown ? "React":"Markdown")}</button>
        <a className='third button' download={"testfile.md"} href={markdownDownloadUrl}>Download Markdown File</a>
        <a className='third button' download={"testfile.pdf"} href={pdfDownloadUrl}>Download PDF</a>
        {/* <button className='third' onClick={downloadMarkdown}>Download Markdown</button> */}        
        {viewMarkdown? 
          <>
            <Markdown>{markdownString}</Markdown>
          </>
          :
          <>
            <h3>{courseData?.courseName}</h3>
            <div>          
              {chaptersArray.map(chapterDataObject => (
                <CourseReportChapter chapterUserData={chapterDataObject}></CourseReportChapter>
              ))}
            </div>
          </>
        }
      </div>

    </div>
  )
}

export default CourseReport