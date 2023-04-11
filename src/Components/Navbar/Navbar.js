import React from 'react'
import "./Navbar.css"
import starIcon from "../../Images/starIconW.png"
import { useDispatch } from 'react-redux'
import { incrementTimerSaveCounter, selectCourse } from '../../App/DbSlice'
import { setSideNavOpen, toggleShowAuthMenu } from '../../App/AppSlice'

function Navbar() {
    const dispacher = useDispatch()

    function goToCourses(){
        dispacher(incrementTimerSaveCounter())
        setTimeout(() => {
            dispacher(selectCourse(null))
            dispacher(setSideNavOpen(false))

        }, 100)
    }

    return (
    <div className='navbar'>
        <div className='navBarInner'>
            <div className='top left'>
                727-500-5075
            </div>
            <div className='bottom left'>
                <button onClick={goToCourses}>Courses</button>
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
                <button onClick={()=>dispacher(toggleShowAuthMenu())}>Account</button>
            </div>
        </div>
    </div>
  )
}

export default Navbar