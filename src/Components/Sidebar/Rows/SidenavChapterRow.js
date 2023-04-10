import { set } from 'firebase/database'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addChapter, addSection, copyChapter, deleteChapter, selectChapter, selectFirst, sidenavDragEnd, sidenavDragOver, sidenavDragStart, updateItemInfo } from '../../../App/DbSlice.js'
import { dontClickThrough, objectToArray } from '../../../App/functions.js'
import ConfirmationBox from '../../../Utils/ConfirmationBox.js'
import DragDropIndicatorBar from '../../../Utils/DragDropIndicatorBar.js'
import HamburgerMenu from '../../../Utils/HamburgerMenu.js'
import SidenavSectionRow from './SidenavSectionRow.js'
function SidenavChapterRow({itemData}) {
  const [confirmDeleteMessage, setConfirmDeleteMessage] = useState()
  const [renaming, setRenaming] = useState()
  const [sectionRenaming, setSectionRenaming] = useState()
  const selectedChapterID = useSelector((state) => state.dbslice.selectedChapterID);
  const editMode = useSelector((state) => state.appslice.editMode);
  const dispatcher = useDispatch()

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
    dispatcher(sidenavDragStart({chapterID: itemData?.id}))
  }
  function dragOverFunction(e){
    e.preventDefault()
    dispatcher(sidenavDragOver(itemData?.id))
  }
  function dragEndFunction(){
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
    dispatcher(selectFirst({chapterID: itemData?.id}))

  }
  function deleteChapterFunction(){
    dispatcher(deleteChapter(itemData.id))
    dispatcher(selectFirst())

  }
  return (
    <div 
      className='sidenavRowOuter noPaddingLeft'
      draggable={!renaming && !sectionRenaming}
      onDragOver={dragOverFunction}
      onDragStart={dragStartFunction}
      onDrop={dragEndFunction}
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
        {editMode &&
          <HamburgerMenu>
            <div className='hamburgerMenuOption' onClick={()=>dispatcher(copyChapter(itemData))}>Copy</div>
            <div className='hamburgerMenuOption' onClick={editName}>Rename</div>
            <div className='hamburgerMenuOption' onClick={()=>setConfirmDeleteMessage(`Delete chapter ${itemData.name}`)}>Delete</div>
            <div className='hamburgerMenuOption' onClick={addChapterFunction}>Add Chapter</div>
            <div className='hamburgerMenuOption' onClick={addSectionFunction}>Add Section</div>
          </HamburgerMenu>
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