import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {Card, CardBody, CardTitle, Tooltip} from "mdbreact";
import chunks from 'array.chunk';

import baseUri from "../config/config";

class Europe extends React.Component {

    constructor(props) {
        super(props);

        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        let country = props.match.params.country ? props.match.params.country.toUpperCase() : 'EU';

        this.state = {
            country,
            games: [],
            discounts: [],
            done: false,
            baseUri,
            axiosSource: source
        };
    }

    getMetacriticScores(){
        this.state.discounts.forEach((game) => {
            // console.log(`${this.state.baseUri}getMetacriticScores/${game.title}`);

            axios.get(`${this.state.baseUri}getMetacriticScores/${game.title}`, {cancelToken: this.state.axiosSource.token})
                .then(response => {
                    // handle success
                    // console.log("getMetacriticScores ",game.title, response.data);

                    let discounts = this.state.discounts;
                    discounts.forEach((discount) => {
                        if(discount.nsuid_txt[0] === game.nsuid_txt[0]){
                            // console.log(game.title, response.data);
                            discount.scores = response.data;
                        }
                    });

                    // console.log("discounted games with scores", discounts);
                    this.setState({discounts: discounts});
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        });

    }

    getEuropePrices(){
        let offset = 0;

        let gameIds = [];
        gameIds.push(this.state.games.map((game) => {
            return game.nsuid_txt[0];
        }));

        // Convert large array of ids in chunks
        gameIds = gameIds[0];
        gameIds = chunks(gameIds, 100);

        let country = this.state.country === 'EU' ? 'FR' : this.state.country;

        let allAxios = [];
        gameIds.forEach((chunk) => {
            // console.log(chunk.join(','));

            allAxios.push(
                axios.get(`${this.state.baseUri}getPrices/${country}/${chunk.join(",")}/${offset}`, {cancelToken: this.state.axiosSource.token})
                    .then(response => {
                        // handle success
                        // console.log("getEuropePrices ", response.data);

                        let prices = (response.data.filter((price) => {
                            return price.discount_price !== undefined
                        }));
                        console.log("discounted prices ", prices);

                        let games = [];
                        games = (
                            this.state.games.filter((game) => {
                                games.scores = {};
                                games.scores.metascore = "";
                                games.scores.userscore = "";

                                // If game's price has not been already set in precedent chunk
                                if(game.price === undefined){
                                    game.price = prices.filter((price) => {
                                        // console.log(price);
                                        return Number(price.title_id) === Number(game.nsuid_txt[0]);
                                    });

                                    if(game.price.length === 0){
                                        game.price = undefined;
                                    }
                                    else{
                                        game.price = game.price[0];
                                    }

                                    return game.price !== undefined;
                                }

                                return false;
                            })
                        );
                        console.log("discounted games ",games);

                        let tmp = [...this.state.discounts, ...games];
                        this.setState({discounts: tmp});

                        // this.getMetacriticScores();
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    })
            );

        });

        axios.all(allAxios)
            .then(axios.spread((acct, perms) => {
                // Both requests are now complete
                this.setState({done: true});
                this.getMetacriticScores();
            }));

        return;
    };

    getEuropeGames() {
        this.setState({done: false});
        this.setState({games: []});
        this.setState({discounts: []});

        let limit  = 0; // 0 means no limit
        let offset = 0;
        axios.get(`${this.state.baseUri}getEuropeGames/${limit}/${offset}`, {cancelToken: this.state.axiosSource.token})
            .then(response => {
                // handle success
                console.log("getEuropeGames ",response);

                let games = {games: response.data};
                this.setState({...games});

                this.getEuropePrices();
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
        ;
    }

    componentWillUnmount(){
        this.state.axiosSource.cancel('Requests cancelled because of unmounted component')
    }

    componentDidMount() {
        this.getEuropeGames();
        document.title = "Nintendo Deals - Europe"
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        // console.log("props", this.props);
        // console.log("prevProps", prevProps);

        // Reload when country change but region remain
        if(this.props.match.params.country.toUpperCase() !== prevProps.match.params.country.toUpperCase()){
            this.setState({country: this.props.match.params.country.toUpperCase()}, (() => {
                this.getEuropeGames();
            }));
        }
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col">
                        <h1 className={"display-3"}>
                            {this.state.country === 'EU' && "Euro zone"}
                            {this.state.country === 'GB' && "Great Britain"}
                            {this.state.country === 'RU' && "Russia"}
                            {this.state.country !== 'EU' && this.state.country !== 'GB' && this.state.country !== 'RU' && this.state.country}
                        </h1>

                        {this.state.done && this.state.discounts.length > 0 && <p className="lead">
                            Found {this.state.discounts.length} discounts over {this.state.games.length} games
                        </p>}

                        <div className="text-center">
                            {!this.state.done && <i className="fa fa-circle-o-notch fa-spin fa-fw fa-3x"/>}
                        </div>

                        {this.state.done && this.state.games.length === 0 && <Card color="info-color" text="white">
                            <CardBody className="p-3">
                                <CardTitle tag="h5">Uh oh</CardTitle>
                                That's embarrassing but we didn't found any games for this country... <br/>
                                Please try again later or with a different country
                            </CardBody>
                        </Card>}

                        {this.state.done && this.state.discounts.length === 0 && <Card color="info-color" text="white">
                            <CardBody className="p-3">
                                <CardTitle tag="h5">Uh oh</CardTitle>
                                That's embarrassing but we didn't found any discounts at this moment... <br/>
                                Please try again later
                            </CardBody>
                        </Card>}

                        {this.state.discounts.length > 0 && <div className={"table-responsive"}>
                            <table className={"table table-hover"}>
                                <thead>
                                <tr>
                                    <th>{/*Image*/}</th>
                                    <th>Game</th>
                                    <th>Discount Price</th>
                                    <th>Regular Price</th>
                                    <th>Discount</th>
                                    <th>Expiration</th>
                                    <th>{/*Icon*/}</th>
                                    <th>Players</th>
                                    <th>Metascore</th>
                                    <th>Userscore</th>
                                </tr>
                                </thead>

                                <tbody>
                                {this.state.discounts.sort((a,b) => {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);} ).map((game) => {
                                    return (
                                        <tr key={game.nsuid_txt[0]}>
                                            <td className={"p-1 align-middle"}>
                                                <div className={"-rounded-circle"} style={{width: "65px", height: "65px", backgroundImage: `url(${game.image_url})`, backgroundSize: "75px", backgroundPosition: "center", backgroundRepeat: "no-repeat"}}/>
                                            </td>
                                            <td className={"align-middle"}>
                                                {game.title}
                                            </td>
                                            <td className={"align-middle"}>
                                                <span className={"font-weight-bold"}>{game.price.discount_price.currency} {game.price.discount_price.raw_value}</span>
                                            </td>
                                            <td className={"align-middle"}>
                                                <del>{game.price.regular_price.currency} {game.price.regular_price.raw_value}</del>
                                            </td>
                                            <td className={"align-middle"}>
                                                <span className={"red-text font-weight-bold"}>{Math.round(100 * (1 - (game.price.discount_price.raw_value / game.price.regular_price.raw_value)))}%</span>
                                            </td>
                                            <td className={"align-middle"}>
                                                {moment(game.price.discount_price.end_datetime).fromNow()}
                                                <br/>
                                                <small className={"text-muted"}>{moment(game.price.discount_price.end_datetime).format("Do MMM")}</small>
                                            </td>
                                            <td className={"align-middle"}>
                                                {moment(game.price.discount_price.end_datetime).isBefore(moment().add(2, 'days')) &&
                                                moment(game.price.discount_price.end_datetime).isAfter(moment().add(1, 'days'))&& <Tooltip
                                                    placement="top"
                                                    component="i"
                                                    componentClass="fa fa-exclamation-circle orange-text fa-lg"
                                                    tag="div"
                                                    tooltipContent="Less than 48h"/>
                                                }

                                                {moment(game.price.discount_price.end_datetime).isBefore(moment().add(1, 'days')) && <Tooltip
                                                    placement="top"
                                                    component="i"
                                                    componentClass="fa fa-exclamation-circle red-text fa-lg"
                                                    tag="div"
                                                    tooltipContent="Less than 24h"/>
                                                }
                                            </td>
                                            <td className={"align-middle"}>
                                                {game.players_to}
                                            </td>
                                            <td className={"align-middle"}>
                                                {game.scores !== undefined ? game.scores.metascore : <i className="fa fa-circle-o-notch fa-spin fa-fw"/>}
                                            </td>
                                            <td className={"align-middle"}>
                                                {game.scores !== undefined ? game.scores.userscore : <i className="fa fa-circle-o-notch fa-spin fa-fw"/>}
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }
}

export default Europe;