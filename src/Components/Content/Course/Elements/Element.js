import React, { useRef } from 'react'
import ElementEdit from './Edit/ElementEdit.js'
import ElementDisplayBlock from "./Display/ElementDisplayBlock.js"
import { useSelector } from 'react-redux';
import "./Element.css"

/*
================================================================================
|                                   Element.js
================================================================================

    This component is renderd from a map in ElementMapper and displays either an ElementEdit or ElementDisplayBlock for each element 
    the component type that is displayed is determened by the editMode state in AppSlice.js
    
    Ihe element data is passed through to the element component corresponding to the editMode state
    the element component then displays the element data in the appropriate way

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