import React, { useState } from 'react'
import CourseReportSection from './CourseReportSection'

function CourseReportChapter({chapterUserData}) {
    const [expaneded, setExpanded] = useState()

  return (
    <div onClick={()=>setExpanded(!expaneded)} className='courseReportSection'>
        <div className='courseReportInfo'>
            <div className='courseReportInfoInner'>
                {chapterUserData?.name}
            </div>
            <div className='courseReportInfoInner'>
                {chapterUserData?.complete ? "✔":"Incomplete"}
            </div>
        </div>
        {expaneded && chapterUserData?.sectionsArray?.map((sectionUserData)=>(
            <CourseReportSection sectionUserData={sectionUserData}></CourseReportSection>
        ))}
    </div>
  )
}

export default CourseReportChapter