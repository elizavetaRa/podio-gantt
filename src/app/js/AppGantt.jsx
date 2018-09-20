import React, { Component } from 'react';
import projects from "./projects.json";
import TimeLine from "react-gantt-timeline";
import api from './utils/api'
import Gantt from '../Gantt';
import Toolbar from './Toolbar';
import MessageArea from './MessageArea';


let data = {
    data: [
        { id: 1, text: 'Task #1', start_date: '15-04-2017', duration: 3, progress: 0.6 },
        { id: 2, text: 'Task #2', start_date: '18-04-2017', duration: 3, progress: 0.4 }
    ],
    links: [
        { id: 1, source: 1, target: 2, type: '0' }
    ]
};

class AppGantt extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            data: [],
            currentZoom: "Days",
            messages: []
        }

        this.handleZoomChange = this.handleZoomChange.bind(this);
        this.logTaskUpdate = this.logTaskUpdate.bind(this);
        this.logLinkUpdate = this.logLinkUpdate.bind(this);

        //this._setUser = this._setUser.bind(this)
    }

    addMessage(message) {
        var messages = this.state.messages.slice();
        var prevKey = messages.length ? messages[0].key : 0;

        messages.unshift({ key: prevKey + 1, message });
        if (messages.length > 40) {
            messages.pop();
        }
        this.setState({ messages });
    }

    logTaskUpdate(id, mode, task) {
        let text = task && task.text ? ` (${task.text})` : '';
        let message = `Task ${mode}: ${id} ${text}`;
        this.addMessage(message);
    }

    logLinkUpdate(id, mode, link) {
        let message = `Link ${mode}: ${id}`;
        if (link) {
            message += ` ( source: ${link.source}, target: ${link.target} )`;
        }
        this.addMessage(message)
    }

    handleZoomChange(zoom) {
        this.setState({
            currentZoom: zoom
        });
    }

    componentDidMount() {

        api.get(`/api/app/${this.state.id}/items`)
            .then(data => {


                const newData = data.items.map(proj => {

                    let endField = proj.fields.filter(el => {
                        return el.label == "Deadline"
                    })

                    let nameField = proj.fields.filter(el => {
                        return el.label == "Title"
                    })

                    let tageField = proj.fields.filter(el => {
                        return el.label == "Tage"
                    })


                    return ({
                        id: proj.item_id,
                        start: new Date(new Date(endField[0].values[0].start) - (24 * 60 * 60 * 1000) * tageField[0].values[0].value),
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


    render() {
        return (
            <div>
                <TimeLine data={this.state.data} mode={"month"} />

                <p>Second Gantt test</p>

                <Toolbar
                    zoom={this.state.currentZoom}
                    onZoomChange={this.handleZoomChange}
                />
                <div className="gantt-container">
                    <Gantt
                        tasks={data}
                        zoom={this.state.currentZoom}
                        onTaskUpdated={this.logTaskUpdate}
                        onLinkUpdated={this.logLinkUpdate}
                    />

                    <MessageArea
                        messages={this.state.messages}
                    />
                </div>
            </div>
        );
    }
}

export default AppGantt;

