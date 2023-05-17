import React, { useEffect, useRef, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { onValue } from 'firebase/database'
import { database } from '../../../../App/DbSlice'
import { ref } from 'firebase/database';

function Charts() {

    const today = new Date()

    const data = [
        {
            name: today.getDate() - 6,
            uv: 100,
            pv: 2400,
            amt: 2400,
        },
        {
            name: today.getDate() - 5,  
            uv: 300,
            pv: 1398,
            amt: 2210,
        },
        {
            name: today.getDate() - 4,  
            uv: 800,
            pv: 9800,
            amt: 2290,
        },
        {
            name: today.getDate() - 3,  
            uv: 1400,
            pv: 3908,
            amt: 2000,
        },
        {
            name: today.getDate() - 2,  
            uv: 2890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: today.getDate() - 1,  
            uv: 3690,
            pv: 3800,
            amt: 2500,
        },
        {
            name: today.getDate(),  
            uv: 7290,
            pv: 4300,
            amt: 2100,
        },
      ];

      const [newUsersChartData, setNewUsersChartData] = useState([])
      const userEventsRef = useRef({})

      useEffect(()=>{
        loadEvents()
      },[])
    
      function loadEvents(){
  
        onValue(ref(database, 'coursesApp'), (snapshot) => {
            userEventsRef.current = snapshot.val()
            setNewUsersChartData(generateChartData("New Users"))
        })

      }
      function generateChartData(eventTypeName){
        if(typeof userEventsRef.current !== "object") return

        let dateRange = 30
        
        // Generate an array of date strings
        let dateArray = []
        let date = new Date()
        let tempDatestring = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
        for(let i = 0; i < dateRange; i++){
            dateArray.push(tempDatestring)
            date.setDate(date.getDate() - 1)
            tempDatestring = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
        }

        // Generate the chard data
        let tempChartData = []

        // Look through the events on those dates
        dateArray.forEach(dateString => {
            let valueOnThisDate = 0  
            let eventsOnThisDate = userEventsRef.current[dateString]
            if(eventsOnThisDate && typeof eventsOnThisDate === "object"){
                Object.values(eventsOnThisDate).forEach((eventData) => {
                    if(eventData.type === eventTypeName){
                        valueOnThisDate++
                    }                        
                })
            }
            tempChartData.push({name: dateString, [eventTypeName]: 0})
        })

        return tempChartData

      }

  return (
    <div className='charts'>
        {/* <h3>
            Charts
        </h3> */}
        <hr></hr>
        <div className='chartContainer'>
            New Users
            <AreaChart
                width={600}
                height={200}
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
                >
                <XAxis dataKey="name" >
                    <Label 
                        style={{
                            marginTop: "20px",
                            paddingTop: "20px",
                            color: "blue",
                            backgroundColor: "blue",
                            height: "100px",
                        }}
                        value={"date"}
                        angle={0}
                    ></Label>
                </XAxis>
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </div>
        <div className='chartContainer'>
            New Users New
            <AreaChart
                width={600}
                height={200}
                data={newUsersChartData}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
                >
                <XAxis dataKey="name" >
                    <Label 
                        style={{
                            marginTop: "20px",
                            paddingTop: "20px",
                            color: "blue",
                            backgroundColor: "blue",
                            height: "100px",
                        }}
                        value={"date"}
                        angle={0}
                    ></Label>
                </XAxis>
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="New Users" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </div>
        <div className='chartContainer'>            
            New Spent
            <AreaChart
                width={600}
                height={200}
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
                >
                <XAxis dataKey="name" >
                    <Label 
                        style={{
                            marginTop: "20px",
                            paddingTop: "20px",
                            color: "blue",
                            backgroundColor: "blue",
                            height: "100px",
                        }}
                        value={"date"}
                        angle={0}
                    ></Label>
                </XAxis>
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </div>
    </div>
  )
}

export default Charts