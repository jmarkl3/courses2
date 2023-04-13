import React from 'react'
import "./Checkout.css"
function Checkout({back}) {
  return (
    <div className='checkout'>        
        <div className='checkoutInput'>
            First Name
            <input placeholder='First Name'></input>
        </div>
        <div className='checkoutInput'>
            Last Name
            <input placeholder='First Name'></input>
        </div>   
        <div className='checkoutInput'>
            Case Number (optional)
            <input placeholder='Case Number'></input>
        </div>   
        <div className='checkoutInput'>
            How did you hear about us? (optional)
            <input></input>
        </div>  
        <div className='checkoutInput checkoutInputW100'>
            Address
            <input></input>
        </div>   
        <div className='checkoutInput checkoutInputW100'>
            Address 2
            <input></input>
        </div>   
        <div className='checkoutInput checkoutInputW100'>
            Number
            <input></input>
        </div>   
        <div className='checkoutInput checkoutInputThird'>
            Number 2
            <input></input>
        </div>  
        <div className='checkoutInput checkoutInputThird'>
            Number 3
            <input></input>
        </div>  
        <div className='checkoutInput checkoutInputThird'>
            Number 3
            <input></input>
        </div>  
        <div className='checkoutSubmit'>
            <button onClick={back}>Back</button>    
            <button className='checkoutButton'>Submit</button>    
        </div>    
    </div>
  )
}

export default Checkout