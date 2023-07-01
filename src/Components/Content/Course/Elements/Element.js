import React, { useRef } from 'react'
import ElementEdit from './Edit/ElementEdit.js'
import ElementDisplayBlock from "./Display/ElementDisplayBlock.js"
import { useSelector } from 'react-redux';
import "./Element.css"

/*
================================================================================
|                                   Element.js
================================================================================

    

*/

function Element({elementData}) {
    const editMode = useSelector((state) => state.appslice.editMode);
    
  return (
    <>
        {editMode ?
            <ElementEdit elementData={elementData}></ElementEdit>
        :
            <ElementDisplayBlock elementData={elementData}></ElementDisplayBlock>
        }
    </>
  )
}

export default Element