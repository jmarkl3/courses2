import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addElement, copySection, deleteSection, selectChapter, selectFirst, selectSection, sidenavDragEnd, sidenavDragOver, sidenavDragStart, updateItemInfo } from '../../../App/DbSlice.js'
import { dontClickThrough, objectToArray } from '../../../App/functions.js'
import ConfirmationBox from '../../../Utils/ConfirmationBox.js'
import DragDropIndicatorBar from '../../../Utils/DragDropIndicatorBar.js'
import HamburgerMenu from '../../../Utils/HamburgerMenu.js'
import SidenavElementRow from './SidenavElementRow.js'
function SidenavSectionRow({itemData, chapterID, setSectionRenaming}) {
  const [confirmDeleteMessage, setConfirmDeleteMessage] = useState()
  const [renaming, setRenaming] = useState()
  const [elementRenaming, setElementRenaming] = useState()
  const selectedSectionID = useSelector((state) => state.dbslice.selectedSectionID);
  const dragItemType = useSelector((state) => state.dbslice.dragItemType);
  const editMode = useSelector((state) => state.appslice.editMode);
  const dispatcher = useDispatch()

  // Determines if the items are shown or hidden
  const [expanded, setExpanded] = useState(false)
  function toggleExpended(e){
    e.stopPropagation()
    setExpanded(!expanded)
  }

  // The array of elements to be displayed in the sidebar as rows
  const [itemArray, setItemArray] = useState([])
  useEffect(() => {
    setItemArray(objectToArray(itemData?.items))
  }, [itemData])
  
  useEffect(() => {
    if(selectedSectionID === itemData?.id)
      setExpanded(true)
  }, [selectedSectionID])

  // Add an element to this section
  function addElementFunction(){
    dispatcher(addElement({
      sectionID: itemData?.id, 
      chapterID: chapterID,
      index: itemArray.length,
    }))
  }

  // For reordering
  function dragStartFunction(e){
    // So it doesnt also call this on the parent
    e.stopPropagation()
    dispatcher(sidenavDragStart({sectionID: itemData?.id, chapterID: chapterID}))
  }

  function copySectionFunction(){
    dispatcher(copySection({sectionToCopy: itemData, chapterID: chapterID}))
}

  function dragOverFunction(e){
    e.preventDefault()
    // Only drop elements or sections on sections
    if(dragItemType === "element" || dragItemType === "section"){
      e.stopPropagation()
      dispatcher(sidenavDragOver(itemData?.id))
    }
  }
  function dragEndFunction(e){
    // Only drop elements or sections on sections   
    if(dragItemType === "element" || dragItemType === "section"){
      e.stopPropagation()      
      dispatcher(sidenavDragEnd({sectionID: itemData?.id, chapterID: chapterID}))
    }
  }
  function deleteSectionFunction(){
    dispatcher(deleteSection({chapterID: chapterID, sectionID: itemData.id}))
    dispatcher(selectFirst({chapterID: chapterID}))

  }

  function editName(){
    setRenaming(true)
    setSectionRenaming(true)
    setTimeout(() => {
      nameInputRef.current.focus()
    }, 250);    
  }
  const nameInputRef = useRef()
  function renameFunction(){    
    console.log("updateName", nameInputRef.current.value)
    dispatcher(updateItemInfo({
      type:"name", 
      value: nameInputRef.current.value, 
      chapterID: chapterID, 
      sectionID: itemData?.id
    }))
    setRenaming(false)
    setSectionRenaming(false)
    
  }
  function cancelRenameFunction(){
    setRenaming(false)
    setSectionRenaming(false)

  }

  function selectSectionFunction(){    
    dispatcher(selectFirst({chapterID: chapterID, sectionID: itemData?.id}))

  }

  return (
    <div 
      className='sidenavRowOuter' 
      draggable={!renaming && !elementRenaming}
      onDragOver={dragOverFunction}
      onDragStart={dragStartFunction}
      onDrop={dragEndFunction}
    >
      <div 
        className={`sidenavRowInner ${(selectedSectionID === itemData?.id) && "selectedRow"}`} 
        onClick={selectSectionFunction}
      >
        {editMode && 
          <div 
            className='rowExpandButton' 
            onClick={toggleExpended}
            title={expanded ? "Hide Elements" : "Show Elements"}
          >
            {expanded ? "▽" : "▷"}
          </div>
        }
        {renaming ? 
          <div className='renamingField' onClick={dontClickThrough}>
            <input 
              defaultValue={itemData?.name}               
              ref={nameInputRef}
            ></input>
            <div onClick={cancelRenameFunction}>X</div>
            <div onClick={renameFunction}>✔</div>
          </div>
          :
          itemData?.name
        }
        <>
        {editMode && 
          <HamburgerMenu>
            <div className='hamburgerMenuOption' onClick={copySectionFunction}>Copy</div>
            <div className='hamburgerMenuOption' onClick={editName}>Rename</div>
            <div className='hamburgerMenuOption' onClick={()=>setConfirmDeleteMessage(`Delete section ${itemData.name}`)}>Delete</div>          
            <div className='hamburgerMenuOption' onClick={addElementFunction}>Add Element</div>
          </HamburgerMenu>
        }
        </>
      </div>
      <DragDropIndicatorBar itemID={itemData.id}></DragDropIndicatorBar>
      {editMode && expanded && itemArray.map(section => (
        <SidenavElementRow 
          itemData={section} 
          key={section?.id} 
          chapterID={chapterID} 
          sectionID={itemData.id}
          setElementRenaming={setElementRenaming}
          setSectionRenaming={setSectionRenaming}
        ></SidenavElementRow>
      ))}
      <ConfirmationBox
        message={confirmDeleteMessage}
        cancel={() => {setConfirmDeleteMessage()}}
        confirm={() => {deleteSectionFunction()}}
      ></ConfirmationBox>
    </div>
  )
}

export default SidenavSectionRow