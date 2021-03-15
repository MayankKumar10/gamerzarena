/* eslint-disable */

import React from "react";
import {
    NavLink,
    Redirect,
    useParams
} from "react-router-dom";
import withSizes from "react-sizes";
import Button from "react-bootstrap/Button";
import {
    motion
} from "framer-motion";
import "moment-timezone";
import * as moment from "moment";
import TournamentOverview from "./TournamentOverview";
import TournamentBrackets from "./TournamentBrackets";
import TournamentLeaderboard from "./TournamentLeaderboard";
import TournamentLivestream from "./TournamentLivestream";
import TournamentParticipants from "./TournamentParticipants";
import SubmitResult from "./SubmitResult";
import $ from "jquery";
import {
    CircularProgress
} from "@material-ui/core";
import {
    useDispatch,
    useSelector
} from "react-redux";
import * as Actions from "../store/actions";
import TournamentDateTime from "components/Tournaments/TournamentDateTime";
import Status from "../../../components/Tournaments/Status";
import Navigation from "../../../components/Tournaments/Navigation";
import * as AppActions from "../../../store/actions";
import {
    useHistory
} from "react-router-dom";
import Modal from 'react-bootstrap/Modal'

import EnterTournamentButton from "./EnterTournamentButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import Countdown, {
    zeroPad,
    calcTimeDelta,
    formatTimeDelta,
} from "react-countdown";

