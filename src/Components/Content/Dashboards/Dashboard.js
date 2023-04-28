import React, { useEffect } from 'react'
import UserDash from './UserDash'
import AdminDash from './AdminDash'
import { useDispatch, useSelector } from 'react-redux'
import DisplayPage from '../DisplayPage'
import { setSideNavOpen } from '../../../App/AppSlice'

function Dashboard() {
  const viewAsAdmin = useSelector(state => state.appslice.viewAsAdmin)
  
  const dispacher = useDispatch()
  useEffect(()=>{
    dispacher(setSideNavOpen(false))
  },[])

    return (
    <DisplayPage>
        {viewAsAdmin ?
            <AdminDash></AdminDash>
            :
            <UserDash></UserDash>
        }
    </DisplayPage>
  )
}

export default Dashboard