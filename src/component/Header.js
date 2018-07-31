import React from 'react';
import {
    Navbar,
    NavbarBrand,
    NavbarNav,
    NavbarToggler,
    Collapse,
    NavItem,
    NavLink,
    Container,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem, /*Dropdown, DropdownToggle, DropdownMenu, DropdownItem*/
} from 'mdbreact';

import logo from '../logo.svg';
import {Link} from "react-router-dom";

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: `/${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}`,
            regions: [
                {
                    name: 'North America',
                    uri: '/north-america/',
                    dropdownOpen: false,
                    countries: [
                        {
                            code: 'us',
                            name: 'United States'
                        },
                        {
                            code: 'ca',
                            name: 'Canada'
                        },
                        {
                            code: 'mx',
                            name: 'Mexico'
                        },
                    ]
                },
                {
                    name: 'Europe',
                    uri: '/europe/',
                    dropdownOpen: false,
                    countries: [
                        {
                            code: 'eu',
                            name: 'Euro zone'
                        },
                        {
                            code: 'gb',
                            name: 'Great Britain'
                        },
                        {
                            code: 'ru',
                            name: 'Russia'
                        },
                    ]
                },
                {
                    name: 'Asia',
                    uri: '/asia/',
                    dropdownOpen: false,
                    countries: [
                        {
                            code: 'jp',
                            name: 'Asia'
                        },
                    ]
                },
            ],
            collapse: false,
            isWideEnough: false,
            dropdownOpen: false
        };

        this.onClick = this.onClick.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    onClick() {
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    toggle(region) {
        region.dropdownOpen = !region.dropdownOpen;
        // console.log(region);

        let tmp = [...this.state.regions, ...region];
        this.setState({regions: tmp});
    }

    handleActiveChange(element){
        let uri = element.target.href.substr(element.target.href.lastIndexOf('/') + 1);
        this.setState({active: `/${uri}`});
    }

    render() {
        return (
            <Navbar color="red accent-4" dark expand="lg">
                <Container>
                    <NavbarBrand tag="span">
                        <Link to="/" className="white-text">
                            <img src={logo} height="30" className="d-inline-block align-top mr-2" alt={"Nintendo Switch logo"}/>
                            <strong>Nintendo Deals</strong>
                        </Link>
                    </NavbarBrand>

                    {!this.state.isWideEnough && <NavbarToggler onClick={this.onClick}/>}

                    <Collapse isOpen={this.state.collapse} navbar>
                        <NavbarNav right>
                            {this.state.regions.map((region) => {
                                return (
                                    <NavItem key={region.uri}>
                                        <Dropdown color="primary">
                                            <DropdownToggle nav caret>{region.name}</DropdownToggle>

                                            <DropdownMenu>
                                                {region.countries.map((country) => {
                                                    return (
                                                        <NavLink key={country.code} to={region.uri+country.code}>
                                                            <DropdownItem>{country.name}</DropdownItem>
                                                        </NavLink>
                                                    )
                                                })}
                                            </DropdownMenu>
                                        </Dropdown>
                                    </NavItem>
                                )
                            })}
                        </NavbarNav>
                    </Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default Header;