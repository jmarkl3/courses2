import React, { useEffect, useRef, useState } from 'react'
import "../Dashboards.css"
import { useDispatch, useSelector } from 'react-redux'
import UserCourses from './UserCourses'
import "./UserDash.css"
import { auth, saveUserAccountData, toggleTheme } from '../../../../App/DbSlice'
import { setEditMode, setShowCart, toggleShowAuthMenu } from '../../../../App/AppSlice'
import { updateEmail } from 'firebase/auth'
import TimedWebcam from '../../../Webcam/TimedWebcam'
import { languageConverter, log } from '../../../../App/functions'
import ProfileEdit from '../ProfileEdit'

function UserDash() {
  const userData = useSelector(state => state.dbslice.userData)
  const language = useSelector(state => state.dbslice?.language)
  const theme = useSelector(state => state.dbslice.userData?.accountData?.theme)
  const webcamModule = useSelector(state => state.dbslice.userData?.accountData?.webcamModule)
  const [takingNewImage, setTakingNewImage] = useState(false)
  const dispatcher = useDispatch()


  return (
    <div>
      
      <div>
        <h3>
          {languageConverter(language, "Your Courses")}
        </h3>
        <div>
          <UserCourses></UserCourses>          
        </div>
      <div>
        <h3>
          {languageConverter(language, "Profile")}
        </h3>
        <div className='profileSection'>
          <div className='profileImage'><img src={userData?.accountData?.profileImageUrl}></img></div>
          <div className={"profileImageButton"} onClick={()=>setTakingNewImage(true)}>{languageConverter(language, "Take New Picture")}</div>
          {takingNewImage && <TimedWebcam once removeDisplay={()=>setTakingNewImage(false)}></TimedWebcam>}
        </div>
        {/* <div className='profileSection'>
          <div>
            <input readOnly={editingProfileInfo? false: "readOnly"} className='half' defaultValue={userData?.accountData?.firstName} ref={nameInputF} placeholder={languageConverter(language, "First Name")}></input>          
            <input readOnly={editingProfileInfo? false: "readOnly"} className='half' defaultValue={userData?.accountData?.lastName} ref={nameInputL} placeholder={languageConverter(language, "Last Name")}></input>          
          </div>
          <input readOnly={editingProfileInfo? false: "readOnly"}  defaultValue={userData?.accountData?.phone} ref={phoneInput} placeholder={languageConverter(language, "Phone")}></input>          
          <input readOnly={editingProfileInfo? false: "readOnly"}  defaultValue={userData?.accountData?.address1} ref={adressInput1} placeholder={languageConverter(language, "Address Line 1")}></input>          
          <input readOnly={editingProfileInfo? false: "readOnly"}  defaultValue={userData?.accountData?.address2} ref={adressInput2} placeholder={languageConverter(language, "Address Line 2")}></input>                            
          <input readOnly={"readOnly"} defaultValue={auth?.currentUser?.email} ref={emailInput} title={languageConverter(language, 'To edit email click the account button, then click "Change Email"')} placeholder={languageConverter(language, "Email")}></input>          
          {editingProfileInfo?
            <>
              <div className={"profileImageButton"} onClick={resetFields}> {languageConverter(language, "Reset")}</div>
              <div className={"profileImageButton"} onClick={saveUserAccountDataFunction}> {languageConverter(language, "Save")}</div>
              {errorMessage}
            </>
            :
            <div className={"profileImageButton"} onClick={startEditingProfileInfo}> {languageConverter(language, "Edit Info")}</div>
          }
        </div> */}
        <ProfileEdit></ProfileEdit>
        <div className='profileSection'>
          <div>            
            <button onClick={()=>dispatcher(toggleTheme())}>{theme === "darkTheme" ? languageConverter(language, "Light Theme") : languageConverter(language, "Dark Theme")}</button>                                                                                
          </div>
          <div>
            <button 
              onClick={()=>dispatcher(saveUserAccountData({kvPairs: {webcamModule: !webcamModule}}))}
              title='This will allow the webcam to take images while you complete the course for the course report'
            >
                {languageConverter(language, "Webcam Module")} {webcamModule ? languageConverter(language, "(On)") : languageConverter(language, "(Off)")}
            </button>
            <button onClick={()=>dispatcher(setShowCart(true))} title="View your cart and available courses">{languageConverter(language, "Add Courses")}</button>
            <button onClick={()=>dispatcher(toggleShowAuthMenu())} title="Open Account Options Menu">{languageConverter(language, "Account")}</button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default UserDash