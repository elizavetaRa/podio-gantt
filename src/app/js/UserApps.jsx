import React from 'react';
import { Link } from 'react-router-dom';

const UserApps = props => {

    const apps = props.apps
    const mappedApps = apps.map(app => {


        return (
            <div key={app.app_id}>
                
                <li>
                    <div className="appBox">
                        <Link to={`/app/${app.app_id}/items`}>
                            <h3>{app.config.name}</h3>
                            <p>{app.config.description}</p>
                        </Link>
                        <a href={`${app.link}`}>See on Podio &rarr;</a>
                    </div>
                </li>
            </div>
        )
    })

    return (
        <div className="apps">
            <h2>See your apps: </h2>
            <ul>{mappedApps}</ul>
        </div>
    );
};

export default UserApps;