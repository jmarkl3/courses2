import React from 'react'
import "./DisplayPage.css"
import topImage from "../../Images/topImage.jpg"
import Navbar from '../Navbar/Navbar'
import { useSelector } from 'react-redux'

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
    </div>
  )
}

export default DisplayPage