/* eslint-disable */

import React from "react";
import styles from "./TournamentsBannerSlider.module.scss";
import {
    useDispatch,
    useSelector
} from "react-redux";
import Skeleton from "@material-ui/lab/Skeleton";
import CurrencyWrapper from "components/CurrencyWrapper/CurrencyWrapper";
import {
    NavLink
} from "react-router-dom";
import ArrowRight from "assets/images/arrowRight.svg";
import Slider from "react-slick";
import * as moment from "moment";
import {
    useHistory
} from "react-router-dom";

const TournamentsBannerSlider = (props) => {
    let history = useHistory();

    const activeTournaments = useSelector(({
        TournamentAppStore
    }) => TournamentAppStore.tournamentApp.tournamentsLanding);
    const loggedInUser = useSelector(({
        core
    }) => core.appStore.loggedInUser);


    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: 0, //'10px',
        focusOnSelect: true,
        slidesToShow: activeTournaments && activeTournaments.length < 3 ? activeTournaments.length : 2.35,
        autoplay: false,
        speed: 1000,
        nextArrow: '',
        prevArrow: '',
        responsive: [{
                breakpoint: 768,
                settings: {
                    arrows: true,
                    // centerMode: true,
                    // centerPadding: '40px',
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return ( <
        div className = {
            styles.container
        } >
        <
        div className = "TournamentsBannerSlider" >
        <
        Slider { ...settings
        }
        className = {
            styles.gamesSlider
        } > { /* {images.map((image, index) => ( */ } {
            (!activeTournaments ?
                Array.from(new Array(3)) :
                activeTournaments
            ).map((tournament, index) => ( <
                div className = {
                    styles.banner
                }
                key = {
                    index
                } > {
                    tournament ?
                    <
                    NavLink to = {
                        `/tournaments/${tournament.hash_id}`
                    } >

                    <
                    img className = {
                        styles.bannerImg
                    }
                    src = {
                        tournament.images.arena_large_image_url
                    }
                    /> <
                    div className = {
                        styles.overlayText
                    } > { /* {tournament.labelType == 1 && */ } { /* <div className={styles.gaPlus}>{tournament.labelType}</div> */ }

                    <
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
                    /div>

                    <
                    div className = {
                        styles.bottomPart
                    } >
                    <
                    div >
                    <
                    div className = {
                        styles.prizePool
                    } > {
                        tournament.prizeType !== "Merchandise" && ( <
                            > {
                                tournament.prizeType === "Amount Based" ? ( <
                                    > {
                                        tournament.pricePool.replace(/,/g, "") != 0.0 && ( <
                                            CurrencyWrapper amount = {
                                                tournament.pricePool.replace(/,/g, "") || 0
                                            }
                                            />
                                        )
                                    } <
                                    />
                                ) : (
                                    tournament.pricePool
                                )
                            } <
                            />
                        )
                    } <
                    /div>


                    <
                    a >
                    <
                    div className = {
                        styles.tournamentName
                    } > {
                        tournament.name
                    } <
                    /div> <
                    /a>

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
                    /div> <
                    /div>

                    <
                    /div> <
                    /div>

                    <
                    /NavLink>

                    :
                        <
                        >
                        <
                        Skeleton className = {
                            styles.bannerImg
                        }
                    animation = "wave"
                    height = "30vw"
                    width = "100%" / >
                    <
                    />
                } <
                /div>
            ))
        }


        <
        /Slider> <
        /div>

        <
        /div>
    );
};

export default TournamentsBannerSlider;