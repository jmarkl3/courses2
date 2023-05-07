import React from 'react'
import "./Dashboards.css"
import AdminCourses from '../../CourseTile/AdminCourses'

function AdminDash() {
  return (
    <div>
      <h3>
        Admin dashboard
      </h3>
      <hr></hr>
      <div>
        admin data
      </div>
      <div>
        users chart
      </div>
      <div>
        user input chart
      </div>
      <hr></hr>
      <h3>
        Courses
      </h3>
      <AdminCourses></AdminCourses>
    </div>
  )
}

export default AdminDash