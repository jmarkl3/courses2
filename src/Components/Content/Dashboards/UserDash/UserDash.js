import React from 'react'
import "../Dashboards.css"
import { useSelector } from 'react-redux'
import UserCourses from './UserCourses'

function UserDash() {
  const userData = useSelector(state => state.dbslice.userData)

  return (
    <div>
      
      <div>
        <h3>
          Your Courses
        </h3>
        <div>
          <UserCourses></UserCourses>
      </div>
      </div>
    </div>
  )
}

export default UserDash