import React, { useEffect, useRef, useState } from 'react'
import "../Dashboards.css"
import { useDispatch, useSelector } from 'react-redux'
import UserCourses from './UserCourses'
import "./UserDash.css"
import { auth, saveUserAccountData, toggleTheme } from '../../../../App/DbSlice'
import { setEditMode, setShowCart, toggleShowAuthMenu } from '../../../../App/AppSlice'
import { updateEmail } from 'firebase/auth'

function UserDash() {
  const userData = useSelector(state => state.dbslice.userData)
  const userID = useSelector(state => state.dbslice.userID)
  const theme = useSelector(state => state.dbslice.userData?.accountData?.theme)
  const webcamModule = useSelector(state => state.dbslice.userData?.accountData?.webcamModule)
  const [editingProfileInfo, setEditingProfileInfo] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const dispatcher = useDispatch()
  
  const nameInputF = useRef()
  const nameInputL = useRef()
  const emailInput = useRef()
  const phoneInput = useRef()
  const adressInput1 = useRef()
  const adressInput2 = useRef()
  const loadCount = useRef(0)
  
  // Ensure that the fields show the user data when the it loads
  useEffect(()=>{
    if(userData && loadCount.current < 1){
      loadCount.current++
      resetFields()
    }
  },[userData])

  function resetFields(){
    nameInputF.current.value = (userData?.accountData?.firstName || '')
    nameInputL.current.value = (userData?.accountData?.lastName || '')
    phoneInput.current.value = (userData?.accountData?.phone || '')
    adressInput1.current.value = (userData?.accountData?.address1 || '')
    adressInput2.current.value = (userData?.accountData?.address2 || '')
    emailInput.current.value = (auth.currentUser?.email)
  }

  function saveUserAccountDataFunction(){
    let accountDataTemp ={
      firstName: nameInputF.current.value,
      lastName: nameInputL.current.value,
      phone: phoneInput.current.value,
      address1: adressInput1.current.value,
      address2: adressInput2.current.value,
    }    
    dispatcher(saveUserAccountData({kvPairs: accountDataTemp, userID: userID}))
    setEditingProfileInfo(false)
  }

  function startEditingProfileInfo(){
    nameInputF.current.focus()
    setEditingProfileInfo(true)
  }

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
          <input readOnly={editingProfileInfo? false: "readOnly"} className='half' defaultValue={userData?.accountData?.firstName} ref={nameInputF} placeholder='First Name'></input>          
          <input readOnly={editingProfileInfo? false: "readOnly"} className='half' defaultValue={userData?.accountData?.lastName} ref={nameInputL} placeholder='Last Name'></input>          
          <input readOnly={editingProfileInfo? false: "readOnly"}  defaultValue={userData?.accountData?.phone} ref={phoneInput} placeholder='Phone'></input>          
          <input readOnly={editingProfileInfo? false: "readOnly"}  defaultValue={userData?.accountData?.address1} ref={adressInput1} placeholder='Address Line 1'></input>          
          <input readOnly={editingProfileInfo? false: "readOnly"}  defaultValue={userData?.accountData?.address2} ref={adressInput2} placeholder='Address Line 2'></input>                            
          <input readOnly={"readOnly"} defaultValue={auth?.currentUser?.email} ref={emailInput} title='To edit email click the account button, then click "Change Email"' placeholder='Email'></input>          
          {editingProfileInfo?
            <>
              <div className={"profileImageButton"} onClick={resetFields}> Reset</div>
              <div className={"profileImageButton"} onClick={saveUserAccountDataFunction}> Save</div>
              {errorMessage}
            </>
            :
            <div className={"profileImageButton"} onClick={startEditingProfileInfo}> Edit Info</div>

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