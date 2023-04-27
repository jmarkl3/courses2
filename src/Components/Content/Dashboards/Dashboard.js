import React, { useEffect } from 'react'
import UserDash from './UserDash'
import AdminDash from './AdminDash'
import { useDispatch, useSelector } from 'react-redux'
import DisplayPage from '../DisplayPage'
import { setSideNavOpen } from '../../../App/AppSlice'

function Dashboard() {
  const isAdmin = useSelector(state => state.dbslice.userData?.accountData?.isAdmin)
  
  const dispacher = useDispatch()
  useEffect(()=>{
    dispacher(setSideNavOpen(false))
  },[])

    return (
    <DisplayPage>
        {isAdmin ?
            <AdminDash></AdminDash>
            :
            <UserDash></UserDash>
        }
    </DisplayPage>
  )
}

export default Dashboard