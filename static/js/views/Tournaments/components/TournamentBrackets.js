/* eslint-disable */

import React from "react";
import withSizes from "react-sizes";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import {
    motion,
    AnimatePresence
} from "framer-motion";

import $ from "jquery";
import "components/brackets.js";
import {
    timeAgo
} from "functions/timeAgo";
import "components/brackets.js";
import {
    useDispatch,
    useSelector
} from "react-redux";
import * as moment from "moment";
import * as Actions from "../store/actions";
import {
    Helmet
} from "react-helmet";

import {
    useParams
} from "react-router-dom";

import ScheduleAnnoucements from "./ScheduleAnnoucements";

const TournamentBrackets = (props) => {
    const dispatch = useDispatch();
    const variants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1
        },
        exit: {
            opacity: 0
        },
    };
    let {
        tournamentId
    } = useParams();

    const game = props.game;
    let brackets = useSelector(
        ({
            TournamentAppStore
        }) => TournamentAppStore.tournamentApp.bracketDetail
    );
    let tournament = useSelector(
        ({
            TournamentAppStore
        }) =>
        TournamentAppStore.tournamentApp.tournamentDetail
    );
    const [sideType, setSideType] = React.useState("schedule");
    const [matchType, setMatchType] = React.useState("upcoming");
    const [loaded, setLoaded] = React.useState(false);
    const announcements =
        brackets !== undefined && brackets !== null ? brackets.announcements : null;
    let currentUpcomingDate = null;
    let currentFinishedDate = null;

    React.useEffect(() => {
        if (tournament && tournament.contest.hasBrackets) {
            dispatch(Actions.getBracketDetail(tournamentId, $(".platform:checked").val()));
        }
    }, [tournament])


    const [platform, setPlatform] = React.useState(
        brackets !== undefined &&
        brackets !== null &&
        brackets.platforms !== undefined &&
        brackets.platforms.length > 0 ?
        brackets.platforms[0].name :
        ""
    );
    // let platform = (brackets!==undefined && brackets!==null && brackets.platforms!==undefined  && brackets.platforms.length>0) ? brackets.platforms[0].name : '';

    React.useEffect(() => {
        $(".platform").off("change");
        $(".platform").on("change", function() {
            onChangePlatform(platform);
        });
    });

    React.useEffect(() => {
        if (brackets !== undefined && brackets !== null) {
            let bigData = {
                teams: brackets.bracket_data.teams,
                results: [brackets.bracket_data.winners, brackets.bracket_data.loosers],
            };
            $(".brackets").bracket({
                init: bigData /* data to initialize the bracket with */ ,
                centerConnectors: true,
                teamWidth: 130,
                scoreWidth: 30,
                matchMargin: 50,
                roundMargin: 50,
                skipConsolationRound: true,
                /* set true for Skip the round to determine 3rd and 4th places.*/
                disableToolbar: true,
                // save: false,
                save: function(data) {} /* without save() labels are disabled */ ,
                decorator: {
                    edit: edit_bracket,
                    render: render_bracket,
                },
                onMatchHover: null, // callback
            });

            $(".score.editable").off("click");
            $(".score.editable").off("click", function(e) {
                e.preventDefault();
                return false;
            });

            if ($(".platform:checked").val() === undefined) {
                $(".formRadio:first").trigger("click");
            }
        }
    });

    if (
        brackets !== undefined &&
        brackets !== null &&
        brackets.platforms !== undefined &&
        brackets.platforms[0] !== undefined
    ) {
        if (!loaded) {
            dispatch(
                Actions.getBracketDetail(
                    tournament.contest.hash_id,
                    brackets.platforms[0].name
                )
            );
            setPlatform(brackets.platforms[0].name);
            setLoaded(true);
        }
    }

    function onChangePlatform(value) {
        setPlatform(value);
        dispatch(
            Actions.getBracketDetail(
                tournament.contest.hash_id,
                value !== undefined ? value : platform
            )
        );
    }

    function edit_bracket(container, data, doneCb) {
        doneCb({
            name: data.name,
            match_id: data.match_id,
        });
    }

    function render_bracket(container, data, score, state) {
        switch (state) {
            case "empty-bye":
                container.append("BYE");
                return;
            case "empty-tbd":
                container.append("TBD");
                return;
            case "entry-no-score":
            case "entry-default-win":
            case "entry-complete":
                if (data.name !== null) {
                    container.append(data.name);
                } else {
                    container.append("BYE");
                }
                return;
        }
    }

    return ( <
        motion.div initial = "hidden"
        animate = "visible"
        variants = {
            variants
        }
        className = "tournament-inner tournament-brackets" >
        <
        Helmet >
        <
        title > {
            game ? `${game} Brackets - GamerzArena` : 'Tournament Brackets - GamerzArena'
        } < /title> <
        meta name = "Tournament Brackets"
        content = "GamerzArena Tournament Brackets" /
        >
        <
        meta property = "og:title"
        content = "Tournament Brackets - GamerzArena" / >
        <
        meta property = "og:description"
        content = "Hey! Checkout this awesome Tournament. Participate in exciting tournaments inside GamerzArena - the world's leading esports platform and community for gamers" / >
        <
        meta name = "description"
        content = "Hey! Checkout this awesome Tournament. Participate in exciting tournaments inside GamerzArena - the world's leading esports platform and community for gamers" / >
        <
        meta name = "keywords"
        content = "esports, gamerz, community, playstation, ps4, ps5, xbox, xbox one, xbox series x, xbox series s, pc games, fifa, madden, head to head challenge" / >
        <
        meta property = "og:image"
        content = "https://pbs.twimg.com/profile_images/928696631561740288/2dR3FDsz.jpg" / >
        <
        /Helmet> <
        div className = "brackets-main" >
        <
        div className = "brackets-rounds-wrapper" >
        <
        div className = "brackets-rounds" > {
            brackets !== undefined &&
            brackets !== null &&
            brackets.rounds !== undefined &&
            brackets.rounds !== null &&
            brackets.rounds.map((round, index) => ( <
                div key = {
                    index
                }
                className = "round" >
                <
                span > {
                    round.title
                } < /span> <
                h3 > {
                    moment(moment.utc(round.time, 'YYYY-MM-DD HH:mm:ss').local()).format("MMMM D, hh:mm A")
                } < /h3> <
                /div>
            ))
        } <
        /div> {
            brackets !== undefined &&
                brackets !== null &&
                brackets.platforms !== undefined &&
                brackets.platforms !== null && ( <
                    div className = "dropdown-wrapper" >
                    <
                    DropdownButton alignRight className = {
                        "platform"
                    }
                    title = {
                        `Platform${platform && ":"} ${platform}`
                    }
                    id = "dropdown-menu-align-right"
                    variant = "outline-secondary" >
                    {
                        brackets.platforms.map((platformName, index) => ( <
                            Dropdown.Item as = "button"
                            key = {
                                index
                            }
                            // onClick={() => selectPlatform(platformName.name)}
                            onClick = {
                                () => onChangePlatform(platformName.name)
                            }
                            className = {
                                platformName.name === platform ? "active" : ""
                            } >
                            {
                                platformName.name
                            } <
                            /Dropdown.Item>
                        ))
                    } <
                    /DropdownButton> <
                    /div>
                )
        } <
        /div>

        <
        div id = "brackets"
        className = {
            "brackets"
        } > < /div> <
        /div>

        <
        div className = "brackets-side" >
        <
        ScheduleAnnoucements brackets = {
            brackets
        }
        announcements = {
            announcements
        }
        /> <
        /div> <
        /motion.div>
    );
};

const mapSizesToProps = ({
    width
}) => ({
    isMobile: width < 1000,
});

export default withSizes(mapSizesToProps)(TournamentBrackets);