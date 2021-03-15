/* eslint-disable */

import React from "react";
import {
    motion
} from "framer-motion";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {
    kmFormatter
} from "../../../functions/formatters";
import CreateTeam from "./CreateTeam";
import styles from "./JoinTeam.module.scss";
import {
    NavLink,
    useParams
} from "react-router-dom";
import {
    useDispatch,
    useSelector
} from "react-redux";
import * as Actions from "../store/actions";
import placeholderProfileImage from "assets/img/userplaceholder.png";
import twitchImage from "assets/img/twitch-notice-small.png";
import * as moment from "moment";
import CurrencyWrapper from "components/CurrencyWrapper/CurrencyWrapper";

import Twitch from "assets/images/icons/accounts/twitch.svg";
import * as AppActions from "../../../store/actions";
import * as TournamentActions from "../../Tournaments/store/actions";

import {
    makeStyles
} from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import Skeleton from "@material-ui/lab/Skeleton";
import {
    useHistory
} from "react-router-dom";
import StrimingRules from './StrimingRules'

import SearchBar from "components/Search/SearchBar";
import Spinner from "react-bootstrap/Spinner";
import Info from '../../../components/Info/Info'
const useStyles = makeStyles((theme) => ({
    root: {
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
    },
}));

const JoinIndividual = (props) => {
        const classes = useStyles();
        let {
            tournamentId
        } = useParams();
        let history = useHistory();

        const variants = {
            hidden: {
                opacity: 0
            },
            visible: {
                opacity: 1
            },
        };
        const [teams, setTeams] = React.useState([]);
        const [totalTeams, setTotalTeams] = React.useState(0);
        const [pages, setPages] = React.useState(0);
        const [currentPage, setCurrentPage] = React.useState(1);
        const [loading, setLoading] = React.useState(true);
        const [isSearching, setIsSearching] = React.useState(false);
        const [teamUser, setTeamUser] = React.useState([]);
        const [teamId, setTeamId] = React.useState("");
        const [currentTeamId, setCurrentTeamId] = React.useState("");
        const [modalShow, setModalShow] = React.useState(false);
        const dispatch = useDispatch();
        const [inProgress, setInProgress] = React.useState(false);

        const user_streaming = useSelector(({
            core
        }) => core.appStore.user_streaming);

        const loggedInUser = useSelector(({
            core
        }) => core.appStore.loggedInUser);
        const tournamentDetail = useSelector(({
            TournamentAppStore
        }) => TournamentAppStore.tournamentApp.tournamentDetail);
        React.useEffect(() => {
            if (tournamentDetail && tournamentDetail.contest.hasBrackets && !tournamentDetail.contest.isUserHaveAccessToJoinTeamContest) {
                history.goBack()
            }
        }, [tournamentDetail]);

        let now = +new Date();
        let startDate = +moment.utc(tournamentDetail.contest.date, "YYYY-MM-DD HH:mm:ss").toDate();
        let endDate = +moment.utc(tournamentDetail.contest.endDate, "YYYY-MM-DD HH:mm:ss").toDate();

        let games = ['nhl-21'] //['nhl-21', 'fifa-21', 'nba-2k21', 'madden-21']
        let genjiGames = ['nhl-21', 'fifa-21', 'nba-2k21', 'madden-21']


        const defaultValue = {
            user_id: loggedInUser ? loggedInUser.id : null,
            contest_hash_id: tournamentDetail ? tournamentDetail.hash_id : 0,
            invite_code: "",
            team_name: "",
            gamer_name: games.includes(tournamentDetail.contest.game_slug) ? "" : loggedInUser ? loggedInUser.name : "",
            gamer_region: "",
            platform_id: tournamentDetail && tournamentDetail.contest.isEnrolled &&
                tournamentDetail.contest.streamingButtonVisibility ?
                tournamentDetail.contest.played_platforms[0] : "",
            stream_url: tournamentDetail && tournamentDetail.contest.twitchUsername && tournamentDetail.contest.twitchUsername !== "" ? `https://www.twitch.tv/${tournamentDetail.contest.twitchUsername}` : "",
        };
        const [values, setValues] = React.useState(defaultValue);

        const [invalidValues, setInvalidValues] = React.useState({
            gamer_name: false,
            invite_code: false
        });

        function openModal(team_id) {
            setTeamId(team_id);
            setCurrentTeamId(team_id);
            // setModalShow(true);
        }

        const handleChange = (e) => {
            let {
                name,
                value
            } = e.target;
            setValues({
                ...values,
                [name]: value,
            });
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
            if (values.gamer_name === "") {
                return false;
            }
            if (tournamentDetail.contest.stream_type === "tracked" && !tournamentDetail.contest.hasBrackets && startDate <= now) {

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
            values.team_id = teamId;
            values.start_streaming = 1;
            dispatch(Actions.joinTournament(values)).then(function(response) {
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
            values.team_id = teamId;
            if (tournamentDetail.contest.hasBrackets) {
                values.stream_url = "";
                dispatch(Actions.JoinBracketTournament(values)).then(function(response) {
                    setInProgress(false)
                    if (response.success) {
                        dispatch(AppActions.reFatchLogedinUserInfo());
                        dispatch(Actions.getTournmentDetail(tournamentDetail.contest.hash_id));
                        history.push(`/tournaments/${tournamentDetail.contest.hash_id}/brackets`);
                    }
                });
            } else {
                dispatch(Actions.joinTeam(values)).then(function(response) {
                    setInProgress(false)
                    if (response.success) {
                        if (tournamentDetail.contest.stream_type === "untracked") {
                            history.push(`/tournaments/${tournamentDetail.contest.hash_id}/submit-result`);
                        } else {
                            if (response.redirect_url) {
                                history.push(response.redirect_url);
                            } else {
                                history.push(`/tournaments/${tournamentDetail.contest.hash_id}`);
                            }
                        }
                    }
                });
            }
        }

        const getTeams = (page, limit, search) => {
            const dataParam = {
                user_id: loggedInUser ? loggedInUser.id : null,
                page: page,
                limit: limit,
                search: search,
                contest_id: tournamentId
            };
            dispatch(Actions.getTeams(dataParam)).then(function(response) {
                if (response.data && response.data.teams) {
                    setTeams(response.data.teams);
                    setTeamUser(response.data.user);
                    const total_teams = response.data.total_teams;
                    setTotalTeams(total_teams);
                    const pages = Math.ceil(parseInt(total_teams) / 10);
                    setPages(pages);
                    // if (response.data.teams.length > 0) {
                    //   setTeamId(response.data.teams[0].id);
                    // }
                    if (limit !== '' && page !== '') setIsSearching(false);
                    setLoading(false);
                    return;
                }
                setLoading(false);
            });
        }

        React.useEffect(() => {
            getTeams(currentPage, 10, '');
        }, [dispatch]);

        const handlePageChange = (event, value) => {
            setCurrentPage(value);
            setLoading(true);
        };

        React.useEffect(() => {
            getTeams(currentPage, 10, '');
        }, [currentPage]);

        const searchTeams = (event) => {
            setIsSearching(true);
            const search = event.target.value;
            if (search === '') {
                setIsSearching(false);
                setCurrentPage(1);
                return;
            }
            getTeams('', '', search);
        };

        function reconnectTwitch(e) {
            e.preventDefault();
            dispatch(AppActions.reconnectTwitch()).then((response) => {
                if (response.redirect_url !== undefined) {
                    window.location.href = response.redirect_url;
                }
            });
        }

        if (tournamentDetail && !tournamentDetail.contest.enable_team_name == 1) {
            history.push(`/tournaments/${tournamentDetail.contest.hash_id}`);
        }
        // if (tournamentDetail.contest.streamingButtonVisibility || tournamentDetail.contest.isClosedEnroled) {
        //   history.push(`/tournaments/${tournamentDetail.contest.hash_id}/brackets`);
        // }
        // if (tournamentDetail && !tournamentDetail.contest.hasBrackets && startDate > now) {
        //   history.push(`/tournaments/${tournamentDetail.contest.hash_id}`);
        //   dispatch(
        //     AppActions.showMessage({
        //       message: `Hey ${loggedInUser.name
        //         }, This tournament will start at ${moment
        //           .utc(tournamentDetail.contest.date, "YYYY-MM-DD HH:mm:ss")
        //           .local()
        //           .format("MMM DD YYYY HH:mm:ss")}`,
        //       variant: "info",
        //     })
        //   );
        // }

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

        function closeCreateTeamModel(data) {
            if (data) {
                getTeams(currentPage, 10, '');
            }
            setModalShow(false)
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

        function bracketbaseTrackStream() {
            if (
                startDate <= now &&
                now < endDate &&
                tournamentDetail.contest.isEnrolled &&
                tournamentDetail.contest.streamingButtonVisibility
            ) {
                if (loggedInUser && loggedInUser.gamerzarena_plus) {
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
                styles.teamForm
            }
            onSubmit = {
                JoinTournament
            } >
            <
            div >
            <
            h1 > Join as team < /h1> <
            div className = {
                styles.teamWrapper
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
            /div> <
            br / >
            <
            br / > {
                tournamentDetail &&
                tournamentDetail.contest.stream_type === "tracked" && ( <
                    StrimingRules tournamentDetail = {
                        tournamentDetail
                    }
                    />
                )
            } {
                tournamentDetail.contest.min_age > 0 &&
                    tournamentDetail.contest.max_age > 0 && ( <
                        div className = {
                            styles.individualWrapper
                        } >
                        <
                        br / >
                        <
                        br / >
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
            } <
            br / >
            <
            br / >
            <
            h2 > Select a team < /h2> {
                teams && totalTeams > 10 && ( <
                    SearchBar teamClass = {
                        styles.searchBar
                    } >
                    <
                    input type = "search"
                    placeholder = "Search"
                    onChange = {
                        (e) => searchTeams(e)
                    }
                    /> <
                    /SearchBar>
                )
            } <
            Form.Group controlId = "formTeam"
            className = {
                styles.formGroup
            } > {
                loading ? ( <
                    > {
                        Array.from(new Array(5)).map((item, index) => {
                            return ( <
                                div className = {
                                    styles.teamOption
                                }
                                key = {
                                    index
                                }
                                style = {
                                    {
                                        display: "flex",
                                        alignItems: "center"
                                    }
                                } >
                                <
                                Skeleton variant = "circle"
                                width = {
                                    16
                                }
                                height = {
                                    16
                                }
                                style = {
                                    {
                                        marginRight: 20
                                    }
                                }
                                /> <
                                Skeleton variant = "circle"
                                width = {
                                    40
                                }
                                height = {
                                    40
                                }
                                /> <
                                div className = {
                                    styles.skeletonTextContainer
                                } >
                                <
                                Skeleton width = {
                                    170
                                }
                                variant = "text" / >
                                <
                                Skeleton width = {
                                    100
                                }
                                variant = "text" / >
                                <
                                /div> <
                                /div>
                            );
                        })
                    } <
                    />
                ) : ( <
                        > {
                            teams.map((team) => ( <
                                    div className = {
                                        styles.teamOption
                                    }
                                    key = {
                                        team.id
                                    } >
                                    <
                                    Form.Check className = {
                                        styles.formCheck
                                    }
                                    required type = "radio"
                                    id = {
                                        `team-${team.id}`
                                    }
                                    aria - label = {
                                        `team ${team.id}`
                                    }
                                    label = { < TeamLabel team = {
                                            team
                                        }
                                        openModal = {
                                            () => openModal(team.id)
                                        }
                                        />}
                                        name = "teamId"
                                        checked = {
                                            teamId === team.id
                                        }
                                        onChange = {
                                            () => setTeamId(team.id)
                                        }
                                        /> <
                                        /div>
                                    ))
                            } <
                            />
                        )
                    } <
                    /Form.Group> {
                        teams && !isSearching && totalTeams > 10 && ( <
                            div className = {
                                `${classes.root} ${styles.paginationWrapper}`
                            } >
                            <
                            Pagination count = {
                                pages
                            }
                            page = {
                                currentPage
                            }
                            size = "large"
                            shape = "rounded"
                            onChange = {
                                handlePageChange
                            }
                            /> <
                            /div>
                        )
                    }

                    <
                    p > Or create a team < /p> <
                    div className = {
                        styles.createTeam
                    }
                onClick = {
                    () => setModalShow(true)
                } >
                <
                div className = {
                    styles.plus
                } > < /div> <
                span > Create team < /span> <
                /div>

                {
                    genjiGames.includes(tournamentDetail.contest.game_slug) &&
                        <
                        Form.Group controlId = "formIndividualEmail" >
                        <
                        Form.Control
                    type = "text"
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
                    required
                        /
                        >
                        <
                        Form.Label className = {
                            styles.formLabel
                        } >
                        Your team name in game <
                        /Form.Label> <
                        /Form.Group>
                }

                {
                    ((!tournamentDetail.contest.hasBrackets && tournamentDetail.contest.stream_type === "tracked" && startDate <= now) ||
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
                }

                { /* {tournamentDetail.contest.hasBrackets && */ } <
                Form.Group controlId = "formIndividualRegion" >
                <
                Form.Control
                as = "select"
                required
                className = {
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
                /Form.Group> { /* } */ } {
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
                    loggedInUser && user_streaming !== null &&
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
                    !inProgress && teamId && loggedInUser && ( <
                        > {
                            user_streaming !== null &&
                            ((tournamentDetail.contest.min_age > 0 &&
                                    tournamentDetail.contest.max_age > 0 &&
                                    tournamentDetail.contest.max_age > user_streaming.current_age &&
                                    tournamentDetail.contest.min_age < user_streaming.current_age) ||
                                (tournamentDetail.contest.min_age <= 0 &&
                                    tournamentDetail.contest.max_age <= 0)) ? ( <
                                > { /* {now < endDate && now > startDate ? ( */ } {
                                    now < endDate ?
                                        <
                                        div > {
                                            teams ? ( <
                                                > {
                                                    tournamentDetail.contest.hasBrackets ? ( <
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

                                                                {!loggedInUser.gamerzarena_plus &&
                                                                    tournamentDetail.contest.isForGAPlus == 1 && ( <
                                                                        NavLink to = {
                                                                            `/profile/${loggedInUser.name}/settings/ga-plus`
                                                                        } >
                                                                        <
                                                                        Button variant = "primary" > Join GA < sup > + < /sup></Button >
                                                                        <
                                                                        /NavLink>
                                                                    )
                                                                }

                                                            {
                                                                tournamentDetail.contest.isForGAPlus == 1 &&
                                                                    loggedInUser.gamerzarena_plus && ( <
                                                                        Button type = "submit"
                                                                        variant = "primary" >
                                                                        <
                                                                        span > FREE < /span> Enrol <
                                                                        /Button>
                                                                    )
                                                            }

                                                            {
                                                                loggedInUser.gamerzarena_plus &&
                                                                    tournamentDetail.contest.isForGAPlus == 0 && ( <
                                                                        Button type = "submit"
                                                                        variant = "primary" >
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
                                                                        /span>
                                                                        Enrol <
                                                                        /Button>
                                                                    )
                                                            }

                                                            {
                                                                !loggedInUser.gamerzarena_plus &&
                                                                    tournamentDetail.contest.isForGAPlus == 0 && ( <
                                                                        Button type = "submit"
                                                                        variant = "primary" > {
                                                                            tournamentDetail.contest.entry_fee > 0 && ( <
                                                                                span > {
                                                                                    getEntryFee()
                                                                                } < /span>
                                                                            )
                                                                        }
                                                                        Enrol <
                                                                        /Button>
                                                                    )
                                                            } <
                                                            /div>
                                                        } <
                                                        />
                                                    ) : ( <
                                                        > {
                                                            startDate <= now ?
                                                            <
                                                            div className = {
                                                                styles.buttonWrapper
                                                            } > {
                                                                tournamentDetail &&
                                                                !tournamentDetail.contest
                                                                .is_re_entry_for_contest ? ( <
                                                                    > {
                                                                        loggedInUser.gamerzarena_plus ? ( <
                                                                            > {
                                                                                tournamentDetail.contest.isForGAPlus ==
                                                                                1 ? ( <
                                                                                    Button type = "submit"
                                                                                    variant = "primary" >
                                                                                    <
                                                                                    span > FREE < /span> Enter <
                                                                                    /Button>
                                                                                ) : ( <
                                                                                    > {
                                                                                        tournamentDetail.contest.isForGAPlus == 0 ? ( <
                                                                                            Button type = "submit"
                                                                                            variant = "primary" >
                                                                                            <
                                                                                            span > {
                                                                                                tournamentDetail.contest
                                                                                                .entry_fee > 0 ? ( <
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
                                                                                            /Button>
                                                                                        ) : ( <
                                                                                            Button type = "submit"
                                                                                            variant = "primary" >
                                                                                            <
                                                                                            span > {
                                                                                                tournamentDetail.contest
                                                                                                .entry_fee > 0 ?
                                                                                                getEntryFee() :
                                                                                                    "FREE"
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
                                                                                tournamentDetail.contest.isForGAPlus ==
                                                                                1 ? ( <
                                                                                    NavLink to = {
                                                                                        `/profile/${loggedInUser.name
                                                        }/settings/ga-plus`
                                                                                    } >
                                                                                    <
                                                                                    Button variant = "primary" >
                                                                                    Join GA < sup > + < /sup> <
                                                                                    /Button> <
                                                                                    /NavLink>
                                                                                ) : ( <
                                                                                    Button type = "submit"
                                                                                    variant = "primary" >
                                                                                    <
                                                                                    span > {
                                                                                        tournamentDetail.contest.entry_fee >
                                                                                        0 ?
                                                                                        getEntryFee() :
                                                                                            "FREE"
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
                                                                            Button variant = "primary" >
                                                                            Join GA < sup > + < /sup> <
                                                                            /Button> <
                                                                            /NavLink>
                                                                        )
                                                                    }

                                                                    {
                                                                        tournamentDetail.contest.isForGAPlus == 1 &&
                                                                            loggedInUser.gamerzarena_plus && ( <
                                                                                Button type = "submit"
                                                                                variant = "primary" >
                                                                                <
                                                                                span > {
                                                                                    tournamentDetail.contest.reentry_fee >
                                                                                    0 ?
                                                                                    getEntryFee() :
                                                                                        "Free"
                                                                                } <
                                                                                /span>
                                                                                Enter <
                                                                                /Button>
                                                                            )
                                                                    }

                                                                    {
                                                                        loggedInUser.gamerzarena_plus &&
                                                                            tournamentDetail.contest.isForGAPlus == 0 && ( <
                                                                                Button type = "submit"
                                                                                variant = "primary" >
                                                                                <
                                                                                span > {
                                                                                    tournamentDetail.contest.reentry_fee >
                                                                                    0 ?
                                                                                    getEntryFee() :
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
                                                                                    tournamentDetail.contest.reentry_fee >
                                                                                    0 ?
                                                                                    getEntryFee() :
                                                                                        "Free"
                                                                                } <
                                                                                /span>
                                                                                Enter <
                                                                                /Button>
                                                                            )
                                                                    } <
                                                                    />
                                                                )
                                                            } <
                                                            /div> :
                                                                <
                                                                Button variant = "primary"
                                                            type = "submit"
                                                            disabled = {
                                                                tournamentDetail.contest.registration.isClosed
                                                            } >
                                                            REGISTER <
                                                            /Button>
                                                        } <
                                                        />
                                                    )
                                                } <
                                                />
                                            ) : ( <
                                                >

                                                <
                                                />
                                            )
                                        } <
                                        /div> :
                                        <
                                        >

                                        <
                                        />
                                } <
                                br / >
                                <
                                br / >
                                <
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
                        />
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
                } <
                /Form>

                <
                CreateTeam
                modalShow = {
                    modalShow
                }
                onHide = {
                    closeCreateTeamModel
                }
                teamId = {
                    currentTeamId
                }
                contestId = {
                    tournamentDetail.contest.id
                }
                contestName = {
                    tournamentDetail.contest.name
                }
                /> <
                /motion.div>
            );
        };

        export default JoinIndividual;

        const TeamLabel = ({
            team,
            openModal
        }) => ( <
            >
            <
            div className = {
                styles.teamLabel
            }
            onClick = {
                () => openModal()
            } >
            <
            img src = {
                team.image ? team.image : placeholderProfileImage
            }
            alt = "Team logo"
            className = {
                styles.profilePhotoTeam
            }
            /> <
            div className = {
                styles.text
            } >
            <
            h3 > {
                team.team_name
            } < /h3> <
            span > {
                kmFormatter(team.users.length)
            }
            Members < /span> <
            /div>

            {
                /* <button
                        type={"button"}
                        onClick={() => openModal(team.id)}
                      >Edit</button> */
            } <
            /div> <
            />
        );