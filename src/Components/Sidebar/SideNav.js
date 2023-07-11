import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSideNavOpen } from '../../App/AppSlice'
import { addChapter, selectFirst, setSectionArray } from '../../App/DbSlice'
import { newID, objectToArray } from '../../App/functions'
import SidenavChapterRow from './Rows/SidenavChapterRow'
import "./SideNav.css"

/*
================================================================================
|                                   SideNav.js
================================================================================

    This component is displayed from ElementMapper.js
    It displays the sidebar that shows a collapasable menu with chapters, sections, and (in edit mode) elements
    It allows the user to navigate the course

    In display mode it shows the completion status of each section and chapter
    it also shows which section is currently selected

    In edit mode is shows all of the elements and allows the user to add, rearange, or delete new chapters, sections, and elements

    There is a global state variable that determines if the sidebar is open or closed
    If it is closed it shows as a thin bar at the left of the screen that can be clicked to open the sidebar

*/

function SideNav() {    
    const sideNavOpen = useSelector(state => state.appslice.sideNavOpen)
    const courseData = useSelector((state) => state.dbslice.courseData);
    const selectedChapterID = useSelector((state) => state.dbslice.selectedChapterID);
    const sectionArray = useSelector((state) => state.dbslice.sectionArray);
    const dispacher = useDispatch()    

    // The array of chapters to be displayed in the sidebar as rows
    const [itemArray, setItemArray] = useState([])
    useEffect(() => {
        setItemArray(objectToArray(courseData?.items))
        if(!selectedChapterID){
            // console.log("calling selecting first from Siednav")            
            dispacher(selectFirst())
        }else{
            // console.log("not calling selecting first from Siednav")            
        }
    }, [courseData, sectionArray])

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
            {sideNavOpen && 
                <>
                    {!itemArray || itemArray.length === 0 && 
                        <button onClick={addChapterFunction}>Add Chapter</button>
                    }        
                    <div className={sideNavOpen ? "":" sideNaveClosedItems"}>
                        {itemArray.map(chapter => (
                            <SidenavChapterRow itemData={chapter} key={chapter.id}></SidenavChapterRow>
                        ))}

                    </div>
                </>
            }
        </div>
    )
}

export default SideNav