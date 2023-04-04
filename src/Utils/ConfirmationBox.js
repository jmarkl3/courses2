import React from 'react'
import { dontClickThrough } from '../App/functions'
import "./Utils.css"

function ConfirmationBox({message, confirm, cancel}) {

  return (
    <>
        {message &&
            <div className='confirmationBox' onClick={dontClickThrough}>
                <div>{message}</div>
                <div className='buttons'>
                    <button onClick={()=>cancel()}>Cancel</button>
                    <button onClick={()=>confirm()}>Confirm</button>
                </div>
            </div>
        }
    </>
  )
}
ConfirmationBox.defaultProps = {
  confirm: ()=>{console.log("no confirm function in ConfirmationBox")},
  cancel: ()=>{console.log("no cancel function in ConfirmationBox")}
}
export default ConfirmationBox