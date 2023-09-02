import React from 'react'
import "./BottomNav.css"

function BottomNav() {
  return (
    <div className='bottomNav'>        
        <div className='bottomNavColumn'>
            <a href='./'>Home</a>
            <a href='./#/About'>About</a>
            <a href='./#/About'>Available Courses</a>
        </div>
        <div className='bottomNavColumn'>
            <a>Languages</a>
            <a>Contact / Support</a>
            <a>Account</a>
        </div>
        <div className='bottomNavColumn'>
            <a href='./#/Dashboard'>Your Dashboard</a>
            <a href='./#/Sets'>Available Programs</a>
            <a>Completed Courses</a>
        </div>
    </div>
  )
}

export default BottomNav