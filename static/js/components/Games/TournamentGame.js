import React from 'react';
import {
    NavLink
} from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import styles from './TournamentGame.module.scss';

const TournamentGame = (props) => {
    return ( <
        div className = '' > {
            props.game ?
            <
            >
            <
            div className = {
                `${styles.game}`
            } >
            <
            div className = {
                styles.img
            } >
            <
            img onClick = {
                () => props.setFilter("Games", props.game.gameTitle)
            }
            className = {
                `${props.game.gameTitle == props.selectedGame  ? styles.selected : ""}`
            }
            src = {
                props.game.titleImage
            }
            title = {
                props.game.gameTitle
            }
            alt = {
                props.game.gameTitle
            }
            /> <
            /div> <
            /div> <
            /> :
                <
                NavLink to = {
                    `/tournaments`
                } >
                <
                Skeleton animation = "wave"
            variant = "rect"
            height = {
                130
            }
            width = "100%" / >
            <
            /NavLink>
        } <
        /div>
    );
}

export default TournamentGame;