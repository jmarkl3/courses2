import React from 'react'
import "./Navbar.css"
import starIcon from "../../Images/starIconW.png"
import { useDispatch, useSelector } from 'react-redux'
import { toggleLanguage } from '../../App/DbSlice'
import { toggleShowAuthMenu } from '../../App/AppSlice'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const dispacher = useDispatch()
    const language = useSelector(state => state.dbslice.userData?.accountData?.language)
    const navigate = useNavigate();

  return (
    <div className='navbar'>
        <div className='navBarInner'>
            <div className='top left'>
                727-500-5075
            </div>
            <div className='bottom left'>
                <button  onClick={()=>navigate("/Dashboard")}>Dashboard</button>
                <button onClick={()=>navigate("/About")}>About</button>
            </div>
            <div className='navbarCenter'>
                <img src={starIcon}></img>
            </div>
            <div className='top right clickable' onClick={()=>dispacher(toggleLanguage())}>
                {language === "English" ? "Español" : "English"}
            </div>
            <div className='bottom right'>
                <button>Support</button>
                <button onClick={()=>dispacher(toggleShowAuthMenu())}>Account</button>
            </div>
        </div>
    </div>
  )
}

export default Navbar