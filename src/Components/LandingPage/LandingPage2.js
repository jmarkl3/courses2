import React, { useRef, useEffect } from 'react'
import "./LandingPage2.css"
import { useDispatch, useSelector } from 'react-redux'
import EditTextToggle from './EditTextToggle'
import { setShowSupportMenu, toggleShowAuthMenu } from '../../App/AppSlice'
import { toggleLanguage } from '../../App/DbSlice'
import LandingCourses from './LandingCourses'

function LandingPage2({allowEdit, setIDOverride, goto}) {

    const setData = useSelector(state => state.dbslice?.setData)
    //const selectedSetData = useSelector(state => state.dbslice?.selectedSetData)
    const selectedSetID = useSelector(state => state.dbslice?.selectedSetID)
    const language = useSelector(state => state.dbslice?.language)

    const dispatcher = useDispatch()

    let localSetData
    if(setIDOverride){
        localSetData = {...setData[setIDOverride]}
        localSetData.id = setIDOverride
    }else{
        localSetData = {...setData[selectedSetID]}
    }    

    useEffect(() => {
        if(goto === "about")
        setTimeout(() => {
            scrollToAbout()

        }, 250)                
    }, [])

    // const allowEdit = true

    const aboutRef = useRef()
    const coursesRef = useRef()
    function scrollToAbout(){
        if(aboutRef.current)
            aboutRef.current?.scrollIntoView({behavior: 'smooth'})
    }
    function scrollToCourses(){
        if(coursesRef.current)
            coursesRef.current.scrollIntoView({behavior: 'smooth'})         
    }

  return (
    <div className='landingPageOuterBox'>
        <div className='banner'>
            <img src={localSetData?.landingPage?.bannerUrl}></img>
        </div>
        {/* <div className='spacer'></div> */}
        <div className='pageBox'>
            <div className='bannerUrlEdit'>
                <EditTextToggle path={"coursesApp/sets/"+localSetData.id+"/landingPage/bannerUrl"} value={localSetData?.landingPage?.bannerUrl} hide={!allowEdit} allowEdit={allowEdit}></EditTextToggle>
            </div>
            <div className='bottomBox'>
                <div className='landingTopText'>
                    <EditTextToggle path={"coursesApp/sets/"+localSetData.id+"/landingPage/title"} value={localSetData?.landingPage?.title} className={"landingTitle"} allowEdit={allowEdit}></EditTextToggle>
                    <EditTextToggle path={"coursesApp/sets/"+localSetData.id+"/landingPage/description"} value={localSetData?.landingPage?.description} className={"landingTitleText"} allowEdit={allowEdit}></EditTextToggle>
                    {/* <h1>{"Title"}</h1>
                    <h5>{"Description"}</h5> */}
                </div>
                <div className='landingNav'>
                    <div className='landingNavButton' onClick={scrollToAbout}>
                        {"About"}
                    </div>
                    <div className='landingNavButton' onClick={scrollToCourses}>
                        {"Courses"}
                    </div>
                    <div className='landingNavButton' onClick={()=>dispatcher(toggleLanguage())}>
                        {language === "English" ? "Español" : "English"}
                    </div>
                    <div className='landingNavButton' onClick={()=>dispatcher(setShowSupportMenu(true))}>
                        {"Contact / Support"}
                    </div>
                    {/* <div className='landingNavButton' onClick={()=>dispatcher(setShowCart(true))}>
                        {languageConverter(language, "Cart")}
                    </div> */}
                    <div className='landingNavButton' onClick={()=>dispatcher(toggleShowAuthMenu())}>
                        {"Account"}
                    </div>
                </div>
                <div className='largeBox'>
                    <div className='landingPageContent' ref={aboutRef}>
                        <EditTextToggle verbose path={"coursesApp/sets/"+localSetData.id+"/landingPage/content1"} value={localSetData?.landingPage?.content1} className={"landingPageTextSection"} type={"content"} allowEdit={allowEdit}></EditTextToggle>
                        <div ref={coursesRef}>
                            <LandingCourses></LandingCourses>
                        </div>
                        <EditTextToggle verbose path={"coursesApp/sets/"+localSetData.id+"/landingPage/content2"} value={localSetData?.landingPage?.content2} className={"landingPageTextSection"} type={"content"} allowEdit={allowEdit}></EditTextToggle>                    
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default LandingPage2