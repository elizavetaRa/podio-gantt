import React from 'react'
import axios from 'axios'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

import Auth from './Auth'
import Home from './Home'
import Navigation from './Navigation'
import Profile from './Profile'
import NotFound from './NotFound'
import api from './utils/api'

import UserApps from "./UserApps"
import AppGantt from "./AppGantt"

class Application extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: this._setUser(true),
            userName: undefined,
            apps: [],
            authUrl: "",
            loggedin: false
        }

        this._setUser = this._setUser.bind(this)
        this._resetUser = this._resetUser.bind(this)
    }

    componentWillMount() {

        if (!this.state.loggedin) {
            api.get('/api').then(data => {

                if (data.authUrl) {
                    this.setState({
                        authUrl: data.authUrl
                    })

                } else {
                    this.setState({
                        loggedin: data.loggedin
                    })
                }

                console.log("Loggedin: ", this.state.loggedin)
            })
        }
    }


    componentDidMount() {

        api.get('/api/user').then(user => {

            this.setState({
                userName: user.profile.name
            })
        }).then(() => {

            api.get("/api/apps").then(apps => {
                console.log(apps)
                this.setState({
                    apps: apps
                })
            })
        })

    }

    render() {

        if (!this.state.loggedin) {
            return (
                <BrowserRouter>
                    <div className="container">
                        <a href={this.state.authUrl}>Authentication in Podio</a>
                    </div>
                </BrowserRouter>
            )
        } else {
            return (
                <BrowserRouter>
                    <div className="container">
                        <h1>Hello {this.state.userName}!</h1>
                        <h2>See your apps:</h2>
                        <UserApps apps={this.state.apps} />
                        <Route path="/app/:id/items" render={()=>{
                            return <AppGantt/>
                        }}/>
                    </div>
                </BrowserRouter>
            )

        }
    }

    _resetUser() {
        this.setState({
            user: null,
        })
    }

    _setUser(init) {
        const token = localStorage.getItem('identity')
        if (token) {
            const decoded = jwtDecode(token)
            delete decoded.iat
            if (init) return decoded
            this.setState({ user: decoded })
        } else {
            return null
        }
    }
}

export default Application
