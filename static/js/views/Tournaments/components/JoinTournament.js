/* eslint-disable */

import React from "react";
import {
    useParams,
    NavLink
} from "react-router-dom";
import {
    motion
} from "framer-motion";
import styles from "./JoinTournament.module.scss";
import BackArrow from "../../../assets/images/icons/arrow-back-white.svg";
import JoinOptions from "./JoinOptions";
import JoinIndividual from "./JoinIndividual";
import JoinTeam from "./JoinTeam";
import * as moment from "moment";
import {
    CircularProgress
} from "@material-ui/core";
import history from "../../../history";
import {
    useDispatch,
    useSelector
} from "react-redux";
import * as Actions from "../store/actions";
import * as AppActions from "../../../store/actions";
import CurrencyWrapper from "components/CurrencyWrapper/CurrencyWrapper";
import {
    Helmet
} from "react-helmet";

const JoinTournament = (props) => {
    const dispatch = useDispatch();

    const variants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1
        },
    };

    let {
        tournamentId,
        platform
    } = useParams();

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        dispatch(Actions.getTournmentDetail(tournamentId));
    }, [dispatch, tournamentId]);

    const tournamentDetail = useSelector(
        ({
            TournamentAppStore
        }) =>
        TournamentAppStore.tournamentApp.tournamentDetail
    );
    // const tournamentData = getTournamentHero();
    // if (!tournamentDetail) {
    //   return <CircularProgress disableShrink />;
    // }

    React.useEffect(() => {
        if (tournamentDetail && tournamentDetail.contest) {
            if (!tournamentDetail.contest.isChallenge && tournamentDetail.contest.registration_close_at !== "") {
                const now = +new Date();
                const acceptDate = +moment
                    .utc(
                        tournamentDetail.contest.registration_close_at,
                        "YYYY-MM-DD HH:mm:ss"
                    )
                    .toDate();
                if (now > acceptDate) {
                    if (tournamentDetail.contest.hasBrackets && !tournamentDetail.contest.isEnrolled) {
                        if (tournamentDetail.contest.bracketType === "Closed") {
                            const message =
                                "You are not enrolled to this contest!";
                            dispatch(
                                AppActions.showMessage({
                                    message: message,
                                    variant: "warning",
                                })
                            );
                            history.push(`/tournaments/${tournamentDetail.contest.hash_id}/overview`);
                            return;
                        } else {
                            const message =
                                "Registration deadline passed!, you can not enter this contest anymore";
                            dispatch(
                                AppActions.showMessage({
                                    message: message,
                                    variant: "warning",
                                })
                            );
                            history.push(`/tournaments`);
                            return;
                        }
                    } else if (!tournamentDetail.contest.hasBrackets && !tournamentDetail.contest.isRegistered) {
                        const message =
                            "Registration deadline passed!, you can not enter this contest anymore";
                        dispatch(
                            AppActions.showMessage({
                                message: message,
                                variant: "warning",
                            })
                        );
                        history.push(`/tournaments`);
                        return;
                    }
                } else {
                    setLoading(false);
                }
            }
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [tournamentDetail]);

    return ( <
        > {
            loading ? ( <
                div className = {
                    styles.circularProgress
                } >
                <
                CircularProgress disableShrink / >
                <
                /div>
            ) : ( <
                motion.div initial = "hidden"
                animate = "visible"
                variants = {
                    variants
                }
                className = {
                    styles.content
                } >
                <
                Helmet >
                <
                title > {
                    tournamentDetail ?
                    `Join ${tournamentDetail.contest.game} - GamerzArena` :
                        "Join Tournament - GamerzArena"
                } <
                /title> <
                meta name = "Tournament Join"
                content = "GamerzArena Tournament Join" /
                >
                <
                meta property = "og:title"
                content = "Join Tournament - GamerzArena" / >
                <
                meta property = "og:description"
                content = "Participate in exciting tournaments inside GamerzArena - the world's leading esports platform and community for gamers" /
                >
                <
                meta name = "description"
                content = "Participate in exciting tournaments inside GamerzArena - the world's leading esports platform and community for gamers" /
                >
                <
                meta name = "keywords"
                content = "esports, gamerz, community, playstation, ps4, ps5, xbox, xbox one, xbox series x, xbox series s, pc games, fifa, madden, head to head challenge" /
                >
                <
                meta property = "og:image"
                content = "https://pbs.twimg.com/profile_images/928696631561740288/2dR3FDsz.jpg" /
                >
                <
                /Helmet> <
                div className = {
                    styles.tournamentInfo
                } >
                <
                div className = {
                    styles.tournamentCard
                } >
                <
                h3 style = {
                    {
                        cursor: "pointer"
                    }
                }
                onClick = {
                    () =>
                    history.push(
                        `/tournaments/${tournamentDetail.contest.hash_id}/overview`
                    )
                } >
                Tournament overview <
                /h3> <
                div className = {
                    styles.tournamentCardInner
                } >
                <
                div className = {
                    styles.img
                } >
                <
                img src = {
                    tournamentDetail.contest.largeImg
                }
                alt = "Tournament banner" /
                >
                <
                /div> <
                div className = {
                    styles.textWrapper
                } >
                <
                div className = {
                    styles.text
                } >
                <
                div className = {
                    styles.title
                } >
                <
                h1 > {
                    tournamentDetail.contest.name
                } < /h1> <
                span > {
                    moment(tournamentDetail.contest.date).format("D MMM")
                } <
                /span> <
                /div> <
                h2 > {
                    tournamentDetail.contest.prizeType === "Amount Based" ? ( <
                        > {
                            tournamentDetail.contest.prizePool.total != 0.0 && ( <
                                >
                                Prize pool: {
                                    " "
                                } <
                                CurrencyWrapper amount = {
                                    tournamentDetail.contest.prizePool.total || 0
                                }
                                /> <
                                />
                            )
                        } <
                        />
                    ) : ( <
                        >
                        Prize pool: {
                            " "
                        } {
                            tournamentDetail.contest.prizePool.priceSuffix
                        } {
                            " "
                        } {
                            tournamentDetail.contest.prizePool.total
                        } <
                        />
                    )
                } <
                /h2> <
                p className = "myTestClass"
                dangerouslySetInnerHTML = {
                    {
                        __html: tournamentDetail.contest.introduction,
                    }
                }
                /> <
                /div> <
                /div> <
                /div> <
                /div> <
                NavLink to = "/tournaments" >
                <
                img src = {
                    BackArrow
                }
                alt = "Back arrow" / > All tournaments <
                /NavLink> <
                /div> <
                div className = {
                    styles.joinWrapper
                } > {
                    {
                        team: < JoinTeam / > ,
                        individual: < JoinIndividual / > ,
                    }[props.matchParams.jointTournamentType] || ( <
                        JoinOptions matchParams = {
                            props.matchParams
                        }
                        />
                    )
                } <
                /div> <
                /motion.div>
            )
        } <
        />
    );
};

export default JoinTournament;