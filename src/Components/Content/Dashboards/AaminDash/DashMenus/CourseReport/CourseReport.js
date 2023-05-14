import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import "../../AdminDash.css"
import CourseReportChapter from './CourseReportChapter'
import json2md from 'json2md'
import Markdown from 'markdown-to-jsx'
import jsPDF from 'jspdf'
import topImage from "../../../../../../Images/topImage.jpg"
import { saveUserAccountData } from '../../../../../../App/DbSlice'

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
  const [markdownArray, setMarkdownArray] = useState([])
  const [viewMarkdown, setViewMarkdown] = useState(false)
  const [viewPDF, setViewPDF] = useState(false)
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
  useEffect(()=>{
    if(!pdfDoc && markdownArray.length > 0)
      generatePDF(markdownArray)
  },[markdownArray])

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
    setMarkdownArray(tempMarkdownArray)
    generatePDF(tempMarkdownArray)

    var tempMarkdownString = json2md(tempMarkdownArray)
    console.log("tempMarkdownString")
    console.log(tempMarkdownString)

    setMarkdownString(tempMarkdownString)
    createDownloadMarkdownURL(tempMarkdownString)
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
    
    createDownloadPDFURL(url)
    setMarkdownDownloadUrl(url)
    //setMarkdownFile(markDownFileTemp)
  }
  function openMarkdown(){
    window.open(markdownDownloadUrl)

  }
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState("")
  async function createDownloadPDFURL(markdownDownloadUrl){


    
    // // create the pdf file
    // const pdf = await mdToPdf({ path: markdownDownloadUrl }).catch(console.error);
    // console.log("pdf")
    // console.log(pdf)
    // // generate a blob then a url to the blob for it
    // var pdfFileTemp = new Blob([mdString], {type: 'text/plain'});
    // var url = URL.createObjectURL(pdfFileTemp);
    
    // // put the url in state so when the user clicks the link it will donwload
    // setPdfDownloadUrl(url)

  }

  const [pdfDoc, setPdfDoc] = useState()
  const [pdfDocUrl, setPdfDocUrl] = useState()
  function generatePDF(markdownArray){
    // searched react locally generate a pdf from markdown in react app
    // How to create PDF files using React.js
    // https://morioh.com/p/eb466cddaa7e
    // https://www.npmjs.com/package/jspdf

    // Displaying it (and downlading)
    // https://www.npmjs.com/package/react-pdf
    // https://www.youtube.com/watch?v=JU7rfAMpbZA
    // another one https://www.npmjs.com/package/pdf-viewer-reactjs

    // Can generate this from markdownArray and save it in state
    // Admin can view it with a pdf viewer and download it with a button
    // Could also create it from the json and not have to use markdown at all
    // need to be able to add images to it too

    // safe and sound
    // just came to say hello
    // sweet caroline    
    // bohemian rhapsody

    // using a url didn't work
    //doc.addImage(topImage, 'JPEG', 15, 40, 180, 160);
    const doc = new jsPDF();
    doc.text("Hello world!", 10, 10);
    let yOffset = 10
    markdownArray.forEach(markdownObject => {
      Object.values(markdownObject).forEach(markdownText => {
        doc.text(markdownText, 10, yOffset+=10);
      })
    })
    setPdfDoc(doc)
  let pdfUrl = URL.createObjectURL(doc.output("blob"))
  console.log("pdfUrl")  
  console.log(pdfUrl)  
  setPdfDocUrl(pdfUrl)
  }
  function downloadPDF(){
    if(typeof pdfDoc !== "object")
      return
    pdfDoc?.save(userData.accountData?.firstName+"_"+userData.accountData?.lastName+"_CourseReport.pdf");

  }

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (

    <div className='box courseReport'>

      <div className='closeButton' onClick={close}>x</div>
      <div className='courseReportInner'>
        <button className='third' onClick={()=>setViewPDF(!viewPDF)}>View {(viewPDF ? "React":"PDF")}</button>
        <button className='third' onClick={()=>downloadPDF()}>Download PDF</button>
        {/* <a className='third button' download={"testfile.md"} href={markdownDownloadUrl}>Download Markdown File</a>
        <a className='third button' download={"testfile.pdf"} href={pdfDownloadUrl}>Download PDF</a>
        <button className='third' onClick={downloadPDF}>Download PDF</button>         */}
        {viewPDF? 
          <>
            {/* <Markdown>{markdownString}</Markdown> */}
            <iframe className='pdfIframe' src={pdfDocUrl}></iframe>
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