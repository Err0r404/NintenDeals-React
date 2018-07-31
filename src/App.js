import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import Header from "./component/Header";
import NotFoundPage from "./component/NotFoundPage";
import NorthAmerica from "./component/NorthAmerica";
import Europe from "./component/Europe";
import Asia from "./component/Asia";
import Footer from "./component/Footer";

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Header/>

                        <div className="container pt-3">
                            <Switch>
                                {/*<Redirect from="/" to="/america" exact={true} />*/}
                                <Redirect from="/" to="/north-america/us" exact={true} />

                                {/*<Route path={"/america"} component={America} exact={true}/>*/}
                                {/*<Route path={"/europe"} component={Europe} exact={true}/>*/}
                                {/*<Route path={"/japan"} component={Japan} exact={true}/>*/}

                                <Route path={"/north-america/:country"} component={NorthAmerica}/>
                                <Route path={"/europe/:country"} component={Europe}/>
                                <Route path={"/asia/:country"} component={Asia}/>

                                <Route component={NotFoundPage}/>
                            </Switch>
                        </div>

                    <Footer/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;

