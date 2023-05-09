import React from 'react'
import "../Dashboards.css"
import AdminCourses from '../../../CourseTile/AdminCourses'
import { useSelector } from 'react-redux'
import UserCourses from '../UserDash/UserCourses'
import Charts from './Charts'
import AdminUsers from './AdminUsers'

function AdminDash() {
    const userData = useSelector(state => state.dbslice.userData)
    // Display components based on admin permissions
    const fullAdmin = useSelector(state => state.dbslice.userData?.accountData?.fullAdmin)
    const courseAdmin = useSelector(state => state.dbslice.userData?.accountData?.courseAdmin)
    const userAdmin = useSelector(state => state.dbslice.userData?.accountData?.userAdmin)

  return (
    <div>
      <div className='dashboardWelcomeMessage'>
        {`Welcome Back ${userData?.accountData?.firstName}`}
      </div>
      { fullAdmin && 
        <>
          <Charts></Charts>
          <hr></hr>
        </>
      }
      {/* <h3>Courses</h3> */}
      {(fullAdmin || courseAdmin)?
        <AdminCourses></AdminCourses>
        :
        <UserCourses></UserCourses>
      }
      { (fullAdmin || userAdmin) && 
        <>
          <hr></hr>
          <AdminUsers></AdminUsers>
        </>
      }

    </div>
  )
}

export default AdminDash