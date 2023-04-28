import React, { useState } from 'react'
import { dontClickThrough } from '../App/functions'
import "./Utils.css"

function HamburgerMenu(props) {
    const [hideMenu, setHideMenu] = useState()
    const [menuOpen, setMenuOpen] = useState(false)

    function toggleMenu(e){
        dontClickThrough(e)
        setMenuOpen(!menuOpen)
    }

    // This used to hide the menu for a second when the open status was set by hover isstead of click
    function hideMenuFunction(e){
        dontClickThrough(e)        

        setHideMenu(true)
        setTimeout(() => {
            setHideMenu(false)
        }, 100)
    }

    // In order to have the animation the height needs to be a set number, but it varies based on the number of buttons in the menu, so this function calculates the height
    function heightFromProps(){   
        // If the menu is closed it will have a 0 height
        if(!menuOpen)
            return "0px"

        // If the height is set in props, use that
        if(props.height)     
            return props.height
            
        // If there are no buttons in the menu, use a default height
        if(!props.children)
            return "20px"
        
        // If there are children, use the number of children * 40px
        return (props.children.length * 40) +"px"
    }

  return (
    <div className={`topRight`} onClick={toggleMenu}>
        {"⋮"}
        <div className={`topRightMenu `} style={{height: heightFromProps()}}>
            {props.children}
            <div className="closeButton" onClick={toggleMenu}>x</div>
        </div>
    </div>
  )
}

export default HamburgerMenu