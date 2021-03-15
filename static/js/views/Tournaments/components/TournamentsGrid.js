/* eslint-disable */

import React, {
    useCallback
} from "react";
import {
    NavLink
} from "react-router-dom";
import styles from "./TournamentsGrid.module.scss";
import Status from "../../../components/Tournaments/Status";
import * as moment from "moment";
import Button from "react-bootstrap/Button";
import {
    useDispatch,
    useSelector
} from "react-redux";
import * as Actions from "../store/actions";
import Skeleton from "@material-ui/lab/Skeleton";
import Spinner from "react-bootstrap/Spinner";
import TournamentFilters from "./TournamentFilters";
import CurrencyWrapper from "components/CurrencyWrapper/CurrencyWrapper";
import GroupIcon from '@material-ui/icons/Group';
import ProgressBar from 'react-bootstrap/ProgressBar'
import TournamentsBannerSlider from "./TournamentsBannerSlider";
import withSizes from "react-sizes";
import ArrowRight from "assets/images/arrowRight.svg";
import _ from "lodash";
import {
    useHistory
} from "react-router-dom";
import {
    add3Dots
} from "../../../functions/formatters";
import * as AppActions from '../../../store/actions'

const TournamentsGrid = (props) => {
    const dispatch = useDispatch();
    let history = useHistory();

    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageLimit, setPageLimit] = React.useState(20);
    const [loading, setLoading] = React.useState(false);
    const [inprogress, setInprogress] = React.useState(false);
    const [searchVal, setSearchVal] = React.useState("")
    const loggedInUser = useSelector(({
        core
    }) => core.appStore.loggedInUser);

    const tournamentListData = useSelector(
        ({
            TournamentAppStore
        }) => TournamentAppStore.tournamentApp.tournaments
    );
    // const filterStatus = useSelector(
    //   ({ TournamentAppStore }) => TournamentAppStore.tournamentApp.filterStatus
    // );
    const game = useSelector(
        ({
            TournamentAppStore
        }) => TournamentAppStore.tournamentApp.game
    );
    // const selectedGame = useSelector(({ core }) => core.appStore.selectedGame);

    const filterGameOptions = useSelector(
        ({
            core
        }) => core.appStore.filterGameOptions
    );
    const platforms = useSelector(
        ({
            TournamentAppStore
        }) => TournamentAppStore.tournamentApp.platforms
    );

    const tournamentsCount = useSelector(
        ({
            TournamentAppStore
        }) =>
        TournamentAppStore.tournamentApp.tournamentsCount
    );

    const [filters, setFilters] = React.useState([]);

    React.useEffect(() => {


        // if (selectedGame) {
        //   const filter = [
        //     {
        //       name: 'Games',
        //       options: filterGameOptions,
        //       selected: selectedGame
        //     }
        //   ];
        //   getFilterData(filter);
        //   return;
        // }



        if (!tournamentListData) {
            setInprogress(true);
            setLoading(true);
            dispatch(Actions.getTournmentList(currentPage, pageLimit)).then(
                (response) => {
                    setLoading(false);
                    setInprogress(false);
                }
            );
        }
    }, [dispatch]);



    function getMoreTournaments() {
        setLoading(true);
        var form_data = new FormData();
        form_data.append("filters", JSON.stringify(filters));
        dispatch(Actions.getTournmentList(currentPage + 1, pageLimit, form_data, searchVal, false)).then(
            (response) => {
                setLoading(false);
                setCurrentPage(currentPage + 1);
            }
        );
    }

    function searchTournament(value) {
        setSearchVal(value)
        getFilterData(filters, value)
    }

    function resetAllFilter() {
        setInprogress(true);
        setLoading(true);
        setSearchVal("")
        setCurrentPage(1);
        setFilters()
        dispatch(Actions.getTournmentList(1, pageLimit, "", "", true)).then(
            (response) => {
                setLoading(false);
                setInprogress(false);
            }
        );
    }

    const delayedQuery = useCallback(_.debounce((applyFilters, searchText) => {
        var form_data = new FormData();
        form_data.append("filters", JSON.stringify(applyFilters));
        dispatch(Actions.getTournmentList(1, pageLimit, form_data, searchText, true)).then((response) => {
            setLoading(false);
            setInprogress(false);
        });
    }, 500), []);

    function getFilterData(applyFilters, searchText) {
        setCurrentPage(1);
        setFilters(applyFilters);
        setLoading(true);
        setInprogress(true);
        delayedQuery(applyFilters, searchText)
    }


    return ( <
        div className = {
            styles.container
        } >
        <
        div className = {
            styles.pageTitle
        } > Tournaments < /div> <
        TournamentsBannerSlider / > {
            game && platforms && ( <
                TournamentFilters getFilterData = {
                    getFilterData
                }
                platforms = {
                    platforms
                }
                searchTournament = {
                    searchTournament
                }
                searchVal = {
                    searchVal
                }
                resetAllFilter = {
                    resetAllFilter
                }
                />
            )
        }

        {
            tournamentListData && tournamentListData.length > 0 ?
                <
                >
                <
                div className = {
                    styles.fatchingDataProgress
                } > {
                    loading &&
                    <
                    span >
                    <
                    Spinner
                    as = "span"
                    animation = "grow"
                    size = "sm"
                    role = "status"
                    aria - hidden = "true" /
                    >
                    Fetching data...
                    <
                    /span>
                } <
                /div>


            {
                /* {!props.isMobile &&
                            <hr className={styles.solid} />
                          } */
            } <
            div className = {
                    styles.grid
                } > {
                    tournamentListData.map((tournament, index) => ( <
                        div className = {
                            styles.card
                        }
                        key = {
                            index
                        } > {
                            tournament ? ( <
                                NavLink to = {
                                    `/tournaments/${tournament.hash_id}`
                                } >
                                <
                                div className = {
                                    styles.img
                                } > {
                                    tournament.images.arena_small_image_url && ( <
                                        img src = {
                                            tournament.images.arena_small_image_url
                                        }
                                        alt = "Tournament" / >
                                    )
                                } <
                                div className = {
                                    `${styles.tournamentEntry} ${tournament.labelType === "GA+" ? styles.gaPlus : ''} ${tournament.labelType === "FREE" ? styles.free : ''} ${tournament.labelType === "PAYABLE" ? styles.payable : ''}`
                                } >
                                <
                                span > {
                                    tournament.labelType === "PAYABLE" ?

                                    <
                                    > {
                                        tournament.entry_fee_type === "Amount Based" ?
                                        <
                                        > {
                                            tournament.pricePool.replace(/,/g, '') != 0.00 &&
                                            <
                                            > {
                                                loggedInUser && loggedInUser.gamerzarena_plus ?
                                                <
                                                >
                                                <
                                                del > < CurrencyWrapper amount = {
                                                    tournament.entry_fee.replace(/,/g, '') || 0
                                                }
                                                /></del >
                                                <
                                                /> :
                                                    <
                                                    >
                                                    <
                                                    CurrencyWrapper amount = {
                                                        tournament.entry_fee.replace(/,/g, '') || 0
                                                    }
                                                /> /
                                                Entry <
                                                />
                                            } <
                                            />
                                        } <
                                        /> :
                                            <
                                            > {
                                                loggedInUser && loggedInUser.gamerzarena_plus ?
                                                <
                                                >
                                                <
                                                del > {
                                                    tournament.entry_fee
                                                }
                                                Pts < /del> <
                                                /> :
                                                    `${tournament.entry_fee}Pts/Entry`
                                            } <
                                            />
                                    } <
                                    /> :
                                        tournament.labelType
                                } <
                                /span> <
                                /div> { /* <NavLink to={`/tournaments/${tournament.hash_id}`}></NavLink> */ } <
                                /div> <
                                div className = {
                                    styles.content
                                } >
                                <
                                div className = {
                                    styles.name
                                } >
                                <
                                span className = {
                                    styles.title
                                }
                                title = {
                                    tournament.name
                                } > {
                                    add3Dots(tournament.name, 60)
                                } < /span> <
                                /div> <
                                h3 className = {
                                    styles.contestType
                                } > {
                                    tournament.stream_type
                                }• {
                                    tournament.customStatus
                                } < /h3>

                                <
                                div className = {
                                    styles.ongoing
                                } > { /* <span >{tournament.customStatus}</span> */ } <
                                ProgressBar className = {
                                    styles.progress
                                }
                                now = {
                                    tournament.on_going_percentage
                                }
                                /> <
                                /div>

                                <
                                div className = {
                                    styles.date
                                } >
                                <
                                span > {
                                    moment.utc(tournament.date, "YYYY-MM-DD HH:mm:ss").local().format(" D MMM 'YY h:mm A")
                                } < /span> <
                                img src = {
                                    ArrowRight
                                }
                                alt = "ArrowRight" / >
                                <
                                span > {
                                    moment.utc(tournament.endDate, "YYYY-MM-DD HH:mm:ss").local().format(" D MMM 'YY h:mm A")
                                } <
                                /span> <
                                /div>

                                <
                                div className = {
                                    styles.platformIcon
                                } > {
                                    tournament.platforms.map((item, i) =>
                                        // <object  key={i}  data={item.image_url} type="image/svg+xml" title={item.name}>
                                        item.image_url &&
                                        <
                                        img key = {
                                            i
                                        }
                                        src = {
                                            item.image_url
                                        }
                                        title = {
                                            item.name
                                        }
                                        alt = {
                                            item.name
                                        }
                                        />
                                        // </object>
                                    )
                                } <
                                /div> <
                                /div> <
                                div className = {
                                    styles.footer
                                } >
                                <
                                div className = {
                                    styles.leftSide
                                } >
                                <
                                GroupIcon / >
                                <
                                span className = {
                                    styles.userCount
                                }
                                title = {
                                    tournament.entries_count + " Entries"
                                } > {
                                    tournament.entries_count
                                } <
                                /span> <
                                /div> <
                                div className = {
                                    styles.rightSide
                                } > {
                                    tournament.prizeType !== "Merchandise" && ( <
                                        >
                                        <
                                        span className = {
                                            styles.prizeLabel
                                        } > Prize: < /span> {
                                            tournament.prizeType === "Amount Based" ? ( <
                                                > {
                                                    tournament.pricePool.replace(/,/g, '') != 0.00 &&
                                                    <
                                                    span className = {
                                                        styles.prize
                                                    } >
                                                    <
                                                    CurrencyWrapper amount = {
                                                        tournament.pricePool.replace(/,/g, '') || 0
                                                    }
                                                    /> <
                                                    /span>
                                                } <
                                                />
                                            ) : ( <
                                                span className = {
                                                    styles.prize
                                                } > {
                                                    tournament.pricePool
                                                } < /span>
                                            )
                                        } <
                                        />
                                    )
                                } <
                                /div> <
                                /div> <
                                /NavLink>
                            ) : ( <
                                >
                                <
                                div className = {
                                    styles.img
                                } >
                                <
                                Skeleton animation = "wave"
                                variant = "rect"
                                className = {
                                    styles.imgSkeleton
                                }
                                /> <
                                /div> <
                                div className = {
                                    styles.content
                                } >
                                <
                                div className = {
                                    styles.title
                                } >
                                <
                                Skeleton animation = "wave"
                                height = {
                                    10
                                }
                                width = "40%" / >
                                <
                                /div> <
                                NavLink to = {
                                    `/`
                                } >
                                <
                                h2 >
                                <
                                Skeleton animation = "wave"
                                height = {
                                    10
                                }
                                width = "80%" / >
                                <
                                /h2> <
                                /NavLink> <
                                h3 >
                                <
                                Skeleton animation = "wave"
                                height = {
                                    10
                                }
                                width = "80%" / >
                                <
                                /h3> <
                                /div> <
                                />
                            )
                        } <
                        /div>
                    ))
                } <
                /div>

            {
                tournamentListData && tournamentListData.length < tournamentsCount && ( <
                    div className = {
                        styles.buttonWrapper
                    } > {!loading ? ( <
                            Button variant = "outline-primary"
                            className = "button-shadow"
                            onClick = {
                                getMoreTournaments
                            } >
                            Load More <
                            /Button>
                        ) : ( <
                            Button variant = "outline-primary"
                            className = "button-shadow"
                            disabled >
                            <
                            Spinner as = "span"
                            animation = "grow"
                            size = "sm"
                            role = "status"
                            aria - hidden = "true" /
                            >
                            Loading...
                            <
                            /Button>
                        )
                    } <
                    /div>
                )
            }

            <
            />:
            (!tournamentListData || (tournamentListData && tournamentListData.length === 0)) && !inprogress ?
                <
                h4 className = {
                    styles.noDataFound
                } > No records found! < /h4> :
                <
                div >

                <
                /div>
        } <
        /div>
    );
};


const mapSizesToProps = ({
    width
}) => ({
    isMobile: width < 1000,
});
export default withSizes(mapSizesToProps)(TournamentsGrid);