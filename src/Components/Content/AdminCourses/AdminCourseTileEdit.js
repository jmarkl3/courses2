import React, { useEffect, useRef, useState } from 'react'
import { updateCourseInfo2 } from '../../../App/DbSlice'
import { useDispatch } from 'react-redux'

function AdminCourseTileEdit({close, course}) {
    const [imgSrc, setImgSrc] = useState(course.image) 
    const titleRef = useRef()
    const priceRef = useRef()
    const descriptionRef = useRef()
    const imageUrlRef = useRef()
    const descriptionLongRef = useRef()
    const dispatcher = useDispatch()

    function updateCourseTileData(){
        let newCourseData = {
            name: titleRef.current.value,
            price: priceRef.current.value,
            description: descriptionRef.current.value,
            image: imageUrlRef.current.value,
            descriptionLong: descriptionLongRef.current.value,
        }
        dispatcher(updateCourseInfo2({courseID: course?.id, valuesObject: newCourseData}))
        close()
    }

  return (
    <div className='adminCourseTileEditWindow box'>
        <div className='closeButton' onClick={close}>x</div>
        <div className='inputHalf'>
            Title
            <input defaultValue={course.name} placeholder='Title' ref={titleRef}></input>
        </div>
        <div className='inputHalf'>
            Price
            <input defaultValue={course.price} placeholder='Price' ref={priceRef}></input>
        </div>
        <div className='tileEditImagePreview'>
            <img src={imgSrc}></img>
        </div>
        <div className='inputHalfM100'>
            Image Url
            <input defaultValue={course.image} placeholder='Image Url' ref={imageUrlRef} onChange={()=>setImgSrc(imageUrlRef.current.value)}></input>
        </div>
        <div>
            Description (short)
            <input defaultValue={course.description} placeholder='Description (short)' ref={descriptionRef}></input>
        </div>
        <div>
            Description (long)
            <textarea defaultValue={course.descriptionLong} placeholder='Description (long)' ref={descriptionLongRef}></textarea>
        </div>
        <div>
            <button onClick={close}>Cancel</button>
            <button onClick={updateCourseTileData}>Save</button>
        </div>
    </div>
  )
}

export default AdminCourseTileEdit