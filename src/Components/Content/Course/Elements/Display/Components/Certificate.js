import React, { useEffect, useRef, useState } from 'react'
import certificateImage from "../../../../../../Images/certificateNoName.jpg"
import { useDispatch, useSelector } from 'react-redux'
import "./Certificate.css"
import jsPDF from 'jspdf'
import emailjs from '@emailjs/browser'
import { saveUserAccountData, storage } from '../../../../../../App/DbSlice'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'


/*
  if a certificate has not been created
  create the certificate pdf
  save it in user data (check this location to see if it has already been created)
  send a link via email to user and other email
  display the certificate (either the new one or the one on file)

  might want a way the user can update the certificate if their name is wrong or something

*/

/*
================================================================================
|                                 Certificate.js
================================================================================

    This component is embeded in the Course.js component and only displays when a course is complete
    
    It checks to see if a certificaet has been generated for this course for this user
    if so it displays that certificate in a pdf iframe
    the pdf certificate can be downloaded from there
    
    If the certificate has not been generated it generated a pdf version of the certificate with JSPDF
    it then saves it in firebase storage and saves the download link in user data to be checked next time the component is rendered
    it also emails the new certificate to the user with EmailJS and to a predefined email address based on the course data

*/

function Certificate() {
  const userData = useSelector(state => state.dbslice.userData)
  const courseData = useSelector((state) => state.dbslice.courseData);
  const userDataOverride = useSelector(state => state.appslice.userDataOverride)
  const [certificatePDFUrl, setCertificatePDFUrl] = useState()
  const dispatcher = useDispatch()

  const generatedPDF = useRef()
  useEffect(()=>{
    
      if(userData && courseData)
        checkForCertificate()
      
    

  },[userData, courseData])
  
  function checkForCertificate(){

    if(generatedPDF.current)
      return
    generatedPDF.current = true

    console.log("checkForCertificate")
    console.log("userData")
    console.log(userData)
    
    console.log("saved cert:")
    console.log(userData.accountData.certificateUrl)

    if(userData.accountData.certificateUrl) 
      setCertificatePDFUrl(userData.accountData.certificateUrl)
    else
      generateCertificatePDF()
  }

  // This function generates a pdf version of the certificate and a url pointing towards that is saved in state and displayed in an iframe
  function generateCertificatePDF(){
    console.log("generating pdf")
    const doc = new jsPDF()
    doc.addImage(certificateImage, 'JPG', 10, 10, 190, 140);
    //doc.text(80, 80, 'User Name')
    
    // Add the user's name
    let text = certificateName()
    // from this https://stackoverflow.com/questions/21060876/is-there-any-way-to-center-text-with-jspdf
    var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(textOffset, 80, text);
    
    // Add the course name
    let courseName = courseData.name
    // from this https://stackoverflow.com/questions/21060876/is-there-any-way-to-center-text-with-jspdf
    var textWidth = doc.getStringUnitWidth(courseName) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(textOffset, 64, courseName);    

    // This shows it in the iframe and it can be downloaded from there
    let url = URL.createObjectURL(doc.output("blob"))
    setCertificatePDFUrl(url)
    
    //emailCertificate(doc)
    saveCertificate(doc)
  }
 
  // So this can work, just need to upgrade account. docs: https://www.emailjs.com/docs/user-guide/file-attachments/
  function emailCertificate(doc){
    // EmailJS docs
    console.log("sending message with attachment")
    // https://www.emailjs.com/docs/user-guide/file-attachments/
    // maybe can use send instead of send form in other places
    // can add a dynamic attachment based on whats in the docs there, still not totally sure how to do that though
    var base64 = doc.output('blob');//canvas.toDataURL();
    console.log(base64)

    emailjs.send('service_fepcyns', 'template_bfzz3sp', {
        message: base64
    }, 'jxl1B6Wy4ZMfn1YcQ');
  }

  // Save the certificate in storage and save a link in user data. Check this to see if the cert has been created already for this course
  function saveCertificate(doc){
    
    // console.log("userData")
    // console.log(userData)
    // console.log("courseData")
    // console.log(courseData)

    console.log("save to storage and save link in user data")

    var blob = doc.output('blob');

    // Create a file name 
    let date = new Date()
    let fileName = "certificateOfCompletion_" + userData.accountData.firstName+"_"+userData.accountData.firstName+"_"+ courseData.name +"_"+date.getFullYear()+"_"+date.getMonth()+"_"+date.getDate()+"_"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()

    // Create a file from the blob
    let file = new File([blob], fileName, {type: "pdf"})                

    // Define the path and name for the webcam image
    let imageNamePath = 'certificates/'+fileName        

    // Upload the image to storage                
    const certificateRef = ref(storage, imageNamePath);
    uploadBytes(certificateRef, blob).then((snapshot) => {

        // Get the download url
        console.log("getting download url:")       
        getDownloadURL(snapshot.ref).then((url) => {                        
            // Push the image download url to the array of webcam images in userData for this section
            // if(!profileImageUrl || once)
            console.log("uploaded certificate url: "+url)

            console.log("saving certificate url in user data")
            dispatcher(saveUserAccountData({kvPairs: {certificateUrl: url}}))

            // Doing this for now to test before creating the db action 
            //dispatcher(pushToUserSectionData2({sectionID: sectionData?.id, arrayName: "webcamImages", valueArray: [url]}))

            // if(once)
            //     removeDisplay()

        })   

    });

  }

  function certificateName(){
    let firstName = (userDataOverride?.accountData?.firstName || userData?.accountData?.firstName)
    let lastName = (userDataOverride?.accountData?.lastName || userData?.accountData?.lastName)
    return firstName+" "+lastName
  }

  

  return (
    <>
      <div style={{height: "500px", width: "100%"}}>
        <iframe style={{height: "500px", width: "100%"}} src={certificatePDFUrl}></iframe>
      </div>
      {/* <div className='certificate'>
          <div className='certificateName'>
              {certificateName()}
          </div>
          <img src={certificateImage}></img>
      </div> */}
    </>
  )
}

export default Certificate