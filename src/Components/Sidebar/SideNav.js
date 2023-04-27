import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSideNavOpen } from '../../App/AppSlice'
import { addChapter, selectFirst } from '../../App/DbSlice'
import { newID, objectToArray } from '../../App/functions'
import SidenavChapterRow from './Rows/SidenavChapterRow'
import "./SideNav.css"

function SideNav() {    
    const sideNavOpen = useSelector(state => state.appslice.sideNavOpen)
    const courseData = useSelector((state) => state.dbslice.courseData);
    const selectedChapterID = useSelector((state) => state.dbslice.selectedChapterID);
    const dispacher = useDispatch()    

    // The array of chapters to be displayed in the sidebar as rows
    const [itemArray, setItemArray] = useState([])
    useEffect(() => {
        setItemArray(objectToArray(courseData?.items))
        if(!selectedChapterID)
            dispacher(selectFirst())
    }, [courseData])

    function addChapterFunction(){
        dispacher(addChapter({       
            index: itemArray.length,
        }))
    }   

    function closeSidebar(e) {
        e.stopPropagation()        
        dispacher(setSideNavOpen(false))
    }
    function openSidebar(e) {
        e.stopPropagation()
        dispacher(setSideNavOpen(true))        
    }

    return (
    <div className={`sidebar ${!sideNavOpen && "sidebarClosed"}`} onClick={openSidebar} title={!sideNavOpen ? "Open Sidebar" : null}>
        <div className={`sidebarClose ${!sideNavOpen && "hidden"}`} onClick={closeSidebar} title="Hide Sidebar">{"◁"}</div>
        {!itemArray || itemArray.length === 0 && 
            <button onClick={addChapterFunction}>Add Chapter</button>
        }        
        <div className={sideNavOpen ? "":" sideNaveClosedItems"}>
            {itemArray.map(chapter => (
                <SidenavChapterRow itemData={chapter} key={chapter.id}></SidenavChapterRow>
            ))}

        </div>
    </div>
  )
}

export default SideNav