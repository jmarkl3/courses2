import React, { useState, useEffect } from 'react'
import DisplayPage from '../Content/DisplayPage'
import "./SetsDash.css"
import SetDetail from './SetDetail'
import { useDispatch, useSelector } from 'react-redux'
import { createSet } from '../../App/DbSlice'
import { setSideNavOpen } from '../../App/AppSlice'

function SetsDash() {

  // The id of the set that will be displayed in the detail window
  const [detailSetID, setDetailSetID] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setSideNavOpen(false))
  
  }, [])
  

  const setDataArray = Object.entries(useSelector(state => state.dbslice.setData)).map(entry =>{
    let object = {...entry[1]}
    object.id = entry[0]
    return object
  })
    
  return (
    <div className='setsDash'>
        <DisplayPage>
          <div>filter</div>
          {setDataArray.map(set => (
            <div className='setBox' onClick={()=>setDetailSetID(set.id)}>
              {set.name}
            </div>            
          ))}
          <div className='setBox' onClick={()=>dispatch(createSet())}>Create New</div>  
          <SetDetail setID={detailSetID} close={()=>setDetailSetID()}></SetDetail>
        </DisplayPage>          
    </div>
  )
}

export default SetsDash