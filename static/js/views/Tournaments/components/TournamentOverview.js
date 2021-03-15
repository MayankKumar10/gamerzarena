/* eslint-disable */

import React from 'react';
import {
    useParams
} from 'react-router-dom';
import withSizes from 'react-sizes';
import {
    motion
} from 'framer-motion';
import 'moment-timezone';
import {
    useDispatch,
    useSelector
} from "react-redux";
import * as Actions from "../store/actions";
import * as ActionsProfile from "../../NewProfilePage/store/actions";
import * as AppActions from '../../../store/actions';
import Host from 'components/Teams/Host';
import CurrencyWrapper from 'components/CurrencyWrapper/CurrencyWrapper';
import {
    Helmet
} from "react-helmet";
import Button from 'react-bootstrap/Button';

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Spinner from "react-bootstrap/Spinner";
import {
    useHistory
} from "react-router-dom";
import {
    StylesProvider
} from '@material-ui/core';

const TournamentOverview = (props) => {
        const dispatch = useDispatch();
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

        const game = props.game;

        const tournamentDetail = useSelector(({
            TournamentAppStore
        }) => TournamentAppStore.tournamentApp.tournamentDetail);
        const loggedInUser = useSelector(({
            core
        }) => core.appStore.loggedInUser);
        let submitedResults = useSelector(({
            TournamentAppStore
        }) => TournamentAppStore.tournamentApp.submitedResults);
        // const prizeData = (tournamentDetail !== undefined && tournamentDetail !== null) ? tournamentDetail.contest.merchandise : {};
        const [platform, setPlatform] = React.useState(tournamentDetail && tournamentDetail.contest.hasBrackets ? tournamentDetail.contest.played_platforms[0] : null);
        React.useEffect(() => {
            if (loggedInUser) {
                dispatch(Actions.getSubmitedResults(tournamentId, platform));
            }
        }, [dispatch, tournamentId, platform]);

        if (!tournamentDetail) {
            return ( < > No data available < />)
            }

            const [followInprogress, setFollowInprogress] = React.useState(false);

            function follow(userName) {
                setFollowInprogress(true)
                if (!loggedInUser) {
                    history.push("/login")
                } else {
                    if (tournamentDetail.contest.organization_id > 0) {
                        let values = new FormData();
                        values.append('organization_id', tournamentDetail.contest.host.slug);
                        values.append('user_id', loggedInUser.id);
                        dispatch(Actions.followOrganization(values)).then(response => {
                            if (!response.success) {
                                dispatch(AppActions.showMessage({
                                    message: response.message,
                                    variant: "error"
                                }));
                                return false;
                            }
                            dispatch(Actions.getTournmentDetail(tournamentId));
                            // dispatch(AppActions.showMessage({ message: response.message, variant: "success" }));
                            setTimeout(function() {
                                setFollowInprogress(false)
                            }, 2000)
                        })
                    } else {
                        dispatch(ActionsProfile.followUser(userName)).then(response => {
                            if (!response.success) {
                                dispatch(AppActions.showMessage({
                                    message: response.message,
                                    variant: "error"
                                }));
                                return false;
                            }
                            dispatch(Actions.getTournmentDetail(tournamentId));
                            // dispatch(AppActions.showMessage({ message: response.message, variant: "success" }));
                            setTimeout(function() {
                                setFollowInprogress(false)
                            }, 2000)

                        })
                    }

                }
            }

            function unfollow(userName) {
                setFollowInprogress(true)
                if (tournamentDetail.contest.organization_id > 0) {
                    let values = new FormData();
                    values.append('organization_id', tournamentDetail.contest.host.slug);
                    values.append('user_id', loggedInUser.id);
                    dispatch(Actions.unfollowOrganization(values)).then(response => {
                        if (!response.success) {
                            dispatch(AppActions.showMessage({
                                message: response.message,
                                variant: "error"
                            }));
                            return false;
                        }
                        dispatch(Actions.getTournmentDetail(tournamentId));
                        setTimeout(function() {
                            setFollowInprogress(false)
                        }, 2000)

                    });
                } else {
                    dispatch(ActionsProfile.unfollowUser(userName)).then(response => {
                        if (!response.success) {
                            dispatch(AppActions.showMessage({
                                message: response.message,
                                variant: "error"
                            }));
                            return false;
                        }
                        dispatch(Actions.getTournmentDetail(tournamentId));
                        setTimeout(function() {
                            setFollowInprogress(false)
                        }, 2000)

                    });
                }
            }


            const [submitResults, setSubmitResults] = React.useState(false);
            React.useEffect(() => {
                if (submitedResults && submitedResults.length > 0) {
                    setSubmitResults(true)
                } else {
                    setSubmitResults(false)
                }
            }, [submitedResults]);

            const [open, setOpen] = React.useState(false);
            const handleClose = () => {
                setOpen(false);
            };

            const [cancelChallengeInprogress, setCancelChallengeInprogress] = React.useState(false);

            function cancelChallenge() {
                setCancelChallengeInprogress(true);
                dispatch(Actions.cancelChallenge(tournamentId)).then((response) => {
                    setOpen(false);
                    if (response.success) {
                        history.push('/lobby')
                    }
                    setCancelChallengeInprogress(false);
                });
            }

            const prefix = tournamentDetail.contest !== undefined && tournamentDetail.contest !== null && tournamentDetail.contest.entry_fee_type === 'Amount Based' ? '$ ' : '';
            const suffix = tournamentDetail.contest !== undefined && tournamentDetail.contest !== null && tournamentDetail.contest.entry_fee_type === 'Amount Based' ? '' : ' Points';

            return ( <
                motion.div initial = "hidden"
                animate = "visible"
                variants = {
                    variants
                }
                className = "tournament-inner white-bg tournament-overview" >
                <
                Helmet >
                <
                title > {
                    game ? `${game} Overview - GamerzArena` : 'Tournament Overview - GamerzArena'
                } < /title> <
                meta name = "Tournament Overview"
                content = "GamerzArena Tournament Overview" / >
                <
                meta property = "og:title"
                content = "Tournament Overview - GamerzArena" / >
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
                div className = "tournament-inner--left tournament-overview--left" > {
                    Object.entries(tournamentDetail.contest.host).length > 0 && ( <
                        > {
                            tournamentDetail.contest.organization_id == 0 && ( <
                                >
                                <
                                h2 > Hosted by < /h2> <
                                Host host = {
                                    tournamentDetail.contest.host
                                }
                                isClickable = {
                                    true
                                }
                                userData = {
                                    loggedInUser
                                }
                                followInprogress = {
                                    followInprogress
                                }
                                onFollow = {
                                    () => follow(tournamentDetail.contest.host.name)
                                }
                                onUnfollow = {
                                    () =>
                                    unfollow(tournamentDetail.contest.host.name)
                                }
                                /> <
                                />
                            )
                        } {
                            tournamentDetail.contest.organization_id > 0 && ( <
                                >
                                <
                                h2 > Organized by < /h2> <
                                Host host = {
                                    tournamentDetail.contest.host
                                }
                                userData = {
                                    loggedInUser
                                }
                                showType = {
                                    true
                                }
                                type = "organization"
                                showMembers = {
                                    false
                                }
                                isClickable = {
                                    true
                                }
                                followInprogress = {
                                    followInprogress
                                }
                                onFollow = {
                                    () => follow(tournamentDetail.contest.host.name)
                                }
                                onUnfollow = {
                                    () =>
                                    unfollow(tournamentDetail.contest.host.name)
                                }
                                /> <
                                />
                            )
                        } <
                        />
                    )
                } {
                    tournamentDetail && tournamentDetail.contest.introduction != "" && ( <
                        div >
                        <
                        h2 > Introduction < /h2> <
                        div className = "myTestClass"
                        dangerouslySetInnerHTML = {
                            {
                                __html: tournamentDetail.contest.introduction,
                            }
                        }
                        /> <
                        /div>
                    )
                } {
                    tournamentDetail && tournamentDetail.rules != "" && ( <
                        >
                        <
                        h2 > Rules < /h2> <
                        div className = "myTestClass"
                        dangerouslySetInnerHTML = {
                            {
                                __html: tournamentDetail.rules[0]
                            }
                        }
                        /> <
                        />
                    )
                } {
                    tournamentDetail &&
                        tournamentDetail.sponsorLogos &&
                        tournamentDetail.sponsorLogos.length > 0 && ( <
                            >
                            <
                            h2 > Sponsor < /h2> <
                            div className = "sponsors" > {
                                tournamentDetail.sponsorLogos.map((sponsor, index) => ( <
                                    img key = {
                                        index
                                    }
                                    src = {
                                        sponsor
                                    }
                                    alt = "Sponsor logo" / >
                                ))
                            } <
                            /div> <
                            />
                        )
                } <
                /div>

                <
                div className = "tournament-inner--right tournament-overview--right" > {
                    tournamentDetail &&
                    tournamentDetail.contest.bracketType === "Closed" &&
                    tournamentDetail.contest.stream_type === "untracked" ? ( <
                        > < />
                    ) : ( <
                        >
                        <
                        h2 > Entry fee < /h2> <
                        div className = "entry-fee" >
                        <
                        div >
                        <
                        span > {
                            (tournamentDetail.contest.hasBrackets || tournamentDetail.contest.stream_type === "untracked") ?
                            "Entry" :
                                "First-time entry"
                        } <
                        /span> <
                        span className = {
                            'prizePool'
                        } > {
                            tournamentDetail.contest.entry_fee > 0 ? (
                                tournamentDetail.contest.entry_fee_type ===
                                "Amount Based" ? ( <
                                    CurrencyWrapper amount = {
                                        tournamentDetail.contest.entry_fee || 0
                                    }
                                    />
                                ) : (
                                    prefix + tournamentDetail.contest.entry_fee + suffix
                                )
                            ) : (

                                <
                                > {
                                    tournamentDetail && tournamentDetail.contest && tournamentDetail.contest.organization_id === 12 ?
                                    "25.00" :
                                        "Free"
                                } <
                                />
                            )
                        } <
                        /span> <
                        /div> {
                            !tournamentDetail.contest.hasBrackets && tournamentDetail.contest.stream_type === "tracked" && ( <
                                div >
                                <
                                span > Re - entry < /span> <
                                span className = {
                                    'prizePool'
                                } > {
                                    tournamentDetail.contest.reentry_fee > 0 ?
                                    tournamentDetail.contest.entry_fee_type === "Amount Based" ?
                                    <
                                    CurrencyWrapper
                                    amount = {
                                        tournamentDetail.contest.reentry_fee || 0
                                    }
                                    /> :
                                    (
                                        prefix + tournamentDetail.contest.reentry_fee + (tournamentDetail.contest.reentry_fee == 1 ?
                                            " Point" :
                                            suffix)
                                    ) :
                                        "Free"
                                } <
                                /span> { /* <span>Free</span> */ } <
                                /div>
                            )
                        } {
                            tournamentDetail.contest.organization_id == 0 && !tournamentDetail.contest.isChallenge && ( <
                                div >
                                <
                                span > GA < sup > + < /sup> Members</span >
                                <
                                span className = {
                                    'prizePool'
                                } >
                                Free {
                                    loggedInUser && !loggedInUser.gamerzarena_plus && ( <
                                        button className = "upgrateGAPlusBtn"
                                        onClick = {
                                            () =>
                                            history.push(
                                                `/profile/${loggedInUser.name}/settings/ga-plus`
                                            )
                                        } >
                                        UPGRADE <
                                        /button>
                                    )
                                } <
                                /span>

                                {
                                    /* <div className="upgrateGAPlusBtn">
                                                                UPGRADE
                                                                </div> */
                                } <
                                /div>
                            )
                        }

                        {
                            !(tournamentDetail.contest.canSubmitScore && submitResults) && tournamentDetail.contest.isChallenge && loggedInUser && tournamentDetail.contest.host.id === loggedInUser.id && ( <
                                div >
                                <
                                span >
                                <
                                Button onClick = {
                                    () => setOpen(true)
                                }
                                variant = 'outline-primary' > Cancel Challenge < /Button> <
                                /span> <
                                /div>
                            )
                        } <
                        /div> <
                        />
                    )
                }

                {
                    /* {tournamentDetail && tournamentDetail.contest.prizeType === "Merchandise" && prizeData.hasOwnProperty(tournamentDetail.contest.id) &&
                              <>
                                <h2>Prize</h2>
                                <div className="prizeMerchandise">
                                  {Object.entries(prizeData[tournamentDetail.contest.id]).map(
                                    ([key, value], index) => (
                                      <div key={index}>
                                        <span className="rank">{key}</span>
                                        <span>{value}</span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </>
                            } */
                } {
                    tournamentDetail && tournamentDetail.contest && tournamentDetail.contest.organization_id === 12 ?
                        <
                        div className = "prize" >
                        <
                        div className = "wtctest-prize" >
                        <
                        h2 > Prize < /h2> <
                        div className = "prize-text myTestClass"
                    dangerouslySetInnerHTML = {
                            {
                                __html: tournamentDetail.contest.prize_text
                            }
                        } > < /div> { /* <div className="prize-text" dangerouslySetInnerHTML={{ __html: htmlDesvForWtc }}></div> */ } <
                        /div> <
                        /div>:
                        <
                        > {
                            tournamentDetail && tournamentDetail.contest.prizeType === "Merchandise" &&
                            <
                            >
                            <
                            h2 > Prize < /h2> <
                            div className = "prizeMerchandise" > {
                                tournamentDetail.contest.merchandise.map((item, index) =>
                                    <
                                    div key = {
                                        index
                                    } >
                                    <
                                    span className = "rank" > {
                                        item.number
                                    } < /span> <
                                    span >
                                    <
                                    div className = "img"
                                    style = {
                                        {
                                            backgroundImage: `url(${item.file})`
                                        }
                                    } > < /div> <
                                    /span> {
                                        /* <span>
                                                                <img src={item.file} className="img-thumbnail" alt="Game settings"/>
                                                              </span> */
                                    } <
                                    span > {
                                        item.description
                                    } < /span> <
                                    /div>
                                )
                            } <
                            /div> <
                            />
                        }

                    {
                        tournamentDetail && tournamentDetail.contest.prizeType !== "Merchandise" &&
                            // (tournamentDetail.contest.organization_id <= 0 ||
                            //   tournamentDetail.contest.prizePool.total > 0) &&
                            <
                            div className = "prize" >
                            <
                            div >
                            <
                            h2 > Prize < /h2> <
                            span > Prize pool < /span> <
                            div className = "amount" >
                            <
                            span > {
                                tournamentDetail.contest.prizeType ===
                                "Amount Based" ? ( <
                                    CurrencyWrapper amount = {
                                        tournamentDetail.contest.prizePool.total.replace(/,/g, '') || 0
                                    }
                                    />
                                ) : (
                                    tournamentDetail.contest.prizePool.priceSuffix +
                                    tournamentDetail.contest.prizePool.total
                                )
                            } <
                            /span> { /* <span>{tournamentDetail.contest.prizePool.pricePrefix}</span> */ } <
                            /div> { /* <p>Win prizes will be paid out within 10 business days via PayPal.</p> */ } <
                            /div> {
                                tournamentDetail && tournamentDetail.contest.prizePool.places && ( <
                                    div className = "top-three" > {
                                        tournamentDetail.contest.prizePool.places[0] && ( <
                                            div >
                                            <
                                            span > {
                                                tournamentDetail.contest.prizeType ===
                                                "Amount Based" ? ( <
                                                    CurrencyWrapper amount = {
                                                        tournamentDetail.contest.prizePool.places[0] || 0
                                                    }
                                                    />
                                                ) : (
                                                    tournamentDetail.contest.prizePool.priceSuffix +
                                                    tournamentDetail.contest.prizePool.places[0]
                                                )
                                            } <
                                            /span> <
                                            div className = "renk1" >
                                            <
                                            span > 1 st < /span> <
                                            /div> <
                                            /div>
                                        )
                                    } {
                                        tournamentDetail.contest.prizePool.places[1] && ( <
                                            div >
                                            <
                                            span > {
                                                tournamentDetail.contest.prizeType ===
                                                "Amount Based" ? ( <
                                                    CurrencyWrapper amount = {
                                                        tournamentDetail.contest.prizePool.places[1] || 0
                                                    }
                                                    />
                                                ) : (
                                                    tournamentDetail.contest.prizePool.priceSuffix +
                                                    tournamentDetail.contest.prizePool.places[1]
                                                )
                                            } <
                                            /span> <
                                            div className = "renk2" >
                                            <
                                            span > 2 nd < /span> <
                                            /div> <
                                            /div>
                                        )
                                    }

                                    {
                                        tournamentDetail.contest.prizePool.places[2] && ( <
                                            div >
                                            <
                                            span > {
                                                tournamentDetail.contest.prizeType ===
                                                "Amount Based" ? ( <
                                                    CurrencyWrapper amount = {
                                                        tournamentDetail.contest.prizePool.places[2] || 0
                                                    }
                                                    />
                                                ) : (
                                                    tournamentDetail.contest.prizePool.priceSuffix +
                                                    tournamentDetail.contest.prizePool.places[2]
                                                )
                                            } <
                                            /span> <
                                            div className = "renk3" >
                                            <
                                            span > 3 rd < /span> <
                                            /div> <
                                            /div>
                                        )
                                    }

                                    {
                                        tournamentDetail.contest.prizePool.places[3] && ( <
                                            div >
                                            <
                                            span > {
                                                tournamentDetail.contest.prizeType ===
                                                "Amount Based" ? ( <
                                                    CurrencyWrapper amount = {
                                                        tournamentDetail.contest.prizePool.places[3] || 0
                                                    }
                                                    />
                                                ) : (
                                                    tournamentDetail.contest.prizePool.priceSuffix +
                                                    tournamentDetail.contest.prizePool.places[3]
                                                )
                                            } <
                                            /span> <
                                            div className = "renk4" >
                                            <
                                            span > 4 th < /span> <
                                            /div> <
                                            /div>
                                        )
                                    } {
                                        tournamentDetail.contest.prizePool.places[4] && ( <
                                            div >
                                            <
                                            span > {
                                                tournamentDetail.contest.prizeType ===
                                                "Amount Based" ? ( <
                                                    CurrencyWrapper amount = {
                                                        tournamentDetail.contest.prizePool.places[4] || 0
                                                    }
                                                    />
                                                ) : (
                                                    tournamentDetail.contest.prizePool.priceSuffix +
                                                    tournamentDetail.contest.prizePool.places[4]
                                                )
                                            } <
                                            /span> <
                                            div className = "renk5" >
                                            <
                                            span > 5 th < /span> <
                                            /div> <
                                            /div>
                                        )
                                    } <
                                    /div>
                                )
                            } <
                            /div>
                    } <
                    />
                }

                <
                div className = "game-settings" >
                <
                h2 > Game Settings < /h2> <
                div className = "flex" >
                <
                div >
                <
                span > Game < /span> <
                span > {
                    tournamentDetail.contest.game
                } < /span> <
                /div> <
                div >
                <
                span > Format < /span> <
                span > {
                    tournamentDetail.contest.format
                } < /span> <
                /div> <
                div >
                <
                span > Type < /span> <
                span > {
                    tournamentDetail.contest.type
                } < /span> <
                /div> <
                div >
                <
                span > How to Win < /span> <
                span > {
                    tournamentDetail.contest.resultType.name
                } < /span> <
                /div> <
                /div> <
                br / > {
                    tournamentDetail.contest.images.game_setting_image_url && ( <
                        div className = "img" >
                        <
                        img src = {
                            tournamentDetail.contest.images.game_setting_image_url
                        }
                        alt = "Game settings" /
                        >
                        <
                        /div>
                    )
                } {
                    tournamentDetail && tournamentDetail.contest.settings.length > 0 && ( <
                        div className = "flex" > {
                            tournamentDetail.contest.settings.map((setting, index) => ( <
                                div key = {
                                    index
                                } >
                                <
                                span > {
                                    setting.meta_title
                                } < /span> <
                                span > {
                                    setting.meta_value
                                } < /span> <
                                /div>
                            ))
                        } <
                        /div>
                    )
                }

                <
                /div> {
                    tournamentDetail &&
                        tournamentDetail.contact &&
                        (tournamentDetail.contact.twitch != "" ||
                            tournamentDetail.contact.discord != "") && ( <
                            div className = "contact" >
                            <
                            h2 > Contact < /h2> <
                            div className = "social" > {
                                tournamentDetail.contact.twitch && ( <
                                    a href = {
                                        tournamentDetail.contact.twitch
                                    }
                                    target = "_blank" >
                                    <
                                    i className = "fab fa-twitch" > < /i> <
                                    /a>
                                )
                            } {
                                tournamentDetail.contact.discord && ( <
                                    a href = {
                                        tournamentDetail.contact.discord
                                    }
                                    target = "_blank"
                                    rel = "noopener noreferrer" >
                                    <
                                    i className = "fab fa-discord" > < /i> <
                                    /a>
                                )
                            } <
                            /div> {
                                tournamentDetail.contact.text && ( <
                                    p className = "myTestClass"
                                    dangerouslySetInnerHTML = {
                                        {
                                            __html: tournamentDetail.contact.text
                                        }
                                    }
                                    />
                                )
                            } <
                            /div>
                        )
                } <
                /div>

                <
                Dialog open = {
                    open
                }
                onClose = {
                    handleClose
                }
                aria - labelledby = "alert-dialog-title"
                aria - describedby = "alert-dialog-description" >
                <
                DialogTitle id = "alert-dialog-title" >
                Are you sure you want to cancel this challenge ?
                <
                /DialogTitle> <
                DialogContent >
                <
                DialogContentText id = "alert-dialog-description" > { /* {token && <p>Token: {token}</p>} */ } <
                /DialogContentText> <
                /DialogContent> <
                DialogActions >
                <
                Button onClick = {
                    handleClose
                }
                color = "primary" >
                Disagree <
                /Button>

                {
                    !cancelChallengeInprogress ?
                        <
                        Button onClick = {
                            cancelChallenge
                        }
                    color = "primary" >
                        Agree <
                        /Button>:
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
                        >
                        Loading...
                        <
                        /Button>
                } <
                /DialogActions> <
                /Dialog>

                <
                /motion.div>
            );
        }

        const mapSizesToProps = ({
            width
        }) => ({
            isMobile: width < 1000,
        })

        export default withSizes(mapSizesToProps)(TournamentOverview)