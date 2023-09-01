import React from 'react'
import "./Card.css"
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useDispatch, useSelector } from 'react-redux'
import { updateCourseInfo } from '../../../../../../App/DbSlice'

/*

https://www.youtube.com/watch?v=AGDaLOawJSc

*/
function Card() {
  const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
  const courseData = useSelector(state => state.dbslice.courseData)
  const coursesData = useSelector(state => state.dbslice.coursesData)
  const dispatcher = useDispatch()

  return (
    <div className='CardMenu'>
      {courseData?.paid ? 
        <div className='paymentCompleteMessage'>
          Payment Complete
        </div>
        :
        <div className='cardMenuInner'>
          <PayPalScriptProvider options={{"client-id": "AQa4_xB8PM--YGfXjgIygo3H6M9rCm7Cvl-4PqYrTx6bGTy2yNKnHfcy7ctIKsfu8XTmdsQHepeLNs62"}}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: coursesData[selectedCourseID]?.price,
                      },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(function (details) {
                  // Used for dev testing
                  alert('Transaction completed by ' + details.payer.name.given_name);
                  
                  // Update the database to show that the user has paid
                  dispatcher(updateCourseInfo({courseID: selectedCourseID, valuesObject: {paid: true}}))

                });
              }}
            ></PayPalButtons>
          </PayPalScriptProvider>      
        </div>
      }
    </div>
  )
}

export default Card