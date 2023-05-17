import React, { useState } from 'react'
import HamburgerMenu from '../../../../Utils/HamburgerMenu'
import AdminUserMenu from './DashMenus/AdminUserMenu'
import { setWithPriority } from 'firebase/database'
import Cart from '../../../Menus/Cart/Cart'

function AdminUserTile({userData}) {
    const [showMenu, setShowMenu] = useState(false)

  return (
    <div className='userTile' onClick={()=>setShowMenu(true)}>
        <HamburgerMenu>
            <div className="hamburgerMenuOption" >Edit User Privilages</div>
            <div className="hamburgerMenuOption" >View Course Data</div>                        
        </HamburgerMenu>

        <div className='userTileText'>
          {(userData?.accountData?.firstName || userData?.accountData?.lastName)?
            (userData?.accountData?.firstName + " " + userData?.accountData?.lastName) 
            : 
            (userData?.accountData?.email)
          }
        </div>
        {showMenu && <AdminUserMenu userData={userData} close={()=>setShowMenu(false)}></AdminUserMenu>}
    </div>
  )
}

export default AdminUserTile