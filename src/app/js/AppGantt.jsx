import React, { Component } from 'react';
import projects from "./projects.json";
import TimeLine from "react-gantt-timeline";
import api from './utils/api'
import Gantt from '../Gantt';
import Toolbar from './Toolbar';
import MessageArea from './MessageArea';
import './App.css';
import { Link } from 'react-router-dom';


class AppGantt extends Component {

    constructor(props) {
        super(props)

        console.log("Found apps!", props.apps)
        this.state = {
            id: props.match.params.id,
            data: [],

            currentZoom: "Months",
            app: []
        }



        this.handleZoomChange = this.handleZoomChange.bind(this);
        this.logTaskUpdate = this.logTaskUpdate.bind(this);
        this.logLinkUpdate = this.logLinkUpdate.bind(this);

    }


    //possible functions for future
    logTaskUpdate(id, mode, task) {
        console.log("Task updated")
    }

    logLinkUpdate(id, mode, link) {
        console.log("Link added", link)
        if (link) {
            api.post(`/api/item/${link.target}/${link.source}`).then(
                res => { console.log(res) }
            )
        }

    }

    handleZoomChange(zoom) {
        this.setState({
            currentZoom: zoom
        });
    }

    componentDidMount() {

        let matchedApp = this.props.apps.filter(app => {
            console.log(this.state.id, app.app_id)
            return this.state.id == app.app_id

        })

        console.log("MATCHEDAPP", matchedApp)


        let mappedApp = (
            <div>
                <li>
                    <div className="appBox">
                        <Link to={`/app/${matchedApp[0].app_id}/items`}>
                            <h3>{matchedApp[0].config.name}</h3>
                            <p>{matchedApp[0].config.description}</p>
                        </Link>
                        <a href={`${matchedApp[0].link}`}>See on Podio &rarr;</a>
                    </div>
                </li>
            </div>
        )



        this.setState({

            app: mappedApp
        })

        console.log("mappedAPP", this.state.app)

        api.get(`/api/app/${this.state.id}/items`)
            .then(res => {


                console.log("Recieved data: ", res)

                const newData = res.items.map(proj => {

                    //format properties
                    let endField = proj.fields.filter(el => {
                        return el.label == "Deadline"
                    })

                    let nameField = proj.fields.filter(el => {
                        return el.label == "Title"
                    })

                    let tageField = proj.fields.filter(el => {
                        return el.label == "Tage"
                    })

                    let startDate = new Date(new Date(endField[0].values[0].start) - (24 * 60 * 60 * 1000) * tageField[0].values[0].value)
                    let startDateText = startDate.getUTCFullYear() + "/" +
                        ("0" + (startDate.getUTCMonth() + 1)).slice(-2) + "/" +
                        ("0" + startDate.getUTCDate()).slice(-2) + " " +
                        ("0" + startDate.getUTCHours()).slice(-2) + ":" +
                        ("0" + startDate.getUTCMinutes()).slice(-2)

                    let abteilung = proj.fields.filter(el => {
                        return el.label == "Abteilung"
                    })

                    let abteilungText = abteilung[0].values[0].value.text
                    console.log(abteilungText)

                    let responsible = proj.fields.filter(el => {
                        return el.label == "Responsible"
                    })
                    let respString = ""
                    let arrResponsible = responsible[0].values.forEach(val => {
                        respString = respString + val.name + " "
                    })
                    console.log("RespString: ", respString)

                    return ({

                        id: proj.item_id,
                        text: nameField[0].values[0].value,
                        start_date: new Date(new Date(endField[0].values[0].start) - (24 * 60 * 60 * 1000) * tageField[0].values[0].value),
                        duration: tageField[0].values[0].value,
                        progress: 0,
                        start_string: startDateText,
                        abteilung: abteilungText,
                        readonly: true
                    })

                })
                let linkCounter = 0;
                let newLinks = []
                res.items.forEach(item => {

                    let verbindungField = item.fields.filter(el => {
                        return el.label == "Verbindung"
                    })

                    if (verbindungField.length > 0) {

                        verbindungField[0].values.forEach(value => {
                            newLinks.push({
                                id: linkCounter,
                                source: item.item_id,
                                target: value.value.item_id,
                                type: "2"
                            })

                            linkCounter++
                        })
                    }


                })

                console.log("LIIINKS: ", newLinks)

                const newDataParsed = {
                    data: newData,
                    links: newLinks
                }



                this.setState({
                    data: newDataParsed,
                    data: newDataParsed
                })
            })



    }


    render() {
        console.log(this.props.apps)

        if (this.state.data.length == 0) {

            return (
                <div>
                    <div className="backbutton">
                        <Link to={`/app/`}><button> Back</button></Link>
                    </div>
                    {/*<ul>{mappedApp}</ul>*/}

                    <h2>Wrong format for the gantt chart! Check, if the app has properties "Tage" and "Verbindung".</h2>
                    {/*<TimeLine data={this.state.data} mode={"month"} />*/}
                    <br />
                    <br />

                </div>
            );


        } else {

            return (
                <div>
                    {/*<TimeLine data={this.state.data} mode={"month"} />*/}
                    <div className="backbutton">
                        <Link to={`/app/`}><button> Back</button></Link>
                    </div>
                    <br />
                    <ul>{this.state.app}</ul>
                    <br />
                    <Toolbar
                        zoom={this.state.currentZoom}
                        onZoomChange={this.handleZoomChange}
                    />
                    <div className="gantt-container">
                        <Gantt
                            tasks={this.state.data}
                            zoom={this.state.currentZoom}
                            onTaskUpdated={this.logTaskUpdate}
                            onLinkUpdated={this.logLinkUpdate}
                        />

                    </div>
                </div>
            );
        }

    }
}

export default AppGantt;

