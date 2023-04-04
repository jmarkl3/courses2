import React from 'react'
import { useSelector } from 'react-redux';
import ElementDisplayBlock from "../Display/ElementDisplayBlock.js"
import ElementEditBlock from "./ElementEditBlock.js"

function ElementEdit({element}) {
    const previewMode = useSelector((state) => state.appslice.courseEditPreviewMode);

    return (
        <div>
            {previewMode?
            <div className='previewElement'>
                <div className='previewEditButton'>Edit</div>
                <ElementDisplayBlock element={element}></ElementDisplayBlock>
            </div>
            :
                <ElementEditBlock element={element}></ElementEditBlock>
            }
        </div>
    )
}

export default ElementEdit