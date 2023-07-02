import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux';
import ElementDisplayBlock from "../Display/ElementDisplayBlock.js"
import ElementEditBlock from "./ElementEditBlock.js"
import editIcon from "../../../../../Images/editIconS.png"
import "./ElementEdit.css"

/*
================================================================================
|                              ElementEdit.js
================================================================================

    This component is renderd from Element.js and displays the element either in edit or preview mode
    
    There are several types of elements including text, video, multiple choice, etc.

    The element data is passed through to the element component corresponding to the preview state
    If it is in preview mode the ElementDisplayBlock componentis shows with an added edit button to edit just that element
    if in edit mode and not in preview mode the ElementEditBlock component is shown that allows the user to edit the element

*/



function ElementEdit({elementData}) {
    const previewMode = useSelector((state) => state.appslice.previewMode);
    // If this is true the element displays as an edit block regardless of preview mode
    const [previewOverride, setPreviewOverride] = useState()

    return (
        <>
            <div className='elementPreviewEditButton'>
                {previewMode && 
                    <div 
                        className='topLeft square20 hoverOpacity2' 
                        onClick={()=>setPreviewOverride(!previewOverride)}
                        title={`${previewOverride ? "Done" : "Edit"}`}
                    >
                        {previewOverride ? 
                            "✔" 
                            : 
                            <img src={editIcon}></img>
                        }
                    </div>
                }
            </div>
            {(previewMode && !previewOverride)?
                <ElementDisplayBlock elementData={elementData}></ElementDisplayBlock>                
                :
                <ElementEditBlock elementData={elementData}></ElementEditBlock>
            }
        </>
    )
}

export default ElementEdit