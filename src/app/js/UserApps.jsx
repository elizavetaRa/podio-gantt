import React from 'react';
import { Link } from 'react-router-dom';

const UserApps = props => {

    const apps = props.apps

    const mappedApps = apps.map(app => {


        return (       
                <li key={app.app_id}>
                    <div className="appBox">
                        <Link to={`/app/${app.app_id}/items`}>
                            <h3>{app.config.name}</h3>
                            <p>{app.config.description}</p>
                        </Link>
                        <a href={`${app.link}`}>See on Podio &rarr;</a>
                    </div>
                </li>
        )
    })

    return (
        <div className="apps">
            <ul>{mappedApps}</ul>
        </div>
    );
};

export default UserApps;