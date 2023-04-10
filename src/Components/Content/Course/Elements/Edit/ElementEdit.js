import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux';
import ElementDisplayBlock from "../Display/ElementDisplayBlock.js"
import ElementEditBlock from "./ElementEditBlock.js"
import editIcon from "../../../../../Images/editIconS.png"
import "./ElementEdit.css"

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