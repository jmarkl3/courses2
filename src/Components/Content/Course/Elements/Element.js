import React from 'react'
import ElementEdit from './Edit/ElementEdit.js'
import ElementDisplayBlock from "./Display/ElementDisplayBlock.js"
import { useSelector } from 'react-redux';

function Element({element}) {
    const courseEditMode = useSelector((state) => state.appslice.courseEditMode);
    
  return (
    <div>
        {courseEditMode ?
            <ElementEdit element={element}></ElementEdit>
        :
            <ElementDisplayBlock element={element}></ElementDisplayBlock>
        }
    </div>
  )
}

export default Element