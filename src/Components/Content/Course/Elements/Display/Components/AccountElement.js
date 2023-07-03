import React from 'react'
import { useSelector } from 'react-redux'

/*

    maybe modify the other login component to be a general account component
    user this as a wrapper

*/

function AccountElement() {
    const selectedCourseID = useSelector(state => state.dbslice.userID)
  return (
    <div>
        {/* {userID ?
        <>
        </>
        : */}
        <div>
            <div>
                Create an account
            </div>
            <input type="text" placeholder="Email" />
            <input type="text" placeholder="Password" />
            <input type="text" placeholder="Password re-type" />

        </div>
    {/* } */}
        
    </div>
  )
}

export default AccountElement