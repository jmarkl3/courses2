import { update, ref, set } from 'firebase/database';
import React, { useRef } from 'react'
import { database } from '../../App/DbSlice';

function EditDisplay({value, editMode, path, verbose, label}) {
    const inputRef = useRef()
    const timerRef = useRef()
    function valueUpdated(){

        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
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

        // Get the data from the input fields
        const value = inputRef.current?.value
        
        // If this flag is set log what its doing
        if(verbose)
            console.log("saving '"+value+"' at "+ path) 

        // Save it in the db under the setData.id
        set(ref(database, path), value)

    }

  return (
    <>
        <div className='setDetailRow'>  
            <div>{label}</div>
            {editMode ? 
                <input defaultValue={value} ref={inputRef} onChange={valueUpdated}></input>
                :
                <div>{value}</div>
            }
        </div>
        <hr></hr>
    </>
  )
}

export default EditDisplay