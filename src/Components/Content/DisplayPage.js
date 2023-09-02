import React from 'react'
import "./DisplayPage.css"
import topImage from "../../Images/topImage.jpg"
import Navbar from '../Navbar/Navbar'
import { useSelector } from 'react-redux'
import BottomNav from '../LandingPage/BottomNav'

/*
================================================================================
|                                 DisplayPage.js
================================================================================

    This component is a wrapper for all of the components that are displayed in the main content area of the application
    it contains a navbar, layout styling, and whatever components it is wrapping

*/

function DisplayPage(props) {
    const sideNavOpen = useSelector(state => state.appslice.sideNavOpen)

    return (
    <div>    
        <Navbar></Navbar>
        <div className='pageBackground'>
            <div className='topImage'>
                <img src={topImage}></img>
            </div>        
        </div>
        <div className={`pageOuter ${sideNavOpen ? "pageOuterNavOpen":""}`}>
            <div className='pageInner'>
                {props.children}
            </div>
        </div>  
        {!props.hideBottomBar && <BottomNav></BottomNav>}
    </div>
  )
}

export default DisplayPage