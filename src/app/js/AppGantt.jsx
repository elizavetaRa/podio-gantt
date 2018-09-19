import React from 'react';
import projects from "./projects.json";
import TimeLine from "react-gantt-timeline";

const AppGantt = () => {

    
// tranforming data to format for the TimeLine    
const data = projects.map(proj=>{

    return ({
       id: proj.item_id,
       start: new Date(),
       end:  new Date(proj.fields[3].values[0].start),
       name: proj.fields[0].values[0].value

    })
})


console.log(data)
      
    return (
        <div>
            <TimeLine data={data} mode={"month"}/>
        </div>
    );
};

export default AppGantt;