import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

function Charts() {

    const today = new Date()

    const data = [
        {
            name: today.getDate() - 6,
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: today.getDate() - 5,  
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: today.getDate() - 4,  
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: today.getDate() - 3,  
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: today.getDate() - 2,  
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: today.getDate() - 1,  
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: today.getDate(),  
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
      ];

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
            <hr></hr>
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