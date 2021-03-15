import React from 'react';
import styles from './ScheduleAnnoucements.module.scss';
import {
    motion,
    AnimatePresence
} from 'framer-motion';
import ScheduleIcon from 'assets/images/icons/schedule.svg';
import AnnouncementsIcon from 'assets/images/icons/announcements.svg';
import Button from 'react-bootstrap/Button';
import SingleMatch from 'components/Tournaments/SingleMatch';
import * as moment from 'moment';


const ScheduleAnnoucements = ({
    brackets,
    announcements,
    ...props
}) => {
    const variants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1
        },
    };
    const [sideType, setSideType] = React.useState('schedule');
    const [matchType, setMatchType] = React.useState('upcoming');
    let currentUpcomingDate = null;
    let currentOngoingDate = null;
    let currentFinishedDate = null;

    // let startDate = moment.utc(props.date, 'YYYY-MM-DD HH:mm:ss').local();
    // let endDate = moment.utc(props.endDate, 'YYYY-MM-DD HH:mm:ss').local();


    return ( <
        >
        <
        div className = {
            styles.sideNav
        } >
        <
        Button variant = {
            sideType === 'schedule' ? 'primary' : 'light'
        }
        className = {
            sideType === 'schedule' ? styles.primary : styles.light
        }
        onClick = {
            () => sideType !== 'schedule' && setSideType('schedule')
        } >
        < img src = {
            ScheduleIcon
        }
        alt = 'Schedule icon' / > Schedule < /Button> <
        Button variant = {
            sideType === 'announcements' ? 'primary' : 'light'
        }
        className = {
            sideType === 'announcements' ? styles.primary : styles.light
        }
        onClick = {
            () => sideType !== 'announcements' && setSideType('announcements')
        } >
        < img src = {
            AnnouncementsIcon
        }
        alt = 'Announcements icon' / > Announcements < /Button> <
        /div>

        <
        div className = {
            styles.scheduleAnnouncements
        } >
        <
        AnimatePresence > {
            sideType === 'schedule' &&
            <
            motion.div
            initial = 'hidden'
            animate = 'visible'
            exit = 'exit'
            variants = {
                variants
            }
            transition = {
                {
                    ease: 'easeOut',
                    duration: .3
                }
            }
            className = 'matches' >
            <
            div className = {
                styles.matchesNav
            } >
            <
            Button
            variant = {
                matchType === 'upcoming' ? 'outline-primary' : 'link'
            }
            className = {
                matchType === 'upcoming' ? styles.primary : styles.light
            }
            onClick = {
                () => matchType !== 'upcoming' && setMatchType('upcoming')
            } >
            Upcoming < /Button>

            <
            Button
            variant = {
                matchType === 'ongoing' ? 'outline-primary' : 'link'
            }
            className = {
                matchType === 'ongoing' ? styles.primary : styles.light
            }
            onClick = {
                () => matchType !== 'ongoing' && setMatchType('ongoing')
            } >
            Ongoing < /Button>

            <
            Button
            variant = {
                matchType === 'finished' ? 'outline-primary' : 'link'
            }
            className = {
                matchType === 'finished' ? styles.primary : styles.light
            }
            onClick = {
                () => matchType !== 'finished' && setMatchType('finished')
            } >
            Finished < /Button> <
            /div>

            <
            div className = {
                styles.matchesWrapper
            } >
            <
            AnimatePresence > {
                brackets !== undefined && brackets !== null && brackets.bracket_data.upcoming !== undefined && brackets.bracket_data.upcoming !== null &&
                <
                > {
                    (brackets.bracket_data.upcoming.length > 0 && matchType === 'upcoming') ? ( <
                        motion.div initial = 'hidden'
                        animate = 'visible'
                        exit = 'exit'
                        variants = {
                            variants
                        }
                        transition = {
                            {
                                ease: 'easeOut',
                                duration: .3
                            }
                        }
                        className = 'upcoming' >
                        {
                            brackets.bracket_data.upcoming.map((match, index) => {
                                let addDate = false;
                                if (currentUpcomingDate !== moment(moment.utc(match.time, 'YYYY-MM-DD HH:mm:ss').local()).format('D MM')) {
                                    addDate = true;
                                    currentUpcomingDate = moment(moment.utc(match.time, 'YYYY-MM-DD HH:mm:ss').local()).format('D MM')
                                } else {
                                    addDate = false;
                                }
                                return ( <
                                    SingleMatch key = {
                                        index
                                    }
                                    addDate = {
                                        addDate
                                    }
                                    home = {
                                        match.teams.home
                                    }
                                    away = {
                                        match.teams.away
                                    }
                                    time = {
                                        moment(moment.utc(match.time, 'YYYY-MM-DD HH:mm:ss').local())
                                    }
                                    />
                                )
                            })
                        } <
                        /motion.div>
                    ) : (matchType === 'upcoming' &&
                        <
                        >
                        <
                        p className = {
                            'text-center w-100'
                        } > No upcoming match Yet. < /p> <
                        />
                    )
                } <
                />
            } <
            /AnimatePresence>

            <
            AnimatePresence > {
                brackets && brackets.bracket_data.ongoing &&
                <
                > {
                    (brackets.bracket_data.ongoing.length > 0 && matchType === 'ongoing') ? ( <
                        motion.div initial = 'hidden'
                        animate = 'visible'
                        exit = 'exit'
                        variants = {
                            variants
                        }
                        transition = {
                            {
                                ease: 'easeOut',
                                duration: .3
                            }
                        }
                        className = 'ongoing' >
                        {
                            brackets.bracket_data.ongoing.map((match, index) => {
                                let addDate = false;
                                if (currentOngoingDate !== moment(moment.utc(match.time, 'YYYY-MM-DD HH:mm:ss').local()).format('D MM')) {
                                    addDate = true;
                                    currentOngoingDate = moment(moment.utc(match.time, 'YYYY-MM-DD HH:mm:ss').local()).format('D MM')
                                } else {
                                    addDate = false;
                                }
                                return ( <
                                    SingleMatch key = {
                                        index
                                    }
                                    addDate = {
                                        addDate
                                    }
                                    home = {
                                        match.teams.home
                                    }
                                    away = {
                                        match.teams.away
                                    }
                                    time = {
                                        moment(moment.utc(match.time, 'YYYY-MM-DD HH:mm:ss').local())
                                    }
                                    />
                                )
                            })
                        } <
                        /motion.div>
                    ) : (matchType === 'ongoing' &&
                        <
                        >
                        <
                        p className = {
                            'text-center w-100'
                        } > No ongoing match yet. < /p> <
                        />
                    )
                } <
                />
            } <
            /AnimatePresence>

            <
            AnimatePresence > {
                brackets !== undefined && brackets !== null && brackets.bracket_data.finished !== undefined && brackets.bracket_data.finished !== null &&
                <
                > {
                    (brackets.bracket_data.finished.length > 0 && matchType === 'finished') ? ( <
                        motion.div initial = 'hidden'
                        animate = 'visible'
                        exit = 'exit'
                        variants = {
                            variants
                        }
                        transition = {
                            {
                                ease: 'easeOut',
                                duration: .3
                            }
                        }
                        className = 'finished' >
                        {
                            brackets.bracket_data.finished.map((match, index) => {
                                let addDate = false;
                                if (currentFinishedDate !== moment(moment.utc(match.time, 'YYYY-MM-DD HH:mm:ss').local()).format('D MM')) {
                                    addDate = true;
                                    currentFinishedDate = moment(moment.utc(match.time, 'YYYY-MM-DD HH:mm:ss').local()).format('D MM')
                                } else {
                                    addDate = false;
                                }
                                return ( <
                                    SingleMatch key = {
                                        index
                                    }
                                    addDate = {
                                        addDate
                                    }
                                    home = {
                                        match.teams.home
                                    }
                                    away = {
                                        match.teams.away
                                    }
                                    time = {
                                        moment(moment.utc(match.time, 'YYYY-MM-DD HH:mm:ss').local())
                                    }
                                    />
                                )
                            })
                        } <
                        /motion.div>
                    ) : (matchType === 'finished' &&
                        <
                        >
                        <
                        p className = {
                            'text-center w-100'
                        } > No finished match yet. < /p> <
                        />
                    )
                } <
                />
            } <
            /AnimatePresence> <
            /div> <
            /motion.div>
        } <
        /AnimatePresence>

        <
        AnimatePresence > {
            announcements !== null && sideType === 'announcements' &&
            <
            motion.div
            initial = 'hidden'
            animate = 'visible'
            exit = 'exit'
            variants = {
                variants
            }
            transition = {
                {
                    ease: 'easeOut',
                    duration: .3
                }
            }
            className = {
                styles.announcements
            } >
            {
                announcements.length ?
                <
                >

                {
                    announcements.map((announcement, index) => ( <
                        div key = {
                            index
                        }
                        className = {
                            styles.singleAnnouncement
                        } >
                        <
                        div className = {
                            styles.heading
                        } >
                        <
                        div >
                        <
                        img src = {
                            announcement.image
                        }
                        alt = 'Annoucement' / >
                        <
                        div >
                        <
                        h3 > {
                            announcement.name
                        } < /h3> <
                        span > {
                            announcement.type
                        } < /span> <
                        /div> <
                        /div> <
                        span className = {
                            styles.time
                        } > {
                            announcement.time
                        } < /span> <
                        /div> <
                        div dangerouslySetInnerHTML = {
                            {
                                __html: announcement.content
                            }
                        } > < /div> <
                        /div>
                    ))
                } <
                /> :
                    <
                    p className = {
                        'text-center w-100'
                    } > No announcements yet. < /p>


            } <
            /motion.div>
        } <
        /AnimatePresence> <
        /div>

        <
        />
    )
}
export default ScheduleAnnoucements;