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
import '../style/index.scss';
import Logout from './Auth/Logout'

import UserApps from './UserApps'
import AppGantt from './AppGantt'

class Application extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: this._setUser(true),
            userName: undefined,
            apps: [],
            authUrl: '',
            loggedin: false,
        }

        this._setUser = this._setUser.bind(this)
        this._resetUser = this._resetUser.bind(this)
        this._handleLogout = this._handleLogout.bind(this)
    }

    componentWillMount() {
    }
    
    componentDidMount() {
        if (!this.state.loggedin) {
            api.get(`/api${window.location.search}`).then(data => {
                if (data.authUrl) {
                    this.setState({
                        authUrl: data.authUrl,
                    })
                } else {
                    this.setState({
                        loggedin: data.loggedin,
                    })
    
    
                    api.get('/api/user')
                        .then(user => {
                            this.setState({
                                userName: user.profile.name,
                            })
                        })
                        .then(() => {
                            api.get('/api/apps').then(apps => {
    
                                this.setState({
                                    apps: apps,
                                })
                            })
                        })
    
    
    
    
                }
    
    
            })
        }

    }

    _handleLogout(){
        api.get("api/logout").then(res=>{
            console.log("logout")
            window.location = '/'
        })
    }

    render() {
        if (!this.state.loggedin) {
            return (
                <BrowserRouter>
                    <div className="container centered">
                        <div className="appBox">

                            <a href={this.state.authUrl}>


                                <h1>Authentication in Podio &rarr;</h1>
                                <p>Loggen Sie sich ein über Podio.com</p>
                            </a>


                        </div>

                    </div>
                </BrowserRouter>
            )
        } else {
            return (
                <BrowserRouter>
                    <div className="container">
                        <h1>Hello {this.state.userName}!</h1>
                        <button onClick={this._handleLogout}>Logout</button>
                        


                        <Route
                            exact
                            path="/app/"
                            render={() => {
                                return <UserApps apps={this.state.apps} />
                            }}
                        />

                        <Route
                            exact
                            path="/app/:id/items"
                            render={({ match }) => {
                                return <AppGantt match={match} apps={this.state.apps} />
                            }}
                        />
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