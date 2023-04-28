import React, { useEffect, useRef, useState } from 'react'
import "./LandingPage.css"
import backgroundImage from "../../Images/momAndChildBackground.jpg"
import { useDispatch, useSelector } from 'react-redux'
import { toggleShowAuthMenu } from '../../App/AppSlice'
import Cart from '../Cart/Cart'
import CartCourse from '../Cart/CartCourse'
import { toggleLanguage } from '../../App/DbSlice'
/*    

    page content
    match style from example page
    add the courses from the sample data to the landing page description 
    put the links to the page scrolls to the corresponding nav section

    landing page content can switch when user clicks some nav buttons 
    support page is the only one for now

    language changes based on the app state  

    create some content that is ok. it can be added to later if needed

    links to the courses page via the cart
    user signs up for a course and it saves in the db
    they can get to their courses with a your courses button or in the account menu
    account menu will be the main place
    if theyre logged in and enrolled in a course there will be a go to my course button
    or if multiple courses go to my courses will open the account page 


    nav buttons
      if it doesn't open a menu have the page scroll to where the corrosponding section is

    cart menu
      pulls from list of courses
      selected courses save in local storage and reload on user return
        maybe also by IP address
        and in account if user is logged in
      when user clicks areas in the nav it scrolls to the information areas
    course more info menu displays when the user clicks the button on the cart item

    checkout button
      slide over to the page that has the checkout
        or maybe the bottom part where the available courses are is the checkout
      shows selected coursess with option to view course info
      checkout inputs
      submit button      
      back button    

      checkout page should be a seperate page
      will look better and also less likley they will press back in the browser than close a modal

    information sections
      the company
      selling points
      about each course
        can add course to cart and the cart shows

    when user comes back it says welcome back with a smile and emojo

    selected course IDs are saved in global state to be accessed by cart and checkout
    they are also stored in local storage and loaded when user returns
    if user is logged in they are stored in the db and loaded when user returns

    examples:
        this is a good one:
        https://parentingafterdivorce.org/
        :
        other examples
        https://www.onlineparentingprograms.com/support/how-it-works.html
        https://co.onlineparentingprograms.com/district-18-coparenting-programs.html
        https://healthychildrenofdivorce.com/
        https://www.courtparentclass.com/
        https://www.factcolorado.com/

*/

function LandingPage({goto}) {
    const language = useSelector(state => state.dbslice.userData?.accountData?.language)
    const [showCart, setShowCart] = useState(false)
    const dispacher = useDispatch()
    const aboutRef = useRef()
    const coursesRef = useRef()
    const coursesArray = useSelector(state => state.dbslice.coursesArray)
    const userData = useSelector(state => state.dbslice.userData)

    useEffect(() => {
        if(goto === "about")
        setTimeout(() => {
            scrollToAbout()

        }, 250)
        
    }, [])

    function scrollToAbout(){
        aboutRef.current.scrollIntoView({behavior: 'smooth'})

    }
    function scrollToCourses(){
        coursesRef.current.scrollIntoView({behavior: 'smooth'})

    }

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
                    <div className='landingNavButton' onClick={scrollToAbout}>
                        About
                    </div>
                    <div className='landingNavButton' onClick={scrollToCourses}>
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
                <div className='landingPageText'>

                    <div className={"landingPageTextSection"} ref={aboutRef}> 
                        <h3 className='center' >
                            About
                        </h3>    
                        <div>
                            If you have been mandated to complete one of our online parenting classes, it is your responsibility to make sure the court or government agency has a copy of your certificate or a record of your completion. OnlineParentingPrograms.com does not file completed certificates on your behalf. If you are unsure how to file your certificate contact the agency that required the program for specific instructions.
                        </div>
                    </div>
                    <div className={"landingPageTextSection"}>
                        <h3 className='center'>
                            Key Facts
                        </h3>  
                        <hr></hr>
                        <ul>
                            <li>Meets the requirements of courts throughout Colorado</li>
                            <li>More than 100,000 parents served since 1993</li>
                            <li>Highly-experienced male-female teams of mental health professionals and educators</li>
                            <li>Curriculum reflects the most recent research about children of divorce</li>
                            <li>Convenient locations throughout the Denver Metro Area</li>
                            <li>Reduced fee for qualified indigent participants</li>
                            <li>Offered in English and Spanish</li>
                            <li>Two Classes Offered &ndash; Levels 1 &amp; 2</li>
                        </ul>
                    </div>
                    {(userData?.enrolledCourses && Array.isArray(userData?.enrolledCourses) && userData?.enrolledCourses?.length > 0) &&
                        <div className={"landingPageTextSection"} ref={coursesRef}>
                            <h3 className='center'>
                                Your Courses
                            </h3>  
                            <hr></hr>
                            <div>
                                {coursesArray.filter(courseData => userData?.enrolledCourses?.includes(courseData.id)).map(courseData => (
                                    <CartCourse courseData={courseData} draggable={false} key={courseData.id}></CartCourse>
                                ))}
                            </div>
                        </div>
                    }
                    <div className={"landingPageTextSection"} ref={coursesRef}>
                        <h3 className='center'>
                            Available Courses
                        </h3>  
                        <hr></hr>
                        <div>
                            {coursesArray.map(courseData => (
                                <CartCourse courseData={courseData} draggable={false} showCart={()=>setShowCart(true)} key={courseData.id}></CartCourse>
                            ))}
                        </div>
                    </div>
                    <div className={"landingPageTextSection"}>
                        <h3 className='center'>
                            A word of inspiration
                        </h3>  
                        <hr></hr>
                        <div>
                            <p><em>&ldquo;&hellip;there is hope for children. Divorcing parents cannot spare their children the pain of divorce, despite their sometimes fervent desire to do so. And perhaps they shouldn&rsquo;t try. Children are entitled to their own feelings; children need to grieve. But even after divorce parents can &ndash; in my view must &ndash; work hard to be good parents and co-parents. Over time after divorce, good parents and co-parents can promote their children&rsquo;s resilience and do much to ease their pain. Rather than forever being &ldquo;children of divorce,&rdquo; hardworking divorced parents and co-parents can help their kids to be, well, just kids.&rdquo;</em></p>
                            <p><em>Robert Emery &ndash; Family Court Review &ndash; July, 2006</em></p>
                        </div>

                    </div>


                </div>
            </div>

        </div>
        {showCart && <Cart close={()=>setShowCart(false)}></Cart>}
    </div>
  )
}

export default LandingPage