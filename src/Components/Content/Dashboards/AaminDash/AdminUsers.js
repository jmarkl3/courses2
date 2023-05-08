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

    // Loads all users data from the db
    function loadUsers(){
        onValue(ref(database, 'coursesApp/userData'), (snapshot) => {                
            setUsersData(snapshot.val())
        })    
    }

  return (
    <div>
        <h3>Users</h3>  
        <SearchPager 
            dataObject={usersData} 
            searchKey="firstName" 
            searchKey2="lastName"       
            searchSubsetKey="accountData"     
            setFilteredDataArray={setFilteredUserArray}
        ></SearchPager>
        {filteredUserArray.map((userData, index) => (
            <div className='userTile' key={userData.id+""+index}>
                <HamburgerMenu>
                    <div className="hamburgerMenuOption" >Edit User Privilages</div>
                    <div className="hamburgerMenuOption" >View Course Data</div>                        
                </HamburgerMenu>
                {userData?.accountData?.firstName}
            </div>
        ))}
    </div>
  )
}

export default AdminUsers