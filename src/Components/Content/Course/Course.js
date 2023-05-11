import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setSideNavOpen } from '../../../App/AppSlice'
import SideNav from '../../Sidebar/SideNav'
import ElementMapper from './Elements/ElementMapper'
import DisplayPage from '../DisplayPage'
import { useParams } from 'react-router-dom'
import { selectCourse } from '../../../App/DbSlice'
import "./Course.css"
import certificateImage from "../../../Images/certificateNoName.jpg"
import Certificate from './Elements/Display/Components/Certificate'

function Course() {
  const userData = useSelector(state => state.dbslice.userData)
  const userDataOverride = useSelector(state => state.dbslice.userDataOverride)
  const [courseComplete, setCourseComplete] = useState()
  const [displayCertificate, setDisplayCertificate] = useState()
  const dispatcher = useDispatch()
  const { courseID } = useParams();  
  
  useEffect(() => {
    dispatcher(selectCourse(courseID))
    dispatcher(setLoading(true))
  },[courseID])
  
  useEffect(() => {
    checkIfComplete()
  },[courseID, userData])

  function checkIfComplete(){
    let complete = userData?.courses[courseID]?.complete
    setCourseComplete(complete)
    if(complete)
      showCertificate()
  }
  function showCertificate(){
    setDisplayCertificate(true)
    dispatcher(setSideNavOpen(false))
  }

  function certificateName(){
    let firstName = (userDataOverride?.accountData?.firstName || userData?.accountData?.firstName)
    let lastName = (userDataOverride?.accountData?.lastName || userData?.accountData?.lastName)
    return firstName+" "+lastName
  }

  return (
    <DisplayPage>
        {displayCertificate ? 
          <>
            <Certificate></Certificate>
            <div>
              <button onClick={()=>{setDisplayCertificate(false)}}>View Course</button>
            </div>
          </>  
          :
          <>
            <SideNav></SideNav>
            <div className='course'>
              {courseComplete &&
                <button onClick={()=>{showCertificate(true)}}>View Certificate</button>
              }
              <ElementMapper></ElementMapper>
            </div>
          </>  
        }
    </DisplayPage>
  )
}

export default Course