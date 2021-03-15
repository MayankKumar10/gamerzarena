import * as Actions from "../actions";
// // import * as moment from 'moment';

const initialState = {
    tournamentsLanding: null,
    tournamentDetail: null,
    leaderboard: null,
    bestPlayer: null,
    participants: null,
    teamRanking: null,
    liveStreamData: null,
    countries: null,
    tournaments: null,
    games: null,
    game: null,
    platforms: null,
    tournamentsCount: 0,
    filterStatus: false,
    submitedResults: null,
};

const Reducer = function(state = initialState, action) {
    switch (action.type) {
        case Actions.GET_SUBMITED_RESULTS:
            {
                return {
                    ...state,
                    submitedResults: action.payload,
                };
            }
        case Actions.GET_TOURNAMENTS_LANDING:
            {
                return {
                    ...state,
                    tournamentsLanding: action.payload,
                };
            }
        case Actions.GET_TOURNAMENTS:
            {
                let data = [];
                if (action.filter) {
                    data = [];
                } else if (state.filterStatus) {
                    data = [];
                } else {
                    data = state.tournaments ? state.tournaments : [];
                }
                return {
                    ...state,
                    tournaments: [
                        ...data,
                        ...(action.payload.data ? action.payload.data : []),
                    ], //action.payload.data,
                    tournamentsCount: action.payload.count,
                    // filterStatus: action.filter,
                    games: action.games,
                    game: action.game,
                    platforms: action.platforms,
                };
            }

        case Actions.GET_TOURNAMENT_DETAIL:
            {
                return {
                    ...state,
                    tournamentDetail: action.payload,
                };
            }

        case Actions.RESET_TOURNAMENT_DETAIL:
            {
                return {
                    ...state,
                    tournamentDetail: action.payload,
                };
            }

        case Actions.GET_TOURNAMENT_BRACKET:
            {
                return {
                    ...state,
                    bracketDetail: action.payload,
                };
            }

        case Actions.LEADERBOARD:
            {
                return {
                    ...state,
                    leaderboard: action.payload,
                };
            }
        case Actions.BEST_PLAYER:
            {
                return {
                    ...state,
                    bestPlayer: action.payload,
                };
            }
        case Actions.PARTICIPANTS:
            {
                return {
                    ...state,
                    participants: action.payload,
                };
            }
        case Actions.TEAM_RANKING:
            {
                return {
                    ...state,
                    teamRanking: action.payload,
                };
            }
        case Actions.GET_LIVE_STREAM:
            {
                return {
                    ...state,
                    liveStreamData: action.payload,
                };
            }

        default:
            {
                return state;
            }
    }
};

export default Reducer;