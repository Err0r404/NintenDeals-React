import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import Header from "./component/Header";
import NotFoundPage from "./component/NotFoundPage";
import NortAmerica from "./component/America";
import Europe from "./component/Europe";

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Header/>

                    <div className="container pt-3">
                        <Switch>
                            <Redirect from="/" to="/america" exact={true} />
                            <Route path={"/america"} component={NortAmerica} exact={true}/>
                            <Route path={"/europe"} component={Europe} exact={true}/>
                            <Route component={NotFoundPage}/>
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;

