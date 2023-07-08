import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { auth, saveUserAccountData } from '../../../App/DbSlice'
import { languageConverter } from '../../../App/functions'

function ProfileEdit() {
    const userData = useSelector(state => state.dbslice.userData)
    const userID = useSelector(state => state.dbslice.userID)
    const language = useSelector(state => state.dbslice?.language)
    const [editingProfileInfo, setEditingProfileInfo] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const nameInputF = useRef()
    const nameInputL = useRef()
    const emailInput = useRef()
    const phoneInput = useRef()
    const adressInput1 = useRef()
    const adressInput2 = useRef()
    const loadCount = useRef(0)
    const dispatcher = useDispatch()

    
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
    <div className='profileSection'>
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
    </div>
  )
}

export default ProfileEdit