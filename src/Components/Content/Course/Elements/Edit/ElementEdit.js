import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux';
import ElementDisplayBlock from "../Display/ElementDisplayBlock.js"
import ElementEditBlock from "./ElementEditBlock.js"
import editIcon from "../../../../../Images/editIconS.png"
import "./ElementEdit.css"

function ElementEdit({elementData}) {
    const previewMode = useSelector((state) => state.appslice.courseEditPreviewMode);
    // If this is true the element displays as an edit block regardless of preview mode
    const [previewOverride, setPreviewOverride] = useState()
    const sectionTypeRef = useRef()

    return (
        <div>
            {(previewMode && !previewOverride)?
                <div className='previewElement'>
                    <div className='previewEditButton'>Edit</div>
                    <ElementDisplayBlock elementData={elementData}></ElementDisplayBlock>
                </div>
                :
                <ElementEditBlock elementData={elementData}></ElementEditBlock>
            }
            {previewMode && 
                <div 
                    className='topLeft square30 elementHoverShow' 
                    onClick={()=>setPreviewOverride(!previewOverride)}
                >
                    {previewOverride ? 
                        "✔" 
                        : 
                        <img src={editIcon}></img>
                    }
                </div>
            }
        </div>
    )
}

export default ElementEdit