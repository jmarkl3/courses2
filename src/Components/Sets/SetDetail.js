import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteSet, setSelectedSetData } from '../../App/DbSlice'
import { useNavigate } from 'react-router-dom'
import editIcon from '../../Images/editIconS.png'
import ConfirmationBox from '../../Utils/ConfirmationBox'
import EditDisplay from './EditDisplay'
import LandingPage2 from '../LandingPage/LandingPage2'
import CourseSelector from '../LandingPage/CourseSelector'

function SetDetail({setID, close}) {
    const dispacher = useDispatch()
    const navigate = useNavigate()
    
    const [delteMessage, setDelteMessage] = useState()
    const [editMode, setEditMode] = useState()
    const [landingEditSetID, setLandingEditSetID] = useState()

    let setData = useSelector(state => state.dbslice.setData)[setID]    
    // useEffect(() => {
    //     console.log("======================================================================")
    //     console.log("SetDetail setData")
    //     console.log(setData)
      
    // }, [setData])

    function openSet(){        

        // Put the data in state
        dispacher(setSelectedSetData(setData))
        
        // Open the set
        navigate("/set/"+setID)

        // window.open("#/set/"+setID, '_blank')
        //window.open("#/set/"+setID)

        // Should put all the set data in db state in app.js (simulating loading from db)
        // the using the set id in the url get the data and set it in selectedSetData in appslice
        // Then get that data from appslice to diplay in LandingPageSet

    }
    function delteSet(){
        dispacher(deleteSet(setID))
        setDelteMessage(null)
        close()
    }

  return (
    <>
        {setID && 
            <div className='box floatingMenu setDashMenu'>
                <div className='topBox' title="Edit" onClick={()=>setEditMode(!editMode)}>
                    <img src={editIcon}></img>
                </div>
                <div className='closeButton' onClick={close}>x</div>
                <div>
                    <EditDisplay value={setData.name} label={"Name"} path={"coursesApp/sets/"+setID+"/name"} editMode={editMode} ></EditDisplay>                    
                    <EditDisplay value={setData.url} label={"URL"} path={"coursesApp/sets/"+setID+"/url"} editMode={editMode} ></EditDisplay>                    
                    <EditDisplay value={setData.contactPhone} label={"Contact Phone"} path={"coursesApp/sets/"+setID+"/contactPhone"} editMode={editMode} ></EditDisplay>                    
                    <EditDisplay value={setData.contactEmail} label={"Contact Email"} path={"coursesApp/sets/"+setID+"/contactEmail"} editMode={editMode} ></EditDisplay>                    
                    <EditDisplay value={setID} label={"Set ID"} path={"coursesApp/sets/"+setID+"/id"} editMode={false} ></EditDisplay>                    
                    {/* 
                        Later will create a user selector with a "assign me" option and a search field to search users by name or id. This will save the selected user to the specified location 
                        also an array editor
                        courses selector (for landing page)
                    */}
                    <EditDisplay value={setData.owner} label={"Owner ID"} path={"coursesApp/sets/"+setID+"/owner"} editMode={false} ></EditDisplay>                    
                    <CourseSelector setID={setID}></CourseSelector>
                    <hr></hr>
                </div>
                {/* <div>
                    {Object.entries(setData).map(setEntry => (
                        <>
                            <div className='setDetailRow'>
                                <div>{setEntry[0] + ":"}</div>
                                {
                                    editMode ?
                                        <input defaultValue={typeof setEntry[1] == "object" ? "object":setEntry[1]}></input>
                                        :
                                        <div>{typeof setEntry[1] == "object" ? "object":setEntry[1]}</div>
                                }
                            </div>
                            <hr></hr>
                        </>
                    ))}
                </div> */}
                <div className='bottomButtons'>
                    {/* opens a floading menu with the landing page. Can edit the content and also courses from the courses the user has created */}                    
                    <button onClick={()=>{setLandingEditSetID(setID); console.log(setID)}}>Edit Landing Page</button>  
                    {/* sets/setID/Dashboard shows the dashboard for that set */}
                    
                    <button onClick={()=>setDelteMessage("Delte "+setData.name+"?")}>Delete</button>
                </div>
            </div>      
        }
        {landingEditSetID &&
            <div className='box floatingMenu landingPageFloatingMenu'>             
                <div className='closeButton' onClick={()=>setLandingEditSetID()}>x</div>
                <LandingPage2 setIDOverride={landingEditSetID} allowEdit></LandingPage2> 
            </div>
        }
        <ConfirmationBox 
            cancel={()=>setDelteMessage()}
            confirm={delteSet}
            message={delteMessage}
        ></ConfirmationBox>
    </>
  )
}

export default SetDetail