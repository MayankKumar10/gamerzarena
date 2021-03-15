/* eslint-disable */

import React from 'react';
import {
    NavLink
} from 'react-router-dom';
import {
    motion
} from 'framer-motion';
import IconTeam from '../../../assets/images/icons/team-icon.svg';
import IconIndividual from '../../../assets/images/icons/individual-icon.svg';

import styles from './JoinOptions.module.scss';

const JoinOptions = (props) => {
        const [link, setLink] = React.useState();

        const variants = {
            hidden: {
                opacity: 0
            },
            visible: {
                opacity: 1
            },
        };


        return (

            <
            motion.div initial = 'hidden'
            animate = 'visible'
            variants = {
                variants
            }
            className = {
                styles.optionContainer
            } >
            <
            div >
            <
            h1 > Join Tournament < /h1>

            <
            div className = {
                styles.optionsWrapper
            } >
            <
            div className = {
                `${styles.option} ${(link === 'team' && styles.optionActive)}`
            }
            onClick = {
                () => setLink('team')
            } >
            <
            div className = {
                styles.optionIcon
            } >
            <
            img src = {
                IconTeam
            }
            alt = 'Team icon' / >
            <
            /div> <
            h2 > Join as team < /h2> <
            p > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do usmod tempor incididunt ut labore et dolore < /p>

                <
                /div>

                <
                div className = {
                    `${styles.option} ${(link === 'individual' && styles.optionActive)}`
                }
            onClick = {
                () => setLink('individual')
            } >
            <
            div className = {
                styles.optionIcon
            } >
            <
            img src = {
                IconIndividual
            }
            alt = 'Individual icon' / >

            <
            /div> <
            h2 > Join as individual < /h2> <
            p > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do usmod tempor incididunt ut labore et dolore < /p>

                <
                /div>

                <
                /div>

                <
                /div> {
                    link && < NavLink to = {
                            `/tournaments/${props.matchParams.tournamentId}/join/${link}`
                        } > Next < Icon / > < /NavLink>} <
                        /motion.div >
                );

        }



        export default JoinOptions

        const Icon = () => ( <
            svg xmlns = "http://www.w3.org/2000/svg"
            width = "34"
            height = "15"
            viewBox = "0 0 34 15" >
            <
            path fill = "#0078FF"
            d = "M23.935 2.356c-.592-.487-.592-1.38-.084-1.948.592-.487 1.438-.568 2.03-.08L34 7.47l-8.12 7.142c-.591.568-1.437.487-2.03-.08-.507-.488-.507-1.38.085-1.868L28.25 8.85H1.438C.677 8.85 0 8.28 0 7.47 0 6.74.677 6.17 1.438 6.17h26.81l-4.313-3.815z" / >
            <
            /svg>
        )