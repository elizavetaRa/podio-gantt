import React from 'react'
import axios from 'axios'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import UserApps from "./UserApps"
import Auth from "./Auth"

(function(PodioJS, SessionStore, PlatformConfig) {

    var clientId = PlatformConfig.clientId;
    var platform = new PodioJS({ authType: 'client', clientId: clientId }, { sessionStore: SessionStore });
  
    // will fetch the tokens from the hash fragment
    // and store them in the sessionStore
    if (platform.isAuthenticated()) {
      window.opener.onAuthCompleted();
    } else {
      window.opener.onAuthError();
    }
  
    window.close();
  
  })(PodioJS, SessionStore, PlatformConfig);

class Application extends React.Component {
    componentDidMount() {
        
    }

    render() {
        return (
            <div className="container">
                <Auth/>
                <UserApps/>
            </div>
        )
    }
}

export default Application
