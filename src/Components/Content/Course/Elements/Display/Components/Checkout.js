import React from 'react'
import AccountElement from './AccountElement'
import Card from './Card'
import ElementDisplayBlock from '../ElementDisplayBlock'

function Checkout({elementData}) {
  return (
    <div>
        <>
            <ElementDisplayBlock
                elementData={{type: "User Data Field", content: "First Name", content3: "firstName", inputSize: "Half"}}
            ></ElementDisplayBlock>
            <ElementDisplayBlock
                elementData={{type: "User Data Field", content: "Last Name", content3: "lastName", inputSize: "Half"}}
            ></ElementDisplayBlock>
            <ElementDisplayBlock
                elementData={{type: "User Data Field", content: "Case Number (optional)", content3: "caseNumber", inputSize: "Half"}}
            ></ElementDisplayBlock>
            <ElementDisplayBlock
                elementData={{type: "User Data Field", content: "Phone", content3: "phone", inputSize: "Half"}}
            ></ElementDisplayBlock>
            <ElementDisplayBlock
                elementData={{type: "User Data Field", content: "Address", content3: "address1", inputSize: "Whole"}}
            ></ElementDisplayBlock>
            <ElementDisplayBlock
                elementData={{type: "User Data Field", content: "How did you find us?", content3: "customerSource", inputSize: "Whole"}}
            ></ElementDisplayBlock>
        </>
        <AccountElement elementData={elementData}></AccountElement>
        <Card elementData={elementData}></Card>
    </div>
  )
}

export default Checkout