import React from 'react';
import {Link} from 'react-router-dom';

const NotFoundPage = () => {
    return (
            <div className={"text-center"}>
                <h1 className={"display-3"}>404 - Page not found</h1>
                <Link className={"btn btn-primary waves-effect waves-light"} to="/">Go Back to Homepage</Link>
            </div>
    )
};

export default NotFoundPage;