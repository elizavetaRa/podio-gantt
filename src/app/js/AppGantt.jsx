import React, { Component } from 'react';
import projects from "./projects.json";
import TimeLine from "react-gantt-timeline";
import api from './utils/api'

class AppGantt extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            data: []
        }

        //this._setUser = this._setUser.bind(this)
    }


    componentDidMount() {

        api.get(`/api/app/${this.state.id}/items`)
            .then(data => {
                console.log(data.items)

                const newData = data.items.map(proj => {

                    let endField = proj.fields.filter(el=>{
                        return el.label == "Deadline"
                    })

                    let nameField = proj.fields.filter(el=>{
                        return el.label == "Title"
                    })

                    let tageField = proj.fields.filter(el=>{
                        return el.label == "Tage"
                    })

                    console.log("END: ", tageField[0].values[0].value)
                    return ({
                        id: proj.item_id,
                        start: new Date(new Date(endField[0].values[0].start) - (24*60*60*1000)*tageField[0].values[0].value),
                        end: new Date(endField[0].values[0].start),
                        name: nameField[0].values[0].value,

                    })
                })

                console.log("newData", newData)

                this.setState({
                    data: newData
                })
            })



    }


    // tranforming data to format for the TimeLine    


    render() {
        return (
            <div>
                <TimeLine data={this.state.data} mode={"month"} />
            </div>
        );
    }
}

export default AppGantt;

