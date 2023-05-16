import React from 'react'
import "./Support.css"
import { useDispatch, useSelector } from 'react-redux'
import { setShowSupportMenu } from '../../../App/AppSlice'

function Support() {
    const showSupportMenu = useSelector(state => state.appslice.showSupportMenu)
    const userData = useSelector(state => state.dbslice.userData)
    const dispatcher = useDispatch()

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
                    727-500-5075
                  </div>
                  <div className='supportInfoInfo'>
                    email@email.com
                  </div>                                    
                </div>
                <div className='supportMessage'>
                  <div className='title'>
                    Or Send a Message:
                  </div>                  
                  <input defaultValue={userData?.accountData ? (userData?.accountData?.firstName + " " + userData?.accountData?.lastName) : ""}></input>
                  <input defaultValue={userData?.accountData ? (userData?.accountData?.email) : ""} placeholder='Email'></input>
                  <input defaultValue={userData?.accountData ? (userData?.accountData?.phone) : ""} placeholder='Phone'></input>                  
                  <textarea placeholder='Message'></textarea>                
                  <button>Send</button>                                  
                </div>
            </div>
        
        }
    </>
  )
}

export default Support