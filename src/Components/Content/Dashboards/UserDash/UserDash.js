import React, { useState } from 'react'
import "../Dashboards.css"
import { useDispatch, useSelector } from 'react-redux'
import UserCourses from './UserCourses'
import "./UserDash.css"
import { saveUserAccountData, toggleTheme } from '../../../../App/DbSlice'
import { setShowCart, toggleShowAuthMenu } from '../../../../App/AppSlice'

function UserDash() {
  const userData = useSelector(state => state.dbslice.userData)
  const theme = useSelector(state => state.dbslice.userData?.accountData?.theme)
  const webcamModule = useSelector(state => state.dbslice.userData?.accountData?.webcamModule)
  const [editingProfileInfo, setEditingProfileInfo] = useState(false)
  const dispatcher = useDispatch()
  console.log(userData)

  return (
    <div>
      
      <div>
        <h3>
          Your Courses
        </h3>
        <div>
          <UserCourses></UserCourses>          
        </div>
      <div>
        <h3>
          Profile
        </h3>
        <div className='profileSection'>
          <div className='profileImage'><img></img></div>
          <div className={"profileImageButton"}> Take New Picture</div>
        </div>
        <div className='profileSection'>
          <input readonly={editingProfileInfo? false: "readonly"} defaultValue={userData?.accountData?.firstName + " " + userData?.accountData?.lastName}></input>          
          <input readonly={editingProfileInfo? false: "readonly"}  defaultValue={userData?.accountData?.email}></input>          
          <input readonly={editingProfileInfo? false: "readonly"}  defaultValue={userData?.accountData?.phone}></input>          
          <input readonly={editingProfileInfo? false: "readonly"}  defaultValue={userData?.accountData?.address1}></input>          
          <input readonly={editingProfileInfo? false: "readonly"}  defaultValue={userData?.accountData?.address2}></input>                            
          {editingProfileInfo?
            <>
              <div className={"profileImageButton"} onClick={()=>setEditingProfileInfo(!editingProfileInfo)}> Cancel</div>
              <div className={"profileImageButton"} onClick={()=>setEditingProfileInfo(!editingProfileInfo)}> Save</div>
            </>
            :
            <div className={"profileImageButton"} onClick={()=>setEditingProfileInfo(!editingProfileInfo)}> Edit Info</div>

          }
        </div>
        <div className='profileSection'>
          <div>            
            <button onClick={()=>dispatcher(toggleTheme())}>{theme === "lightTheme" ? "Dark Theme" : "Light Theme"}</button>                                                                                
          </div>
          <div>
            <button 
              onClick={()=>dispatcher(saveUserAccountData({kvPairs: {webcamModule: !webcamModule}}))}
              title='This will allow the webcam to take images while you complete the course for the course report'
            >
                Webcam Module {webcamModule ? "(On)" : "(Off)"}
            </button>
            <button onClick={()=>dispatcher(setShowCart(true))} title="View your cart and available courses">Add Courses</button>
            <button onClick={()=>dispatcher(toggleShowAuthMenu())} title="Open Account Options Menu">Account</button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default UserDash