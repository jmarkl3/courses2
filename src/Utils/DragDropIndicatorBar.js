import React from 'react'
import { useSelector } from 'react-redux'

function DragDropIndicatorBar({itemID}) {
  
  const sidenavHoverItemID = useSelector((state) => state.dbslice.sidenavHoverItemID);
    return (
    <>
        {sidenavHoverItemID === itemID &&
            <div className='dragDropIndicatorBar'></div>
        }
    </>
  )
}

export default DragDropIndicatorBar