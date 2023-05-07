import React from 'react'
import "./Support.css"
import { useDispatch, useSelector } from 'react-redux'
import { setShowSupportMenu } from '../../../App/AppSlice'

function Support() {
    const showSupportMenu = useSelector(state => state.appslice.showSupportMenu)
    const dispatcher = useDispatch()

  return (
    <>
        {showSupportMenu && 
            <div className='box supportMenu'>
                <div className='closeButton' onClick={()=>dispatcher(setShowSupportMenu(false))}>x</div>
                phone: 727-500-5075
                email: email@email.com
            </div>
        
        }
    </>
  )
}

export default Support