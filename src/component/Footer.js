import React from 'react';
// import { Col, Container, Row, Footer as MDFooter } from 'mdbreact';

class Footer extends React.Component {
    render(){
        return(
            <footer className="page-footer font-small grey darken-3">
                <div className="footer-copyright text-center py-3">
                    Made with <i className="fa fa-heart red-text ml-1 mr-1"/> by
                    <a href="https://jschmitt.fr"> Julien aka Err0r404</a>
                </div>
            </footer>
        );
    }
}

export default Footer;