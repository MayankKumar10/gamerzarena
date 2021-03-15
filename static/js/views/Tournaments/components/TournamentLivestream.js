/* eslint-disable */

import React from "react";
import {
    motion
} from "framer-motion";
import {
    useDispatch,
    useSelector
} from "react-redux";
import LiveStream from "components/Tournaments/LiveStream";
import {
    Helmet
} from "react-helmet";

const TournamentLivestream = (props) => {
    const variants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1
        },
    };
    const liveStreamData = useSelector(
        ({
            TournamentAppStore
        }) => TournamentAppStore.tournamentApp.liveStreamData
    );
    const tournamentDetail = useSelector(
        ({
            TournamentAppStore
        }) =>
        TournamentAppStore.tournamentApp.tournamentDetail
    );

    const game = props.game;

    if (!liveStreamData) {
        return ( <
            div >
            <
            Helmet >
            <
            title > {
                game ? `${game} Livestream | GamerzArena` : 'Tournament Livestream | GamerzArena'
            } < /title> <
            meta name = "Tournament Livestream"
            content = "GamerzArena Tournament Livestream" /
            >
            <
            meta property = "og:title"
            content = "__TITLE__" / >
            <
            meta property = "og:description"
            content = "__DESCRIPTION__" / >
            <
            meta name = "description"
            content = "__DESCRIPTION__" / >
            <
            meta name = "keywords"
            content = "__KEYWORDS__" / >
            <
            meta property = "og:image"
            content = "__IMAGE__" / >
            <
            /Helmet>
            No live stream available <
            /div>
        );
    }

    return ( <
        motion.div initial = "hidden"
        animate = "visible"
        variants = {
            variants
        }
        className = "tournament-inner white-bg" >
        <
        Helmet >
        <
        title > {
            game ? `${game} Livestream - GamerzArena` : 'Tournament Livestream - GamerzArena'
        } < /title> <
        meta name = "Tournament Livestream"
        content = "GamerzArena Tournament Livestream" /
        >
        <
        meta property = "og:title"
        content = "Tournament Livestream - GamerzArena" / >
        <
        meta property = "og:description"
        content = "Hey! Watch Livestream for this awesome Tournament. Participate in exciting tournaments inside GamerzArena - the world's leading esports platform and community for gamers" / >
        <
        meta name = "description"
        content = "Hey! Watch Livestream for this awesome Tournament. Participate in exciting tournaments inside GamerzArena - the world's leading esports platform and community for gamers" / >
        <
        meta name = "keywords"
        content = "esports, gamerz, community, playstation, ps4, ps5, xbox, xbox one, xbox series x, xbox series s, pc games, fifa, madden, head to head challenge" / >
        <
        meta property = "og:image"
        content = "https://pbs.twimg.com/profile_images/928696631561740288/2dR3FDsz.jpg" / >
        <
        /Helmet> <
        LiveStream data = {
            liveStreamData
        }
        liveMatch = {
            null
        }
        tournamentDetail = {
            tournamentDetail
        }
        host = {
            Object.entries(tournamentDetail.contest.host).length > 0 ?
            tournamentDetail.contest.host :
                null
        }
        /> <
        /motion.div>
    );
};

export default TournamentLivestream;