import React from 'react'
import "./LandingPage.css"
import backgroundImage from "../../Images/momAndChildBackground.jpg"
import { useDispatch, useSelector } from 'react-redux'
import { toggleLanguage } from '../../App/AppSlice'
function LandingPage() {
    const language = useSelector(state => state.appslice.language)
    const dispacher = useDispatch()

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
                    {/* {["Info","Courses","Language","Support","Cart", "Account"].map((item, index) => (
                        <div className='landingNavButton'>
                            {item}
                        </div>

                    ))} */}
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
                    <div className='landingNavButton'>
                        Cart
                    </div>
                    <div className='landingNavButton'>
                        Account
                    </div>
                </div>
            </div>
            <div className='landingContent'>

            </div>

        </div>
        {/* <div className='landingPageScroll'>
            <div className='landingPageScrollText'>
                <div className='landingTitle'>
                    Online Coparenting Courses 
                </div>
                <div className='landingTitleText'>
                    We offer effective full online coparenting courses for a low cost. Our passion for family repair is canneled into our 
                </div>
            </div>
            <div className='landingScrollInner'>
                <div className='landingNav'>

                </div>
            </div>          
        </div> */}
    </div>
  )
}

export default LandingPage