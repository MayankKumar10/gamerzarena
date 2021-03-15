/* eslint-disable */

import React from 'react'
import styles from './SubmitResult.module.scss'
import {
    motion
} from 'framer-motion'
import ScheduleAnnoucements from './ScheduleAnnoucements'
import 'components/brackets.js'
import * as moment from 'moment'
import placeholderProfileImage from 'assets/img/userplaceholder.png'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InfoIcon from 'assets/images/icons/info.svg'
import {
    useDispatch,
    useSelector
} from 'react-redux'
import {
    useParams
} from 'react-router-dom'
import * as Actions from '../store/actions'
import classNames from 'classnames'
import Spinner from 'react-bootstrap/Spinner'
import DatePicker from "react-datepicker";

import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import {
    useHistory
} from 'react-router-dom'
import {
    Helmet
} from 'react-helmet'
import {
    add3Dots
} from "../../../functions/formatters";

import * as AppActions from '../../../store/actions'

const SubmitResult = props => {
        let history = useHistory()
        const dispatch = useDispatch()
        let {
            tournamentId
        } = useParams()
        const variants = {
            hidden: {
                opacity: 0
            },
            visible: {
                opacity: 1
            }
        }
        const game = props.game;
        const tournamentDetail = useSelector(
            ({
                TournamentAppStore
            }) =>
            TournamentAppStore.tournamentApp.tournamentDetail
        )
        const loggedInUser = useSelector(({
            core
        }) => core.appStore.loggedInUser)
        let brackets = useSelector(
            ({
                TournamentAppStore
            }) => TournamentAppStore.tournamentApp.bracketDetail
        )
        let submitedResults = useSelector(({
            TournamentAppStore
        }) => TournamentAppStore.tournamentApp.submitedResults)
        const announcements =
            brackets !== undefined && brackets !== null ? brackets.announcements : null

        const [platform, setPlatform] = React.useState(
            tournamentDetail && tournamentDetail.contest.hasBrackets ?
            tournamentDetail.contest.played_platforms[0] :
            null
        )

        const [result, setResult] = React.useState([])
        const [submitInprogress, setSubmitInprogress] = React.useState(false)
        const [disputeInprogress, setDisputeInprogress] = React.useState(false)
        const [disputeId, setDisputeId] = React.useState('')

        const [disputeReason, setDisputeReason] = React.useState('')

        const [time, setTime] = React.useState();

        React.useEffect(() => {
            dispatch(Actions.getSubmitedResults(tournamentId, platform))
        }, [dispatch, tournamentId, platform])

        React.useEffect(() => {
            if (submitedResults && submitedResults.length > 0) {} else {
                history.push(`/tournaments/${tournamentId}/overview`)
            }
        }, [submitedResults])

        function handleChange(game) {
            setResult(game)
        }

        function submitResult(bracket_id) {
            let data = []
            if (!result.players) {
                dispatch(
                    AppActions.showMessage({
                        message: 'Please enter score',
                        variant: 'error'
                    })
                )
                return false
            } else if (
                result.players &&
                result.players.find(item => item.score === null) &&
                (tournamentDetail.contest.hasBrackets ||
                    tournamentDetail.contest.isChallenge)
            ) {
                dispatch(
                    AppActions.showMessage({
                        message: `Please enter score for both users`,
                        variant: 'error'
                    })
                )
                return false
            }
            result.players.map(item => {
                if (
                    tournamentDetail.contest.hasBrackets ||
                    tournamentDetail.contest.isChallenge
                ) {
                    data.push({
                        entry_id: item.id,
                        score: item.score,
                        user_id: item.user_id
                    })
                } else if (!tournamentDetail.contest.hasBrackets &&
                    item.user_id === loggedInUser.id &&
                    !tournamentDetail.contest.isChallenge
                ) {
                    data.push({
                        entry_id: item.id,
                        score: item.score,
                        user_id: item.user_id
                    })
                }
                return < > < />
            })
            setSubmitInprogress(true)

            let form_data = new FormData()
            form_data.append('user_id', loggedInUser.id)
            form_data.append('scoring_result', JSON.stringify(data))
            form_data.append('bracket_id', bracket_id)


            dispatch(Actions.submitResult(tournamentId, form_data)).then(response => {
                setResult([])
                dispatch(Actions.getSubmitedResults(tournamentId, platform))
                setTimeout(function() {
                    dispatch(Actions.getLeaderboard(tournamentId))
                    setSubmitInprogress(false)
                }, 4000)
            })
        }

        function createDispute(match_id, disputeReason, rootIndex) {
            if (!disputeReason || disputeReason === "") {
                dispatch(AppActions.showMessage({
                    message: `Please enter dispute reason`,
                    variant: 'error'
                }))
                return false
            }
            setDisputeId(rootIndex)
            setDisputeInprogress(true)
            let formData = new FormData()
            formData.append('user_id', loggedInUser.id)
            formData.append('match_id', match_id)

            formData.append('note', disputeReason)

            dispatch(Actions.createDispute(tournamentId, formData)).then(response => {
                dispatch(Actions.getSubmitedResults(tournamentId, platform))
                setTimeout(function() {
                    setDisputeInprogress(false)
                    setDisputeId('')
                }, 4000)
            })
        }

        function onChangePlatform(value) {
            setPlatform(value)
            dispatch(Actions.getSubmitedResults(tournamentId, value))
        }

        let now = +(new Date());
        // let startDate = +(moment.utc(tournamentDetail.contest.date, 'YYYY-MM-DD HH:mm:ss').toDate());
        let endDate = +(moment.utc(tournamentDetail.contest.endDate, 'YYYY-MM-DD HH:mm:ss').toDate());


        return ( <
            motion.div initial = 'hidden'
            animate = 'visible'
            variants = {
                variants
            }
            className = {
                `tournament-inner ${styles.participants}`
            } >
            <
            Helmet >
            <
            title > Submit Result - GamerzArena < /title> <
            meta name = 'Tournament Submit Result'
            content = 'GamerzArena Tournament Submit Result' /
            >
            <
            meta property = "og:title"
            content = "Submit Result - GamerzArena" / >
            <
            /Helmet> <
            div className = {
                styles.gamesWrapper
            } > {
                tournamentDetail && tournamentDetail.contest.hasBrackets && ( <
                    div className = {
                        `dropdown-wrapper ${styles.dropdownWrapper}`
                    } >
                    <
                    DropdownButton alignRight className = {
                        `platform ${styles.platform}`
                    }
                    title = {
                        `Platform${':'} ${tournamentDetail.contest.platforms.find(
                item => item.id === platform
              )
                ? tournamentDetail.contest.platforms.find(
                  item => item.id === platform
                ).name
                : ''
                }`
                    }
                    id = 'dropdown-menu-align-right'
                    variant = 'outline-secondary' >
                    {
                        tournamentDetail &&
                        tournamentDetail.contest.platforms.map((item, index) => ( <
                            Dropdown.Item as = 'button'
                            key = {
                                index
                            }
                            onClick = {
                                () => onChangePlatform(item.id)
                            }
                            className = {
                                item.id === platform ? 'active' : ''
                            } >
                            {
                                item.name
                            } <
                            /Dropdown.Item>
                        ))
                    } <
                    /DropdownButton> <
                    /div>
                )
            }

            {
                submitedResults && submitedResults.length > 0 && ( <
                        > {
                            submitedResults.map((game, rootIndex) => ( <
                                    Form key = {
                                        rootIndex
                                    }
                                    className = {
                                        styles.gameWrapper
                                    } >
                                    <
                                    div className = {
                                        styles.singleGame
                                    } >
                                    <
                                    div className = {
                                        `${styles.borderRight} ${styles.timeWrapper}`
                                    } >
                                    <
                                    span className = {
                                        `${styles.title} ${styles.first}`
                                    } >
                                    Date & amp; Time <
                                    /span> <
                                    div className = {
                                        styles.time
                                    } >
                                    <
                                    span > {
                                        moment
                                        .utc(game.time, 'YYYY-MM-DD HH:mm:ss')
                                        .local()
                                        .format('MMM D')
                                    } <
                                    /span> <
                                    span > {
                                        moment
                                        .utc(game.time, 'YYYY-MM-DD HH:mm:ss')
                                        .local()
                                        .format('h:mm a')
                                    } <
                                    /span> <
                                    /div> <
                                    /div> <
                                    div className = {
                                        styles.borderRight
                                    } >
                                    <
                                    span className = {
                                        `${styles.title}`
                                    } > Players < /span> {
                                        game.players && game.players.length > 0 && ( <
                                            > {
                                                game.players.map((player, index) => ( <
                                                    div key = {
                                                        index
                                                    }
                                                    className = {
                                                        `${styles.player} ${styles.cell}`
                                                    } >
                                                    <
                                                    img src = {
                                                        player.img ?
                                                        player.img :
                                                            placeholderProfileImage
                                                    }
                                                    alt = 'Player' /
                                                    >
                                                    <
                                                    span className = 'text-ellipsis'
                                                    title = {
                                                        player.name
                                                    } > {
                                                        add3Dots(player.name, props.isMobile ? 15 : 30)
                                                    } <
                                                    /span> <
                                                    /div>
                                                ))
                                            } <
                                            />
                                        )
                                    } <
                                    /div> <
                                    div className = {
                                        styles.borderRight
                                    } >
                                    <
                                    span className = {
                                        `${styles.title}`
                                    } > Score < /span> {
                                        game.players && game.players.length > 0 && ( <
                                            > {
                                                game.players.map((player, index) => ( <
                                                    div key = {
                                                        index
                                                    }
                                                    className = {
                                                        `${styles.score} ${styles.cell}`
                                                    } >
                                                    {
                                                        game.submitted ? ( <
                                                            span className = {
                                                                player.placement === 1 ? styles.first : ''
                                                            } >
                                                            {
                                                                player.score
                                                            } <
                                                            /span>
                                                        ) : ( <
                                                            > {
                                                                (tournamentDetail.contest.hasBrackets || game.isChallenge) && game.resultType.code === 'high_score' && ( <
                                                                    Form.Control min = '0'
                                                                    type = 'number'
                                                                    name = 'score'
                                                                    onChange = {
                                                                        e => {
                                                                            player.score = e.target.value
                                                                            handleChange(game)
                                                                        }
                                                                    }
                                                                    className = {
                                                                        `${styles.formInput} ${player.placement === 1
                                        ? styles.first
                                        : ''
                                        }`
                                                                    }
                                                                    />
                                                                )
                                                            } {
                                                                (tournamentDetail.contest.hasBrackets || game.isChallenge) && (game.resultType.code === 'low_time' || game.resultType.code === 'high_time') && ( <
                                                                    DatePicker key = {
                                                                        player.user_id
                                                                    }
                                                                    className = {
                                                                        `${styles.formInput} ${player.placement === 1
                                        ? styles.first
                                        : ''
                                        }`
                                                                    }
                                                                    name = "score"
                                                                    showTimeSelect selected = {
                                                                        player.score != null ? moment(player.score, "HH:mm:ss").toDate() : null
                                                                    }
                                                                    showTimeSelectOnly timeCaption = "Time"
                                                                    timeIntervals = {
                                                                        10
                                                                    }
                                                                    timeFormat = "HH:mm:ss"
                                                                    dateFormat = "HH:mm:ss"
                                                                    onChange = {
                                                                        (event) => {
                                                                            if (event != null) {
                                                                                let time = moment(event).format('HH:mm:ss');
                                                                                player.score = time;
                                                                                setTime(event);
                                                                                handleChange(game)
                                                                            } else {
                                                                                player.score = null;
                                                                                setTime(event);
                                                                                handleChange(game)
                                                                            }
                                                                        }
                                                                    }
                                                                    popperModifiers = {
                                                                        {
                                                                            preventOverflow: {
                                                                                enabled: true,
                                                                                escapeWithReference: false,
                                                                                boundariesElement: "viewport"
                                                                            }
                                                                        }
                                                                    }
                                                                    />
                                                                )
                                                            } {
                                                                !tournamentDetail.contest.hasBrackets &&
                                                                    !game.isChallenge &&
                                                                    player.user_id === loggedInUser.id && game.resultType.code === 'high_score' && ( <
                                                                        Form.Control min = '0'
                                                                        type = 'number'
                                                                        name = 'score'
                                                                        onChange = {
                                                                            e => {
                                                                                player.score = e.target.value
                                                                                handleChange(game)
                                                                            }
                                                                        }
                                                                        className = {
                                                                            `${styles.formInput} ${player.placement === 1
                                          ? styles.first
                                          : ''
                                          }`
                                                                        }
                                                                        />
                                                                    )
                                                            }

                                                            {
                                                                !tournamentDetail.contest.hasBrackets &&
                                                                    !game.isChallenge &&
                                                                    player.user_id === loggedInUser.id && (game.resultType.code === 'low_time' || game.resultType.code === 'high_time') && ( <
                                                                        DatePicker className = {
                                                                            `${styles.formInput} ${player.placement === 1
                                          ? styles.first
                                          : ''
                                          }`
                                                                        }
                                                                        name = "score"
                                                                        showTimeSelect selected = {
                                                                            player.score != null ? moment(player.score, "HH:mm:ss").toDate() : null
                                                                        }
                                                                        showTimeSelectOnly timeCaption = "Time"
                                                                        timeIntervals = {
                                                                            10
                                                                        }
                                                                        timeFormat = "HH:mm:ss"
                                                                        dateFormat = "HH:mm:ss"
                                                                        onChange = {
                                                                            (event) => {
                                                                                if (event != null) {
                                                                                    let time = moment(event).format('HH:mm:ss');
                                                                                    player.score = time;
                                                                                    setTime(event);
                                                                                    handleChange(game)
                                                                                } else {
                                                                                    player.score = null;
                                                                                    setTime(event);
                                                                                    handleChange(game)
                                                                                }
                                                                            }
                                                                        }
                                                                        popperModifiers = {
                                                                            {
                                                                                preventOverflow: {
                                                                                    enabled: true,
                                                                                    escapeWithReference: false,
                                                                                    boundariesElement: "viewport"
                                                                                }
                                                                            }
                                                                        }
                                                                        />
                                                                    )
                                                            }

                                                            {
                                                                !tournamentDetail.contest.hasBrackets &&
                                                                    !game.isChallenge &&
                                                                    player.user_id !== loggedInUser.id && ( <
                                                                        span > - < /span>
                                                                    )
                                                            } <
                                                            />
                                                        )
                                                    } <
                                                    /div>
                                                ))
                                            } <
                                            />
                                        )
                                    } <
                                    /div> <
                                    div >
                                    <
                                    span className = {
                                        `${styles.title}`
                                    } > Placement < /span> {
                                        game.players && game.players.length > 0 && ( <
                                            > {
                                                game.players.map((player, index) => ( <
                                                    div key = {
                                                        index
                                                    }
                                                    className = {
                                                        `${styles.placement} ${styles.cell}`
                                                    } >
                                                    {
                                                        game.submitted ? ( <
                                                            span className = {
                                                                player.placement === 1 ? styles.first : ''
                                                            } >
                                                            {
                                                                player.placement
                                                            } <
                                                            /span>
                                                        ) : ( <
                                                            span > - < /span>
                                                        )
                                                        // <Form.Control min="0" type='number' name="placement" className={`${styles.formInput} ${player.placement === 1 ? styles.first : ''}`} />
                                                    } <
                                                    /div>
                                                ))
                                            } <
                                            />
                                        )
                                    } <
                                    /div> <
                                    /div> <
                                    div className = {
                                        styles.action
                                    } > {
                                        game.submitted ? ( <
                                            div className = {
                                                styles.submitted
                                            } > {
                                                game.submittedBy.length > 0 &&
                                                <
                                                div >
                                                <
                                                span > Submitted by < /span> <
                                                div className = {
                                                    classNames(styles.player, styles.mb20)
                                                } >
                                                <
                                                img
                                                src = {
                                                    game.submittedBy.img ?
                                                    game.submittedBy.img :
                                                        placeholderProfileImage
                                                }
                                                alt = 'Player' /
                                                >
                                                <
                                                span
                                                className = 'text-ellipsis'
                                                title = {
                                                    game.submittedBy.name
                                                } >
                                                {
                                                    add3Dots(game.submittedBy.name || "", 15)
                                                }

                                                <
                                                /span> <
                                                /div> <
                                                /div>
                                            }

                                            {
                                                !game.disputed && endDate > now && ( <
                                                    >
                                                    <
                                                    textarea rows = '3'
                                                    name = 'description'
                                                    onChange = {
                                                        e => {
                                                            game.disputeReason = e.target.value
                                                        }
                                                    }
                                                    placeholder = 'Enter dispute reason here...' >
                                                    {
                                                        disputeReason
                                                    } <
                                                    /textarea>

                                                    {
                                                        !disputeInprogress ? ( <
                                                            Button className = {
                                                                styles.mb20
                                                            }
                                                            variant = 'outline-primary'
                                                            onClick = {
                                                                () =>
                                                                createDispute(
                                                                    game.match_id,
                                                                    game.disputeReason,
                                                                    rootIndex
                                                                )
                                                            } >
                                                            Dispute <
                                                            /Button>
                                                        ) : ( <
                                                            > {
                                                                disputeId === rootIndex ? ( <
                                                                    Button className = {
                                                                        styles.mb20
                                                                    }
                                                                    variant = 'outline-primary'
                                                                    disabled >
                                                                    <
                                                                    Spinner as = 'span'
                                                                    animation = 'grow'
                                                                    size = 'sm'
                                                                    role = 'status'
                                                                    aria - hidden = 'true' /
                                                                    >
                                                                    Loading...
                                                                    <
                                                                    /Button>
                                                                ) : ( <
                                                                    Button className = {
                                                                        styles.mb20
                                                                    }
                                                                    variant = 'outline-primary'
                                                                    onClick = {
                                                                        () =>
                                                                        createDispute(
                                                                            game.match_id,
                                                                            game.disputeReason,
                                                                            rootIndex
                                                                        )
                                                                    } >
                                                                    Dispute <
                                                                    /Button>
                                                                )
                                                            } <
                                                            />
                                                        )
                                                    } <
                                                    />
                                                )
                                            }

                                            {
                                                game.disputes &&
                                                    game.disputes.length > 0 &&
                                                    game.disputes.map((item, index) => ( <
                                                            div key = {
                                                                item.id
                                                            }
                                                            className = {
                                                                styles.mb20
                                                            } > {
                                                                index === 0 && < span > Disputed by < /span>} <
                                                                div className = {
                                                                    styles.player
                                                                } >
                                                                <
                                                                img
                                                                src = {
                                                                    item.user.img ?
                                                                    item.user.img :
                                                                        placeholderProfileImage
                                                                }
                                                                alt = 'Player' /
                                                                >
                                                                <
                                                                span
                                                                className = 'text-ellipsis'
                                                                title = {
                                                                    item.user.name
                                                                } >
                                                                {
                                                                    item.user.name
                                                                } <
                                                                /span> <
                                                                /div> <
                                                                div >
                                                                <
                                                                ul >
                                                                <
                                                                li > {
                                                                    item.note
                                                                } < /li> <
                                                                /ul> <
                                                                /div> <
                                                                /div>
                                                            ))
                                                    } <
                                                    /div>
                                            ): ( <
                                                div className = {
                                                    styles.submit
                                                } > {!submitInprogress ? ( <
                                                        Button type = 'button'
                                                        onClick = {
                                                            () => submitResult(game.bracket_id ? game.bracket_id : null)
                                                        }
                                                        variant = 'primary' >
                                                        Submit <
                                                        /Button>
                                                    ) : ( <
                                                        Button variant = 'primary'
                                                        disabled >
                                                        <
                                                        Spinner as = 'span'
                                                        animation = 'grow'
                                                        size = 'sm'
                                                        role = 'status'
                                                        aria - hidden = 'true' /
                                                        >
                                                        Loading...
                                                        <
                                                        /Button>
                                                    )
                                                } <
                                                p >
                                                <
                                                img src = {
                                                    InfoIcon
                                                }
                                                alt = 'Info icon' / > Submission rules:
                                                <
                                                /p> <
                                                ul >
                                                <
                                                li > Each player can only submit once. < /li> <
                                                li > Other players can dispute the result. < /li> <
                                                /ul> <
                                                /div>
                                            )
                                        } <
                                        /div> <
                                        /Form>
                                    ))
                            } <
                            />
                        )
                    } <
                    /div> <
                    div > {
                        /* {tournamentDetail && tournamentDetail.contest.hasBrackets &&
                                  <ScheduleAnnoucements
                                    brackets={brackets}
                                    announcements={announcements}
                                  />
                                } */
                    } <
                    /div> <
                    /motion.div>
            )
        }
        export default SubmitResult