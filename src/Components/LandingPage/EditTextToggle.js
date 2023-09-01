import React, {useState, useRef} from 'react'
import editIcon from "../../Images/editIconS.png"
import { CKEditor } from 'ckeditor4-react'
import HTMLReactParser from 'html-react-parser'
import { ref, set } from 'firebase/database'
import { database } from '../../App/DbSlice'

function EditTextToggle({value, className, type, path, allowEdit, hide, verbose}) {

  const [editing, setEditing] = useState()
  const inputRef = useRef()

  const timeoutRef = useRef()
  const editorRef = useRef()
  function valueNeedsUpdate(event){
    if(event.editor)
      editorRef.current = event.editor
    else if(type === "content")
      console.log("no content editor")
    
    if(timeoutRef.current) 
      clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {      
        // setValue(inputRef.current.value)
        saveSetData()      
    }, 500);
  }

  function saveSetData(){      
    // Make sure there is a valid path
    if(!path || typeof path !== "string"){
        console.log("no valid path string in EditDisplay.js")
        console.log("path: "+path)            
    }

    // Make sure it has enough to it and is not an eronious string
    let arrayFromPath = path.split("/")        
    if(arrayFromPath?.length < 3){
        console.log("check path in EditDisplay.js")
        console.log(path)
        return
    }        

    let value
    // Get the data from the input fields
    if(type==="content"){
      if(editorRef.current)
        value = editorRef.current.getData()
    }else{
      value = inputRef.current?.value
    }

    if(!value){
      console.log("no value")
      return
    }
    
    // If this flag is set log what its doing
    if(verbose)
        console.log("saving '"+value+"' at "+ path) 

    // Save it in the db under the setData.id
    set(ref(database, path), value)

}

  function editComponent(){
    if(type === "content"){
      return (
        <CKEditor
          id="editor1"
          initData={value} 
          onChange={valueNeedsUpdate}
        />
      )
    }else if(type === "image"){
      return (
        <div className={className}>
          <input defaultValue={value}></input>
          <img src={value}></img>
        </div>
      )
    }
    else{
      return(
        <>
          <input className='centeredInput' defaultValue={value} ref={inputRef} onChange={valueNeedsUpdate} style={{maxWidth: "95%"}}></input>
        </>
      )
    }

  }

  function displayComponent(){
    if(type === "content"){
      return (
        HTMLReactParser(value)
      )
    }else if(type === "image"){
      return (                 
        <img src={value}></img>        
      )
    }
    else{
      return(
        <div style={{width: "95%", overflow: "hidden"}}> {value}</div>
      )
    }

  }

  return (
    // <div className={className +( notRel ? " " : " rel")}>
    <>
      {!hide && 
        <div className={"rel "+className}>
          {allowEdit &&
            <div className='editToggleButton' onClick={()=>setEditing(!editing)}>
                <img src={editIcon}></img>
            </div>
          }
          {editing ? 
            editComponent()
            :
            displayComponent()
          }
        </div>
      }
    </>
  )

}

EditTextToggle.defaultProps = {
  value: " ",
  // setValue: (newValue) => {console.log("need function to save " + newValue)},  
}

export default EditTextToggle