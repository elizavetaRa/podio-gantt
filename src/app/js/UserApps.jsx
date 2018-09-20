import React from 'react';
import { Link } from 'react-router-dom';

const UserApps = props => {

    const apps = props.apps

    const mappedApps = apps.map(app => {
        return (
            <li key={app.app_id}>
                <Link to={`/app/${app.app_id}/items`}>{app.config.name}</Link>
                </li>
        )
    })

    return (
        <div>
            <ul>{mappedApps}</ul>
        </div>
    );
};

export default UserApps;