import { set } from 'firebase/database'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addChapter, addSection, copyChapter, deleteChapter, selectChapter, selectChapterIfValid, selectFirst, sidenavDragEnd, sidenavDragOver, sidenavDragStart, updateItemInfo } from '../../../App/DbSlice.js'
import { dontClickThrough, getUserData, objectToArray } from '../../../App/functions.js'
import ConfirmationBox from '../../../Utils/ConfirmationBox.js'
import DragDropIndicatorBar from '../../../Utils/DragDropIndicatorBar.js'
import HamburgerMenu from '../../../Utils/HamburgerMenu.js'
import SidenavSectionRow from './SidenavSectionRow.js'
function SidenavChapterRow({itemData}) {
  const [confirmDeleteMessage, setConfirmDeleteMessage] = useState()
  const [renaming, setRenaming] = useState()  
  const [sectionRenaming, setSectionRenaming] = useState()
  const selectedChapterID = useSelector((state) => state.dbslice.selectedChapterID);
  const selectedCourseID = useSelector((state) => state.dbslice.selectedCourseID);
  const userData = useSelector((state) => state.dbslice.userData);
  const fullAdmin = useSelector((state) => state.dbslice.userData?.accountData?.fullAdmin);
  const editMode = useSelector((state) => state.appslice.editMode);
  const dispatcher = useDispatch()

  const userChapterDataLocationString = "courses/"+selectedCourseID+"/chapterData/"+itemData.id
  var userChapterData = getUserData(userData, userChapterDataLocationString)

  // Determines if the items are shown or hidden
  const [expanded, setExpanded] = useState(false)
  function toggleExpended(e){
    e.stopPropagation()
    setExpanded(!expanded)
  }

  // The array of sections to be displayed in the sidebar as rows
  const [itemArray, setItemArray] = useState([])
  useEffect(() => {
    setItemArray(objectToArray(itemData?.items))
  }, [itemData])

  useEffect(() => {
    if(selectedChapterID === itemData?.id)
      setExpanded(true)
  }, [selectedChapterID])

  // Add a section to this chapter
  function addSectionFunction(){
    dispatcher(addSection({       
      chapterID: itemData.id,
      index: itemArray.length,
    }))
  }
  function addChapterFunction(){
    dispatcher(addChapter({       
      index: itemData.index+1,
    }))
  }

  function dragStartFunction(){
    if(!editMode) return
    dispatcher(sidenavDragStart({chapterID: itemData?.id}))
  }
  function dragOverFunction(e){
    e.preventDefault()
    if(!editMode) return
    dispatcher(sidenavDragOver(itemData?.id))
  }
  function dragEndFunction(){
    if(!editMode) return
    dispatcher(sidenavDragEnd({chapterID: itemData?.id}))
  }
  function editName(){
    setRenaming(true)
    setTimeout(() => {
      nameInputRef.current.focus()
    }, 250);    
  }
  const nameInputRef = useRef()
  function renameFunction(){  
    var renameObject = {
      type:"name", 
      value: nameInputRef.current.value, 
      chapterID: itemData?.id
    }    
    dispatcher(updateItemInfo(renameObject))
    setRenaming(false)    

  }
  function cancelRenameFunction(){
    setRenaming(false)

  }
  function selectChapterFunction(){
    if(editMode || fullAdmin)      
      dispatcher(selectFirst({chapterID: itemData?.id}))      
    else    
      dispatcher(selectChapterIfValid({chapterID: itemData?.id}))

  }
  function deleteChapterFunction(){
    dispatcher(deleteChapter(itemData.id))
    dispatcher(selectFirst())

  }

  function allSectionsComplete(){
    // Check to make sure this chapeter has sections
    if(!itemData.items || typeof itemData.items !== "object")
      return

    let sectionIDArray = Object.keys(itemData.items)
    let totalSectionsCount = sectionIDArray.length
    let completedSectionsCount = 0

    // Get a list of all of the sections the user has completed
    let userChapterSectionsData = userData?.courses[selectedCourseID]?.chapterData[itemData.id]?.sectionData
    if(userChapterSectionsData && typeof userChapterSectionsData === "object"){
      Object.entries(userChapterSectionsData).forEach((sectionID, sectionData) => {
        if(sectionData?.complete)
        completedSectionsCount++
      })
    }

    // If they are return true
    if(completedSectionsCount === totalSectionsCount)
      return true
  }

  return (
    <div 
      className='sidenavRowOuter noPaddingLeft'
      draggable={!renaming && !sectionRenaming && editMode}
      onDragOver={dragOverFunction}
      onDragStart={dragStartFunction}
      onDrop={dragEndFunction}
      key={itemData.id}
    >
      <div 
        className={`sidenavRowInner ${(selectedChapterID === itemData?.id) && "selectedRow"}`} 
        onClick={selectChapterFunction}
      >
        <div 
          className='rowExpandButton' 
          onClick={toggleExpended} 
          title={expanded ? "Hide Sections" : "Show Sections"}
        >
          {expanded ? "▽" : "▷"}
        </div>
        {renaming ? 
          <div className='renamingField' onClick={dontClickThrough}>
            <input 
              defaultValue={itemData?.name}               
              ref={nameInputRef}
            ></input>
            <div onClick={cancelRenameFunction} title="Cancel">X</div>
            <div onClick={renameFunction} title="Save" >✔</div>
          </div>
          :
          itemData?.name
        }        
        {editMode ?
          <HamburgerMenu>
            <div className='hamburgerMenuOption' onClick={()=>dispatcher(copyChapter(itemData))}>Copy</div>
            <div className='hamburgerMenuOption' onClick={editName}>Rename</div>
            <div className='hamburgerMenuOption' onClick={()=>setConfirmDeleteMessage(`Delete chapter ${itemData.name}`)}>Delete</div>
            <div className='hamburgerMenuOption' onClick={addChapterFunction}>Add Chapter</div>
            <div className='hamburgerMenuOption' onClick={addSectionFunction}>Add Section</div>
          </HamburgerMenu>
          :
          userChapterData?.complete && <div className='completeIndicator' title='Chapter Complete'>✔</div>
        }

      </div>
      <DragDropIndicatorBar itemID={itemData.id}></DragDropIndicatorBar>
      {expanded && itemArray.map(section => (
        <SidenavSectionRow itemData={section} key={section.id} chapterID={itemData.id} setSectionRenaming={setSectionRenaming}></SidenavSectionRow>
      ))}
      <ConfirmationBox 
        message={confirmDeleteMessage}
        cancel={() => {setConfirmDeleteMessage()}}
        confirm={deleteChapterFunction}
      ></ConfirmationBox>
    </div>
  )
}

export default SidenavChapterRow