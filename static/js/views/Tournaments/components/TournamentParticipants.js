import React from "react";
import withSizes from "react-sizes";
import {
    motion
} from "framer-motion";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from "assets/images/icons/close-blue.svg";

import styles from "./TournamentParticipants.module.scss";
import Participant from "components/Tournaments/Participant";
// import SearchIcon from 'assets/images/icons/search.svg';
import Player from "components/Players/Player";
// import NextArrow from 'assets/images/icons/arrow-next-blue.svg';
import {
    useSelector
} from "react-redux";
import {
    Helmet
} from "react-helmet";

// samples
import TeamImg from "assets/images/samples/team.jpg";

const TournamentParticipants = (props) => {
    const game = props.game;

    const participants = useSelector(
        ({
            TournamentAppStore
        }) => TournamentAppStore.tournamentApp.participants
    );
    const variants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1
        },
    };

    const [display] = React.useState("confirmed");

    let pending = [{
            img: TeamImg,
            name: "Test",
            verified: true,
            players: 15,
            id: 2235,
        },
        {
            img: TeamImg,
            name: "Test",
            verified: true,
            followers: 162498,
            id: 223,
        },
    ];

    const [players] = React.useState([{
            email: "rushikeshmusale5045@gmail.com",
            firstName: null,
            id: 78942,
            image: "https://testingconsole.gamerzarena.com/img/userplaceholder.png",
            invited: false,
            lastName: null,
            name: "rushikeshmusale5045@gmail.com",
        },
        {
            email: "ellocrabcake@live.com",
            firstName: null,
            id: 3525,
            image: "https://testingconsole.gamerzarena.com/img/userplaceholder.png",
            invited: false,
            lastName: null,
            name: "ellocrabcake",
        },
        {
            email: "ellocrabcake@live.com",
            firstName: null,
            id: 35325,
            image: "https://testingconsole.gamerzarena.com/img/userplaceholder.png",
            invited: false,
            lastName: null,
            name: "ellocrabcake",
        },
        {
            email: "ellocrabcake@live.com",
            firstName: null,
            id: 35225,
            image: "https://testingconsole.gamerzarena.com/img/userplaceholder.png",
            invited: false,
            lastName: null,
            name: "ellocrabcake",
        },
        {
            email: "ellocrabcake@live.com",
            firstName: null,
            id: 35215,
            image: "https://testingconsole.gamerzarena.com/img/userplaceholder.png",
            invited: false,
            lastName: null,
            name: "ellocrabcake",
        },
    ]);

    const [showModal, setShowModal] = React.useState(false);
    const [playerSearch, setPlayerSearch] = React.useState();

    const [activeParticipant, setActiveParticipant] = React.useState(null);
    const participantClick = (id) => {
        if (activeParticipant === id) {
            setActiveParticipant(null);
        } else {
            setActiveParticipant(id);
        }
    };

    if (participants && participants.players.length === 0) {
        return ( <
            motion.div initial = "hidden"
            animate = "visible"
            variants = {
                variants
            }
            className = {
                `tournament-inner white-bg ${styles.participants}`
            } >
            <
            Helmet >
            <
            title > {
                game ?
                `${game} Participants | GamerzArena` :
                    "Tournament Participants | GamerzArena"
            } <
            /title> <
            meta name = "Tournament Participants"
            content = "GamerzArena Tournament Participants" /
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
            /Helmet> <
            div className = {
                styles.partMain
            } >
            <
            h2 > No record found < /h2> <
            /div> <
            /motion.div>
        );
    }
    return ( <
        motion.div initial = "hidden"
        animate = "visible"
        variants = {
            variants
        }
        className = {
            `tournament-inner white-bg ${styles.participants}`
        } >
        <
        Helmet >
        <
        title > {
            game ?
            `${game} Participants - GamerzArena` :
                "Tournament Participants - GamerzArena"
        } <
        /title> <
        meta name = "Tournament Participants"
        content = "GamerzArena Tournament Participants" /
        >
        <
        meta property = "og:title"
        content = "Tournament Participants - GamerzArena" / >
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
        /Helmet> {
            /* <div className={styles.gameInfo}>
                            <h2>Participants Info</h2>
                            <div>
                                <div className={styles.line}>
                                    <div>
                                        <span>Type</span>
                                        <span>{gameInfo.type}</span>
                                    </div>
                                    <div>
                                        <span>Confirmed</span>
                                        <span>{gameInfo.confirmed}</span>
                                    </div>
                                    <div>
                                        <span>Pending</span>
                                        <span>{gameInfo.pending}</span>
                                    </div>
                                </div>
                                <div className={styles.line}>
                                    <div>
                                        <span>Available slots</span>
                                        <span>{gameInfo.available}</span>
                                    </div>
                                </div>
                            </div>
                        </div> */
        }

        <
        div className = {
            styles.partMain
        } > {
            /* <nav>
                                <Button
                                    variant={display === 'confirmed' ? 'primary' : 'outline-primary'}
                                    onClick={() => {
                                        setDisplay('confirmed');
                                        setActiveParticipant(null);
                                    }}
                                    className={display === 'confirmed' ? '' : styles.dim}
                                >Confirmed</Button>
                                <Button
                                    variant={display === 'pending' ? 'primary' : 'outline-primary'}
                                    onClick={() => {
                                        setDisplay('pending');
                                        setActiveParticipant(null)
                                    }}
                                    className={display === 'pending' ? '' : styles.dim}
                                >Pending</Button>

                            </nav>

                            <div className={styles.searchBar}>
                                <img src={SearchIcon} alt='Search icon' />
                                <input type='search' placeholder='Search' className={styles.searchInput} />
                            </div> */
        }

        <
        div className = {
            styles.partGrid
        } > {
            display === "confirmed" && participants && participants.players && ( <
                > {
                    participants &&
                    participants.players
                    .filter(participant => participant.id != null)
                    .map((participant) => {
                        return <Participant
                        key = {
                            participant.id
                        }
                        participant = {
                            participant
                        }
                        doOnClick = {
                            (id) => participantClick(id)
                        }
                        active = {
                            activeParticipant === participant.id
                        }
                        from = "tournament"
                        enableTeamName = {
                            participants.contest && participants.contest.enable_team_name
                        }
                        />
                    })
                } <
                />
            )
        }

        {
            display === "pending" && pending.length && ( <
                > {
                    pending.map((participant) => ( <
                        Participant key = {
                            participant.id
                        }
                        participant = {
                            participant
                        }
                        doOnClick = {
                            (id) => participantClick(id)
                        }
                        active = {
                            activeParticipant === participant.id
                        }
                        from = "tournament" /
                        >
                    ))
                } <
                Button variant = "link" > Load more < /Button> <
                />
            )
        } <
        /div> <
        /div>

        {
            /* <div className={styles.friends}>
                            <h2>Invite your friends</h2>

                            {players.length &&
                                <div className={styles.friendsWrapper}>
                                    {players.map((player, index) => {
                                        if (index > 6) return <></>;
                                        return (
                                            <Player key={player.id} player={player} invite={true} text='Invite' />
                                        )
                                    })}

                                    <a onClick={() => setShowModal(true)}>Select from your list <img src={NextArrow} alt='Next arrow' /></a>
                                </div>
                            }
                        </div> */
        }

        <
        Modal show = {
            showModal
        }
        onHide = {
            () => setShowModal(false)
        }
        dialogClassName = {
            styles.modalDialog
        } >
        <
        div className = "modal-inner-wrapper" >
        <
        Modal.Body className = {
            styles.modalBody
        } >
        <
        header >
        <
        h2 > Invite players < /h2> <
        button onClick = {
            () => setShowModal(false)
        } >
        <
        img src = {
            CloseButton
        }
        alt = "Close button" / >
        <
        /button> <
        /header>

        <
        Form.Group controlId = "playerSearch"
        className = {
            styles.playerSearch
        } >
        <
        Form.Control type = "text"
        value = {
            playerSearch
        }
        name = "playerSearch"
        onChange = {
            (e) => {
                setPlayerSearch(e.target.value);
                // handleChange(e);
                // searchPlayers(e);
            }
        }
        placeholder = "Search" /
        >
        <
        /Form.Group>

        {
            players.length > 0 && ( <
                div className = {
                    styles.playersWrapper
                } > {
                    players.map((player) => ( <
                        Player key = {
                            player.id
                        }
                        player = {
                            player
                        }
                        invite = {
                            true
                        }
                        invitePlayer = {
                            null
                        }
                        uninvitePlayer = {
                            null
                        }
                        />
                    ))
                } <
                /div>
            )
        }

        <
        div className = {
            styles.buttonWrapper
        } >
        <
        Button variant = "primary"
        onClick = {
            () => setShowModal(false)
        } >
        Done <
        /Button> <
        /div> <
        /Modal.Body> <
        /div> <
        /Modal> <
        /motion.div>
    );
};

const mapSizesToProps = ({
    width
}) => ({
    isMobile: width < 1000,
});

export default withSizes(mapSizesToProps)(TournamentParticipants);