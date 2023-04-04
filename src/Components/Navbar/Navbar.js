import React from 'react'
import "./Navbar.css"
import starIcon from "../../Images/starIconW.png"
import { useDispatch } from 'react-redux'
import { selectCourse } from '../../App/DbSlice'

function Navbar() {
    const dispacher = useDispatch()

    return (
    <div className='navbar'>
        <div className='navBarInner'>
            <div className='top left'>
                727-500-5075
            </div>
            <div className='bottom left'>
                <button onClick={()=>dispacher(selectCourse(null))}>Courses</button>
                <button>About</button>
                <button>Info</button>
            </div>
            <div className='navbarCenter'>
                <img src={starIcon}></img>
            </div>
            <div className='top right'>
                language
            </div>
            <div className='bottom right'>
                <button>Support</button>
                <button>Cart</button>
                <button>Account</button>
            </div>
        </div>
    </div>
  )
}

export default Navbar