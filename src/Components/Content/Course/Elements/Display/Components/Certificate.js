import React, { useEffect, useRef, useState } from 'react'
import certificateImage from "../../../../../../Images/certificateNoName.jpg"
import { useSelector } from 'react-redux'
import "./Certificate.css"
import jsPDF from 'jspdf'


/*
  if a certificate has not been created
  create the certificate pdf
  save it in user data (check this location to see if it has already been created)
  send a link via email to user and other email
  display the certificate (either the new one or the one on file)

  might want a way the user can update the certificate if their name is wrong or something

*/


function Certificate() {
  const userData = useSelector(state => state.dbslice.userData)
  const userDataOverride = useSelector(state => state.appslice.userDataOverride)
  const [certificatePDFUrl, setCertificatePDFUrl] = useState()
  
  useEffect(()=>{
    generateCertificatePDF()
  },[])
  
  // This function generates a pdf version of the certificate and a url pointing towards that is saved in state and displayed in an iframe
  function generateCertificatePDF(){
    console.log("generating pdf")
    const doc = new jsPDF()
    doc.addImage(certificateImage, 'JPG', 10, 10, 190, 140);
    //doc.text(80, 80, 'User Name')
    let text = certificateName()

    // from this https://stackoverflow.com/questions/21060876/is-there-any-way-to-center-text-with-jspdf
    var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(textOffset, 80, text);

    // This shows it in the iframe and it can be downloaded from there
    setCertificatePDFUrl(URL.createObjectURL(doc.output("blob")))

    emailCertificate()
    saveCertificate()
  }
 
  function emailCertificate(){
    // EmailJS docs
    // https://www.emailjs.com/docs/user-guide/file-attachments/
    // maybe can use send instead of send form in other places
    // can add a dynamic attachment based on whats in the docs there, still not totally sure how to do that though
  }
  // Save the certificate in storage and save a link in user data. Check this to see if the cert has been created already for this course
  function saveCertificate(){

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
      <div className='certificate'>
          <div className='certificateName'>
              {certificateName()}
          </div>
          <img src={certificateImage}></img>
      </div>
    </>
  )
}

export default Certificate