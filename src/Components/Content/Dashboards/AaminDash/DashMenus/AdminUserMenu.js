import React, { useRef, useState } from 'react'
import { dontClickThrough } from '../../../../../App/functions'
import { useDispatch } from 'react-redux'
import { saveUserAccountData } from '../../../../../App/DbSlice'
import UserCourses from '../../UserDash/UserCourses'
import Cart from '../../../../Menus/Cart/Cart'
import { setShowCart, setUserDataOverride } from '../../../../../App/AppSlice'

function AdminUserMenu({userData, close}) {
  const dispatcher = useDispatch()

  console.log(userData)

  const firstNameInput = useRef()
  const lastNameInput = useRef()
  const addressInput = useRef()
  const address2Input = useRef()
  const emailInput = useRef()
  const phoneInput = useRef()
  const caseNumberInput = useRef()
  const heardAboutInput = useRef()
  const notesInput = useRef()
  const fullAdminInput = useRef()
  const courseAdminInput = useRef()
  const courseAdminCoursesInput = useRef()
  const userAdminInput = useRef()
  const previewInput = useRef()

  function updateUserAccountData(field, value){
    let kvPairs ={
      [field]: value
    } 
  dispatcher(saveUserAccountData({kvPairs: kvPairs, userID: userData?.id}))

  }

  function saveChanges(){
    let updatedUserInfo = {
      firstName: firstNameInput.current.value,
      lastName: lastNameInput.current.value,
      address1: addressInput.current.value,
      address2: address2Input.current.value,
      email: emailInput.current.value,
      phone: phoneInput.current.value,
      caseNumber: caseNumberInput.current.value,
      heardAbout: heardAboutInput.current.value,
      notes: notesInput.current.value,      
    }
    dispatcher(saveUserAccountData({kvPairs: updatedUserInfo, userID: userData?.id}))
  }
  function resetFields(){
    firstNameInput.current.value = (userData?.accountData?.firstName || '')
    lastNameInput.current.value = (userData?.accountData?.lastName || '')
    addressInput.current.value = (userData?.accountData?.address1 || '')
    address2Input.current.value = (userData?.accountData?.address2 || '')
    emailInput.current.value = (userData?.accountData?.email || '')
    phoneInput.current.value = (userData?.accountData?.phone || '')
    caseNumberInput.current.value = (userData?.accountData?.caseNumber || '')
    heardAboutInput.current.value = (userData?.accountData?.heardAbout || '')
    notesInput.current.value = (userData?.accountData?.notes || '')
  }

  function showCartForUser(){
    dispatcher(setUserDataOverride(userData))
    dispatcher(setShowCart(true))
  }

  // set userdateoverride in appslice so it

  return (
    <div className='box adminUserMenu' onClick={dontClickThrough}>
        <div className='closeButton' onClick={close}>x</div>
        <div>
          <div>
            <h3>{userData?.accountData?.firstName}'s Account Info</h3>
            <div className='inputArea half'>
              First Name
              <input 
                defaultValue={userData?.accountData?.firstName} 
                ref={firstNameInput}
              ></input>
            </div>
            <div className='inputArea half'>
              Last Name
              <input 
                defaultValue={userData?.accountData?.lastName} 
                ref={lastNameInput}
              ></input>
            </div>
            <div className='inputArea whole'>
              Address
              <input 
                defaultValue={userData?.accountData?.address1} 
                ref={addressInput}
              ></input>
            </div>
            <div className='inputArea whole'>
              Address 2
              <input 
                defaultValue={userData?.accountData?.address2} 
                ref={address2Input}
              ></input>

            </div>
            <div className='inputArea half'>
              Email
              <input 
                defaultValue={userData?.accountData?.email} 
                ref={emailInput}

              ></input>
            </div>
            <div className='inputArea half'>
              Phone
              <input 
                defaultValue={userData?.accountData?.phone} 
                ref={phoneInput}
              ></input>
            </div>
            <div className='inputArea half'>
              Case Number
              <input 
                defaultValue={userData?.accountData?.caseNumber} 
                ref={caseNumberInput}
              ></input>
            </div>
            <div className='inputArea half'>
              Heard About Us
              <input 
                defaultValue={userData?.accountData?.heardAbout} 
                ref={heardAboutInput}
              ></input>
            </div>
            <div className='inputArea whole'>
              Notes
              <textarea 
                defaultValue={userData?.accountData?.notes} 
                ref={notesInput}
              ></textarea>
            </div>
            <div>
              <button onClick={resetFields}>Reset Fields</button>
              <button onClick={saveChanges}>Save Changes</button>            
            </div>
            <hr></hr>
          </div>
          <div>            
            <h3>Access Rights</h3>
            <label htmlFor={fullAdminInput} className='checkoutInputCheckbox'>
              <span className='labelText'>
                Full Admin
              </span>
              <input 
                type='checkbox'                     
                ref={fullAdminInput}
                defaultChecked={userData?.accountData?.fullAdmin}      
                onChange={()=>updateUserAccountData('fullAdmin', fullAdminInput.current.checked)}        
              ></input> 
            </label>  
            <label htmlFor={courseAdminInput} className='checkoutInputCheckbox'>
              <span className='labelText'>
                Course Admin
              </span>
              <input 
                type='checkbox'                     
                ref={courseAdminInput}
                defaultChecked={userData?.accountData?.courseAdmin}
                onChange={()=>updateUserAccountData('courseAdmin', courseAdminInput.current.checked)}
              ></input> 
            </label>  
            <label htmlFor={userAdminInput} className='checkoutInputCheckbox'>
              <span className='labelText'>
                User Admin
              </span>
              <input 
                type='checkbox'                     
                ref={userAdminInput}
                defaultChecked={userData?.accountData?.userAdmin}
                onChange={()=>updateUserAccountData('userAdmin', userAdminInput.current.checked)}        
              ></input> 
            </label>  
            <label htmlFor={previewInput} className='checkoutInputCheckbox'>
              <span className='labelText'>
                Preview
              </span>
              <input 
                type='checkbox'                     
                ref={previewInput}
                defaultChecked={userData?.accountData?.preview}
                onChange={()=>updateUserAccountData('preview', previewInput.current.checked)}        
              ></input> 
            </label>  
            <label htmlFor={previewInput} className='checkoutInputCheckbox'>
              <span className='labelText'>
                Full View
              </span>
              <input 
                type='checkbox'                     
                ref={previewInput}
                defaultChecked={userData?.accountData?.preview}
                onChange={()=>updateUserAccountData('fullView', previewInput.current.checked)}        
              ></input> 
            </label>    
            <hr></hr>
          </div>
          <div>
            <h3>Admin Actions</h3>             
              <button>Send Password Reset Link</button>
              <button onClick={showCartForUser}>Enroll in course</button>                     
            <hr></hr>
          </div>
          <div>
            <h3>{userData?.accountData?.firstName}'s Course Data</h3>
              <UserCourses userDataOverride={userData}></UserCourses>
            <hr></hr>
          </div>
        </div>

    </div>
  )
}

export default AdminUserMenu