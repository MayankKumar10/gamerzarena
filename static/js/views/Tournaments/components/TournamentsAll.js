/* eslint-disable */

import React from "react";
import withSizes from "react-sizes";
import {
    motion
} from "framer-motion";
import TournamentsGrid from "./TournamentsGrid";
import {
    Helmet
} from "react-helmet";

function TournamentsAll(props) {

    const variants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1
        },
    };


    return ( <
        motion.div initial = "hidden"
        animate = "visible"
        variants = {
            variants
        }
        className = "content-right tournaments-all" >
        <
        Helmet >
        <
        title > Tournaments - GamerzArena < /title> <
        meta name = "Arena"
        content = "Tournaments - GamerzArena" / >
        <
        meta property = "og:title"
        content = "Tournaments - GamerzArena" / >
        <
        /Helmet> <
        TournamentsGrid / >
        <
        /motion.div>
    );
}

const mapSizesToProps = ({
    width
}) => ({
    isMobile: width < 1000,
});

export default withSizes(mapSizesToProps)(TournamentsAll);