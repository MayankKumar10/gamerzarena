/* eslint-disable */

import React from "react";
import {
    useParams
} from "react-router-dom";
import {
    motion
} from "framer-motion";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {
    useDispatch,
    useSelector
} from "react-redux";
import * as Actions from "../store/actions";
import history from "../../../history";
import styles from "./JoinIndividual.module.scss";
import {
    NavLink
} from "react-router-dom";
// import twitchImage from "assets/img/twitch-notice-small.png";
import * as moment from "moment";
import * as AppActions from "../../../store/actions";
import CurrencyWrapper from "components/CurrencyWrapper/CurrencyWrapper";
import Spinner from "react-bootstrap/Spinner";
import Info from '../../../components/Info/Info'
import * as TournamentActions from "../../Tournaments/store/actions";

import StrimingRules from './StrimingRules'
const JoinIndividual = (props) => {
    const dispatch = useDispatch();
    let {
        tournamentId,
        platform
    } = useParams();
    var timeZone = moment.tz.guess();
    const variants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1
        },
    };
    const tournamentDetail = useSelector(
        ({
            TournamentAppStore
        }) =>
        TournamentAppStore.tournamentApp.tournamentDetail
    );
    const user_streaming = useSelector(({
        core
    }) => core.appStore.user_streaming);
    const loggedInUser = useSelector(({
        core
    }) => core.appStore.loggedInUser);

    let games = ['nhl-21']


    const defaultValue = {
        user_id: loggedInUser.id,
        contest_hash_id: tournamentDetail ? tournamentDetail.hash_id : 0,
        invite_code: "",
        team_name: "",
        gamer_name: games.includes(tournamentDetail.contest.game_slug) ? "" : loggedInUser.name || "",
        timezone: timeZone,
        platform_id: tournamentDetail && tournamentDetail.contest.isEnrolled &&
            tournamentDetail.contest.streamingButtonVisibility ?
            tournamentDetail.contest.played_platforms[0] : "",
        stream_url: tournamentDetail && tournamentDetail.contest.twitchUsername && tournamentDetail.contest.twitchUsername !== "" ? `https://www.twitch.tv/${tournamentDetail.contest.twitchUsername}` : "",
    };
    const [values, setValues] = React.useState(defaultValue);
    const [invalidValues, setInvalidValues] = React.useState({
        gamer_name: false,
        platform_id: false,
        invite_code: false,
    });
    const [inProgress, setInProgress] = React.useState(false);


    const handleChange = (e) => {
        let {
            name,
            value
        } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
        // if (name === 'stream_url') {
        //   var res = value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        //   if (res == null) {
        //     dispatch(AppActions.showMessage({
        //       message: `Please enter valid stream url `,
        //       variant: "error",
        //     })
        //     );
        //     return false;
        //   }
        // }
    };

    const onBlur = (e) => {
        let {
            name,
            value
        } = e.target;
        setInvalidValues({
            ...invalidValues,
            [name]: !value,
        });
    };

    function JoinTournament(e) {
        e.preventDefault();
        if (values.gamer_name === "" || values.platform_id === "") {
            return false;
        }

        if (!tournamentDetail.contest.hasBrackets && tournamentDetail.contest.stream_type === "tracked") {
            setInProgress(true)
            dispatch(Actions.verifyStramURL({
                stream_url: values.stream_url
            })).then(function(response) {
                if (response.success) {
                    JoinTournamentSubmit()
                } else {
                    setInProgress(false)
                    dispatch(
                        AppActions.showMessage({
                            message: response.message,
                            variant: "error",
                        })
                    )
                }
            });
        } else if (
            (tournamentDetail.contest.hasBrackets &&
                tournamentDetail.contest.stream_type === "tracked" &&
                tournamentDetail.contest.isEnrolled &&
                tournamentDetail.contest.streamingButtonVisibility)) {

            setInProgress(true)
            dispatch(Actions.verifyStramURL({
                stream_url: values.stream_url
            })).then(function(response) {
                if (response.success) {
                    JoinBracketTrackedTournamentSubmit()
                } else {
                    setInProgress(false)
                    dispatch(
                        AppActions.showMessage({
                            message: response.message,
                            variant: "error",
                        })
                    )
                }

            });
        } else {
            setInProgress(true)
            JoinTournamentSubmit()
        }
    }

    function JoinBracketTrackedTournamentSubmit() {
        setInProgress(true)
        values.start_streaming = 1;
        dispatch(TournamentActions.joinTournament(values)).then(function(response) {
            setInProgress(false)
            if (response.success) {
                if (response.redirect_url) {
                    history.push(response.redirect_url);
                } else {
                    history.push(`/tournaments/${tournamentDetail.contest.hash_id}`);
                }
            }
        });
    }

    function JoinTournamentSubmit() {
        if (tournamentDetail.contest.hasBrackets) {
            //values.stream_url = "";
            dispatch(Actions.JoinBracketTournament(values)).then(function(response) {
                setInProgress(false)

                if (response.success && response.redirect_url !== undefined) {
                    dispatch(AppActions.reFatchLogedinUserInfo());
                    dispatch(
                        Actions.getTournmentDetail(tournamentDetail.contest.hash_id)
                    );
                    history.push(
                        `/tournaments/${tournamentDetail.contest.hash_id}/brackets`
                    );
                }
            });
        } else {
            dispatch(Actions.joinTournament(values)).then(function(response) {
                setInProgress(false)
                if (response.success && response.redirect_url !== undefined) {
                    if (tournamentDetail.contest.stream_type === "untracked") {
                        history.push(
                            `/tournaments/${tournamentDetail.contest.hash_id}/submit-result`
                        );
                    } else {
                        history.push(response.redirect_url);
                    }
                }
            });
        }
    }

    let now = +new Date();
    let startDate = +moment
        .utc(tournamentDetail.contest.date, "YYYY-MM-DD HH:mm:ss")
        .toDate();
    let endDate = +moment
        .utc(tournamentDetail.contest.endDate, "YYYY-MM-DD HH:mm:ss")
        .toDate();

    // if (tournamentDetail.contest.streamingButtonVisibility || tournamentDetail.contest.isClosedEnrolled) {
    //     history.push(`/tournaments/${tournamentDetail.contest.hash_id}/brackets`);
    // }

    if (
        tournamentDetail &&
        !tournamentDetail.contest.hasBrackets &&
        startDate > now
    ) {
        history.push(`/tournaments/${tournamentDetail.contest.hash_id}`);
        dispatch(
            AppActions.showMessage({
                message: `Hey ${loggedInUser.name
          }, This tournament will start at ${moment
            .utc(tournamentDetail.contest.date, "YYYY-MM-DD HH:mm:ss")
            .local()
            .format("MMM DD YYYY HH:mm:ss")}`,
                variant: "info",
            })
        );
    }

    const prefix =
        tournamentDetail.contest !== undefined &&
        tournamentDetail.contest !== null &&
        tournamentDetail.contest.entry_fee_type === "Amount Based" ?
        "$ " :
        "";
    const suffix =
        tournamentDetail.contest !== undefined &&
        tournamentDetail.contest !== null &&
        tournamentDetail.contest.entry_fee_type === "Amount Based" ?
        "" :
        " Points";


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

    function bracketbaseTrackStream() {
        if (
            startDate <= now &&
            now < endDate &&
            tournamentDetail.contest.isEnrolled &&
            tournamentDetail.contest.streamingButtonVisibility
        ) {
            if (loggedInUser.gamerzarena_plus) {
                if (tournamentDetail.contest.isForGAPlus == 1) {
                    return ( <
                        div className = {
                            styles.buttonWrapper
                        } >
                        <
                        Button variant = "primary"
                        onClick = {
                            JoinTournament
                        } >
                        Start Streaming <
                        /Button> <
                        /div>

                    );
                } else {
                    if (tournamentDetail.contest.organization_id == 0) {
                        return ( <
                            div className = {
                                styles.buttonWrapper
                            } >
                            <
                            Button variant = "primary"
                            onClick = {
                                JoinTournament
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
                            /div>

                        );
                    } else {
                        return ( <
                            div className = {
                                styles.buttonWrapper
                            } >
                            <
                            Button variant = "primary"
                            onClick = {
                                JoinTournament
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
                            /div>

                        );
                    }
                }
            } else {
                if (tournamentDetail.contest.isForGAPlus == 0) {
                    return ( <
                        div className = {
                            styles.buttonWrapper
                        } >
                        <
                        Button variant = "primary"
                        onClick = {
                            JoinTournament
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
                        /div>
                    );
                }
            }
        }
    }
    return ( <
        motion.div initial = "hidden"
        animate = "visible"
        variants = {
            variants
        } >
        <
        Form className = {
            styles.individualForm
        }
        onSubmit = {
            JoinTournament
        } >
        <
        div >
        <
        h1 > Join as individual < /h1> <
        div className = {
            styles.individualWrapper
        } >
        <
        h2 > Crucial rules < /h2> <
        div className = {
            styles.rulesWrapper
        } > {
            tournamentDetail && tournamentDetail.rules != "" && ( <
                >
                <
                h2 > Rules < /h2> <
                div className = "myTestClass"
                dangerouslySetInnerHTML = {
                    {
                        __html: tournamentDetail.rules[0],
                    }
                }
                /> <
                />
            )
        } <
        /div> <
        /div> {
            tournamentDetail && tournamentDetail.contest.stream_type === "tracked" &&
                <
                StrimingRules tournamentDetail = {
                    tournamentDetail
                }
            />
        } {
            tournamentDetail.contest.min_age > 0 &&
                tournamentDetail.contest.max_age > 0 && ( <
                    div className = {
                        styles.individualWrapper
                    } >
                    <
                    div className = {
                        styles.rulesWrapper
                    } >
                    <
                    div className = "enter-notice" >
                    <
                    h5 className = {
                        "strong"
                    } >
                    You agree to be between {
                        tournamentDetail.contest.min_age
                    } {
                        " "
                    }
                    and {
                        tournamentDetail.contest.max_age
                    }
                    age
                    if you enter <
                    /h5> <
                    /div> <
                    /div> <
                    /div>
                )
        }

        <
        Form.Group controlId = "formIndividualEmail" >
        <
        Form.Control type = "text"
        value = {
            values.gamer_name
        }
        name = "gamer_name"
        maxLength = {
            games.includes(tournamentDetail.contest.game_slug) ? 3 : 30
        }
        onChange = {
            handleChange
        }
        className = {
            invalidValues.gamer_name && "invalid"
        }
        onBlur = {
            onBlur
        }
        required /
        >
        <
        Form.Label className = {
            styles.formLabel
        } >
        Your name in game <
        /Form.Label> <
        /Form.Group>


        {
            ((!tournamentDetail.contest.hasBrackets && tournamentDetail.contest.stream_type === "tracked") ||
                (tournamentDetail.contest.hasBrackets && tournamentDetail.contest.isEnrolled && tournamentDetail.contest.streamingButtonVisibility)) &&

            <
            Form.Group controlId = "formIndividualEmail" >
                <
                Form.Control
            type = "url"
            value = {
                values.stream_url
            }
            name = "stream_url"
            onChange = {
                handleChange
            }
            className = {
                invalidValues.stream_url && "invalid"
            }
            onBlur = {
                onBlur
            }
            required
                /
                >
                <
                Form.Label className = {
                    styles.formLabel
                } >
                Add your live Stream URL of your streaming platform {
                    " "
                } <
                Info id = {
                    3
                }
            /> <
            /Form.Label> <
            /Form.Group>
        } <
        Form.Group controlId = "formIndividualRegion" >
        <
        Form.Control as = "select"
        required className = {
            invalidValues.platform_id && "invalid"
        }
        onChange = {
            handleChange
        }
        value = {
            values.platform_id
        }
        name = "platform_id"
        onBlur = {
            onBlur
        }
        disabled = {
            tournamentDetail &&
            tournamentDetail.contest.hasBrackets &&
            tournamentDetail.contest.isEnrolled &&
            tournamentDetail.contest.streamingButtonVisibility
        } >
        <
        option value = "" > Select < /option> {
            tournamentDetail &&
                tournamentDetail.contest.platforms.map((item, index) => ( <
                    option key = {
                        index
                    }
                    value = {
                        item.id
                    } > {
                        item.name
                    } <
                    /option>
                ))
        } <
        /Form.Control> <
        Form.Label className = {
            styles.formLabel
        } > Platform < /Form.Label> <
        /Form.Group> {
            tournamentDetail && tournamentDetail.contest.inviteCodeRequired && ( <
                Form.Group controlId = "formIndividualinviteCode" >
                <
                Form.Control type = "text"
                value = {
                    values.invite_code
                }
                name = "invite_code"
                onChange = {
                    handleChange
                }
                className = {
                    invalidValues.invite_code && "invalid"
                }
                onBlur = {
                    onBlur
                }
                required /
                >
                <
                Form.Label className = {
                    styles.formLabel
                } > Invite code < /Form.Label> <
                /Form.Group>
            )
        } <
        /div>

        {
            user_streaming !== null &&
                user_streaming.current_age < 1 &&
                (tournamentDetail.contest.min_age > 0 &&
                    tournamentDetail.contest.max_age > 0) && ( <
                    div className = {
                        styles.buttonWrapper
                    } >
                    <
                    NavLink to = {
                        `/profile/${loggedInUser.name}/settings/profile`
                    } >
                    <
                    Button variant = "primary" > Set Birthdate < /Button> <
                    /NavLink> <
                    /div>
                )
        }


        {
            inProgress &&
                <
                div className = {
                    styles.buttonWrapper
                } >
                <
                Button color = "primary"
            disabled >
                <
                Spinner
            as = "span"
            animation = "grow"
            size = "sm"
            role = "status"
            aria - hidden = "true" /
                > Loading... < /Button> <
                /div>
        }

        {
            !inProgress && user_streaming !== null &&
                ((tournamentDetail.contest.min_age > 0 &&
                        tournamentDetail.contest.max_age > 0 &&
                        tournamentDetail.contest.max_age > user_streaming.current_age &&
                        tournamentDetail.contest.min_age < user_streaming.current_age) ||
                    (tournamentDetail.contest.min_age <= 0 &&
                        tournamentDetail.contest.max_age <= 0)) ? ( <
                    > {
                        startDate <= now &&
                        now < endDate &&
                        !tournamentDetail.contest.hasBrackets ? ( <
                            div className = {
                                styles.buttonWrapper
                            } > {
                                tournamentDetail &&
                                !tournamentDetail.contest.is_re_entry_for_contest ? ( <
                                    > {
                                        loggedInUser.gamerzarena_plus ? ( <
                                            > {
                                                tournamentDetail.contest.isForGAPlus == 1 ? ( <
                                                    Button type = "submit"
                                                    variant = "primary" >
                                                    <
                                                    span > FREE < /span> Enter <
                                                    /Button>
                                                ) : ( <
                                                    > {
                                                        tournamentDetail.contest.organization_id == 0 ? ( <
                                                            Button type = "submit"
                                                            variant = "primary" >
                                                            <
                                                            span > {
                                                                tournamentDetail.contest.entry_fee > 0 ?
                                                                <
                                                                > {
                                                                    tournamentDetail.contest.isChallenge ?
                                                                    <
                                                                    > {
                                                                        tournamentDetail.contest.entry_fee_type === "Amount Based" ?
                                                                        <
                                                                        CurrencyWrapper amount = {
                                                                            tournamentDetail.contest.entry_fee || 0
                                                                        }
                                                                        /> :
                                                                            prefix + tournamentDetail.contest.entry_fee + suffix
                                                                    } <
                                                                    /> :
                                                                        <
                                                                        >
                                                                        <
                                                                        del > {
                                                                            tournamentDetail.contest.entry_fee_type === "Amount Based" ?
                                                                            <
                                                                            CurrencyWrapper amount = {
                                                                                tournamentDetail.contest.entry_fee || 0
                                                                            }
                                                                            /> :
                                                                                prefix + tournamentDetail.contest.entry_fee + suffix
                                                                        } <
                                                                        /del> {
                                                                            " Free"
                                                                        } <
                                                                        />
                                                                } <
                                                                /> :
                                                                    "FREE"
                                                            } <
                                                            /span>
                                                            Enter <
                                                            /Button>
                                                        ) : ( <
                                                            Button type = "submit"
                                                            variant = "primary" >
                                                            <
                                                            span > {
                                                                tournamentDetail.contest.entry_fee > 0 ? ( <
                                                                    > {
                                                                        tournamentDetail.contest
                                                                        .entry_fee_type === "Amount Based" ? ( <
                                                                            CurrencyWrapper amount = {
                                                                                tournamentDetail.contest
                                                                                .entry_fee || 0
                                                                            }
                                                                            />
                                                                        ) : (
                                                                            prefix +
                                                                            tournamentDetail.contest.entry_fee +
                                                                            suffix
                                                                        )
                                                                    } <
                                                                    />
                                                                ) : (
                                                                    "FREE"
                                                                )
                                                            } <
                                                            /span>
                                                            Enter <
                                                            /Button>
                                                        )
                                                    } <
                                                    />
                                                )
                                            } <
                                            />
                                        ) : ( <
                                            > {
                                                tournamentDetail.contest.isForGAPlus == 1 ? ( <
                                                    NavLink to = {
                                                        `/profile/${loggedInUser.name}/settings/ga-plus`
                                                    } >
                                                    <
                                                    Button variant = "primary" > Join GA < sup > + < /sup></Button >
                                                    <
                                                    /NavLink>
                                                ) : ( <
                                                    Button type = "submit"
                                                    variant = "primary" >
                                                    <
                                                    span > {
                                                        tournamentDetail.contest.entry_fee > 0 ? ( <
                                                            > {
                                                                tournamentDetail.contest.entry_fee_type ===
                                                                "Amount Based" ? ( <
                                                                    CurrencyWrapper amount = {
                                                                        tournamentDetail.contest.entry_fee || 0
                                                                    }
                                                                    />
                                                                ) : (
                                                                    prefix +
                                                                    tournamentDetail.contest.entry_fee +
                                                                    suffix
                                                                )
                                                            } <
                                                            />
                                                        ) : (
                                                            "FREE"
                                                        )
                                                    } <
                                                    /span>
                                                    Enter <
                                                    /Button>
                                                )
                                            } <
                                            />
                                        )
                                    } <
                                    />
                                ) : ( <
                                    > {!loggedInUser.gamerzarena_plus &&
                                        tournamentDetail.contest.isForGAPlus == 1 && ( <
                                            NavLink to = {
                                                `/profile/${loggedInUser.name
                                  }/settings/ga-plus`
                                            } >
                                            <
                                            Button variant = "primary" > Join GA < sup > + < /sup></Button >
                                            <
                                            /NavLink>
                                        )
                                    }

                                    {
                                        loggedInUser.gamerzarena_plus &&
                                            tournamentDetail.contest.isForGAPlus == 1 && ( <
                                                Button type = "submit"
                                                variant = "primary" >
                                                <
                                                span > {
                                                    tournamentDetail.contest.reentry_fee > 0 ? (
                                                        tournamentDetail.contest.entry_fee_type ===
                                                        "Amount Based" ? ( <
                                                            CurrencyWrapper amount = {
                                                                tournamentDetail.contest.reentry_fee || 0
                                                            }
                                                            />
                                                        ) : (
                                                            prefix +
                                                            tournamentDetail.contest.reentry_fee +
                                                            suffix
                                                        )
                                                    ) : (
                                                        "Free"
                                                    )
                                                } <
                                                /span>
                                                Enter <
                                                /Button>
                                            )
                                    } {
                                        loggedInUser.gamerzarena_plus && tournamentDetail.contest.isForGAPlus == 0 && ( <
                                            Button type = "submit"
                                            variant = "primary" >
                                            <
                                            span > {
                                                tournamentDetail.contest.reentry_fee > 0 ?
                                                // tournamentDetail.contest.entry_fee_type === "Amount Based" ?
                                                //   <CurrencyWrapper amount={tournamentDetail.contest.reentry_fee || 0} />
                                                //   :
                                                //   prefix + tournamentDetail.contest.reentry_fee + suffix
                                                <
                                                >
                                                <
                                                del > {
                                                    tournamentDetail.contest.entry_fee_type === "Amount Based" ?
                                                    <
                                                    CurrencyWrapper amount = {
                                                        tournamentDetail.contest.reentry_fee || 0
                                                    }
                                                    /> :
                                                        prefix + tournamentDetail.contest.reentry_fee + suffix
                                                } <
                                                /del> {
                                                    " Free"
                                                } <
                                                /> :
                                                    "Free"
                                            } <
                                            /span>
                                            Enter <
                                            /Button>
                                        )
                                    }

                                    {
                                        !loggedInUser.gamerzarena_plus &&
                                            tournamentDetail.contest.isForGAPlus == 0 && ( <
                                                Button type = "submit"
                                                variant = "primary" >
                                                <
                                                span > {
                                                    tournamentDetail.contest.reentry_fee > 0 ? (
                                                        tournamentDetail.contest.entry_fee_type ===
                                                        "Amount Based" ? ( <
                                                            CurrencyWrapper amount = {
                                                                tournamentDetail.contest.reentry_fee || 0
                                                            }
                                                            />
                                                        ) : (
                                                            prefix +
                                                            tournamentDetail.contest.reentry_fee +
                                                            suffix
                                                        )
                                                    ) : (
                                                        "Free"
                                                    )
                                                } <
                                                /span>
                                                Enter <
                                                /Button>
                                            )
                                    } <
                                    />
                                )
                            } <
                            /div>
                        ) : ( <
                            > < />
                        )
                    } {
                        tournamentDetail.contest.stream_type === "untracked" ?
                            <
                            > {
                                now < endDate && tournamentDetail.contest.hasBrackets ? ( <
                                    div className = {
                                        styles.buttonWrapper
                                    } > {!loggedInUser.gamerzarena_plus &&
                                        tournamentDetail.contest.isForGAPlus == 1 && ( <
                                            NavLink to = {
                                                `/profile/${loggedInUser.name
                              }/settings/ga-plus`
                                            } >
                                            <
                                            Button variant = "primary" > Join GA < sup > + < /sup></Button >
                                            <
                                            /NavLink>
                                        )
                                    } {
                                        loggedInUser.gamerzarena_plus ? ( <
                                            > {
                                                tournamentDetail.contest.isForGAPlus == 1 ?
                                                <
                                                Button type = "submit"
                                                variant = "primary" >
                                                <
                                                span > FREE < /span> Enrol <
                                                /Button> :
                                                    <
                                                    > {
                                                        tournamentDetail.contest.organization_id == 0 ? ( <
                                                            Button type = "submit"
                                                            variant = "primary" >
                                                            <
                                                            span > {
                                                                tournamentDetail.contest.entry_fee > 0 ? ( <
                                                                    >
                                                                    <
                                                                    del > {
                                                                        tournamentDetail.contest.entry_fee_type ===
                                                                        "Amount Based" ? ( <
                                                                            CurrencyWrapper amount = {
                                                                                tournamentDetail.contest.entry_fee ||
                                                                                0
                                                                            }
                                                                            />
                                                                        ) : (
                                                                            prefix +
                                                                            tournamentDetail.contest.entry_fee +
                                                                            suffix
                                                                        )
                                                                    } <
                                                                    /del> {
                                                                        " Free"
                                                                    } <
                                                                    />
                                                                ) : (
                                                                    "FREE"
                                                                )
                                                            } <
                                                            /span>
                                                            Enrol <
                                                            /Button>
                                                        ) : ( <
                                                            Button type = "submit"
                                                            variant = "primary" > {
                                                                tournamentDetail.contest.entry_fee > 0 && ( <
                                                                    span > {
                                                                        tournamentDetail.contest.entry_fee_type ===
                                                                        "Amount Based" ? ( <
                                                                            CurrencyWrapper amount = {
                                                                                tournamentDetail.contest.entry_fee || 0
                                                                            }
                                                                            />
                                                                        ) : (
                                                                            prefix +
                                                                            tournamentDetail.contest.entry_fee +
                                                                            suffix
                                                                        )
                                                                    } <
                                                                    /span>
                                                                )
                                                            }
                                                            Enrol <
                                                            /Button>
                                                        )
                                                    } <
                                                    />
                                            } <
                                            />
                                        ) : ( <
                                            > {
                                                tournamentDetail.contest.isForGAPlus == 0 && ( <
                                                    Button type = "submit"
                                                    variant = "primary" > {
                                                        tournamentDetail.contest.entry_fee > 0 && ( <
                                                            span > {
                                                                tournamentDetail.contest.entry_fee_type === "Amount Based" ?
                                                                <
                                                                CurrencyWrapper
                                                                amount = {
                                                                    tournamentDetail.contest.entry_fee || 0
                                                                }
                                                                /> :
                                                                    prefix + tournamentDetail.contest.entry_fee + suffix
                                                            } <
                                                            /span>
                                                        )
                                                    }
                                                    Enrol <
                                                    /Button>
                                                )
                                            } <
                                            />
                                        )
                                    } <
                                    /div>
                                ) : ( <
                                    > < />
                                )
                            } <
                            /> :
                            tournamentDetail.contest.hasBrackets &&
                            <
                            > {
                                startDate <= now &&
                                now < endDate &&
                                tournamentDetail.contest.isEnrolled &&
                                tournamentDetail.contest.streamingButtonVisibility ?
                                bracketbaseTrackStream() :
                                    <
                                    div className = {
                                        styles.buttonWrapper
                                    } >
                                    <
                                    Button type = "submit"
                                variant = "primary" >
                                Enrol <
                                /Button> <
                                /div>
                            }

                            <
                            />
                    } <
                    />
                ) : ( <
                    > {
                        user_streaming !== null &&
                        (tournamentDetail.contest.min_age > 0 &&
                            tournamentDetail.contest.max_age > 0 &&
                            (tournamentDetail.contest.max_age <
                                user_streaming.current_age ||
                                tournamentDetail.contest.min_age >
                                user_streaming.current_age)) && ( <
                            div className = {
                                styles.buttonWrapper
                            } >
                            <
                            Button type = "button"
                            disabled variant = "primary" >
                            Not Available <
                            /Button> <
                            /div>
                        )
                    } <
                    />
                )
        } <
        /Form> <
        /motion.div >
    );
};



export default JoinIndividual;