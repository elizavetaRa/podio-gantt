import React from 'react'
import axios from 'axios'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

import Auth from './Auth'
import Home from './Home'
import Navigation from './Navigation'
import Profile from './Profile'
import NotFound from './NotFound'
import api from './utils/api'

import UserApps from "./UserApps"

class Application extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: this._setUser(true),
            userName: undefined,
            apps: []
        }

        this._setUser = this._setUser.bind(this)
        this._resetUser = this._resetUser.bind(this)
    }

    componentDidMount() {
        console.log("App loaded")
        axios.get('/user').then(user => {
            this.setState({
                userName: user.data.profile.name
            })
        }).then(()=>{
            axios.get("/apps").then(apps=>{
                console.log(apps.data)
                this.setState({
                    apps: apps.data
                })
            })
        })
    }

    render() {
        return (
            <BrowserRouter>
                <div className="container">
                    <h1>Hello {this.state.userName}!</h1>
                    <h2>See your apps:</h2>
                    <UserApps apps={this.state.apps}/>
                </div>
            </BrowserRouter>
        )
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
