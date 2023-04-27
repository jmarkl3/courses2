import React from 'react'
import "./DisplayPage.css"
import topImage from "../../Images/topImage.jpg"
import Course from './Course/Course'
import AdminCourses from './AdminCourses/AdminCourses'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {database, setCourseData, setCoursesData, setUserData, setUserID } from '../../App/DbSlice';
import { onValue } from 'firebase/database';
import { ref } from 'firebase/database';
import { HashRouter, Route, Routes, useParams } from 'react-router-dom';
import { setEditMode } from '../../App/AppSlice';
import { selectCourse } from '../../App/DbSlice';
import Navbar from '../Navbar/Navbar'
import UserDash from './Dashboards/UserDash'
import Dashboard from './Dashboards/Dashboard'

function DisplayPage(props) {
    const sideNavOpen = useSelector(state => state.appslice.sideNavOpen)
    const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
    const theme = useSelector(state => state.appslice.theme)

  return (
    <div className={theme}>    
        <Navbar></Navbar>
        <div className='pagePackground'>
            <div className='topImage'>
                <img src={topImage}></img>
            </div>        
        </div>
        <div className={`pageOuter ${sideNavOpen ? "pageOuterNavOpen":""}`}>
            <div className='pageInner'>
                {props.children}
            </div>
        </div>  
    </div>
  )
}

export default DisplayPage