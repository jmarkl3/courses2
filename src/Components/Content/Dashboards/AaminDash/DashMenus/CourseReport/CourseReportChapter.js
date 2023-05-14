import React, { useState } from 'react'
import CourseReportSection from './CourseReportSection'

function CourseReportChapter({chapterUserData}) {
    const [expaneded, setExpanded] = useState(true)

  return (
    <div onClick={()=>setExpanded(expaneded)} className='courseReportSection' id={chapterUserData?.id}>
        <div className='courseReportInfo'>
            <div className='courseReportInfoInner courseReportChapterTitle'>
                {"Chapter: "+chapterUserData?.name}
            </div>
            <div className='courseReportInfoInner'>
                {chapterUserData?.complete ? "(Complete)":"(Incomplete)"}
            </div>
        </div>
        {expaneded && chapterUserData?.sectionsArray?.map((sectionUserData)=>(
            <CourseReportSection sectionUserData={sectionUserData}></CourseReportSection>
        ))}
    </div>
  )
}

export default CourseReportChapter