import React, { useEffect } from 'react'
import UserDash from './UserDash/UserDash'
import AdminDash from './AaminDash/AdminDash'
import { useDispatch, useSelector } from 'react-redux'
import DisplayPage from '../DisplayPage'
import { setSideNavOpen } from '../../../App/AppSlice'

function Dashboard() {
  // If they have any of these admin permissions, show the admin dash, else show the user dash
  const fullAdmin = useSelector(state => state.dbslice.userData?.accountData?.fullAdmin)
  const courseAdmin = useSelector(state => state.dbslice.userData?.accountData?.courseAdmin)
  const userAdmin = useSelector(state => state.dbslice.userData?.accountData?.userAdmin)

  const dispacher = useDispatch()
  useEffect(()=>{
    dispacher(setSideNavOpen(false))
  },[])

    return (
    <DisplayPage>
        {(fullAdmin || courseAdmin || userAdmin) ?
            <AdminDash></AdminDash>
            :
            <UserDash></UserDash>
        }
    </DisplayPage>
  )
}

export default Dashboard