import React, { useEffect, useRef, useState } from 'react'
import "../../AdminDash.css"
import json2md from 'json2md'
import Markdown from 'markdown-to-jsx'
import jsPDF from 'jspdf'
import topImage from "../../../../../../Images/topImage.jpg"
import html2canvas from 'html2canvas'
import { timeString } from '../../../../../../App/functions'
import { FromPixels } from '@tensorflow/tfjs'
/*
  When user data changes generateChaptersReportObject is called from a useEffect
  This generates the chapters array which is saved in state

  When the chapters array changes generatePDF3 is called from a useEffect
  This generates a PDF with jsPDF which is saved in state and used to download the pdf with the appropriate name
  It also generates a blob url for the pdf which is saved in state and displayed in an iframe

*/
function CourseReport({userData, courseData, close}) {
  const [chaptersArray, setChaptersArray] = useState([])
  const [markdownArray, setMarkdownArray] = useState([])
  const [viewMarkdown, setViewMarkdown] = useState(false)
  const [viewPDF, setViewPDF] = useState(false)
  const [markdownString, setMarkdownString] = useState(false)
  const [webcamImageUrls, setWebcamImageUrls] = useState([])

  // Generate the chapters report object do be displayed
  useEffect(() => {
    generateChaptersReportObject()
  },[userData])

  // Converting the chapters array into a PDF
  useEffect(() => {
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
        Object.entries(sectionData).forEach(([sectionKey, sectionData]) => {
          let tempSectionData = {
            name: sectionData?.name,
            id: sectionKey,
            complete: sectionData?.complete,
            requiredTime: sectionData?.requiredTime,
            userTime: sectionData?.userTime,
            webcamImages: sectionData?.webcamImages,
            index: sectionData?.index,
            responsesArray: [],
            responseCount: 0,
            numberOfInputElements: sectionData.numberOfInputElements,
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

    setMarkdownArray(tempMarkdownArray)
    generatePDF(tempMarkdownArray)
    // Give it half a second to render that, then generate the pdf from the html
    setTimeout(() => {

      generatePDF2()
      
    }, 250);

    var tempMarkdownString = json2md(tempMarkdownArray)

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
  const docRef = useRef()
  async function generatePDF3(){
    if(!Array.isArray(chaptersArray) || chaptersArray.length <= 0){      
      return
    }

    // Create a pdf doc with jsPDF node package
    const doc = new jsPDF();
    docRef.current = doc

    // Add the header with name, course, and date
    addLineToDoc(doc, "Course report for "+userData.accountData.firstName+" "+userData.accountData.lastName, 10, 10)
    addLineToDoc(doc, "Course: "+courseData.name, 10, 5)
    let date = new Date()    
    addLineToDoc(doc, "Generated "+date.getFullYear()+" / "+date.getMonth()+" / "+date.getDate(), 10, 5)
  
    // Add each chapter along with sections and responses
    chaptersArray.forEach(chapter => {
      // setting text formating: https://codepen.io/AndreKelling/pen/BaoLWao        
      
      // Add the chapter name and completion statue
      addLineToDoc(doc, "Chapter: "+chapter.name + " " + (chapter.complete ? "(Complete)":""), 14, 10)

      // Add each section
      if(Array.isArray(chapter.sectionsArray) && chapter.sectionsArray.length > 0){
        chapter.sectionsArray.forEach(async (section) => {
          doc.setFontSize(10)

          // Add the section name, completion status, time spent, and webcam images 
          addLineToDoc(doc, "    Section: "+section.name + " " + (section.complete ? "(Complete)":""), 12, 8)
          addLineToDoc(doc, "          Time Spent in Section: "+timeString(section.userTime)+"    Required Time: "+timeString(section.requiredTime), 8, 5)
          addLineToDoc(doc, "          Webcam Images: ", 8, 5)
          // If there are webcam imagse add them
          if(section.webcamImages && Array.isArray(section.webcamImages) && section.webcamImages.length > 0){
            console.log("ther are images to add")
            // await addWebcamImageToDoc(doc, section.webcamImages[0])
            setWebcamImageUrls(section.webcamImages)

          }

          // Add text for each user response
          if(Array.isArray(section.responsesArray) && section.responsesArray.length > 0){
            addLineToDoc(doc, "          User Responses: ", 8, 8)
            section.responsesArray.forEach(response => {
              if(response.elementData.type === "Text Input"){
                addLineToDoc(doc, "          "+response.elementData.content, 8, 8)
                addLineToDoc(doc, "              "+response.response, 8, 5)

              }
              else if(response.elementData.type === "Multiple Choice"){
                addLineToDoc(doc, "          "+response.elementData?.content, 8, 8)
                let answerChoices = response.elementData?.answerChoices
                if(answerChoices && typeof answerChoices === "object"){
                  Object.entries(answerChoices).forEach(([answerKey, answerChoice]) => {
                    // If it is the selected answer choice
                    if(answerKey === response.response?.answerChoiceID){
                      // Set the color based on if it is correct and add the choice text
                      if(response.response?.correct == true)
                        addLineToDoc(doc, "              "+answerChoice.content, 8, 5, "green")                          
                      else
                        addLineToDoc(doc, "              "+answerChoice.content, 8, 5, "red")                                                        
                      }
                    // If it is not the selected answer choice add it normally without any color
                    else{
                      addLineToDoc(doc, "              "+answerChoice.content, 8, 5)                                                                                
                    }
                  })
                }
              }              
            })
          }
        })
      }
    })
    
    // Save the doc for downloading
    setPdfDoc(doc)
    // Save the url for display in the iframe
    setPdfDocUrl(URL.createObjectURL(doc.output("blob")))

  }


  
  const docHeightOffset = useRef(0)
  // Adds a line to the doc keeping track of the height offset and when a new page is needed
  function addLineToDoc(doc, text, fontSize, heightOffset, color){
    // Set the line color and font size
    doc.setFontSize(fontSize)
    if(color)
      doc.setTextColor(color)
    else
      doc.setTextColor("black")

    // See if a new page needs to be added before adding the line
    if(docHeightOffset.current >= 280){
      doc.addPage()
      docHeightOffset.current = 10
    }   

    // Check to see if multiple lines need to be added based on font size and text length
    if(typeof text == "string" && text.length > 100){
      let leadingSpaces = text.length - text.trimStart().length
      let startString = ""
      for(let i = 0; i<leadingSpaces; i++) {
        startString += " "
      }
      let linePosition = 0
      let maxLineLength = 150
      while(linePosition < text.length){
        if(linePosition == 0)
          doc.text(text.substring(linePosition, linePosition + maxLineLength), 10, docHeightOffset.current += 5);
        else
          doc.text(startString+text.substring(linePosition, linePosition + maxLineLength), 10, docHeightOffset.current += 5);

        linePosition += maxLineLength
      }
    }else{
      // Add the line normally
      doc.text(text, 10, docHeightOffset.current += heightOffset);

    }
 
  }

  async function addWebcamImageToDoc(doc, imageURL){

    // it will be displayed in an img tag below
    // can use html2canvas to convert the image to a canvas and then add it to the pdf
    // https://stackoverflow.com/questions/16245767/creating-a-pdf-from-a-html-canvas
    // Will need to make img ids from the section info and index or the url
    // Then retrieve them from those images after they are displayed
    // Maybe when building the chapters array create an array of object with imageUrls and ids based on the section id and index
    // Then after it is built (maybe even with a timeouwt function or after an await)
    // Create images with hml2canvas ofr each of them and use that in the pdf bilder function


    console.log("in addWebcamImageToDoc")
    console.log("imageURL")
    console.log(imageURL)
    // Add the image to the doc
    let imageFile = await dataUrlToFile(imageURL)
    console.log("adding file:")
    console.log(imageFile)
    doc.addImage(imageFile, 'JPEG', 15, docHeightOffset.current+=60, 60, 40);
    docHeightOffset.current += 160

  }

  async function dataUrlToFile(dataUrl, fileName) {
    console.log("in dataUrlToFile")
    const res = await fetch(dataUrl);
    console.log("res")
    console.log(res)
    const blob = await res.blob();
    const file = new File([blob], fileName, { type: 'image/png' });
    console.log("dataUrlToFile file:")
    console.log(file)
    return file
  }

  function drawDataURIOnCanvas(strDataURI, canvas) {
    "use strict";
    var img = new window.Image();
    img.addEventListener("load", function () {
        canvas.getContext("2d").drawImage(img, 0, 0);
    });
    img.setAttribute("src", strDataURI);
}

  async function addProfileImageTDoc(){
    // docHeightOffset.current = 0
    // console.log("docRef.current")
    // console.log(docRef.current)  
    
  //profileImageElement

    // addLineToDoc(docRef.current, "test line from profile image doc", 10, 10)  
    // addLineToDoc(docRef.current, "test line from profile image doc", 10, 10)  
    // addLineToDoc(docRef.current, "test line from profile image doc", 10, 10)  
    // setPdfDoc(docRef.current)
    // setPdfDocUrl(URL.createObjectURL(docRef.current.output("blob")))

    // docHeightOffset.current = 0
    // const doc = new jsPDF()
    // addLineToDoc(doc, "test line from profile image doc", 10, 10)  
    // addLineToDoc(doc, "test line from profile image doc", 10, 10)  
    // addLineToDoc(doc, "test line from profile image doc", 10, 10)  
    // addLineToDoc(doc, "test line from profile image doc", 10, 10)  
    // setPdfDocUrl(URL.createObjectURL(doc.output("blob")))
    
    // looks like theyre downloading them and 
    // https://stackoverflow.com/questions/48258242/get-the-source-image-file-from-img-tag

    // Going back to the top of the first page of the doc
    docHeightOffset.current = 0  
    docRef.current.setPage(1)

    // Get the profile image element (this part is working)
    let profileImageElement = document.getElementById("profileImgID")
    console.log("profileImageElement")
    console.log(profileImageElement)
    console.log(profileImageElement.src)

    // let tfImg = FromPixels(profileImageElement)
    // console.log(tfImg)
    
    
    console.log("profileImageElement.baseURI")
    console.log(profileImageElement.baseURI)

    console.log("trying loadImgAsBase64")
    loadImgAsBase64(profileImageElement.src)

    // let dataUrl2 = profileImageElement.src.split(',')
    // let base64 = dataUrl2[1];
    // console.log("base64")
    // console.log(base64)
    // console.log(dataUrl2)

    return

    // let loadedFile = await dataUrlToFile(profileImageElement.src)
    // let loadedFileUrl = URL.createObjectURL(loadedFile)
    
    // console.log("loadedFile")
    // console.log(loadedFile)  
    // console.log("loadedFileUrl")  
    // console.log(loadedFileUrl)  
    // console.log("topImage")
    // console.log(topImage)


    // docRef.current.addImage(loadedFileUrl, 'png', 10, 10, 60, 40);
    
    // Create an image
    var image = new Image();
    image.setAttribute('crossOrigin', 'anonymous')

      // Create a canvas
    var canvas = document.createElement('canvas')
  
    //drawDataURIOnCanvas(loadedFileUrl, profileImageElement.src)
  
    let dataUrl = canvas.toDataURL('image/jpeg');

    //"https://firebasestorage.googleapis.com/v0/b/defaultproject-c023e.appspot.com/o/courseWebcamImages%2FWozrrcJDW9Z1mYJ43QxWx835tzr2_timedWebcamImage_10_2023_4_17_12%3A49%3A44?alt=media&token=b43dd362-a30a-4a90-9435-ca494b4bdafc"

    html2canvas(profileImageElement).then(canvas => {
      // Add the image to the doc
      docRef.current.addImage(canvas, 'jpeg', 10, 10, 60, 40);
    
      // Update the display iframe
      setPdfDocUrl(URL.createObjectURL(docRef.current.output("blob")))
      
    })



    // profileImgID

    //canvas.getContext('2d').drawImage(document.getElementById("profileImgID").scr)
    //canvas.drawImage(document.getElementById("profileImgID").scr)

    // https://stackoverflow.com/questions/24912021/convert-a-image-url-to-pdf-using-jspdf

    //let dataUrl = canvas.toDataURL('image/jpeg');
  //  let dataUrl = URL.createObjectURL(image)
    //let dataUrl = image.toDataURL('image/jpeg');

    //document.getElementById("imgTest").scr = dataUrl

  

    return
    image.onload = function () {
      console.log("image loaded")
      var canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 200; 

      //next three lines for white background in case png has a transparent background
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ggg';  /// set white fill style
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      canvas.getContext('2d').drawImage(this, 0, 0);

      let dataUrl = canvas.toDataURL('image/jpeg');

      console.log(document.getElementById("imgTest").src)
      document.getElementById("imgTest").scr = dataUrl
      console.log(document.getElementById("imgTest").src)

      //docRef.current.addImage(dataUrl, 'jpeg', 10, 10, 60, 40);
      docRef.current.addImage(profileImageElement.src, 'jpeg', 10, 10, 60, 40);

      setPdfDocUrl(URL.createObjectURL(docRef.current.output("blob")))
  };
    

    return

    // Create a canvas from it
    html2canvas(profileImageElement).then(canvas => {
      // This logs something, idk for sure if the image is in it 
      console.log("adding canvas")
      console.log(canvas)

      // This is working
      addLineToDoc(docRef.current, "test line from profile image doc", 10, 10)  

      // Put the image in the doc (adds the element with backgrond, but not contents, also doesn't work for img tag contents (doesnt show src))
      docRef.current.addImage(canvas, 'JPG', 10, 10, 60, 40);


      // This works
      // docRef.current.addImage(topImage, 'JPG', 10, 10, 60, 40);
    
      // Set the url so the ifram displays the updated version (seems to be working)
      setPdfDocUrl(URL.createObjectURL(docRef.current.output("blob")))
    })

    return
    // let courseReportElement = document.getElementById("courseReportHTML")

    // // Create a canvas image from the html
    // html2canvas(courseReportElement).then(canvas => {

    //   // var imgData = canvas.toDataURL('image/png');

    //   var pageHeight = 295; 
    //   var heightLeft = canvas.height / 6;
    //   var position = 10;

    //   // For some reason its adding the first page with a large reverse margin at the top
    //   doc.addImage(canvas, 'JPG', 10, 10, canvas.width/6, canvas.height/6);
    // })
  }

  // https://stackoverflow.com/questions/43000648/html-img-src-works-but-js-image-loading-cause-cors-error

  function loadImgAsBase64(url) {

    let canvas = document.createElement('CANVAS');
    let img = document.createElement('img');
    //img.setAttribute('crossorigin', 'anonymous');
    img.src = url;
  
    img.onload = () => {
      canvas.height = img.height;
      canvas.width = img.width;
      let context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);

      docRef.current.addImage(canvas, 'jpeg', 10, 10, 60, 40);
    
      // Update the display iframe
      setPdfDocUrl(URL.createObjectURL(docRef.current.output("blob")))

      // let dataURL = canvas.toDataURL('image/png');
      // canvas = null;
      // console.log(dataURL)
      //callback(dataURL);
    };
  }
  
  
  let url = 'http://lorempixel.com/500/150/sports/9/';

  return (

    <div className='box courseReport'>
      <div className='closeButton' onClick={close}>x</div>
      <div className='courseReportInner'>
        <button className='third' onClick={()=>downloadPDF()}>Download {userData.accountData.firstName+"'s Course Report "} PDF</button>        
        <iframe className='pdfIframe' src={pdfDocUrl}></iframe>     
        {/* {webcamImageUrls.map(imageURL => (
          <img id={"imgTest"} className="webcamImage" src={imageURL}></img>
        ))}   
        <div id='profileImageElement' className='profileImageElement'>
          <img className="webcamImage" id={"profileImgID"} src={userData.accountData.profileImageUrl}></img>
          <span style={{color: "blue"}}>
            test of the thing
          </span>
        </div>
        <button onClick={addProfileImageTDoc}>Add</button> */}
      </div>

    </div>
  )
}

export default CourseReport