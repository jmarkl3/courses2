import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import "../../AdminDash.css"
import CourseReportChapter from './CourseReportChapter'
import json2md from 'json2md'
import Markdown from 'markdown-to-jsx'
import jsPDF from 'jspdf'
import topImage from "../../../../../../Images/topImage.jpg"
import { saveUserAccountData } from '../../../../../../App/DbSlice'
import { Conv2DBackpropFilter } from '@tensorflow/tfjs'
import ElementDisplayBlock from '../../../../Course/Elements/Display/ElementDisplayBlock'
import html2canvas from 'html2canvas'
/*
  when user data changes generateChaptersReportObject is called from a useEffect
  this generates the chapters array which is saved in state

  when the chapters array changes chaptersArrayToMarkdown is called from a useEffect
  this generates the markdown array which is saved in state
  it also calls generatePDF(markdownArray) which generates the pdf and saves it in state
  it also generates the markdown string which is saved in state. This was used to display the markdown in the browser but it is not used anymore

  generatePDF also generates a blob url for the pdf which is saved in state

  when viewPDF state is true the pdf file is displayed in an iframe from the blob url

  when the user clicks the download button the pdf is downloaded with pdfDoc?.save(filename)

  TODO
  the elements should be saved into the markdown array as well
  and this should be added to the pdf
  formatting should be saved from the markdown array to the pdf
    https://stackoverflow.com/questions/25703431/how-to-keep-some-formatting-and-paragraphs-when-using-jspdf
    pdf.addHTML()  
      ex: var pdf = new jsPDF('p', 'pt', 'letter');
          pdf.addHTML($('#NameOfTheElementYouWantToConvertToPdf')[0], function () {
              pdf.save('Test.pdf');
          });
    another option pdf.fromHTML()

*/
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
    //if(!pdfDoc && markdownArray.length > 0)
      //generatePDF(markdownArray)
  },[markdownArray])

  // Generate the chapters report object do be displayed
  useEffect(() => {
    generateChaptersReportObject()
  },[userData])

  // Converting the chapters array into markdown
  useEffect(() => {
    //chaptersArrayToMarkdown()
    console.log("chaptersArray")
    console.log(chaptersArray)
    generatePDF3()
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
        id: chapterKey,
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
            id: sectionKey,
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
              let tempResponseDataObject = {...responseDataObject}
              tempResponseDataObject.id = responseKey
              tempResponsesArray.push(tempResponseDataObject)
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
      // tempChapters.push(chapterObject)
      // tempChapters.push(chapterObject)
      // tempChapters.push(chapterObject)
      tempChapters.push(chapterObject)
      
    })
    
    console.log("tempChapters")
    console.log(tempChapters)

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
        h2: chapter.name + " " + (chapter.complete ? "(Complete) ✔":"(Incomplete)"),        
      }
      tempMarkdownArray.push(chapterObject)

      // Generate the section data markdown json if there is any and push it to the markdown array
      if(chapter.sectionsArray){        
        chapter.sectionsArray.forEach(section => {
          // The section title with competion status
          let sectionObject = {
            h3: section.name + " " + (section.complete ? "(Complete) ✔":((section.numberOfInputElements > 0) ? "("+section.responseCount + " / "+section.numberOfInputElements+")" :"(Incomplete)")),
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
    // Give it half a second to render that, then generate the pdf from the html
    setTimeout(() => {

      generatePDF2()
      
    }, 250);

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
    
    setMarkdownDownloadUrl(url)
    //setMarkdownFile(markDownFileTemp)
  }

  // This may download the markdown file
  function openMarkdown(){
    window.open(markdownDownloadUrl)

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

    // using a url didn't work, this does though
    //doc.addImage(topImage, 'JPEG', 15, 40, 180, 160);

    // Create a pdf with jsPDF node package
    const doc = new jsPDF();

    // Add each line from the markdown object into the pdf
    let yOffset = 0
    markdownArray.forEach(markdownObject => {
      // They are formatted like {h2: "text"} so we just want the text part
      Object.values(markdownObject).forEach(markdownText => {
        // Adding the text line
        doc.text(markdownText, 10, yOffset+=10);
      })
    })
    setPdfDoc(doc)

    // Generate a local blob url so the pdf can be displayed in an iframe
    let pdfUrl = URL.createObjectURL(doc.output("blob"))
    setPdfDocUrl(pdfUrl)
  }
  function downloadPDF(){
    if(typeof pdfDoc !== "object")
      return
    pdfDoc?.save(userData.accountData?.firstName+"_"+userData.accountData?.lastName+"_CourseReport.pdf");

  }

  // This is ok but it chages based on the screen width when the images is captured
  // May be better to do it manually
  const [pdfDoc2, setPdfDoc2] = useState()
  const [pdfDoc2URL, setPdfDoc2URL] = useState()
  function generatePDF2(){
    const doc = new jsPDF();
  
    let courseReportElement = document.getElementById("courseReportHTML")
    console.log("courseReportElement")
    console.log(courseReportElement)

    // Create a canvas image from the html
    html2canvas(courseReportElement).then(canvas => {

      // var imgData = canvas.toDataURL('image/png');

      var pageHeight = 295; 
      var heightLeft = canvas.height / 6;
      var position = 10;
  
      // For some reason its adding the first page with a large reverse margin at the top
      doc.addImage(canvas, 'JPG', 10, 10, canvas.width/6, canvas.height/6);
      heightLeft -= pageHeight;
      position -= pageHeight + 2;
      // adding 2 to the subtract value will move it up by 2
      // can add an image that is just a cover for the bottom and move it by the corresponding amount so there is a bottom margin

      while (heightLeft >= 0) {
        // Add it to the pdf the type can be anything JPG, PNG, CANVAS, etc
        doc.addPage();
        doc.addImage(canvas, 'CANVAS', 10, position, canvas.width/6, canvas.height/6);
        heightLeft -= pageHeight;
        position -= pageHeight + 2;
      }

      
      // How to save it on multiple pages
      // https://stackoverflow.com/questions/24069124/how-to-save-a-image-in-multiple-pages-of-pdf-using-jspdf

      // Save the pdf for the saving function
      setPdfDoc2(doc)

      // Create and save a local blob url for display in the iframe
      let pdfurl2 = URL.createObjectURL(doc.output("blob"))
      setPdfDoc2URL(pdfurl2)
    });

    // Doing it without the html2canvas package
    // doc.html(courseReportElement, {html2canvas: {scale: 0.15}}).then(() => {
    // // //doc.addH(courseReportElement, {html2canvas: {scale: 0.15}}).then(() => {
    // //   html2canvas
    //   console.log("doc callback")
    //   // doc.html
    //   setPdfDoc2(doc)
    //   let pdfurl2 = URL.createObjectURL(doc.output("blob"))
    //   setPdfDoc2URL(pdfurl2)
    // });
    
  }
  function downloadPDF2(){
    pdfDoc2?.save(userData.accountData?.firstName+"_"+userData.accountData?.lastName+"_CourseReport.pdf");

  }
  // This one will generate the pdf directly from the JSON
  function generatePDF3(){
    console.log("generatePDF3")
    console.log(chaptersArray)
    if(!Array.isArray(chaptersArray) || chaptersArray.length <= 0){
      console.log("no chapters array")
      return
    }
    const doc = new jsPDF();
    let heightOffset = 10
    // Instead of using line count can use height count so it will be more accurate. Each type of thing will have different heights and they can be larger if the text is multiple lines
    let lineCount = 0
    doc.text("Course report for "+userData.accountData.firstName+" "+userData.accountData.lastName, 10, heightOffset+=10);
    let date = new Date()
    doc.text("Course: "+courseData.name, 10, heightOffset+=10);
    doc.text("Generated "+date.getFullYear()+" / "+date.getMonth()+" / "+date.getDate(), 10, heightOffset+=10);
    doc.text("    ", 10, heightOffset+=10);
    for(let i=0; i<20; i++){
      chaptersArray.forEach(chapter => {
        // setting text formating: https://codepen.io/AndreKelling/pen/BaoLWao
        doc.setFontSize(20)
        // doc.text(" ", 10, heightOffset+=10);
        // lineCount++
        doc.text("Chapter: "+chapter.name + " " + (chapter.complete ? "(Complete)":""), 10, heightOffset+=10);
        lineCount++
        if(lineCount>=22){
          doc.addPage()
          lineCount = 0
          heightOffset = 10
        }
        console.log("chapter.sectionsArray")
        console.log(chapter.sectionsArray)
        if(Array.isArray(chapter.sectionsArray) && chapter.sectionsArray.length > 0){
          chapter.sectionsArray.forEach(section => {
            doc.setFontSize(10)
            //doc.setTextColor("green")
            doc.text("    "+"Section: "+section.name + " " + (section.complete ? "(Complete)":""), 10, heightOffset+=10);
            doc.setFontSize(8)
            doc.text("        Time Spent in Section: "+"    Required Time: ", 10, heightOffset+=10);          
            doc.text("        Webcam Images: ", 10, heightOffset+=10);
            lineCount+=3
            if(lineCount>=22){
              doc.addPage()
              lineCount = 0
              heightOffset = 10
            }
            if(Array.isArray(section.responsesArray) && section.responsesArray.length > 0){
              doc.setFontSize(8)
              section.responsesArray.forEach(response => {
                if(response.elementData.type === "Text Input"){
                  // doc.text("      ", 10, heightOffset+=10);
                  // lineCount++
                  // if(lineCount>=22){
                  //   doc.addPage()
                  //   lineCount = 0
                  //   heightOffset = 10
                  // }
                  // Can have a function that checks the length of the text and adds a new line if it is too long
                  doc.text("        "+response.elementData.content, 10, heightOffset+=10);
                  // Can have a function that checks and sets these values. Maybe they can be in refs
                  lineCount++
                  if(lineCount>=22){
                    doc.addPage()
                    lineCount = 0
                    heightOffset = 10
                  }
                  doc.text("        "+response.response, 10, heightOffset+=10);
                  lineCount++
                  if(lineCount>=22){
                    doc.addPage()
                    lineCount = 0
                    heightOffset = 10
                  }
                }
                
              })
            }
          })
        }
      })

    }

    setPdfDoc(doc)
    setPdfDocUrl(URL.createObjectURL(doc.output("blob")))

    // Will need to know when to add a new page. Calc based on number of lines, type of line, length of line
  }

  return (

    <div className='box courseReport'>

      <div className='closeButton' onClick={close}>x</div>
      <div className='courseReportInner'>
        <button className='third' onClick={()=>setViewPDF(!viewPDF)}>View {(viewPDF ? "Report":"PDF Preview")}</button>
        {/* <button className='third' onClick={()=>downloadPDF()}>Download PDF</button>
        <button className='third' onClick={()=>generatePDF2()}>Generate PDF 2</button> */}
        <button className='third' onClick={()=>downloadPDF()}>Download PDF</button>
        {viewPDF? 
          <>
            {/* <Markdown>{markdownString}</Markdown> */}
            <iframe className='pdfIframe' src={pdfDocUrl}></iframe>
          </>
          :
          <>
            <h3>{courseData?.courseName}</h3>
            <div id='courseReportHTML'>          
              {chaptersArray.map(chapterDataObject => (
                <CourseReportChapter chapterUserData={chapterDataObject} id={chapterDataObject.id}></CourseReportChapter>
              ))}
              {/* {chaptersArray.map(chapterDataObject => (
                <div className='courseReportSection'>
                  <div className='courseReportInfo'>
                      <div className='courseReportInfoInner courseReportChapterTitle'>
                          {"Chapter: "+chapterDataObject?.name}
                      </div>
                      <div className='courseReportInfoInner'>
                          {chapterDataObject?.complete ? "(Complete)":"(Incomplete)"}
                      </div>
                  </div>
                  {chapterDataObject?.sectionsArray?.map((sectionUserData)=>(
                      <div className='courseReportSection'>
                        <div className='courseReportInfo'>
                            <div className='courseReportInfoInner courseReportSectionTitle'>
                                {"Section: "+sectionUserData?.name}
                            </div>
                            <div className='courseReportInfoInner'>
                                {sectionUserData.complete ? "(Complete)":((sectionUserData.numberOfInputElements > 0) ? "("+sectionUserData.responseCount + " / "+sectionUserData.numberOfInputElements+")" :"(Incomplete)")}
                            </div>
                        </div>
                        {sectionUserData?.responsesArray?.map((responseData)=>(
                            <div className='courseReportResponsesSection'>
                                <ElementDisplayBlock responseDataOverride={responseData}></ElementDisplayBlock>
                            </div>            
                        ))}
                    </div>
                  ))}
              </div>
              ))} */}

            </div>
          </>
        }
      </div>

    </div>
  )
}

export default CourseReport