import React, { useState } from 'react'
import { dontClickThrough } from '../../../../../../App/functions'
import ElementDisplayBlock from '../../../../Course/Elements/Display/ElementDisplayBlock';

function CourseReportSection({sectionUserData}) {
    const [expaneded, setExpanded] = useState()

    function expand(){
        setExpanded(!expaneded)
    }

  return (
    <div className='courseReportSection' onClick={(e)=>{dontClickThrough(e); setExpanded(!expaneded);}}>
        <div className='courseReportInfo'>
            <div className='courseReportInfoInner'>
                {sectionUserData?.name}
            </div>
            <div className='courseReportInfoInner'>
                {sectionUserData.complete ? "✔":((sectionUserData.numberOfInputElements > 0) ? "("+sectionUserData.responseCount + " / "+sectionUserData.numberOfInputElements+")" :"(Incomplete)")}
            </div>
        </div>
        {expaneded && sectionUserData?.responsesArray?.map((responseData)=>(
            <div className='courseReportResponsesSection'>
                {(typeof responseData?.response === "string") && responseData?.response}
                <ElementDisplayBlock responseDataOverride={responseData}></ElementDisplayBlock>
            </div>            
        ))}
    </div>
  )
}

export default CourseReportSection