const SingleTournament = (props) => {
    const dispatch = useDispatch();
    let history = useHistory();
    const loggedInUser = useSelector(({
        core
    }) => core.appStore.loggedInUser);


    let {
        tournamentId,
        platform,
        tournamentScreen
    } = useParams();
    const [inProgress, setInProgress] = React.useState(true);

    const variants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1
        },
    };

    const headToHeadRenderer = ({
        completed
    }) => {
        const time = formatTimeDelta(
            calcTimeDelta(
                moment
                .utc(tournamentDetail.contest.accept_by, "YYYY-MM-DD HH:mm:ss")
                .toDate()
            ), {
                zeroPadTime: true,
                daysInHours: true
            }
        );
        if (completed) {
            return ( <
                span > Deadline Passed! < /span>
            );
        } else {
            // Render a countdown
            return ( <
                strong style = {
                    {
                        minWidth: `${props.isMobile ? '165px' : '184px'}`,
                        textAlign: "justify",
                    }
                } >
                {
                    props.isMobile ?
                    `Accept | ${zeroPad(time.hours)}:${zeroPad(time.minutes)}:${zeroPad(
              time.seconds
            )}` :
                        `Accept In ${zeroPad(time.hours)}:${zeroPad(
              time.minutes
            )}:${zeroPad(time.seconds)}`
                } <
                /strong>
            );
        }
    };

    React.useEffect(() => {
        dispatch(Actions.getLeaderboard(tournamentId));
        dispatch(Actions.getBestPlayer(tournamentId));
        dispatch(Actions.getParticipants(tournamentId));
        dispatch(Actions.getTeamRanking(tournamentId));
        dispatch(Actions.getLiveStream(tournamentId));
    }, [dispatch, tournamentId, platform]);

    React.useEffect(() => {
        dispatch(Actions.getTournmentDetail(tournamentId));
    }, []);



    const tournamentDetail = useSelector(
        ({
            TournamentAppStore
        }) =>
        TournamentAppStore.tournamentApp.tournamentDetail
    );


    const participants = useSelector(
        ({
            TournamentAppStore
        }) => TournamentAppStore.tournamentApp.participants
    );
    const liveStreamData = useSelector(
        ({
            TournamentAppStore
        }) => TournamentAppStore.tournamentApp.liveStreamData
    );
    let submitedResults = useSelector(
        ({
            TournamentAppStore
        }) => TournamentAppStore.tournamentApp.submitedResults
    );

    const [submitResults, setSubmitResults] = React.useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(true);
    const [h2HButton, setH2HButton] = React.useState({
        show: false,
        variant: "",
    });
    // const [showDeadline, setShowDeadline] = React.useState(false);
    const [showClosedButton, setShowClosedButton] = React.useState(false);

    const [isAvailable, setIsAvailable] = React.useState({
        overview: false,
        participants: false,
    });
    const [loading, setLoading] = React.useState(true);
    const [runAcceptInterval, setRunAcceptInterval] = React.useState(false);
    const [runStartInterval, setRunStartInterval] = React.useState(false);

    const [isDeadlinePassed, setIsDeadlinePassed] = React.useState({
        status: false,
        type: "",
    });
    const [isUserInformed, setIsUserInformed] = React.useState(false);
    const [isTournamentStarted, setIsTournamentStarted] = React.useState({
        status: false,
        type: ""
    });
    const [uiUpdated, setUiUpdated] = React.useState(false);

    const [acceptDate, setAcceptDate] = React.useState(null);

    React.useEffect(() => {
        if (isDeadlinePassed.status && !isUserInformed) {
            setIsUserInformed(true);
            setRunAcceptInterval(false);
            dispatch(AppActions.resetNotifications());
            setShowSuccessMessage(false);
            dispatch(Actions.getTournmentDetail(tournamentId));
            let data = {
                user_id: loggedInUser ? loggedInUser.id : 0,
                page: 1,
                limit: 10,
            };
            dispatch(AppActions.getNotifications(data));
            isDeadlinePassed.type === "h2h" ? checkHeadToHead() : checkTournament();
        }
    }, [isDeadlinePassed]);

    React.useEffect(() => {
        if (isTournamentStarted.status && !uiUpdated) {
            setUiUpdated(true);
            setRunStartInterval(false);
            dispatch(AppActions.resetNotifications());
            setShowSuccessMessage(false);
            dispatch(Actions.getTournmentDetail(tournamentId));
            let data = {
                user_id: loggedInUser ? loggedInUser.id : 0,
                page: 1,
                limit: 10,
            };
            dispatch(AppActions.getNotifications(data));
            isTournamentStarted.type === "h2h" ? checkHeadToHead() : checkTournament();
        }
    }, [isTournamentStarted]);

    React.useEffect(() => {
        let interval;
        if (runAcceptInterval) {
            interval = setInterval(() => {
                if (!isUserInformed) {
                    const contestType = tournamentDetail.contest.isChallenge ?
                        "h2h" :
                        "tournament";
                    const now = +new Date();
                    const acceptDate =
                        contestType === "h2h" ?
                        +moment
                        .utc(
                            tournamentDetail.contest.accept_by,
                            "YYYY-MM-DD HH:mm:ss"
                        )
                        .toDate() :
                        +moment
                        .utc(
                            tournamentDetail.contest.registration_close_at,
                            "YYYY-MM-DD HH:mm:ss"
                        )
                        .toDate();
                    if (acceptDate && now > acceptDate) {
                        setIsDeadlinePassed({
                            ...isDeadlinePassed,
                            status: true,
                            type: contestType,
                        });
                    }
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [runAcceptInterval]);

    React.useEffect(() => {
        let interval;
        if (runStartInterval) {
            interval = setInterval(() => {
                if (!uiUpdated) {
                    const contestType = tournamentDetail.contest.isChallenge ?
                        "h2h" :
                        "tournament";
                    const now = +new Date();
                    const startDate = +moment
                        .utc(
                            tournamentDetail.contest.date,
                            "YYYY-MM-DD HH:mm:ss"
                        )
                        .toDate();
                    if (startDate && now > startDate) {
                        setIsTournamentStarted({
                            ...isTournamentStarted,
                            status: true,
                            type: contestType,
                        });
                    }
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [runStartInterval]);

    React.useEffect(() => {
        if (
            isAvailable.overview &&
            isAvailable.participants &&
            tournamentId === tournamentDetail.hash_id
        ) {
            setLoading(false);
            if (tournamentDetail.contest.isChallenge) {
                checkHeadToHead();
            } else {
                checkTournament();
            }
        }
    }, [isAvailable]);

    React.useEffect(() => {
        if (submitedResults && submitedResults.length > 0) {
            setSubmitResults(true);
        } else {
            setSubmitResults(false);
        }
    }, [submitedResults]);

    React.useEffect(() => {
        if (participants && participants.players) {
            setIsAvailable({ ...isAvailable,
                participants: true
            });
        }
    }, [participants]);


    const [startDate, setStartDate] = React.useState(false);
    const [endDate, setEndDate] = React.useState(false);
    let now = +new Date();

    const [hasRegistrationDate, setHasRegistrationDate] = React.useState(false);
    const [registerDate, setRegisterDate] = React.useState(null);

    React.useEffect(() => {
        if (tournamentDetail) {
            if (tournamentDetail.contest.status === "cancelled") {
                history.push("/tournaments");
            } else {
                setIsAvailable({ ...isAvailable,
                    overview: true
                });
            }
        }

        if (tournamentDetail && tournamentDetail.contest) {
            setStartDate(+moment.utc(tournamentDetail.contest.date, "YYYY-MM-DD HH:mm:ss").toDate())
            setEndDate(+moment.utc(tournamentDetail.contest.endDate, "YYYY-MM-DD HH:mm:ss").toDate())
        }

        if (tournamentDetail && tournamentDetail.contest.registration_close_at !== "") {
            setHasRegistrationDate(true);
            setRegisterDate(moment.utc(tournamentDetail.contest.registration_close_at, "YYYY-MM-DD HH:mm:ss").toDate());
        }

    }, [tournamentDetail]);

    const checkTournament = () => {
        const hasAcceptDate = tournamentDetail.contest.registration_close_at !== "";
        if (hasAcceptDate) {
            let now = +new Date();
            let acceptDate = +moment
                .utc(
                    tournamentDetail.contest.registration_close_at,
                    "YYYY-MM-DD HH:mm:ss"
                )
                .toDate();
            let endDate = +moment
                .utc(tournamentDetail.contest.endDate, "YYYY-MM-DD HH:mm:ss")
                .toDate();
            if (now < acceptDate) {
                if (loggedInUser && ((tournamentDetail.contest.hasBrackets && !tournamentDetail.contest.isEnrolled && tournamentDetail.contest.bracketType !== "Closed") || (!tournamentDetail.contest.hasBrackets && !tournamentDetail.contest.isRegistered))) {
                    // setShowDeadline(true);
                }
                if ((tournamentDetail.contest.hasBrackets && tournamentDetail.contest.bracketType !== "Closed") || !tournamentDetail.contest.hasBrackets) {
                    setRunAcceptInterval(true);
                }
            }
            if (now < endDate && now > acceptDate) {
                setRunStartInterval(true);
                // setShowDeadline(false);
                if ((tournamentDetail.contest.hasBrackets && !tournamentDetail.contest.isEnrolled) || (!tournamentDetail.contest.hasBrackets && !tournamentDetail.contest.isRegistered)) {
                    const message =
                        "Registration deadline passed!, you can not enter this contest anymore";
                    dispatch(
                        AppActions.showMessage({
                            message: message,
                            variant: "warning"
                        })
                    );
                    setShowClosedButton(true);
                }
            }
        } else {
            let now = +new Date();
            let startDate = +moment
                .utc(tournamentDetail.contest.date, "YYYY-MM-DD HH:mm:ss")
                .toDate();
            if (now < startDate) {
                setRunStartInterval(true);
                // if (tournamentDetail.contest.hasBrackets && tournamentDetail.contest.bracketType === "Closed") {

                // }
            }
            // setShowDeadline(false);
        }
    };

    const checkHeadToHead = () => {
        let now = +new Date();
        let acceptDate = +moment
            .utc(tournamentDetail.contest.accept_by, "YYYY-MM-DD HH:mm:ss")
            .toDate();
        let startDate = +moment
            .utc(tournamentDetail.contest.date, "YYYY-MM-DD HH:mm:ss")
            .toDate();
        let endDate = +moment
            .utc(tournamentDetail.contest.endDate, "YYYY-MM-DD HH:mm:ss")
            .toDate();
        setAcceptDate(
            moment
            .utc(tournamentDetail.contest.accept_by, "YYYY-MM-DD HH:mm:ss")
            .toDate()
        );
        // setShowDeadline(false);
        if (now < acceptDate && !tournamentDetail.contest.isAccepted) {
            if (!loggedInUser) {
                setRunAcceptInterval(true);
            } else if (loggedInUser && loggedInUser.id !== tournamentDetail.contest.host.id) {
                // setShowDeadline(true);
                setRunAcceptInterval(true);
            }
        }
        if (now > acceptDate) {
            // setShowDeadline(false);
            setRunStartInterval(true);
        }
        if (loggedInUser) {
            const isParticipant = participants.players
                .map((player) => player.id)
                .includes(loggedInUser.id);
            if (!isParticipant) {
                const message = "You can not enter this contest";
                dispatch(
                    AppActions.showMessage({
                        message: message,
                        variant: "warning"
                    })
                );
                history.push("/lobby");
                return;
            }
            if (now < acceptDate && !tournamentDetail.contest.isAccepted) {
                setH2HButton({ ...h2HButton,
                    show: true,
                    variant: "accept"
                });
            } else if (
                now < startDate &&
                tournamentDetail.contest.isAccepted &&
                tournamentDetail.contest.host.id !== loggedInUser.id
            ) {
                const message =
                    "You have accepted this challenge. Tournament will start soon";
                if (showSuccessMessage) {
                    dispatch(
                        AppActions.showMessage({
                            message: message,
                            variant: "success"
                        })
                    );
                }
                setH2HButton({ ...h2HButton,
                    show: false,
                    variant: ""
                });
            } else if (
                now > acceptDate &&
                now < endDate &&
                !tournamentDetail.contest.isAccepted
            ) {
                const message = "Deadline Passed! You can not enter this contest anymore";
                dispatch(
                    AppActions.showMessage({
                        message: message,
                        variant: "warning"
                    })
                );
                setH2HButton({ ...h2HButton,
                    show: true,
                    variant: "noAccept"
                });
            }
        } else {
            if (now > acceptDate && now < endDate) {
                const message = "Deadline Passed! You can not enter this contest anymore";
                dispatch(
                    AppActions.showMessage({
                        message: message,
                        variant: "warning"
                    })
                );
                setH2HButton({ ...h2HButton,
                    show: true,
                    variant: "noAccept"
                });
            } else if (now < acceptDate) {
                setH2HButton({ ...h2HButton,
                    show: false,
                    variant: ""
                });
            } else {
                const message = "Deadline Passed! You can not enter this contest anymore";
                dispatch(
                    AppActions.showMessage({
                        message: message,
                        variant: "warning"
                    })
                );
                setH2HButton({ ...h2HButton,
                    show: true,
                    variant: "noAccept"
                });
            }
        }
    };

    // function storePreviousPath() {
    //   dispatch(AppActions.storePreviousPath(window.location.pathname));
    // }

    // function startStreaming() { 
    //   let fd = new FormData();
    //   fd.append('user_id', loggedInUser.id);
    //   fd.append('contest_hash_id', tournamentDetail ? tournamentDetail.hash_id : 0);
    //   fd.append('start_streaming', 1);
    //   dispatch(TournamentActions.joinTournament(fd)).then(function (response) {
    //     if (response.success && response.redirect_url !== undefined) {
    //       dispatch(AppActions.reFatchLogedinUserInfo())
    //       history.push(response.redirect_url);
    //     }
    //   });
    // }

    const acceptChallenge = () => {
        let data = {};
        data.user_id = loggedInUser ? loggedInUser.id : 0;
        data.contest_id = tournamentDetail.contest.id;
        dispatch(AppActions.acceptHeadtoHead(data)).then(function(response) {
            dispatch(AppActions.resetNotifications());
            setShowSuccessMessage(false);
            // setShowDeadline(false);
            dispatch(Actions.getTournmentDetail(tournamentId));
            let data = {
                user_id: loggedInUser ? loggedInUser.id : 0,
                page: 1,
                limit: 10,
            };
            dispatch(AppActions.getNotifications(data));
        });
    };


    return ( <
        > {
            loading ? ( <
                div className = "circularProgress" >
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
                className = "content-right single-tournament" >
                <
                div className = "tournament-header" >
                <
                div className = "title " >
                <
                div className = "backLink"
                onClick = {
                    history.goBack
                } >
                <
                ArrowBackIosIcon fontSize = "small" / > {
                    `back`
                } <
                /div> <
                div >
                <
                h1 > {
                    tournamentDetail.contest ?
                    tournamentDetail.contest.name || "" :
                        ""
                } <
                /h1> <
                /div> <
                /div> <
                div className = "date-time" >
                <
                div className = "status-box" > {
                    tournamentDetail.contest.customStatus !== "" && ( <
                        Status status = {
                            tournamentDetail.contest.customStatus
                        }
                        />
                    )
                } <
                Status status = {
                    tournamentDetail.contest.stream_type
                }
                /> <
                /div> <
                TournamentDateTime date = {
                    tournamentDetail.contest.date
                }
                endDate = {
                    tournamentDetail.contest.endDate
                }
                // acceptDate={tournamentDetail.contest.registration_close_at}
                isChallenge = {
                    tournamentDetail.contest.isChallenge
                }
                isMobile = {
                    props.isMobile
                }
                // showDeadline={showDeadline}
                /> <
                div className = "button-wrapper" > {
                    tournamentDetail.contest.isChallenge ? ( <
                        > {
                            h2HButton.show ? (
                                (h2HButton.variant === "accept" && acceptDate) ? ( <
                                    Button variant = "primary"
                                    onClick = {
                                        acceptChallenge
                                    } >
                                    <
                                    Countdown date = {
                                        acceptDate
                                    }
                                    renderer = {
                                        headToHeadRenderer
                                    }
                                    /> <
                                    /Button>
                                ) : ( <
                                    Button variant = "primary"
                                    disabled >
                                    Deadline Passed <
                                    /Button>
                                )
                            ) : ( <
                                EnterTournamentButton / >
                            )
                        } <
                        />
                    ) : ( <
                        > {
                            showClosedButton ? ( <
                                Button variant = "primary"
                                disabled > {
                                    props.isMobile ? "Closed" : "Registration Closed"
                                } <
                                /Button>
                            ) : ( <
                                EnterTournamentButton / >
                            )
                        } <
                        />
                    )
                }

                {
                    startDate > now &&
                        !tournamentDetail.contest.isRegistered &&
                        hasRegistrationDate && !tournamentDetail.contest.registration.isClosed && tournamentDetail.contest.registration.placesLeft > 1 ?
                        <
                        p >
                        Hurry!!!{
                            tournamentDetail.contest.registration.placesLeft
                        } {
                            tournamentDetail.contest.registration.placesLeft === 1 ? 'place' : `places`
                        }
                    left
                        <
                        /p>:
                        <
                        > {!tournamentDetail.contest.isForGAPlus &&
                            (!loggedInUser || (loggedInUser &&
                                !loggedInUser.gamerzarena_plus)) &&
                            tournamentDetail.contest.entry_fee > 0 &&
                            !tournamentDetail.contest.organization_id &&
                            !tournamentDetail.contest.isChallenge && ( <
                                p >
                                Free
                                for GA < sup > + < /sup> members <
                                /p>
                            )
                        }


                    {
                        tournamentDetail.contest.isForGAPlus &&
                            (!loggedInUser ||
                                (loggedInUser &&
                                    !loggedInUser.gamerzarena_plus)) && ( <
                                p >
                                GA < sup > + < /sup> members only <
                                /p>
                            )
                    } <
                    />
                } <
                /div> <
                /div> <
                div className = "mobile-status-box" > {
                    tournamentDetail.contest.customStatus !== "" && ( <
                        Status status = {
                            tournamentDetail.contest.customStatus
                        }
                        />
                    )
                } <
                Status status = {
                    tournamentDetail.contest.stream_type
                }
                /> <
                /div> <
                /div> <
                div className = "tournament-banner" > {
                    tournamentDetail.contest.images.cover_image_url.endsWith("mp4") && ( <
                        video width = "100%"
                        preload = "none"
                        autoplay = "autoplay"
                        loop = "loop"
                        muted = "muted" >
                        <
                        source src = {
                            tournamentDetail.contest.images.cover_image_url
                        }
                        type = "video/mp4" /
                        >
                        <
                        /video>
                    )
                } {
                    !tournamentDetail.contest.images.cover_image_url.endsWith("mp4") && ( <
                        img src = {
                            tournamentDetail.contest.images.cover_image_url
                        }
                        alt = "Tournament banner" /
                        >
                    )
                } <
                div className = "social" >
                <
                a href = {
                    `http://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
                }
                target = "_blank"
                rel = "noopener noreferrer" >
                <
                i className = "fab fa-facebook-f" > < /i> <
                /a> <
                a href = {
                    `http://twitter.com/intent/tweet?text=GamerzArena - ${tournamentDetail.contest.name}&amp;url=${window.location.href}`
                }
                target = "_blank"
                rel = "noopener noreferrer" >
                <
                i className = "fab fa-twitter" > < /i> <
                /a> <
                /div>

                {
                    tournamentDetail && tournamentDetail.contest.platforms.length > 0 && ( <
                        div className = "platforms" > {
                            tournamentDetail.contest.platforms.map((platform, index) => ( <
                                span key = {
                                    index
                                } > {
                                    platform.name
                                } < /span>
                            ))
                        } <
                        /div>
                    )
                } <
                /div>

                <
                div className = "game-title" > {
                    tournamentDetail.contest !== undefined ?
                    tournamentDetail.contest.name || "" :
                        ""
                } <
                /div>

                <
                Navigation >
                <
                NavLink to = {
                    `/tournaments/${tournamentDetail.hash_id}/overview`
                } >
                Overview <
                /NavLink> <
                NavLink to = {
                    `/tournaments/${tournamentDetail.hash_id}/participants`
                } >
                Participants <
                /NavLink>

                {
                    tournamentDetail.contest.hasBrackets && ( <
                        NavLink to = {
                            `/tournaments/${tournamentDetail.hash_id}/brackets`
                        } >
                        Brackets <
                        /NavLink>
                    )
                }

                {
                    !tournamentDetail.contest.hasBrackets && ( <
                        NavLink to = {
                            `/tournaments/${tournamentDetail.hash_id}/leaderboard`
                        } >
                        Leaderboard <
                        /NavLink>
                    )
                }

                {
                    liveStreamData && liveStreamData.stream_url && ( <
                        NavLink to = {
                            `/tournaments/${tournamentDetail.hash_id}/livestream`
                        } >
                        Livestream <
                        /NavLink>
                    )
                } { /* tournamentDetail.contest.canSubmitScore && */ } {
                    submitResults && ( <
                        NavLink to = {
                            `/tournaments/${tournamentDetail.hash_id}/submit-result`
                        } > {
                            tournamentDetail.contest.stream_type === "untracked" ?
                            "Submit Result" : "Score Card"
                        } <
                        /NavLink>
                    )
                } <
                /Navigation>

                {
                    {
                        overview: ( <
                            TournamentOverview game = {
                                tournamentDetail.contest.game
                            }
                            />
                        ),
                        participants: ( <
                            TournamentParticipants game = {
                                tournamentDetail.contest.game
                            }
                            />
                        ),
                        brackets: ( <
                            TournamentBrackets game = {
                                tournamentDetail.contest.game
                            }
                            />
                        ),
                        leaderboard: ( <
                            TournamentLeaderboard game = {
                                tournamentDetail.contest.game
                            }
                            />
                        ),
                        livestream: ( <
                            TournamentLivestream game = {
                                tournamentDetail.contest.game
                            }
                            />
                        ),
                        "submit-result": ( <
                            SubmitResult game = {
                                tournamentDetail.contest.game
                            }
                            />
                        ),
                    }[tournamentScreen] || ( <
                        Redirect to = {
                            `/tournaments/${tournamentId}/overview`
                        }
                        />
                    )
                } <
                /motion.div>
            )
        }

        <
        />
    );
};

const mapSizesToProps = ({
    width
}) => ({
    isMobile: width < 1000,
});

export default withSizes(mapSizesToProps)(SingleTournament);