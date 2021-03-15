/* eslint-disable */

import React from "react";
import withSizes from "react-sizes";
import {
    NavLink,
    Redirect,
    useParams
} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {
    useDispatch,
    useSelector
} from "react-redux";
import * as moment from "moment";
import * as AppActions from "../../../store/actions";
import history from "../../../history";
import * as TournamentActions from "../../Tournaments/store/actions";
import styles from "./EnterTournamentButton.module.scss";
import CurrencyWrapper from "components/CurrencyWrapper/CurrencyWrapper";
import Countdown, {
    zeroPad,
    calcTimeDelta,
    formatTimeDelta,
} from "react-countdown";
import Modal from 'react-bootstrap/Modal'
import {
    set
} from "react-ga";

import StreamUrlModel from './StreamUrlModel'

function EnterTournamentButton(props) {
    const dispatch = useDispatch();
    let {
        tournamentId
    } = useParams();
    const loggedInUser = useSelector(({
        core
    }) => core.appStore.loggedInUser);

    const tournamentDetail = useSelector(
        ({
            TournamentAppStore
        }) =>
        TournamentAppStore.tournamentApp.tournamentDetail
    );
    const submitedResults = useSelector(
        ({
            TournamentAppStore
        }) => TournamentAppStore.tournamentApp.submitedResults
    );

    let now = +new Date();
    let startDate = +moment
        .utc(tournamentDetail.contest.date, "YYYY-MM-DD HH:mm:ss")
        .toDate();
    let endDate = +moment
        .utc(tournamentDetail.contest.endDate, "YYYY-MM-DD HH:mm:ss")
        .toDate();

    const [hasRegistrationDate, setHasRegistrationDate] = React.useState(false);
    const [registerDate, setRegisterDate] = React.useState(null);

    React.useEffect(() => {
        if (
            tournamentDetail && tournamentDetail.contest.registration_close_at !== "") {
            setHasRegistrationDate(true);
            setRegisterDate(
                moment.utc(tournamentDetail.contest.registration_close_at, "YYYY-MM-DD HH:mm:ss").toDate()
            );
        }
    }, [tournamentDetail]);

    const startRenderer = ({
        completed
    }) => {
        const time = formatTimeDelta(calcTimeDelta(moment.utc(tournamentDetail.contest.date, "YYYY-MM-DD HH:mm:ss").toDate()), {
            zeroPadTime: true
        });
        if (completed) {
            return ( <
                span > {
                    props.isMobile ? "00:00:00" : "Starting In 00:00:00"
                } < /span>
            );
        } else {
            // Render a countdown
            return ( <
                strong style = {
                    {
                        minWidth: `${props.isMobile ? "80px" : "199px"}`,
                        textAlign: "justify",
                    }
                } > {
                    props.isMobile ?
                    `${zeroPad(time.days)}:${zeroPad(time.hours)}:${zeroPad(time.minutes)}:${zeroPad(
              time.seconds
            )}` :
                        // `Starting In ${zeroPad(time.hours)}:${zeroPad(time.minutes)}:${zeroPad(time.seconds)}`
                        <
                        >

                        <
                        span > Starting In < /span> <
                        span > {
                            zeroPad(time.days)
                        } < div className = {
                            styles.timerFormate
                        } > d < /div> <
                        /span> <
                        span > {
                            zeroPad(time.hours)
                        } <
                        div className = {
                            styles.timerFormate
                        } > h < /div> <
                        /span> <
                        span > {
                            zeroPad(time.minutes)
                        } <
                        div className = {
                            styles.timerFormate
                        } > m < /div> <
                        /span> {
                            zeroPad(time.seconds)
                        } < div className = {
                            styles.timerFormate
                        } > s < /div> <
                        />
                } <
                /strong>
            );
        }
    };

    const registerRenderer = ({
        completed
    }) => {
        const time = formatTimeDelta(
            calcTimeDelta(moment.utc(tournamentDetail.contest.registration_close_at, "YYYY-MM-DD HH:mm:ss").toDate()), {
                zeroPadTime: true
            }
        );
        const untrackedBracket = (tournamentDetail.contest.hasBrackets && tournamentDetail.contest.stream_type === "untracked");
        if (completed) {
            return ( <
                span > {
                    props.isMobile ? "00:00:00" : "Deadline Passed!"
                } < /span>
            );
        } else {
            // Render a countdown
            return ( <
                strong style = {
                    {
                        minWidth: `${props.isMobile ? !untrackedBracket ? "180px" : "80px" : "194px"}`,
                        textAlign: "justify",
                    }
                } > {
                    props.isMobile ?
                    `${!untrackedBracket ? 'Register |' : ''} ${zeroPad(time.days)}: ${zeroPad(time.hours)}:${zeroPad(time.minutes)}:${zeroPad(
              time.seconds
            )}` :
                        <
                        >
                        <
                        span > Register In < /span> <
                        span > {
                            zeroPad(time.days)
                        } < div className = {
                            styles.timerFormate
                        } > d < /div> <
                        /span> <
                        span > {
                            zeroPad(time.hours)
                        } <
                        div className = {
                            styles.timerFormate
                        } > h < /div> <
                        /span> <
                        span > {
                            zeroPad(time.minutes)
                        } <
                        div className = {
                            styles.timerFormate
                        } > m < /div> <
                        /span> {
                            zeroPad(time.seconds)
                        } < div className = {
                            styles.timerFormate
                        } > s < /div> <
                        />
                } <
                /strong>
            );
        }
    };

    const [submitResults, setSubmitResults] = React.useState(true);
    const [platform, setPlatform] = React.useState(
        tournamentDetail && tournamentDetail.contest.hasBrackets ?
        tournamentDetail.contest.played_platforms[0] :
        null
    );

    React.useEffect(() => {
        if (loggedInUser) {
            dispatch(TournamentActions.getSubmitedResults(tournamentId, platform));
        }
    }, [dispatch, tournamentId, platform]);

    React.useEffect(() => {
        if (submitedResults && submitedResults.length > 0) {
            setSubmitResults(false);
        } else {
            setSubmitResults(true);
        }
    }, [submitedResults]);

    const prefix =
        tournamentDetail.contest.entry_fee_type === "Amount Based" ? "$ " : "";
    const suffix =
        tournamentDetail.contest.entry_fee_type === "Amount Based" ? "" : " Points";

    function storePreviousPath() {
        dispatch(AppActions.storePreviousPath(window.location.pathname));
    }




    const [showStreamUrlModel, setShowStreamUrlModel] = React.useState(false);
    const handleClose = () => setShowStreamUrlModel(false);
    const handleShow = () => setShowStreamUrlModel(true);

    function startStreaming() {
        // setShowStreamUrlModel(true)
        if (tournamentDetail.contest.enable_team_name == 1) {
            history.push(`/tournaments/${tournamentId}/join/team`)
        } else {
            history.push(`/tournaments/${tournamentId}/join/individual`)
        }
    }


    function submitStreamUrl(url) {
        if (tournamentDetail.contest.stream_type === "tracked") {
            dispatch(TournamentActions.verifyStramURL({
                stream_url: url
            })).then(function(response) {
                if (response.success) {
                    startStreamingTemp(url)
                    setShowStreamUrlModel(false)
                } else {
                    dispatch(
                        AppActions.showMessage({
                            message: response.message,
                            variant: "error",
                        })
                    )
                }
            });
        }
    }

    function startStreamingTemp(url) {
        let fd = new FormData();
        fd.append("user_id", loggedInUser.id);
        fd.append("contest_hash_id", tournamentDetail ? tournamentDetail.hash_id : 0);
        fd.append("start_streaming", 1);
        fd.append("stream_url", url);
        dispatch(TournamentActions.joinTournament(fd)).then(function(response) {
            if (response.success && response.redirect_url !== undefined) {
                dispatch(AppActions.reFatchLogedinUserInfo());
                history.push(response.redirect_url);
            }
        });
    }

    function getEntryFee() {
        if (!tournamentDetail.contest.is_re_entry_for_contest) {
            if (tournamentDetail.contest.entry_fee_type === "Amount Based") {
                return ( <
                    CurrencyWrapper amount = {
                        tournamentDetail.contest.entry_fee || 0
                    }
                    />
                );
            } else {
                return prefix + tournamentDetail.contest.entry_fee + suffix;
            }
        } else {
            if (tournamentDetail.contest.entry_fee_type === "Amount Based") {
                return ( <
                    CurrencyWrapper amount = {
                        tournamentDetail.contest.reentry_fee || 0
                    }
                    />
                );
            } else {
                return prefix + tournamentDetail.contest.reentry_fee + suffix;
            }
        }
    }

    function registerTournament() {
        if (tournamentDetail.contest.enable_team_name == 1) {
            history.push(`/tournaments/${tournamentId}/join/team`)
            return false
        }

        let values = {
            user_id: loggedInUser ? loggedInUser.id : 0,
            contest_hash_id: tournamentDetail ? tournamentDetail.hash_id : 0,
            invite_code: "",
            team_name: "",
            gamer_name: loggedInUser ? loggedInUser.name : "",
            timezone: "",
            platform_id: "",
        };

        if (!tournamentDetail.contest.hasBrackets) {
            dispatch(TournamentActions.joinTournament(values)).then(function(response) {
                dispatch(TournamentActions.getTournmentDetail(tournamentId));
            });
        }
    }
    // With Login user
    if (loggedInUser) {
        if (
            tournamentDetail.contest.isForGAPlus === 1 &&
            !loggedInUser.gamerzarena_plus
        ) {
            return ( <
                NavLink className = {
                    styles.cp
                }
                to = {
                    `/profile/${loggedInUser.name}/settings/ga-plus`
                }
                F >
                <
                Button variant = "primary" >
                Join GA < sup > + < /sup> <
                /Button> <
                /NavLink>
            );
        }

        // Tracked tournament
        if (tournamentDetail.contest.stream_type === "tracked") {
            //TRACKED + BRACKET BASE TOURNAMENT
            if (tournamentDetail.contest.hasBrackets) {
                //*************************************************************************** */

                //TEAM BASE CONTEST
                if (tournamentDetail.contest.enable_team_name == 1) {
                    if (!tournamentDetail.contest.isUserHaveAccessToJoinTeamContest) {
                        return ( <
                            Button variant = "primary"
                            disabled >
                            You are in
                            <
                            /Button>
                        );
                    }

                    if (
                        tournamentDetail.contest.isEnrolled &&
                        !tournamentDetail.contest.streamingButtonVisibility
                    ) {
                        return ( <
                            Button variant = "primary"
                            disabled > {
                                tournamentDetail.contest.customStatus === "Ended" ? (
                                    "Ended"
                                ) : now < startDate ? ( <
                                    Countdown date = {
                                        startDate
                                    }
                                    renderer = {
                                        startRenderer
                                    }
                                    daysInHours = {
                                        true
                                    }
                                    />
                                ) : (
                                    tournamentDetail.contest.isStreamedForBracketRound ? "Entry Submitted" : "Starting Soon"
                                )
                            } <
                            /Button>
                        );
                    } else if (!tournamentDetail.contest.isEnrolled &&
                        !tournamentDetail.contest.streamingButtonVisibility &&
                        tournamentDetail.contest.bracketType === "Closed"
                    ) {
                        return ( <
                            Button variant = "primary"
                            disabled >
                            You 're Not In <
                            /Button>
                        );
                    }

                    if (!tournamentDetail.contest.streamingButtonVisibility) {
                        return ( <
                            NavLink className = {
                                styles.cp
                            }
                            to = {
                                `/tournaments/${tournamentId}/join/team`
                            } >
                            {
                                hasRegistrationDate ? ( <
                                    Button variant = "primary" >
                                    <
                                    Countdown date = {
                                        registerDate
                                    }
                                    renderer = {
                                        registerRenderer
                                    }
                                    /> <
                                    /Button>
                                ) : ( <
                                    Button variant = "primary" >
                                    <
                                    > {
                                        loggedInUser.gamerzarena_plus &&
                                        tournamentDetail.contest.organization_id == 0 ? ( <
                                            span >
                                            <
                                            del > {
                                                getEntryFee()
                                            } < /del> {
                                                " Free"
                                            } <
                                            /span>
                                        ) : ( <
                                            span > {
                                                tournamentDetail.contest.entry_fee > 0 ?
                                                getEntryFee() :
                                                    "FREE"
                                            } <
                                            /span>
                                        )
                                    } <
                                    />
                                    Enter <
                                    /Button>
                                )
                            } <
                            /NavLink>
                        );
                    } else if (
                        startDate > now &&
                        tournamentDetail.contest.isEnrolled &&
                        tournamentDetail.contest.streamingButtonVisibility
                    ) {
                        return ( <
                            Button variant = "primary"
                            disabled > {
                                tournamentDetail.contest.customStatus === "Ended" ? (
                                    "Ended"
                                ) : ( <
                                    Countdown date = {
                                        startDate
                                    }
                                    renderer = {
                                        startRenderer
                                    }
                                    daysInHours = {
                                        true
                                    }
                                    />
                                )
                            } <
                            /Button>
                        )
                    }
                }

                //*********************** end ******************************************************* */

                //Tracked + bracket + open
                if (tournamentDetail.contest.bracketType !== "Closed") {
                    if (
                        now < endDate &&
                        !tournamentDetail.contest.streamingButtonVisibility &&
                        !tournamentDetail.contest.isEnrolled &&
                        !tournamentDetail.contest.isClosedEnrolled
                    ) {
                        return ( <
                            NavLink className = {
                                styles.cp
                            }
                            to = {
                                `/tournaments/${tournamentId}/join/individual`
                            } >
                            {
                                hasRegistrationDate ? ( <
                                    Button variant = "primary" >
                                    <
                                    Countdown date = {
                                        registerDate
                                    }
                                    renderer = {
                                        registerRenderer
                                    }
                                    /> <
                                    /Button>
                                ) : ( <
                                    Button variant = "primary" >
                                    <
                                    > {
                                        loggedInUser.gamerzarena_plus &&
                                        tournamentDetail.contest.organization_id == 0 ? ( <
                                            span >
                                            <
                                            del > {
                                                getEntryFee()
                                            } < /del> {
                                                " Free"
                                            } <
                                            /span>
                                        ) : ( <
                                            span > {
                                                tournamentDetail.contest.entry_fee > 0 ?
                                                getEntryFee() :
                                                    "FREE"
                                            } <
                                            /span>
                                        )
                                    } <
                                    />
                                    Enter <
                                    /Button>
                                )
                            } <
                            /NavLink>
                        );
                    } else if (
                        startDate <= now &&
                        now < endDate &&
                        tournamentDetail.contest.isEnrolled &&
                        tournamentDetail.contest.streamingButtonVisibility
                    ) {
                        // first time entry
                        // if (!tournamentDetail.contest.is_re_entry_for_contest) {
                        // GA+ user
                        if (loggedInUser.gamerzarena_plus) {
                            if (tournamentDetail.contest.isForGAPlus == 1) {
                                return ( <
                                    >
                                    <
                                    Button variant = "primary"
                                    onClick = {
                                        () => startStreaming()
                                    } >
                                    Start Streaming <
                                    /Button> <
                                    StreamUrlModel show = {
                                        showStreamUrlModel
                                    }
                                    handleClose = {
                                        handleClose
                                    }
                                    submitStreamUrl = {
                                        submitStreamUrl
                                    }
                                    /> <
                                    />
                                );
                            } else {
                                if (tournamentDetail.contest.organization_id == 0) {
                                    return ( <
                                        >
                                        <
                                        Button variant = "primary"
                                        onClick = {
                                            () => startStreaming()
                                        } > {!tournamentDetail.contest.isEntryFeePaidInBracket && ( <
                                                span > {
                                                    tournamentDetail.contest.entry_fee > 0 ? ( <
                                                        >
                                                        <
                                                        del > {
                                                            getEntryFee()
                                                        } < /del> {
                                                            " Free"
                                                        } <
                                                        />
                                                    ) : (
                                                        "FREE"
                                                    )
                                                } <
                                                /span>
                                            )
                                        }
                                        Start Streaming <
                                        /Button> <
                                        StreamUrlModel show = {
                                            showStreamUrlModel
                                        }
                                        handleClose = {
                                            handleClose
                                        }
                                        submitStreamUrl = {
                                            submitStreamUrl
                                        }
                                        /> <
                                        />
                                    );
                                } else {
                                    return ( <
                                        >
                                        <
                                        Button variant = "primary"
                                        onClick = {
                                            () => startStreaming()
                                        } > {!tournamentDetail.contest.isEntryFeePaidInBracket && ( <
                                                span > {
                                                    tournamentDetail.contest.entry_fee > 0 ?
                                                    getEntryFee() :
                                                        "FREE"
                                                } <
                                                /span>
                                            )
                                        }
                                        Start Streaming <
                                        /Button> <
                                        StreamUrlModel show = {
                                            showStreamUrlModel
                                        }
                                        handleClose = {
                                            handleClose
                                        }
                                        submitStreamUrl = {
                                            submitStreamUrl
                                        }
                                        /> <
                                        />
                                    );
                                }
                            }
                        } else {
                            // non GA+ user
                            if (tournamentDetail.contest.isForGAPlus == 0) {
                                return ( <
                                    >
                                    <
                                    Button variant = "primary"
                                    onClick = {
                                        () => startStreaming()
                                    } > {!tournamentDetail.contest.isEntryFeePaidInBracket && ( <
                                            span > {
                                                tournamentDetail.contest.entry_fee > 0 ?
                                                getEntryFee() :
                                                    "FREE"
                                            } <
                                            /span>
                                        )
                                    }
                                    Start Streaming <
                                    /Button>

                                    <
                                    StreamUrlModel show = {
                                        showStreamUrlModel
                                    }
                                    handleClose = {
                                        handleClose
                                    }
                                    submitStreamUrl = {
                                        submitStreamUrl
                                    }
                                    /> <
                                    />
                                );
                            }
                        }
                        // }
                        // else {
                        //   return (
                        //     <Button variant="primary" onClick={() => startStreaming()}>
                        //       <span>{tournamentDetail.contest.reentry_fee > 0 ?
                        //         getEntryFee()
                        //         : 'FREE'}
                        //       </span>
                        //       Start Streaming
                        //     </Button>
                        //   )
                        // }
                    } else if (
                        startDate > now &&
                        tournamentDetail.contest.isEnrolled &&
                        !tournamentDetail.contest.streamingButtonVisibility
                    ) {
                        return ( <
                            Button variant = "primary"
                            disabled > {
                                tournamentDetail.contest.customStatus === "Ended" ? (
                                    "Ended"
                                ) : ( <
                                    Countdown date = {
                                        startDate
                                    }
                                    renderer = {
                                        startRenderer
                                    }
                                    daysInHours = {
                                        true
                                    }
                                    />
                                )
                            } <
                            /Button>
                        );
                    } else if (
                        startDate > now &&
                        tournamentDetail.contest.isEnrolled &&
                        tournamentDetail.contest.streamingButtonVisibility
                    ) {
                        return ( <
                            Button variant = "primary"
                            disabled > {
                                tournamentDetail.contest.customStatus === "Ended" ? (
                                    "Ended"
                                ) : ( <
                                    Countdown date = {
                                        startDate
                                    }
                                    renderer = {
                                        startRenderer
                                    }
                                    daysInHours = {
                                        true
                                    }
                                    />
                                )
                            } <
                            /Button>
                        );
                    } else if (startDate <= now && now < endDate && tournamentDetail.contest.isEnrolled && !tournamentDetail.contest.streamingButtonVisibility) {
                        return ( <
                            Button variant = "primary"
                            disabled > {
                                tournamentDetail.contest.isStreamedForBracketRound ? "Entry Submitted" : "Starting Soon"
                            } <
                            /Button>
                        )
                    }
                }
                //Tracked + bracket + closed
                else {
                    if (
                        tournamentDetail.contest.isEnrolled &&
                        !tournamentDetail.contest.streamingButtonVisibility
                    ) {
                        return ( <
                            Button variant = "primary"
                            disabled > {
                                tournamentDetail.contest.customStatus === "Ended" ? (
                                    "Ended"
                                ) : now < startDate ? ( <
                                    Countdown date = {
                                        startDate
                                    }
                                    renderer = {
                                        startRenderer
                                    }
                                    daysInHours = {
                                        true
                                    }
                                    />
                                ) : (
                                    tournamentDetail.contest.isStreamedForBracketRound ? "Entry Submitted" : "Starting Soon"
                                )
                            } <
                            /Button>
                        );
                    } else if (!tournamentDetail.contest.isEnrolled &&
                        !tournamentDetail.contest.streamingButtonVisibility
                    ) {
                        return ( <
                            Button variant = "primary"
                            disabled >
                            You 're not In <
                            /Button>
                        );
                    } else if (
                        startDate <= now &&
                        now < endDate &&
                        tournamentDetail.contest.isEnrolled &&
                        tournamentDetail.contest.streamingButtonVisibility
                    ) {
                        if (loggedInUser.gamerzarena_plus) {
                            if (tournamentDetail.contest.isForGAPlus == 1) {
                                return ( <
                                    >
                                    <
                                    Button variant = "primary"
                                    onClick = {
                                        () => startStreaming()
                                    } >
                                    Start Streaming <
                                    /Button> <
                                    StreamUrlModel show = {
                                        showStreamUrlModel
                                    }
                                    handleClose = {
                                        handleClose
                                    }
                                    submitStreamUrl = {
                                        submitStreamUrl
                                    }
                                    /> <
                                    />
                                );
                            } else {
                                if (tournamentDetail.contest.organization_id == 0) {
                                    return ( <
                                        >
                                        <
                                        Button variant = "primary"
                                        onClick = {
                                            () => startStreaming()
                                        } > {!tournamentDetail.contest.isEntryFeePaidInBracket && ( <
                                                span > {
                                                    tournamentDetail.contest.entry_fee > 0 ? ( <
                                                        >
                                                        <
                                                        del > {
                                                            getEntryFee()
                                                        } < /del> {
                                                            " Free"
                                                        } <
                                                        />
                                                    ) : (
                                                        "FREE"
                                                    )
                                                } <
                                                /span>
                                            )
                                        }
                                        Start Streaming <
                                        /Button> <
                                        StreamUrlModel show = {
                                            showStreamUrlModel
                                        }
                                        handleClose = {
                                            handleClose
                                        }
                                        submitStreamUrl = {
                                            submitStreamUrl
                                        }
                                        /> <
                                        />
                                    );
                                } else {
                                    return ( <
                                        >
                                        <
                                        Button variant = "primary"
                                        onClick = {
                                            () => startStreaming()
                                        } > {!tournamentDetail.contest.isEntryFeePaidInBracket && ( <
                                                span > {
                                                    tournamentDetail.contest.entry_fee > 0 ?
                                                    getEntryFee() :
                                                        "FREE"
                                                } <
                                                /span>
                                            )
                                        }
                                        Start Streaming <
                                        /Button> <
                                        StreamUrlModel show = {
                                            showStreamUrlModel
                                        }
                                        handleClose = {
                                            handleClose
                                        }
                                        submitStreamUrl = {
                                            submitStreamUrl
                                        }
                                        /> <
                                        />
                                    );
                                }
                            }
                        } else {
                            if (tournamentDetail.contest.isForGAPlus == 0) {
                                return ( <
                                    >
                                    <
                                    Button variant = "primary"
                                    onClick = {
                                        () => startStreaming()
                                    } > {!tournamentDetail.contest.isEntryFeePaidInBracket && ( <
                                            span > {
                                                tournamentDetail.contest.entry_fee > 0 ?
                                                getEntryFee() :
                                                    "FREE"
                                            } <
                                            /span>
                                        )
                                    }
                                    Start Streaming <
                                    /Button> <
                                    StreamUrlModel show = {
                                        showStreamUrlModel
                                    }
                                    handleClose = {
                                        handleClose
                                    }
                                    submitStreamUrl = {
                                        submitStreamUrl
                                    }
                                    /> <
                                    />
                                );
                            }
                        }
                    } else if (startDate <= now && now < endDate && tournamentDetail.contest.isEnrolled && !tournamentDetail.contest.streamingButtonVisibility) {
                        return ( <
                            Button variant = "primary"
                            disabled >
                            Entry Submitted <
                            /Button>
                        )
                    }
                }
            }
            // TRACKED + STREAM BASE TOURNAMENT
            else {
                if (startDate <= now && now < endDate) {
                    // TRACKED + STREAM BASE + TEAM BASE CONTEST
                    if (tournamentDetail.contest.enable_team_name == 1) {
                        return ( <
                            NavLink className = {
                                styles.cp
                            }
                            to = {
                                `/tournaments/${tournamentId}/join/team`
                            } >
                            <
                            Button variant = "primary" > {
                                tournamentDetail.contest.is_re_entry_for_contest ? ( <
                                    span > {
                                        tournamentDetail.contest.reentry_fee > 0 ?
                                        getEntryFee() :
                                            "FREE"
                                    } <
                                    /span>
                                ) : ( <
                                    > {
                                        loggedInUser.gamerzarena_plus &&
                                        tournamentDetail.contest.organization_id == 0 ? ( <
                                            span > {
                                                tournamentDetail.contest.entry_fee > 0 ? ( <
                                                    >
                                                    <
                                                    del > {
                                                        getEntryFee()
                                                    } < /del> {
                                                        " Free"
                                                    } <
                                                    />
                                                ) : (
                                                    "FREE"
                                                )
                                            } <
                                            /span>
                                        ) : ( <
                                            span > {
                                                tournamentDetail.contest.entry_fee > 0 ?
                                                getEntryFee() :
                                                    "FREE"
                                            } <
                                            /span>
                                        )
                                    } <
                                    />
                                )
                            }
                            Enter <
                            /Button> <
                            /NavLink>
                        );
                    }
                    // TRACKED + STREAM BASE + INDIVIDUAL STREAM BASE CONTEST
                    else {
                        // GA+ user + stream base tournament
                        if (
                            loggedInUser.gamerzarena_plus &&
                            tournamentDetail.contest.organization_id == 0
                        ) {
                            // if (!tournamentDetail.contest.is_re_entry_for_contest) {
                            return ( <
                                NavLink className = {
                                    styles.cp
                                }
                                to = {
                                    `/tournaments/${tournamentId}/join/individual`
                                } >
                                <
                                Button variant = "primary" >
                                <
                                span > {
                                    tournamentDetail.contest.entry_fee > 0 ||
                                    tournamentDetail.contest.reentry_fee > 0 ? ( <
                                        >
                                        <
                                        del > {
                                            getEntryFee()
                                        } < /del> {
                                            " Free"
                                        } <
                                        />
                                    ) : (
                                        "FREE"
                                    )
                                } <
                                /span>
                                Enter <
                                /Button> <
                                /NavLink>
                            );
                            // }
                            // else {
                            //   return (
                            //     <NavLink className={styles.cp} to={`/tournaments/${tournamentId}/join/individual`}>
                            //       <Button variant="primary">
                            //         <span>
                            //           {tournamentDetail.contest.reentry_fee > 0
                            //             ? getEntryFee()
                            //             : "Free"}
                            //         </span>
                            //      Enter
                            //     </Button>
                            //     </NavLink>
                            //   )
                            // }
                        } else {
                            //Non GA+ user + stream base tournament
                            return ( <
                                NavLink className = {
                                    styles.cp
                                }
                                to = {
                                    `/tournaments/${tournamentId}/join/individual`
                                } >
                                <
                                Button variant = "primary" > {!tournamentDetail.contest.is_re_entry_for_contest ? ( <
                                        span > {
                                            tournamentDetail.contest.entry_fee > 0 ?
                                            getEntryFee() :
                                                "FREE"
                                        } <
                                        /span>
                                    ) : ( <
                                        span > {
                                            tournamentDetail.contest.reentry_fee > 0 ?
                                            getEntryFee() :
                                                "FREE"
                                        } <
                                        /span>
                                    )
                                }
                                Enter <
                                /Button> <
                                /NavLink>
                            );
                        }
                    }
                }

                // stream base contest start
                else if (startDate > now) {
                    if (
                        tournamentDetail.contest.isForGAPlus == 1 &&
                        !loggedInUser.gamerzarena_plus
                    ) {
                        return ( <
                            NavLink className = {
                                styles.cp
                            }
                            to = {
                                `/profile/${loggedInUser.name}/settings/ga-plus`
                            } >
                            <
                            Button variant = "primary" > Join GA + < /Button> <
                            /NavLink>
                        );
                    } else {
                        return (
                            // <Button variant="primary" disabled>
                            //   Starting soon
                            // </Button>
                            <
                            > {
                                startDate > now &&
                                !tournamentDetail.contest.isRegistered &&
                                hasRegistrationDate ? (
                                    // <Button variant="primary" onClick={registerTournament} id>
                                    //   <Countdown
                                    //     date={registerDate}
                                    //     renderer={registerRenderer}
                                    //   />
                                    // </Button>
                                    <
                                    Button variant = "primary"
                                    onClick = {
                                        registerTournament
                                    }
                                    disabled = {
                                        tournamentDetail.contest.registration.isClosed
                                    } > {
                                        tournamentDetail.contest.registration.isClosed ?
                                        <
                                        > registration closed < /> :
                                            <
                                            Countdown
                                        date = {
                                            registerDate
                                        }
                                        renderer = {
                                            registerRenderer
                                        }
                                        />
                                    } <
                                    /Button>

                                ) : ( <
                                    Button variant = "primary"
                                    disabled >
                                    <
                                    Countdown date = {
                                        startDate
                                    }
                                    renderer = {
                                        startRenderer
                                    }
                                    daysInHours = {
                                        true
                                    }
                                    /> <
                                    /Button>
                                )
                            } <
                            />
                        );
                    }
                }
            }
        }

        // UNTRACKED TOURNAMENT
        else {
            //UNTRACKED + BRACKET BASE TOURNAMENT
            if (tournamentDetail.contest.hasBrackets) {
                //*************************************************************************** */

                //TEAM BASE CONTEST
                if (
                    tournamentDetail.contest.enable_team_name == 1 &&
                    tournamentDetail.contest.bracketType !== "Closed"
                ) {
                    if (!tournamentDetail.contest.isUserHaveAccessToJoinTeamContest) {
                        return ( <
                            Button variant = "primary"
                            disabled >
                            You are in
                            <
                            /Button>
                        );
                    }
                    if (tournamentDetail.contest.isEnrolled) {
                        return ( <
                            > {
                                now > startDate ? ( <
                                    NavLink className = {
                                        styles.cp
                                    }
                                    to = {
                                        `/tournaments/${tournamentId}/submit-result`
                                    } >
                                    <
                                    Button variant = "primary"
                                    disabled = {
                                        submitResults
                                    } >
                                    Submit Result <
                                    /Button> <
                                    /NavLink>
                                ) : ( <
                                    Button variant = "primary"
                                    disabled >
                                    <
                                    Countdown date = {
                                        startDate
                                    }
                                    renderer = {
                                        startRenderer
                                    }
                                    daysInHours = {
                                        true
                                    }
                                    /> <
                                    /Button>
                                )
                            } <
                            />
                        );

                    } else {
                        return ( <
                            NavLink className = {
                                styles.cp
                            }
                            to = {
                                `/tournaments/${tournamentId}/join/team`
                            } >
                            <
                            Button variant = "primary" >
                            <
                            > {
                                loggedInUser.gamerzarena_plus &&
                                tournamentDetail.contest.organization_id == 0 ? ( <
                                    span >
                                    <
                                    del > {
                                        getEntryFee()
                                    } < /del> {
                                        " Free"
                                    } <
                                    /span>
                                ) : ( <
                                    span > {
                                        tournamentDetail.contest.entry_fee > 0 ?
                                        getEntryFee() :
                                            "FREE"
                                    } <
                                    /span>
                                )
                            } <
                            /> {
                                hasRegistrationDate ? ( <
                                    Countdown date = {
                                        registerDate
                                    }
                                    renderer = {
                                        registerRenderer
                                    }
                                    />
                                ) : (
                                    "Enter"
                                )
                            } <
                            /Button> <
                            /NavLink>
                        );
                    }
                }

                //*********************** end ******************************************************* */

                //Untracked + bracket + open
                if (tournamentDetail.contest.bracketType !== "Closed") {
                    if (
                        now < endDate &&
                        !tournamentDetail.contest.isEnrolled &&
                        !tournamentDetail.contest.streamingButtonVisibility &&
                        !tournamentDetail.contest.isClosedEnrolled
                    ) {
                        //*************************************************************** */
                        // tournament only for GA+  wiht login user are GA+
                        if (loggedInUser.gamerzarena_plus) {
                            if (tournamentDetail.contest.isForGAPlus == 1) {
                                return ( <
                                    NavLink className = {
                                        styles.cp
                                    }
                                    to = {
                                        `/tournaments/${tournamentId}/join/individual`
                                    } >
                                    <
                                    Button variant = "primary" >
                                    <
                                    span > FREE < /span> {
                                        hasRegistrationDate ? ( <
                                            Countdown date = {
                                                registerDate
                                            }
                                            renderer = {
                                                registerRenderer
                                            }
                                            />
                                        ) : (
                                            "Enter"
                                        )
                                    } <
                                    /Button> <
                                    /NavLink>
                                );
                            } else {
                                if (tournamentDetail.contest.organization_id == 0) {
                                    return ( <
                                        NavLink className = {
                                            styles.cp
                                        }
                                        to = {
                                            `/tournaments/${tournamentId}/join/individual`
                                        } >
                                        <
                                        Button variant = "primary" >
                                        <
                                        span > {
                                            tournamentDetail.contest.entry_fee > 0 ? ( <
                                                >
                                                <
                                                del > {
                                                    getEntryFee()
                                                } < /del> {
                                                    " Free"
                                                } <
                                                />
                                            ) : (
                                                "FREE"
                                            )
                                        } <
                                        /span> {
                                            hasRegistrationDate ? ( <
                                                Countdown date = {
                                                    registerDate
                                                }
                                                renderer = {
                                                    registerRenderer
                                                }
                                                />
                                            ) : (
                                                "Enter"
                                            )
                                        } <
                                        /Button> <
                                        /NavLink>
                                    );
                                } else {
                                    return ( <
                                        NavLink className = {
                                            styles.cp
                                        }
                                        to = {
                                            `/tournaments/${tournamentId}/join/individual`
                                        } >
                                        <
                                        Button variant = "primary" >
                                        <
                                        span > {
                                            tournamentDetail.contest.entry_fee > 0 ?
                                            getEntryFee() :
                                                "FREE"
                                        } <
                                        /span> {
                                            hasRegistrationDate ? ( <
                                                Countdown date = {
                                                    registerDate
                                                }
                                                renderer = {
                                                    registerRenderer
                                                }
                                                />
                                            ) : (
                                                "Enter"
                                            )
                                        } <
                                        /Button> <
                                        /NavLink>
                                    );
                                }
                            }
                        } else {
                            if (tournamentDetail.contest.isForGAPlus == 0) {
                                return ( <
                                    NavLink className = {
                                        styles.cp
                                    }
                                    to = {
                                        `/tournaments/${tournamentId}/join/individual`
                                    } >
                                    <
                                    Button variant = "primary" > {
                                        tournamentDetail.contest.entry_fee > 0 ? ( <
                                            span > {
                                                getEntryFee()
                                            } < /span>
                                        ) : ( <
                                            span > FREE < /span>
                                        )
                                    } {
                                        hasRegistrationDate ? ( <
                                            Countdown date = {
                                                registerDate
                                            }
                                            renderer = {
                                                registerRenderer
                                            }
                                            />
                                        ) : (
                                            "Enter"
                                        )
                                    } <
                                    /Button> <
                                    /NavLink>
                                );
                            }
                        }
                    } else if (startDate > now && tournamentDetail.contest.isEnrolled) {
                        return ( <
                            Button variant = "primary"
                            disabled > {
                                tournamentDetail.contest.customStatus === "Ended" ? (
                                    "Ended"
                                ) : ( <
                                    Countdown date = {
                                        startDate
                                    }
                                    renderer = {
                                        startRenderer
                                    }
                                    daysInHours = {
                                        true
                                    }
                                    />
                                )
                            } <
                            /Button>
                        );
                    }
                    // } else if (
                    //   tournamentDetail.contest.isEnrolled &&
                    //   tournamentDetail.contest.streamingButtonVisibility
                    // ) {
                    //   return (
                    //     <NavLink
                    //       className={styles.cp}
                    //       to={`/tournaments/${tournamentId}/submit-result`}
                    //     >
                    //       <Button variant="primary" disabled={submitResults}>
                    //         Submit Result
                    //       </Button>
                    //     </NavLink>
                    //   );
                    // }
                }
                //UNTRACKED + BRACKET + CLOSED
                else {
                    if (startDate > now) {
                        return ( <
                            Button variant = "primary"
                            disabled > {!tournamentDetail.contest.isEnrolled ? (
                                    "You're not In"
                                ) : ( <
                                    Countdown date = {
                                        startDate
                                    }
                                    renderer = {
                                        startRenderer
                                    }
                                    daysInHours = {
                                        true
                                    }
                                    />
                                )
                            } <
                            /Button>
                        );
                    } else if (startDate <= now) {
                        return ( <
                            > {
                                tournamentDetail.contest.isEnrolled ? (
                                    tournamentDetail.contest.streamingButtonVisibility ? ( <
                                        NavLink className = {
                                            styles.cp
                                        }
                                        to = {
                                            `/tournaments/${tournamentId}/submit-result`
                                        } >
                                        <
                                        Button variant = "primary" > Submit Result < /Button> <
                                        /NavLink>
                                    ) : ( <
                                        Button variant = "primary"
                                        disabled >
                                        Submit Result <
                                        /Button>
                                    )
                                ) : ( <
                                    Button variant = "primary"
                                    disabled >
                                    You 're not in <
                                    /Button>
                                )
                            } <
                            />
                        );
                    } else if (!tournamentDetail.contest.isEnrolled &&
                        !tournamentDetail.contest.streamingButtonVisibility
                    ) {
                        return ( <
                            Button variant = "primary"
                            disabled >
                            You 're Not In <
                            /Button>
                        );
                    }
                    // else if (
                    //   tournamentDetail.contest.isEnrolled &&
                    //   tournamentDetail.contest.streamingButtonVisibility
                    // ) {
                    //   return (
                    //     <NavLink
                    //       className={styles.cp}
                    //       to={`/tournaments/${tournamentId}/submit-result`}
                    //     >
                    //       <Button variant="primary" disabled={submitResults}>
                    //         Submit Result
                    //       </Button>
                    //     </NavLink>
                    //   );
                    // }
                }
            }
            // UNTRACKED + STREAM BASE TOURNAMENT
            else {
                if (startDate <= now && now < endDate) {
                    //TEAM BASE CONTEST
                    if (tournamentDetail.contest.enable_team_name == 1) {
                        if (tournamentDetail.contest.is_re_entry_for_contest) {
                            return ( <
                                NavLink className = {
                                    styles.cp
                                }
                                to = {
                                    `/tournaments/${tournamentId}/submit-result`
                                } >
                                <
                                Button variant = "primary"
                                disabled = {
                                    submitResults
                                } >
                                Submit Result <
                                /Button> <
                                /NavLink>
                            );
                        } else {
                            return ( <
                                NavLink className = {
                                    styles.cp
                                }
                                to = {
                                    `/tournaments/${tournamentId}/join/team`
                                } >
                                <
                                Button variant = "primary" >
                                <
                                > {
                                    loggedInUser.gamerzarena_plus &&
                                    tournamentDetail.contest.organization_id == 0 ? ( <
                                        span >
                                        <
                                        del > {
                                            getEntryFee()
                                        } < /del> {
                                            " Free"
                                        } <
                                        /span>
                                    ) : ( <
                                        span > {
                                            tournamentDetail.contest.entry_fee > 0 ?
                                            getEntryFee() :
                                                "FREE"
                                        } <
                                        /span>
                                    )
                                } <
                                />
                                Enter <
                                /Button> <
                                /NavLink>
                            );
                        }
                    }
                    // INDIVIDUAL STREAM BASE CONTEST
                    else {
                        // GA+ user + stream base tournament
                        if (!tournamentDetail.contest.is_re_entry_for_contest) {
                            if (
                                loggedInUser.gamerzarena_plus &&
                                tournamentDetail.contest.organization_id == 0
                            ) {
                                if (
                                    startDate <= now &&
                                    tournamentDetail.contest.isChallenge &&
                                    !tournamentDetail.contest.isAccepted
                                ) {
                                    return ( <
                                        NavLink className = {
                                            styles.cp
                                        }
                                        to = {
                                            `/tournaments/${tournamentId}/submit-result`
                                        } >
                                        <
                                        Button variant = "primary"
                                        disabled = {
                                            submitResults
                                        } >
                                        Deadline Passed <
                                        /Button> <
                                        /NavLink>
                                    );
                                } else {
                                    return ( <
                                        NavLink className = {
                                            styles.cp
                                        }
                                        to = {
                                            `/tournaments/${tournamentId}/join/individual`
                                        } >
                                        <
                                        Button variant = "primary" >
                                        <
                                        span > {
                                            tournamentDetail.contest.entry_fee > 0 ? ( <
                                                > {
                                                    tournamentDetail.contest.isChallenge ? (
                                                        getEntryFee()
                                                    ) : ( <
                                                        >
                                                        <
                                                        del > {
                                                            getEntryFee()
                                                        } < /del> {
                                                            " Free"
                                                        } <
                                                        />
                                                    )
                                                } <
                                                />
                                            ) : (
                                                "FREE"
                                            )
                                        } <
                                        /span>
                                        Enter <
                                        /Button> <
                                        /NavLink>
                                    );
                                }
                            } else {
                                if (
                                    startDate <= now &&
                                    tournamentDetail.contest.isChallenge &&
                                    !tournamentDetail.contest.isAccepted
                                ) {
                                    return ( <
                                        NavLink className = {
                                            styles.cp
                                        }
                                        to = {
                                            `/tournaments/${tournamentId}/submit-result`
                                        } >
                                        <
                                        Button variant = "primary"
                                        disabled = {
                                            submitResults
                                        } >
                                        Deadline Passed <
                                        /Button> <
                                        /NavLink>
                                    );
                                } else {
                                    return ( <
                                        NavLink className = {
                                            styles.cp
                                        }
                                        to = {
                                            `/tournaments/${tournamentId}/join/individual`
                                        } >
                                        <
                                        Button variant = "primary" >
                                        <
                                        span > {
                                            tournamentDetail.contest.entry_fee > 0 ?
                                            getEntryFee() :
                                                "FREE"
                                        } <
                                        /span>
                                        Enter <
                                        /Button> <
                                        /NavLink>
                                    );
                                }
                            }
                        } else {
                            return ( <
                                NavLink className = {
                                    styles.cp
                                }
                                to = {
                                    `/tournaments/${tournamentId}/submit-result`
                                } >
                                <
                                Button variant = "primary"
                                disabled = {
                                    submitResults
                                } >
                                Submit Result <
                                /Button> <
                                /NavLink>
                            );
                        }
                    }
                }
                // stream base contest start
                else if (startDate > now) {
                    if (tournamentDetail.contest.isForGAPlus == 1 && !loggedInUser.gamerzarena_plus) {
                        return ( <
                            NavLink className = {
                                styles.cp
                            }
                            to = {
                                `/profile/${loggedInUser.name}/settings/ga-plus`
                            } >
                            <
                            Button variant = "primary" >
                            Join GA < sup > + < /sup> <
                            /Button> <
                            /NavLink>
                        );
                    }
                    //TEAM BASE CONTEST
                    // else if (tournamentDetail.contest.enable_team_name == 1 && !tournamentDetail.contest.isRegistered) {
                    //     return (
                    //       <NavLink className={styles.cp} to={`/tournaments/${tournamentId}/join/team`}>
                    //         <Button variant="primary">
                    //           <>
                    //             {loggedInUser.gamerzarena_plus &&
                    //               tournamentDetail.contest.organization_id == 0 ? (
                    //                 <span>
                    //                   <del>{getEntryFee()}</del>
                    //                   {" Free"}
                    //                 </span>
                    //               ) : (
                    //                 <span>
                    //                   {tournamentDetail.contest.entry_fee > 0
                    //                     ? getEntryFee()
                    //                     : "FREE"}
                    //                 </span>
                    //               )}
                    //           </>
                    //           Enter
                    //         </Button>
                    //       </NavLink>
                    //     );
                    // }
                    else {
                        return ( <
                            > {!tournamentDetail.contest.isRegistered ? ( <
                                    Button variant = "primary"
                                    onClick = {
                                        registerTournament
                                    }
                                    disabled = {
                                        tournamentDetail.contest.registration.isClosed
                                    } > {
                                        hasRegistrationDate ?
                                        <
                                        > {
                                            tournamentDetail.contest.registration.isClosed ?
                                            <
                                            > registration closed < /> :
                                                <
                                                Countdown
                                            date = {
                                                registerDate
                                            }
                                            renderer = {
                                                registerRenderer
                                            }
                                            daysInHours = {
                                                true
                                            }
                                            />
                                        } <
                                        /> :
                                            'Enter'
                                    } <
                                    /Button>
                                ) : ( <
                                    Button variant = "primary"
                                    disabled >
                                    <
                                    Countdown date = {
                                        startDate
                                    }
                                    renderer = {
                                        startRenderer
                                    }
                                    daysInHours = {
                                        true
                                    }
                                    /> <
                                    /Button>
                                )
                            } <
                            />
                        );
                    }
                } else if (
                    now > endDate &&
                    tournamentDetail.contest.isChallenge &&
                    tournamentDetail.contest.isAccepted
                ) {
                    return ( <
                        Button variant = "primary"
                        disabled >
                        Ended <
                        /Button>
                    );
                }
            }
        }
    }

    //Whithout login user
    else {
        // Whithout login user + bracket base tournament
        if (tournamentDetail.contest.hasBrackets) {
            // Whithout login user + bracket base tournament + open bracket type
            if (tournamentDetail.contest.bracketType !== "Closed") {
                return ( <
                    NavLink className = {
                        styles.cp
                    }
                    to = {
                        `/login`
                    } >
                    <
                    Button variant = "primary"
                    onClick = {
                        storePreviousPath
                    } > {
                        /* <span>
                                        {tournamentDetail.contest.entry_fee > 0
                                          ? prefix + tournamentDetail.contest.entry_fee + suffix
                                          : "FREE"}
                                      </span> */
                    } {
                        hasRegistrationDate ? ( <
                            Countdown date = {
                                registerDate
                            }
                            renderer = {
                                registerRenderer
                            }
                            />
                        ) : (
                            "Enter"
                        )
                    } <
                    /Button> <
                    /NavLink>
                );
            }
            // Whithout login user + bracket base tournament + closed brackeet type
            else {
                return ( <
                    Button variant = "primary"
                    disabled > {
                        tournamentDetail.contest.customStatus === "Ended" ? (
                            "Ended"
                        ) : "You're not in"
                    } <
                    /Button>
                );
            }
        } else {
            // Whithout login user + stream base tournament
            if (startDate <= now && now < endDate) {
                return ( <
                    NavLink className = {
                        styles.cp
                    }
                    to = {
                        `/login`
                    } >
                    <
                    Button variant = "primary"
                    onClick = {
                        storePreviousPath
                    } >
                    <
                    span > {
                        tournamentDetail.contest.entry_fee > 0 ?
                        prefix + tournamentDetail.contest.entry_fee + suffix :
                            "Free"
                    } <
                    /span>
                    Enter <
                    /Button> <
                    /NavLink>
                );
            } else if (startDate > now) {
                return ( <
                    Button variant = "primary"
                    disabled > {
                        tournamentDetail.contest.customStatus === "Ended" ? (
                            "Ended"
                        ) : ( <
                            Countdown date = {
                                startDate
                            }
                            renderer = {
                                startRenderer
                            }
                            daysInHours = {
                                true
                            }
                            />
                        )
                    } <
                    /Button>
                );
            }
        }
    }



    return < > < />;
}

const mapSizesToProps = ({
    width
}) => ({
    isMobile: width < 1000,
});

export default withSizes(mapSizesToProps)(EnterTournamentButton);