import React from 'react'
import certificateImage from "../../../../../../Images/certificateNoName.jpg"
import { useSelector } from 'react-redux'
import "./Certificate.css"

function Certificate() {
    const userData = useSelector(state => state.dbslice.userData)
    const userDataOverride = useSelector(state => state.appslice.userDataOverride)

  function certificateName(){
    let firstName = (userDataOverride?.accountData?.firstName || userData?.accountData?.firstName)
    let lastName = (userDataOverride?.accountData?.lastName || userData?.accountData?.lastName)
    return firstName+" "+lastName
  }

  return (
    <div className='certificate'>
        <div className='certificateName'>
            {certificateName()}
        </div>
        <img src={certificateImage}></img>
  </div>
  )
}

export default Certificate