/* eslint-disable */

import React from 'react';
import withSizes from 'react-sizes';
import TournamentsAll from './components/TournamentsAll';
import SingleTournament from './components/SingleTournament';
import JoinTournament from './components/JoinTournament';
import * as Actions from "./store/actions";
import withReducer from "../../store/withReducer";
import reducer from "./store/reducers";
import {
    useDispatch,
    useSelector
} from "react-redux";
import TournamentsLayout from '../../layouts/tournaments/TournamentsLayout';

// import loadable from '@loadable/component'

// const TournamentsAll = loadable(() => import('./components/TournamentsAll'))
// const JoinTournament = loadable(() => import('./components/JoinTournament'))
// const SingleTournament = loadable(() => import('./components/SingleTournament'))

function TournamentsPage(props) {
    const dispatch = useDispatch();

    if (props.match.params.tournamentScreen !== 'join') {
        React.useEffect(() => {
            dispatch(Actions.getLandingTournments());
        }, [dispatch]);
    }

    const loggedInUser = useSelector(({
        core
    }) => core.appStore.loggedInUser);

    return ( <
        div className = 'site' >
        <
        TournamentsLayout loggedIn = {!!loggedInUser
        }
        match = {
            props.match
        } > {!props.match.params.tournamentId ?
            <
            TournamentsAll / >
            :
                props.match.params.tournamentScreen === 'join' ?
                <
                JoinTournament matchParams = {
                    props.match.params
                }
            />:
                <
                SingleTournament matchParams = {
                    props.match.params
                }
            />
        } <
        /TournamentsLayout> <
        /div>

    );
}


const mapSizesToProps = ({
    width
}) => ({
    isMobile: width < 1000,
})

const TournamentsPagewithSizes = withSizes(mapSizesToProps)(TournamentsPage)

export default withReducer('TournamentAppStore', reducer)(TournamentsPagewithSizes);