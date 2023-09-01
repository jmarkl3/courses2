import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { copyElement, deleteElement, selectChapter, selectElement, selectSection, sidenavDragEnd, sidenavDragOver, sidenavDragStart, updateElementInfo, updateItemInfo } from '../../../App/DbSlice'
import { dontClickThrough } from '../../../App/functions';
import ConfirmationBox from '../../../Utils/ConfirmationBox';
import DragDropIndicatorBar from '../../../Utils/DragDropIndicatorBar';
import HamburgerMenu from '../../../Utils/HamburgerMenu';

function SidenavElementRow({itemData, chapterID, sectionID, setElementRenaming, setSectionRenaming}) {
  const [confirmDeleteMessage, setConfirmDeleteMessage] = useState()
  const [renaming, setRenaming] = useState()
  const selectedElementID = useSelector((state) => state.dbslice.selectedElementID);
  const dragItemType = useSelector((state) => state.dbslice.dragItemType);
  const editMode = useSelector((state) => state.appslice.editMode);
  const dispatcher = useDispatch()

  // Copy the element
  function copyElementFunction(){
      dispatcher(copyElement({elementToCopy: itemData, chapterID: chapterID, sectionID: sectionID}))
  }
  function deleteElementFunction(){
    dispatcher(deleteElement({chapterID: chapterID, sectionID: sectionID, elementID: itemData.id}))
  }
  // For reordering
  function dragStartFunction(e){    
    // So it doesnt also call this on the parent
    e.stopPropagation()
    dispatcher(sidenavDragStart({elementID: itemData?.id, chapterID: chapterID, sectionID: sectionID}))
  }
  function dragOverFunction(e){
    e.preventDefault()    
    // Only drop elements onto other elements
    if(dragItemType === "element"){
      e.stopPropagation()
      dispatcher(sidenavDragOver(itemData?.id))
    }
  }
  function dragEndFunction(e){
    // Only drop elements onto other elements
    if(dragItemType === "element"){
      e.stopPropagation()    
      dispatcher(sidenavDragEnd({elementID: itemData?.id, chapterID: chapterID, sectionID: sectionID}))
    }
  }
  function editName(){
    setRenaming(true)
    setElementRenaming(true)
    setSectionRenaming(true)
    setTimeout(() => {
      nameInputRef.current.focus()
    }, 250);    
  }
  const nameInputRef = useRef()
  function renameFunction(){    
    dispatcher(updateItemInfo({
      type:"name", 
      value: nameInputRef.current.value, 
      chapterID: chapterID, 
      sectionID: sectionID,
      elementID: itemData?.id
    }))
    setRenaming(false)
    setElementRenaming(false)
    setSectionRenaming(false)

  }
  function cancelRenameFunction(){
    setRenaming(false)
    setElementRenaming(false)
    setSectionRenaming(false)

  }
  
  function selectElementFunction(){
    dispatcher(selectElement(itemData?.id))
    dispatcher(selectSection(sectionID))
    dispatcher(selectChapter(chapterID))

  }

  return (
    <div 
      className='sidenavRowOuter' 
      draggable={!renaming}
      onDragOver={dragOverFunction}
      onDragStart={dragStartFunction}
      onDrop={dragEndFunction}
    >
      <div 
        className={`sidenavRowInner ${(selectedElementID === itemData?.id) && "selectedRow"} paddingLeft5px`} 
        onClick={selectElementFunction}
      >
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
        {editMode &&
          <HamburgerMenu>
          <div className='hamburgerMenuOption' onClick={copyElementFunction}>Copy</div>
          <div className='hamburgerMenuOption' onClick={editName}>Rename</div>
          <div className='hamburgerMenuOption' onClick={()=>setConfirmDeleteMessage(`Delete element ${itemData?.name}`)}>Delete</div> 
          </HamburgerMenu>
        }
      </div>
      <DragDropIndicatorBar itemID={itemData.id}></DragDropIndicatorBar>
      <ConfirmationBox
        message={confirmDeleteMessage}
        cancel={() => {setConfirmDeleteMessage()}}
        confirm={() => {deleteElementFunction()}}
      ></ConfirmationBox>
    </div>
  )
}

export default SidenavElementRow