import React, { useEffect, useRef, useState } from 'react'
import "./Utils.css"
// The search key is the key of the objects in the data array that the search term will look at
function SearchPager({dataObject, searchKey, searchKey2, objectSubsetKey, searchSubsetKey, setFilteredDataArray}) {
    const [pageRange, setPageRange] = useState([0, 10])
    const [searchInput, setSearchInput] = useState()
    const [filterdArrayLength, setFilterdArrayLength] = useState(0)
    const searchInputRef = useRef()

    useEffect(()=>{
        filterData()
    },[dataObject, pageRange, searchInput])

    function filterData(){
        // If there is no valid data object there is no need to filter it
        if(!dataObject || typeof dataObject !== "object") return

        // Search though each item in the object
        let tempArray = []
        Object.entries(dataObject).forEach((object, index) => {
            // If index is outside the bounds of the page range, skip it
            if(index < pageRange[0] || index > pageRange[1]) return

            // Get the data from the object
            let tempData = {}
            // This is for when only a subsed of the object is needed
            if(objectSubsetKey)
                tempData = {...object[1][objectSubsetKey]}
            // Else just add all of the data in the object
            else
                tempData = {...object[1]}

            // Put the id in the data object that will go in the array 
            tempData.id = object[0]               

            // Now filter it for a search term if there is one

            // The first value that will be checked agains the search term
            let searchCheckValue = ""
            if(searchKey){
                if(searchSubsetKey)
                    searchCheckValue += tempData?.[searchSubsetKey]?.[searchKey]
                else
                    searchCheckValue +=tempData?.[searchKey]
                searchCheckValue = searchCheckValue.toLowerCase()
                searchCheckValue = searchCheckValue.trim()
            }

            // The second value that will be checked agains the search term
            let searchCheckValue2 = ""
            if(searchKey2){
                if(searchSubsetKey)
                    searchCheckValue2 += tempData?.[searchSubsetKey]?.[searchKey]
                else
                    searchCheckValue2 +=tempData?.[searchKey]
                searchCheckValue2 = searchCheckValue.toLowerCase()
                searchCheckValue2 = searchCheckValue.trim()
            }

            // If there is no search input, or the search input is blank, or the user's name includes the search input, add them to the array
            if(!searchInput || searchInput == "")
                tempArray.push(tempData)
            
            // If the search intput is contained in the data object push it to the filtered array
            else if(searchKey && searchCheckValue.includes(searchInput))
                tempArray.push(tempData)

            // If the search intput is contained in the data object push it to the filtered array
            else if(searchKey2 && searchCheckValue2.includes(searchInput))
                tempArray.push(tempData)

        })

        // This is a function that will bes sent from the parent component
        setFilteredDataArray(tempArray)

        // Length to display the page rage
        setFilterdArrayLength(tempArray.length)
    }
    function search(){
        setSearchInput(searchInputRef.current.value?.trim()?.toLowerCase())
    }
    function pageUp(){
        setPageRange([pageRange[0] + 10, pageRange[1] + 10])
    }
    function pageDown(){
        if((pageRange[0] - 10) < 0) 
            setPageRange([0, 10])
        else
            setPageRange([pageRange[0] - 10, pageRange[1] - 10])

    }

  return (
    <div>
        <div className='userSearchBar'>
            <input ref={searchInputRef}></input>
            <button onClick={search}>Search</button>
            <div className='pageRangeBox'>
                <div className='arrowButton' onClick={pageDown}>{"<"}</div>
                {`${pageRange[0]} - ${pageRange[1]} of ${filterdArrayLength}`}
                <div className='arrowButton' onClick={pageUp}>{">"}</div>
            </div>
        </div>
    </div>
  )
}

export default SearchPager