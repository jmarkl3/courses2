import React, { useRef, useState } from 'react'
import "./Support.css"
import { useDispatch, useSelector } from 'react-redux'
import { setShowSupportMenu } from '../../../App/AppSlice'
import emailjs from '@emailjs/browser'

/*
  ================================================================================
  |                                 Support.js
  ================================================================================

    This component is mainly just a contact form 
    it contains contact info and a form to send an email message to the admin
    
    This component is embeded in App.js and displays based on a global state variable 
      so it is always available from anywhere in the application that this state variable can be set

*/
function Support() {
    const showSupportMenu = useSelector(state => state.appslice.showSupportMenu)
    const userData = useSelector(state => state.dbslice.userData)
    let selectedSetID = useSelector(state => state.dbslice.selectedSetID)
    let setData = useSelector(state => state.dbslice.setData)[selectedSetID]    
    const [feedback, setFeedback] = useState('')
    const form = useRef()
    const dispatcher = useDispatch()


function sendSupportMessage(e){
  e.preventDefault()
  // template_bl74n4j 
  console.log("form.current: ")
  console.log(form.current)
  return
  emailjs.sendForm('service_fepcyns', 'template_bfzz3sp', form.current, 'jxl1B6Wy4ZMfn1YcQ')
      .then((result) => {
          console.log(result.text);
          setFeedback("Message Sent!")
      }, (error) => {
          console.log(error.text);
          setFeedback("Error Sending Message")
      });

}

  return (
    <>
        {showSupportMenu && 
            <div className='box supportMenu'>
                <div className='closeButton' onClick={()=>dispatcher(setShowSupportMenu(false))}>x</div>
                <div className='supportInfo'>                  
                  <div className='title'>
                    Contact Us Here:
                  </div>
                  <div className='supportInfoInfo'>
                    {setData.contactPhone || "<phone>"}
                  </div>
                  <div className='supportInfoInfo'>
                    {setData.contactEmail || "<email>"}
                  </div>                                    
                </div>
                <hr></hr>
                <div className='title'>Or Send a Message:</div>
                <form ref={form} onSubmit={sendSupportMessage} className='supportForm'>
                  <input type="text" name="user_name" defaultValue={userData?.accountData ? (userData?.accountData?.firstName + " " + userData?.accountData?.lastName) : ""} placeholder='Name:' />
                  <input type="email" name="user_email" defaultValue={userData?.accountData ? (userData?.accountData?.email) : ""} placeholder='Email:' />
                  {/* <input type="email" name="to_email" defaultValue={userData?.accountData ? (userData?.accountData?.email) : ""} placeholder='To Email:' /> */}
                  <input type="phone" name="user_phone" defaultValue={userData?.accountData ? (userData?.accountData?.phone) : ""} placeholder='Phone:' />                  
                  <textarea name="message" placeholder='Message:'/>
                  {/* <input type="submit" value="Send" /> */}
                  <button style={{width: "100%", marginLeft: "5px"}} onClick={sendSupportMessage}>Send</button>  
                  <div className='feedback'>{feedback}</div>
                </form>
            </div>
        
        }
    </>
  )
}

export default Support