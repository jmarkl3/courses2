import React, { useState } from 'react'
import "./LandingPage.css"
import backgroundImage from "../../Images/momAndChildBackground.jpg"
import { useDispatch, useSelector } from 'react-redux'
import { toggleLanguage, toggleShowAuthMenu } from '../../App/AppSlice'
import Cart from '../Cart/Cart'
/*    

    nav buttons
      if it doesn't open a menu have the page scroll to where the corrosponding section is

    cart menu
      pulls from list of courses
      selected courses save in local storage and reload on user return
        maybe also by IP address
        and in account if user is logged in
      when user clicks areas in the nav it scrolls to the information areas
    course more info menu displays when the user clicks the button on the cart item

    information sections
      the company
      selling points
      about each course
        can add course to cart and the cart shows

    when user comes back it says welcome back with a smile and emojo


*/

function LandingPage() {
    const language = useSelector(state => state.appslice.language)
    const [showCart, setShowCart] = useState(false)
    const dispacher = useDispatch()

    const sampleCourses = [
        {
            id: 1,
            name: "Course 1",
            description: "This is a course about parenting",
            price: 28.25,
            image: "https://imgs.search.brave.com/dn99u3fgXHBh-xtK2LmKtz-vKKFaXW4WCe9BGBYP5fQ/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGFyZW50aW5n/Lm1kcGNkbi5jb20v/c2l0ZXMvcGFyZW50/aW5nLmNvbS9maWxl/cy9zdHlsZXMvZmFj/ZWJvb2tfb2dfaW1h/Z2UvcHVibGljLzEx/MDBfc3RvcnlfUGFy/ZW50c19vZl9zdWNj/ZXNzZnVsX2tpZHMu/anBnP2l0b2s9OTJK/THJZNlg",
        },
        {
            id: 2,
            name: "Course 2",
            description: "This is another course about parenting",
            price: 38.50,
            image: "https://static-ssl.businessinsider.com/image/55c9f359dd089592618b457e-5184-3456/shutterstock_267541034.jpg",
        },
        {
            id: 3,
            name: "Course 1",
            description: "This is a course about parenting",
            price: 10.00,
            image: "https://imgs.search.brave.com/dn99u3fgXHBh-xtK2LmKtz-vKKFaXW4WCe9BGBYP5fQ/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGFyZW50aW5n/Lm1kcGNkbi5jb20v/c2l0ZXMvcGFyZW50/aW5nLmNvbS9maWxl/cy9zdHlsZXMvZmFj/ZWJvb2tfb2dfaW1h/Z2UvcHVibGljLzEx/MDBfc3RvcnlfUGFy/ZW50c19vZl9zdWNj/ZXNzZnVsX2tpZHMu/anBnP2l0b2s9OTJK/THJZNlg",
        },
        {
            id: 4,
            name: "Course 2",
            description: "This is another course about parenting",
            price: 10.00,
            image: "https://static-ssl.businessinsider.com/image/55c9f359dd089592618b457e-5184-3456/shutterstock_267541034.jpg",
        },
        {
            id: 5,
            name: "Course 1",
            description: "This is a course about parenting",
            price: 10.00,
            image: "https://imgs.search.brave.com/dn99u3fgXHBh-xtK2LmKtz-vKKFaXW4WCe9BGBYP5fQ/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGFyZW50aW5n/Lm1kcGNkbi5jb20v/c2l0ZXMvcGFyZW50/aW5nLmNvbS9maWxl/cy9zdHlsZXMvZmFj/ZWJvb2tfb2dfaW1h/Z2UvcHVibGljLzEx/MDBfc3RvcnlfUGFy/ZW50c19vZl9zdWNj/ZXNzZnVsX2tpZHMu/anBnP2l0b2s9OTJK/THJZNlg",
        },
        {
            id: 6,
            name: "Course 2",
            description: "This is another course about parenting",
            price: 10.00,
            image: "https://static-ssl.businessinsider.com/image/55c9f359dd089592618b457e-5184-3456/shutterstock_267541034.jpg",
        },
    ]

  return (

    <div className='landingPage'>
        <div className='banner'>
            <img src={backgroundImage}></img>
        </div>
        <div>
            <div className='landingPageOver'>
                <div className='landingPageTitleContainerOuter'>
                    hey
                    <div className='landingPageTitleContainer'>
                        <div className='landingTitle'>
                            Online Coparenting Courses
                        </div>
                        <div className='landingTitleText'>
                            The best online parenting courses.   
                            landingTitleText landingTitleText landingTitleText landingTitleText landingTitleText landingTitleText landingTitleText landingTitleText landingTitleText landingTitleText landingTitleText landingTitleTextlandingTitleText landingTitleText
                        </div>
                    </div>
                </div>
                <div className='landingNav'>
                    <div className='landingNavButton'>
                        Info
                    </div>
                    <div className='landingNavButton'>
                        Courses
                    </div>
                    <div className='landingNavButton' onClick={()=>dispacher(toggleLanguage())}>
                        {language === "English" ? "Español" : "English"}
                    </div>
                    <div className='landingNavButton'>
                        Support
                    </div>
                    <div className='landingNavButton' onClick={()=>setShowCart(true)}>
                        Cart
                    </div>
                    <div className='landingNavButton' onClick={()=>dispacher(toggleShowAuthMenu())}>
                        Account
                    </div>
                </div>
            </div>
            <div className='landingContent'>

            </div>

        </div>
        {showCart && <Cart close={()=>setShowCart(false)} sampleCourses={sampleCourses}></Cart>}
    </div>
  )
}

export default LandingPage