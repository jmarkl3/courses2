import { onValue, ref } from 'firebase/database'
import React, { useEffect, useRef, useState } from 'react'
import { database } from '../../../../App/DbSlice'
import HamburgerMenu from '../../../../Utils/HamburgerMenu'
import SearchPager from '../../../Utility/SearchPager'

function AdminUsers() {
    const [usersData, setUsersData] = useState({})
    const [filteredUserArray, setFilteredUserArray] = useState([])
    const [pageRange, setPageRange] = useState([0, 10])
    const [searchInput, setSearchInput] = useState()
    const searchInputRef = useRef()

    // Load the user data from the db
    useEffect(()=>{
        loadUsers()        
    },[])

    // Filter the user data into an array when the userData is loaded
    useEffect(()=>{
        filterUsers()
    },[usersData, pageRange, searchInput])

    // Loads all users data from the db
    function loadUsers(){
        onValue(ref(database, 'coursesApp/userData'), (snapshot) => {                
            setUsersData(snapshot.val())
        })    
    }

    // Filters users into an array based on search intput and paging
    function filterUsers(){
        let tempArray = []
        Object.entries(usersData).forEach((user, index) => {
            if(index < pageRange[0] || index > pageRange[1]) return
            let tempUserData = {
                id: user[0],
                ...user[1].accountData
            }
            // If there is no search input, or the search input is blank, or the user's name includes the search input, add them to the array
            if(!searchInput || searchInput == "" || tempUserData?.firstName?.includes(searchInput) || tempUserData?.lastName?.includes(searchInput))
                tempArray.push(tempUserData)
        })
        setFilteredUserArray(tempArray)
    }
    function searchUser(){
        setSearchInput(searchInputRef.current.value?.trim())
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
        <SearchPager 
            dataObject={usersData} 
            searchKey="firstName" 
            searchKey2="lastName"
            objectSubsetKey="accountData"
            setFilteredDataArray={setFilteredUserArray}
        ></SearchPager>
        {filteredUserArray.map(userData => (
            <div className='userTile'>
                <HamburgerMenu>
                    <div className="hamburgerMenuOption" >Edit User Privilages</div>
                    <div className="hamburgerMenuOption" >View Course Data</div>                        
                </HamburgerMenu>
                {userData?.firstName}
            </div>
        ))}
    </div>
  )
}

export default AdminUsers