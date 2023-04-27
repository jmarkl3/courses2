import React from 'react'
import "./DisplayPage.css"
import topImage from "../../Images/topImage.jpg"
import Navbar from '../Navbar/Navbar'
import { useSelector } from 'react-redux'

function DisplayPage(props) {
    const sideNavOpen = useSelector(state => state.appslice.sideNavOpen)
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