/* eslint-disable */

import React from 'react';
import {
    useParams
} from 'react-router-dom';
import withSizes from 'react-sizes';
import {
    motion
} from 'framer-motion';
import {
    currencyFormatter
} from '../../../functions/formatters';
import {
    NavLink
} from 'react-router-dom';
import 'moment-timezone';
import {
    useDispatch,
    useSelector
} from "react-redux";
import CurrencyWrapper from 'components/CurrencyWrapper/CurrencyWrapper';

import {
    useLocation
} from "react-router-dom";
import {
    Helmet
} from "react-helmet";


const TournamentLeaderboard = (props) => {
    let location = useLocation();
    const variants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1
        },
    };
    let {
        tournamentId
    } = useParams();
    const loggedInUser = useSelector(({
        core
    }) => core.appStore.loggedInUser);

    const game = props.game;

    const tournamentDetail = useSelector(({
        TournamentAppStore
    }) => TournamentAppStore.tournamentApp.tournamentDetail);
    const leaderboard = useSelector(({
        TournamentAppStore
    }) => TournamentAppStore.tournamentApp.leaderboard);
    const bestPlayer = useSelector(({
        TournamentAppStore
    }) => TournamentAppStore.tournamentApp.bestPlayer);
    const participants = useSelector(({
        TournamentAppStore
    }) => TournamentAppStore.tournamentApp.participants);
    const teamRanking = useSelector(({
        TournamentAppStore
    }) => TournamentAppStore.tournamentApp.teamRanking);
    const currency = useSelector(({
        core
    }) => core.appStore.currency);
    const currencyRates = useSelector(({
        core
    }) => core.appStore.currencyRates);


    React.useEffect(() => {
        if (leaderboard && loggedInUser) {
            const userInLeaderboard = leaderboard.filter(user => user.playerId === loggedInUser.id);
        }
    }, [leaderboard, loggedInUser]);

    return ( <
        motion.div initial = "hidden"
        animate = "visible"
        variants = {
            variants
        }
        className = "tournament-inner white-bg tournament-leaderboard" >
        <
        Helmet >
        <
        title > {
            game ? `${game} Leaderboard - GamerzArena` : 'Tournament Leaderboard - GamerzArena'
        } < /title> <
        meta name = "Tournament Leaderboard"
        content = "GamerzArena Tournament Leaderboard" /
        >
        <
        meta property = "og:title"
        content = "Tournament Leaderboard - GamerzArena" / >
        <
        meta property = "og:description"
        content = "Hey! Look at the leaderboard for this awesome Tournament. Participate in exciting tournaments inside GamerzArena - the world's leading esports platform and community for gamers" / >
        <
        meta name = "description"
        content = "Hey! Look at the leaderboard for this awesome Tournament. Participate in exciting tournaments inside GamerzArena - the world's leading esports platform and community for gamers" / >
        <
        meta name = "keywords"
        content = "esports, gamerz, community, playstation, ps4, ps5, xbox, xbox one, xbox series x, xbox series s, pc games, fifa, madden, head to head challenge" / >
        <
        meta property = "og:image"
        content = "https://pbs.twimg.com/profile_images/928696631561740288/2dR3FDsz.jpg" / >
        <
        /Helmet>

        <
        div className = "tournament-inner--left tournament-leaderboard--left" >
        <
        h2 > {
            " "
        } {
            tournamentDetail.contest.hasBrackets ?
                "Participant" :
                "Leaderboard"
        } <
        /h2> <
        div className = "leaderboard-grid main" >
        <
        div className = "line heading" >
        <
        span > Ranking < /span> <
        span > Player < /span> <
        span > Score < /span> <
        span > Prize < /span> {
            tournamentDetail.contest.enable_team_name == 1 && ( <
                span > Team < /span>
            )
        } <
        /div>

        {
            leaderboard && leaderboard.length > 0 ?
                leaderboard.map((line, index) => ( <
                    div key = {
                        index
                    }
                    id = {
                        `leaderboard-line-${line.rank}`
                    }
                    className = "leaderboard-line" >
                    <
                    div className = "line" >
                    <
                    span className = "rank" > {
                        line.rank
                    } < /span> <
                    div className = "player" >
                    <
                    img src = {
                        line.playerAvatar
                    }
                    alt = "Player avatar" / >
                    <
                    div className = "player-name" >
                    <
                    p > {
                        line.playerUserName
                    } < /p> <
                    p title = {
                        line.playerName
                    } > {
                        `@${line.playerName.length > 10 ? line.playerName.substring(0, 10) + '...': line.playerName}`
                    } < /p> <
                    /div> <
                    /div> <
                    span className = "score" > {
                        line.score ? line.score : "-"
                    } <
                    /span>

                    {
                        !line.isMerchandise ?
                            <
                            span className = "prize" > {
                                tournamentDetail.contest.prizeType ===
                                "Amount Based" ? ( <
                                    CurrencyWrapper amount = {
                                        line.prize || 0
                                    }
                                    />
                                ) : (
                                    line.prize
                                )
                            } <
                            /span> :
                            <
                            span className = "prize" >
                            <
                            div className = "team" >
                            <
                            div className = "img"
                        style = {
                                {
                                    backgroundImage: `url(${line.merchandise_prize_image})`
                                }
                            } > < /div> {
                                /* <div className="img">
                                                              <img src={line.merchandise_prize_image}  alt="merchandise_prize_image" />
                                                            </div> */
                            } <
                            div className = "prize-text" > {
                                line.merchandise_prize
                            } < /div> <
                            /div> <
                            /span>
                    } {
                        tournamentDetail.contest.enable_team_name == 1 && ( <
                            div className = "team" >
                            <
                            img src = {
                                line.team.image
                            }
                            alt = "Team logo" / >
                            <
                            span > {
                                line.team.name
                            } < /span> <
                            /div>
                        )
                    } <
                    /div> {
                        loggedInUser && loggedInUser.id === line.playerId && ( <
                            div style = {
                                {
                                    position: "relative",
                                    bottom: "12px",
                                    left: "108px",
                                    width: "fit-content"
                                }
                            } >
                            { /* Sharingbutton Facebook --> */ } <
                            a class = "resp-sharing-button__link"
                            href = {
                                `https://facebook.com/sharer/sharer.php?u=${window.location.href}`
                            }
                            target = "_blank"
                            rel = "noopener"
                            aria - label = "" >
                            <
                            div class = "resp-sharing-button resp-sharing-button--facebook resp-sharing-button--small" >
                            <
                            div aria - hidden = "true"
                            class = "resp-sharing-button__icon resp-sharing-button__icon--solid" >
                            <
                            svg xmlns = "http://www.w3.org/2000/svg"
                            viewBox = "0 0 24 24" >
                            <
                            path d = "M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" / >
                            <
                            /svg> <
                            /div> <
                            /div> <
                            /a>

                            { /* Sharingbutton Twitter --> */ } <
                            a class = "resp-sharing-button__link"
                            href = {
                                `https://twitter.com/intent/tweet/?text=${`Yay! I won ${
                            tournamentDetail.contest.prizeType ===
                            "Amount Based"
                              ? currency.symbol +
                                (
                                  line.prize *
                                  currencyRates.rates[currency.code]
                                ).toFixed(2)
                              : line.prize + " Points"
                          } for playing game on GamerzArena!`}&amp;url=${
                            window.location.href
                          }`
                            }
                            target = "_blank"
                            rel = "noopener"
                            aria - label = "" >
                            <
                            div class = "resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small" >
                            <
                            div aria - hidden = "true"
                            class = "resp-sharing-button__icon resp-sharing-button__icon--solid" >
                            <
                            svg xmlns = "http://www.w3.org/2000/svg"
                            viewBox = "0 0 24 24" >
                            <
                            path d = "M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" / >
                            <
                            /svg> <
                            /div> <
                            /div> <
                            /a>

                            { /* Sharingbutton LinkedIn --> */ } <
                            a class = "resp-sharing-button__link"
                            href = {
                                `https://www.linkedin.com/shareArticle?mini=true&amp;url=${
                            window.location.href
                          }&amp;title=${`Yay! I won ${
                            tournamentDetail.contest.prizeType ===
                            "Amount Based"
                              ? currency.symbol +
                                (
                                  line.prize *
                                  currencyRates.rates[currency.code]
                                ).toFixed(2)
                              : line.prize + " Points"
                          } for playing game on GamerzArena!`}&amp;summary=${`Yay! I won ${
                            tournamentDetail.contest.prizeType ===
                            "Amount Based"
                              ? currency.symbol +
                                (
                                  line.prize *
                                  currencyRates.rates[currency.code]
                                ).toFixed(2)
                              : line.prize + " Points"
                          } for playing game on GamerzArena!`}&amp;source=${
                            window.location.href
                          }`
                            }
                            target = "_blank"
                            rel = "noopener"
                            aria - label = "" >
                            <
                            div class = "resp-sharing-button resp-sharing-button--linkedin resp-sharing-button--small" >
                            <
                            div aria - hidden = "true"
                            class = "resp-sharing-button__icon resp-sharing-button__icon--solid" >
                            <
                            svg xmlns = "http://www.w3.org/2000/svg"
                            viewBox = "0 0 24 24" >
                            <
                            path d = "M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z" / >
                            <
                            /svg> <
                            /div> <
                            /div> <
                            /a>

                            { /* Sharingbutton WhatsApp --> */ } <
                            a class = "resp-sharing-button__link"
                            href = {
                                `whatsapp://send?text=${`Yay! I won ${
                            tournamentDetail.contest.prizeType ===
                            "Amount Based"
                              ? currency.symbol +
                                (
                                  line.prize *
                                  currencyRates.rates[currency.code]
                                ).toFixed(2)
                              : line.prize + " Points"
                          } for playing game on GamerzArena!` +
                            window.location.href}`
                            }
                            target = "_blank"
                            rel = "noopener"
                            aria - label = "" >
                            <
                            div class = "resp-sharing-button resp-sharing-button--whatsapp resp-sharing-button--small" >
                            <
                            div aria - hidden = "true"
                            class = "resp-sharing-button__icon resp-sharing-button__icon--solid" >
                            <
                            svg xmlns = "http://www.w3.org/2000/svg"
                            viewBox = "0 0 24 24" >
                            <
                            path d = "M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6-1.6c1.6.9 3.5 1.3 5.4 1.3 6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.3-.3.4-.5.1-.2 0-.4 0-.5C10 9 9.3 7.6 9 7c-.1-.4-.4-.3-.5-.3h-.6s-.4.1-.7.3c-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5z" / >
                            <
                            /svg> <
                            /div> <
                            /div> <
                            /a>

                            { /* Sharingbutton Telegram --> */ } <
                            a class = "resp-sharing-button__link"
                            href = {
                                `https://telegram.me/share/url?text=${`Yay! I won ${
                            tournamentDetail.contest.prizeType ===
                            "Amount Based"
                              ? currency.symbol +
                                (
                                  line.prize *
                                  currencyRates.rates[currency.code]
                                ).toFixed(2)
                              : line.prize + " Points"
                          } for playing game on GamerzArena!`}&amp;url=${
                            window.location.href
                          }`
                            }
                            target = "_blank"
                            rel = "noopener"
                            aria - label = "" >
                            <
                            div class = "resp-sharing-button resp-sharing-button--telegram resp-sharing-button--small" >
                            <
                            div aria - hidden = "true"
                            class = "resp-sharing-button__icon resp-sharing-button__icon--solid" >
                            <
                            svg xmlns = "http://www.w3.org/2000/svg"
                            viewBox = "0 0 24 24" >
                            <
                            path d = "M.707 8.475C.275 8.64 0 9.508 0 9.508s.284.867.718 1.03l5.09 1.897 1.986 6.38a1.102 1.102 0 0 0 1.75.527l2.96-2.41a.405.405 0 0 1 .494-.013l5.34 3.87a1.1 1.1 0 0 0 1.046.135 1.1 1.1 0 0 0 .682-.803l3.91-18.795A1.102 1.102 0 0 0 22.5.075L.706 8.475z" / >
                            <
                            /svg> <
                            /div> <
                            /div> <
                            /a> <
                            /div>
                        )
                    } <
                    /div>
                )) :
                tournamentDetail &&
                tournamentDetail.contest.prizePool.places.map((line, index) => ( <
                    div key = {
                        index
                    }
                    className = "line"
                    id = {
                        `leaderboard-line-${line}`
                    } >
                    <
                    span className = "rank" > {
                        index + 1
                    } < /span> <
                    div className = "player" > { /* <img src={line.playerAvatar} alt='Player avatar' /> */ } <
                    span > OPEN CASH SPOT < /span> <
                    /div> <
                    span className = "score" > {
                        "-"
                    } < /span> <
                    span className = "prize" > {
                        tournamentDetail.contest.prizeType === "Amount Based" ? ( <
                            CurrencyWrapper amount = {
                                line || 0
                            }
                            />
                        ) : (
                            line
                        )
                    } { /* {currencyFormatter(line)} */ } <
                    /span> {
                        /* <div className='team'>
                                                        <img src={line.teamLogo} alt='Team logo' />
                                                        <span>{line.teamName}</span>
                                                    </div> */
                    } <
                    /div>
                ))
        } <
        /div> <
        /div>

        <
        div className = "tournament-inner--right tournament-leaderboard--right" > {
            bestPlayer && bestPlayer.length > 0 && ( <
                div className = "best-player" >
                <
                div className = "top" >
                <
                div className = "img" >
                <
                img src = {
                    bestPlayer.image
                }
                alt = "Best player" / >
                <
                /div> <
                div className = "text" >
                <
                h3 > {
                    bestPlayer.name
                } < /h3> <
                span > {
                    bestPlayer.title
                } < /span> <
                div className = "team" > { /* <img src={bestPlayer.teamLogo} alt='Team logo' /> */ } <
                span > {
                    bestPlayer.teamName
                } < /span> <
                /div> <
                /div> <
                /div>

                {
                    /* <div className='flex'>
                                                {bestPlayer.stats.map((stat, index) => (
                                                    <div key={index}>
                                                        <span>{stat.title}</span>
                                                        <span>{stat.value}</span>
                                                    </div>
                                                ))}
                                            </div> */
                } <
                /div>
            )
        }

        {
            participants && participants.total > 0 && ( <
                div className = "participants" >
                <
                h2 > Participants < /h2>

                <
                div className = "participants-flex" >
                <
                div className = "total" >
                <
                span > Players < /span> <
                span > {
                    participants.total
                } < /span> <
                /div> <
                div className = "images d-flex " > {
                    participants.players.map((participant, index) => {
                        if (index < 5) {
                            return ( <
                                NavLink key = {
                                    index
                                }
                                to = {
                                    participants &&
                                    participants.contest &&
                                    participants.contest.enable_team_name === 1 ?
                                    `/t/${participant.slug}/overview` :
                                        `/profile/${participant.name}`
                                } >
                                <
                                img src = {
                                    participant.image
                                }
                                alt = "Participant"
                                title = {
                                    [participant.firstName, participant.lastName]
                                    .join(" ")
                                    .trim()
                                }
                                /> <
                                /NavLink>
                            );
                        }
                        // else {
                        //     return (
                        //         <NavLink className={'all-participants d-none'} key={index}
                        //             to={`/profile/${participant.nickname}`}>
                        //             <img src={participant.image} alt='Participant' />
                        //         </NavLink>
                        //     )
                        // }
                    })
                } <
                /div> {
                    participants.players.length > 5 && ( <
                        NavLink to = {
                            `/tournaments/${tournamentId}/participants`
                        } >
                        View all <
                        /NavLink>
                    )
                } {
                    /* {!viewAllFlag && participants.players.length > 5 ? (
                                                    <span className={'cursor-pointer'} onClick={() => viewAll()}>View all</span>
                                                ) : (
                                                        <span className={'cursor-pointer'} onClick={() => viewLess()}>View less</span>
                                                    )
                                                } */
                } <
                /div> <
                /div>
            )
        }

        {
            teamRanking &&
                teamRanking.length > 0 &&
                tournamentDetail.contest.enable_team_name == 1 && ( <
                    div className = "team-ranking" >
                    <
                    h2 > Team ranking < /h2>

                    <
                    div className = "leaderboard-grid team" >
                    <
                    div className = "line heading" >
                    <
                    span > Ranking < /span> <
                    span > Team < /span> <
                    span > Score < /span> <
                    span > Total prize < /span> <
                    /div> {
                        teamRanking.map((line, index) => ( <
                            div key = {
                                index
                            }
                            className = "line" >
                            <
                            span className = "rank" > {
                                line.team_rank || "-"
                            } < /span> <
                            div className = "team" >
                            <
                            img src = {
                                line.image
                            }
                            alt = "Team logo" / >
                            <
                            span > {
                                line.team_name
                            } < /span> <
                            /div> <
                            span className = "score" > {
                                line.score ? line.score : "-"
                            } <
                            /span> <
                            span className = "prize" > {
                                line.prize ? currencyFormatter(line.prize) : "-"
                            } <
                            /span> <
                            /div>
                        ))
                    } <
                    /div> <
                    /div>
                )
        } <
        /div> <
        /motion.div>
    );
}

const mapSizesToProps = ({
    width
}) => ({
    isMobile: width < 1000,
})

export default withSizes(mapSizesToProps)(TournamentLeaderboard)