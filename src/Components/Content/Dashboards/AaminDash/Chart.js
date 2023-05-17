import React, { useEffect, useRef, useState } from 'react'
import { Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts'
/*
    eventsObject is an object with 
    {
        date: {
            type: "Event Type (corresponds to dataKey)"
            eventNote: "note"
            userID: <userID>
        },
        ...
    }
*/
function Chart({eventsObject, dataKey, tooltipHeader, title}) {

    const [chartData, setChartData] = useState([])
    const [dateRange, setDateRange] = useState(7)    

    useEffect(()=>{
        generateChartData()
    },[eventsObject, dateRange])

    function generateChartData(){                
        if(typeof eventsObject !== "object") return              

        // Generate an array of date strings
        let dateArray = []
        let date = new Date()
        // Starting at the beginning of the date range
        date.setDate(date.getDate() - (dateRange -1))
        let tempDatestring = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
        for(let i = 0; i < dateRange; i++){
            dateArray.push(tempDatestring)
            // Add a day to the date object
            date.setDate(date.getDate() + 1)
            tempDatestring = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
        }

        // Generate the chard data
        let tempChartData = []

        // Look through the events on those dates
        dateArray.forEach(dateString => {
            let valueOnThisDate = 0  
            let eventsOnThisDate = eventsObject[dateString]            
            if(eventsOnThisDate && typeof eventsOnThisDate === "object"){
                Object.values(eventsOnThisDate).forEach((eventData) => {
                    if(eventData.type === dataKey){                                           
                        valueOnThisDate++
                    }                        
                })
            }
            tempChartData.push({name: dateString, [dataKey]: valueOnThisDate})
        })
        // Put the chart data in state to be displayed by recharts
        setChartData(tempChartData)
    }

    const customDaysRangeInput = useRef()
    function applyCustomDaysRange(){
        let customNDays = Number.parseInt(customDaysRangeInput.current.value)
        if(typeof customNDays !== "number" || customNDays < 2) return
        setDateRange(customNDays)
    }

  return (
    <div className='chartContainer'>
    <h2>
        {title || dataKey}
    </h2>

    <AreaChart
        width={600}
        height={200}
        data={chartData}
        margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
        }}
        >
        <XAxis dataKey="name" angle={325}/>        
        <YAxis />
        <Tooltip content={<CustomTooltip tooltipHeader={tooltipHeader || dataKey}/>}/>
        <Area type="monotone" dataKey={dataKey} stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
    <div className='chartDateRangeButtons'>
        <div className='chartDateRangeBox'>
            <input className='half' placeholder='number of days' ref={customDaysRangeInput}></input>
            <div className='chartDateRangeButton' onClick={applyCustomDaysRange}>Apply</div>
        </div>
        <div className='chartDateRangeButton' onClick={()=>setDateRange(365)}>
            Year
        </div>
        <div className='chartDateRangeButton' onClick={()=>setDateRange(90)}>
            3 Months
        </div>
        <div className='chartDateRangeButton' onClick={()=>setDateRange(30)}>
            Month
        </div>
        <div className='chartDateRangeButton' onClick={()=>setDateRange(7)}>
            Week
        </div>
    </div>
</div>
  )
}
function CustomTooltip(props){
    const { payload, label, active, tooltipHeader } = props

    return(
        <div>
            <p>{`${tooltipHeader}: ${payload && payload[0]?.value}`}</p>
            <p>{`${label}` }</p>            
        </div>
    )
} 
export default Chart