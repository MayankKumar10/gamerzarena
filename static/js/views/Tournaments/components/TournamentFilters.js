import React from 'react';
import styles from './TournamentFilters.module.scss';
import withSizes from 'react-sizes';
import Form from 'react-bootstrap/Form'
import Slider from "react-slick";
import TournamentGame from "../../../components/Games/TournamentGame";
import {
    useDispatch,
    useSelector
} from "react-redux";
import InputGroup from 'react-bootstrap/InputGroup'
import SearchIcon from '@material-ui/icons/Search';

import filterSvg from 'assets/images/icon-filter.svg';
import arrowUpSvg from 'assets/images/icon-arrow.svg';
import arrowDownSvg from 'assets/images/icon-arrow-down.svg';

import {
    makeStyles
} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function TabPanel(props) {
    const {
        children,
        value,
        index,
        ...other
    } = props;

    return ( <
        div role = "tabpanel"
        hidden = {
            value !== index
        }
        id = {
            `scrollable-force-tabpanel-${index}`
        }
        aria - labelledby = {
            `scrollable-force-tab-${index}`
        } { ...other
        } >
        {
            value === index && ( <
                Box p = {
                    3
                } >
                <
                div > {
                    children
                } < /div> <
                /Box>
            )
        } <
        /div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction = "up"
    ref = {
        ref
    } { ...props
    }
    />;
});

const TournamentFilters = (props) => {
    const dispatch = useDispatch();
    const {
        getFilterData,
        platforms,
        searchTournament,
        searchVal,
        resetAllFilter
    } = props;
    const landingData = useSelector(({
        TournamentAppStore
    }) => TournamentAppStore.tournamentApp.game);
    const [editing, setEditing] = React.useState(true);
    const [resetBtn, setResetBtn] = React.useState(false);
    const [toggleFilter, setToggleFilter] = React.useState(false);

    const tournamentsCount = useSelector(
        ({
            TournamentAppStore
        }) =>
        TournamentAppStore.tournamentApp.tournamentsCount
    );

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const [filters, setAvailableFilters] = React.useState([{
            name: 'Games',
            // options: games,
            selected: '',
        },
        {
            name: 'Status',
            // options: [
            //     'Open',
            //     'Ongoing',
            //     // 'Completed',
            // ],
            selected: null,

        },
        {
            name: 'Entry',
            // options: [
            //     'Free',
            //     'GA+',
            // ],
            selected: null,
        },
        {
            name: 'Platform',
            // options: platforms,
            selected: null,
        },
        {
            name: 'System',
            // options: [
            //     'Leaderboard',
            //     'Bracket',
            // ],
            selected: null,
        },
        {
            name: 'date_range',
            // options: [
            //     'today',
            //     'this_week',
            //     'this_month'
            // ],
            selected: null,
        },
        {
            name: 'tracking_type',
            // options: [
            //     'today',
            //     'this_week',
            //     'this_month'
            // ],
            selected: null,
        },
    ]);
    const [editingFilter, setEditingFilter] = React.useState('');
    const [gameOption, setGameOption] = React.useState('');
    const [dateRange, setDateRange] = React.useState('');
    const [entry, setEntry] = React.useState('');

    const [selectedStatus, setSelectedStatus] = React.useState([]);
    const [selectedPlatform, setSelectedPlatform] = React.useState([]);
    const [selectedTrackType, setSelectedTrackType] = React.useState([]);
    const [selectedFormate, setSelectedFormate] = React.useState([]);


    // const [value, setValue] = React.useState('');

    // React.useEffect(() => {
    //     // Remove selected game when destroyed
    //     return () => {
    //         dispatch(AppActions.clearFilters({ selectedGame: null, options: null }));
    //     }
    // }, []);

    // React.useEffect(() => {
    //     // Remove selected game when destroyed
    //     if (selectedGame) {
    //         setResetBtn(true)
    //     }
    // }, [dispatch]);


    const setFilter = (name, option) => {
        window.scrollTo({
            top: props.isMobile ? 600 : 700,
            behavior: 'smooth',
        })

        if (name === "Games") {
            setGameOption(option);
        } else if (name === "date_range") {
            setDateRange(option)
        } else if (name == "Entry") {
            setEntry(option)
        } else if (name == "Status") {
            setSelectedStatus(option)

            let data = selectedStatus;
            if (data.includes(option)) {
                data = data.filter(e => e !== option)
            } else {
                data.push(option)
            }
            setSelectedStatus(data)
            option = data.join(',');

        } else if (name == "Platform") {
            let data = selectedPlatform;
            if (data.includes(option)) {
                data = data.filter(e => e !== option)
            } else {
                data.push(option)
            }
            setSelectedPlatform(data)
            option = data.join(',');
        } else if (name == "tracking_type") {

            let data = selectedTrackType;
            if (data.includes(option)) {
                data = data.filter(e => e !== option)
            } else {
                data.push(option)
            }
            setSelectedTrackType(data)
            option = data.join(',');
        } else if (name == "System") {
            let data = selectedFormate;
            if (data.includes(option)) {
                data = data.filter(e => e !== option)
            } else {
                data.push(option)
            }
            setSelectedFormate(data)
            option = data.join(',');
        }

        const newFilters = filters.map((filter, i) => {
            if (filter.name !== name) {
                setResetBtn(true)
                return filter;
            }
            return { ...filter,
                selected: option
            }
        });
        setAvailableFilters(newFilters);
        getFilterData(newFilters, searchVal);
    }

    const resetFilter = () => {
        setGameOption('');
        setDateRange('')
        setEntry('')

        setSelectedStatus([])
        setSelectedPlatform([])
        setSelectedTrackType([])
        setSelectedFormate([])
        const newFilters = filters.map((filter, i) => {
            return { ...filter,
                selected: ""
            }
        });
        setAvailableFilters(newFilters);
        resetAllFilter()
        setResetBtn(false)
    }

    const gamesSliderSettings = {
        infinite: true,
        dots: false,
        arrows: landingData && landingData.length > 7 ? true : false,
        slidesToShow: landingData && landingData.length < 10 ? landingData.length : 10,
        slidesToScroll: 1,
        autoplay: false,
        swipeToSlide: true,
        responsive: [{
                breakpoint: 1000,
                settings: {
                    slidesToShow: landingData && landingData.length < 9 ? landingData.length : 9,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: landingData && landingData.length < 8 ? landingData.length : 8,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: landingData && landingData.length < 7 ? landingData.length : 7,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: landingData && landingData.length < 6 ? landingData.length : 6,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: landingData && landingData.length < 5 ? landingData.length : 5,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: landingData && landingData.length < 4 ? landingData.length : 4,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
            {
                breakpoint: 420,
                settings: {
                    slidesToShow: landingData && landingData.length < 3 ? landingData.length : 3,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
        ],
    };

    function searchOnChange(e) {
        searchTournament(e.target.value)
        if (e.target.value) {
            setResetBtn(true)
        }
    }

    function toggleFilters() {
        if (props.isMobile) {
            handleClickOpen();
        } else {
            setToggleFilter(!toggleFilter)
        }
    }
    return ( <
        div className = {
            styles.filtersWrapper
        } >
        <
        div className = {
            styles.slider
        } >
        <
        Slider { ...gamesSliderSettings
        }
        className = {
            styles.gamesSlider
        } > {
            (!landingData ? Array.from(new Array(30)) : landingData).map((game, index) => ( <
                TournamentGame key = {
                    index
                }
                game = {
                    game
                }
                selectedGame = {
                    gameOption
                }
                setFilter = {
                    setFilter
                }
                />
            ))
        } <
        /Slider> <
        /div> <
        div className = {
            styles.filter
        } >
        <
        div className = {
            styles.rightSide
        } >
        <
        div onClick = {
            () => setFilter("Entry", "GA+")
        }
        className = {
            `${styles.gaPlus} ${entry == "GA+" ? styles.gaPlusActive : ''}`
        } > GA + < /div> <
        div onClick = {
            () => setFilter("Entry", "Free")
        }
        className = {
            `${styles.free} ${entry == "Free" ? styles.freeActive : ''}`
        } > FREE < /div> <
        div onClick = {
            () => setFilter("Entry", "Payable")
        }
        className = {
            `${styles.paid} ${entry == "Payable" ? styles.paidActive : ''}`
        } > PAID < /div>

        <
        /div>

        <
        div className = {
            styles.center
        } >
        <
        div onClick = {
            () => setFilter("date_range", "today")
        }
        className = {
            `${styles.today} ${dateRange == "today" ? styles.selected : ''}`
        } > Today < /div> <
        div onClick = {
            () => setFilter("date_range", "this_week")
        }
        className = {
            `${styles.thisWeek} ${dateRange == "this_week" ? styles.selected : ''}`
        } > This Week < /div> <
        div onClick = {
            () => setFilter("date_range", "this_month")
        }
        className = {
            `${styles.thisMonth} ${dateRange == "this_month" ? styles.selected : ''}`
        } > This Month < /div> {
            props.isMobile &&
                <
                div className = {
                    styles.togglefilters
                }
            onClick = {
                    toggleFilters
                } >
                <
                img src = {
                    filterSvg
                }
            alt = 'filterSvg' / >
                <
                /div>
        } <
        /div> {
            !props.isMobile &&
                <
                div className = {
                    styles.leftSide
                } >
                <
                div className = {
                    styles.togglefilters
                }
            onClick = {
                    toggleFilters
                } >
                <
                img src = {
                    filterSvg
                }
            alt = 'filterSvg' / >
                <
                span > Filters < /span> <
                img src = {
                    toggleFilter ? arrowUpSvg : arrowDownSvg
                }
            alt = 'filterSvg' / >
                <
                /div> <
                /div>
        } <
        /div> {
            !props.isMobile &&
                <
                div className = {
                    toggleFilter ? styles.expandCollapse : styles.hide
                } >

                <
                div className = {
                    styles.status
                } >
                <
                span >
                <
                StatusSvg / >
                <
                /span> <
                span className = {
                    styles.label
                } > STATUS < /span> <
                div >
                <
                Form.Check
            className = {
                styles.formCheck
            }
            type = "checkbox"
            id = "Open"
            label = "Open"
            name = "Open"
            onChange = {
                () => setFilter("Status", "Open")
            }
            checked = {
                selectedStatus.includes("Open")
            }

            /> <
            Form.Check
            className = {
                styles.formCheck
            }
            type = "checkbox"
            id = "Ongoing"
            label = "Ongoing"
            name = "Ongoing"
            onChange = {
                () => setFilter("Status", "Ongoing")
            }
            checked = {
                selectedStatus.includes("Ongoing")
            }

            />

            <
            /div> <
            /div> <
            div className = {
                    styles.platforms
                } >
                <
                span >
                <
                PlatformSvg / >
                <
                /span> <
                span className = {
                    styles.label
                } > Platform < /span> <
                div className = {
                    styles.consoleWrapper
                } > {
                    platforms && platforms.map((item, index) =>
                        <
                        Form.Check key = {
                            index
                        }
                        className = {
                            styles.formCheck
                        }
                        type = "checkbox"
                        id = {
                            item.name
                        }
                        label = {
                            item.name
                        }
                        name = {
                            item.name
                        }
                        checked = {
                            selectedPlatform.includes(item.name)
                        }
                        onChange = {
                            () => setFilter("Platform", item.name)
                        }
                        />
                    )
                } <
                /div> <
                /div> <
                div className = {
                    styles.trackingType
                } >
                <
                span >
                <
                PlatformSvg / >
                <
                /span> <
                span className = {
                    styles.label
                } > STREAM TYPE < /span> <
                div >
                <
                Form.Check
            className = {
                styles.formCheck
            }
            type = "checkbox"
            id = "Tracked"
            label = "Tracked"
            name = "Tracked"
            onChange = {
                () => setFilter("tracking_type", "Tracked")
            }
            checked = {
                selectedTrackType.includes("Tracked")
            }
            /> <
            Form.Check
            className = {
                styles.formCheck
            }
            type = "checkbox"
            id = "Untracked"
            label = "Untracked"
            name = "Untracked"
            onChange = {
                () => setFilter("tracking_type", "Untracked")
            }
            checked = {
                selectedTrackType.includes("Untracked")
            }
            /> <
            /div> <
            /div> <
            div className = {
                    styles.platforms
                } >
                <
                span >
                <
                FormateSvg / >
                <
                /span> <
                span className = {
                    styles.format
                } > FORMAT < /span> <
                div >
                <
                Form.Check
            className = {
                styles.formCheck
            }
            type = "checkbox"
            id = "Leaderboard"
            label = "Leaderboard"
            name = "Leaderboard"
            onChange = {
                () => setFilter("System", "Leaderboard")
            }
            checked = {
                selectedFormate.includes("Leaderboard")
            }

            /> <
            Form.Check
            className = {
                styles.formCheck
            }
            type = "checkbox"
            id = "Bracket"
            label = "Bracket"
            name = "Bracket"
            onChange = {
                () => setFilter("System", "Bracket")
            }
            checked = {
                selectedFormate.includes("Bracket")
            }

            /> <
            /div> <
            /div> <
            /div>
        } <
        div className = {
            styles.searchBar
        } >
        <
        Form.Row >
        <
        Form.Group >
        <
        InputGroup >
        <
        InputGroup.Prepend >
        <
        InputGroup.Text >
        <
        SearchIcon / >
        <
        /InputGroup.Text> <
        /InputGroup.Prepend> <
        Form.Control className = {
            styles.searchInput
        }
        type = "text"
        placeholder = "Search Tournament..."
        value = {
            searchVal
        }
        onChange = {
            (e) => searchOnChange(e)
        }
        /> <
        /InputGroup> <
        /Form.Group> <
        /Form.Row> <
        div className = {
            styles.tCount
        } > {
            tournamentsCount
        }
        Tournaments <
        /div> <
        /div>


        {
            props.isMobile && resetBtn &&
                <
                div className = {
                    styles.mobileFilterChip
                } > {
                    selectedStatus.length > 0 && selectedStatus.map((item, index) =>
                        <
                        Chip icon = { < StatusSvg / >
                        }
                        key = {
                            index
                        }
                        label = {
                            item
                        }
                        onDelete = {
                            () => setFilter("Status", item)
                        }
                        variant = "outlined" /
                        >
                    )
                }

            {
                selectedPlatform.length > 0 && selectedPlatform.map((item, index) =>
                    <
                    Chip icon = { < PlatformSvg / >
                    }
                    key = {
                        index
                    }
                    label = {
                        item
                    }
                    onDelete = {
                        () => setFilter("Platform", item)
                    }
                    variant = "outlined" /
                    >
                )
            }

            {
                selectedTrackType.length > 0 && selectedTrackType.map((item, index) =>
                    <
                    Chip icon = { < PlatformSvg / >
                    }
                    key = {
                        index
                    }
                    label = {
                        item
                    }

                    onDelete = {
                        () => setFilter("tracking_type", item)
                    }
                    variant = "outlined" /
                    >
                )
            }

            {
                selectedFormate.length > 0 && selectedFormate.map((item, index) =>
                    <
                    Chip icon = { < FormateSvg / >
                    }
                    key = {
                        index
                    }
                    label = {
                        item
                    }
                    onDelete = {
                        () => setFilter("System", item)
                    }
                    variant = "outlined" /
                    >
                )
            } <
            /div>
        } {
            resetBtn &&
                <
                div onClick = {
                    () => resetFilter()
                }
            className = {
                styles.clear
            } > Clear All < /div>
        } {
            props.isMobile &&
                <
                Dialog fullScreen open = {
                    open
                }
            className = {
                styles.filterDialog
            }
            onClose = {
                handleClose
            }
            TransitionComponent = {
                Transition
            }
            style = {
                    {
                        zIndex: '1300000'
                    }
                } >
                <
                AppBar className = {
                    classes.appBar
                } >
                <
                Toolbar >
                <
                IconButton edge = "start"
            color = "inherit"
            onClick = {
                handleClose
            }
            aria - label = "close" >
                <
                ArrowBackIcon / >
                <
                /IconButton> <
                h5 className = {
                    classes.title
                } > Filters < /h5> {
                    /* <Button autoFocus color="inherit" onClick={handleClose}>
                                                Apply
                                             </Button> */
                } <
                /Toolbar> <
                /AppBar>

                <
                div className = {
                    classes.root
                } >
                <
                AppBar position = "static"
            color = "default" >
                <
                Tabs
            value = {
                value
            }
            onChange = {
                handleChange
            }
            variant = "scrollable"
            scrollButtons = "on"
            indicatorColor = "primary"
            textColor = "primary"
            aria - label = "scrollable force tabs example" >
                <
                Tab label = "STATUS" { ...a11yProps(0)
                }
            /> <
            Tab label = "PLATFORM" { ...a11yProps(1)
            }
            /> <
            Tab label = "STREAM TYPE" { ...a11yProps(2)
            }
            /> <
            Tab label = "FORMAT" { ...a11yProps(3)
            }
            /> <
            /Tabs> <
            /AppBar> <
            TabPanel value = {
                value
            }
            index = {
                    0
                } >
                <
                div >
                <
                Form.Check
            className = {
                styles.formCheck
            }
            type = "checkbox"
            id = "Open"
            label = "Open"
            name = "Open"
            onChange = {
                () => setFilter("Status", "Open")
            }
            checked = {
                selectedStatus.includes("Open")
            }
            /> <
            Form.Check
            className = {
                styles.formCheck
            }
            type = "checkbox"
            id = "Ongoing"
            label = "Ongoing"
            name = "Ongoing"
            onChange = {
                () => setFilter("Status", "Ongoing")
            }
            checked = {
                selectedStatus.includes("Ongoing")
            }
            /> <
            /div> <
            /TabPanel> <
            TabPanel value = {
                value
            }
            index = {
                    1
                } >
                <
                div className = {
                    styles.consoleWrapper
                } > {
                    platforms.map((item, index) =>
                        <
                        Form.Check key = {
                            index
                        }
                        className = {
                            styles.formCheck
                        }
                        type = "checkbox"
                        id = {
                            item.name
                        }
                        label = {
                            item.name
                        }
                        name = {
                            item.name
                        }
                        checked = {
                            selectedPlatform.includes(item.name)
                        }
                        onChange = {
                            () => setFilter("Platform", item.name)
                        }
                        />
                    )
                } <
                /div> <
                /TabPanel> <
                TabPanel value = {
                    value
                }
            index = {
                    2
                } >
                <
                div >
                <
                Form.Check
            className = {
                styles.formCheck
            }
            type = "checkbox"
            id = "Tracked"
            label = "Tracked"
            name = "Tracked"
            onChange = {
                () => setFilter("tracking_type", "Tracked")
            }
            checked = {
                selectedTrackType.includes("Tracked")
            }
            /> <
            Form.Check
            className = {
                styles.formCheck
            }
            type = "checkbox"
            id = "Untracked"
            label = "Untracked"
            name = "Untracked"
            onChange = {
                () => setFilter("tracking_type", "Untracked")
            }
            checked = {
                selectedTrackType.includes("Untracked")
            }
            /> <
            /div> <
            /TabPanel> <
            TabPanel value = {
                value
            }
            index = {
                    3
                } >
                <
                div >
                <
                Form.Check
            className = {
                styles.formCheck
            }
            type = "checkbox"
            id = "Leaderboard"
            label = "Leaderboard"
            name = "Leaderboard"
            onChange = {
                () => setFilter("System", "Leaderboard")
            }
            checked = {
                selectedFormate.includes("Leaderboard")
            }

            /> <
            Form.Check
            className = {
                styles.formCheck
            }
            type = "checkbox"
            id = "Bracket"
            label = "Bracket"
            name = "Bracket"
            onChange = {
                () => setFilter("System", "Bracket")
            }
            checked = {
                selectedFormate.includes("Bracket")
            }

            /> <
            /div> <
            /TabPanel>

            <
            /div> <
            /Dialog>
        } <
        /div>
    )
}


const mapSizesToProps = ({
    width
}) => ({
    isMobile: width < 1000,
})

export default withSizes(mapSizesToProps)(TournamentFilters)


const PlatformSvg = () => ( <
    svg xmlns = "http://www.w3.org/2000/svg"
    width = "20"
    height = "21"
    viewBox = "0 0 20 21" >
    <
    defs >
    <
    filter id = "1p8jwexxxa" >
    <
    feColorMatrix in = "SourceGraphic"
    values = "0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 1.000000 0" / >
    <
    /filter> <
    /defs> <
    g fill = "none"
    fillRule = "evenodd" >
    <
    g >
    <
    g >
    <
    g filter = "url(#1p8jwexxxa)"
    transform = "translate(-320 -984) translate(-1 946) translate(321 38.5)" >
    <
    g fill = "#000"
    fillRule = "nonzero" >
    <
    path d = "M16.25.25H3.75C1.679.25 0 1.929 0 4v8.267c-.002.461.183.904.512 1.228.33.325.775.507 1.238.505h.024c1.624-.022 1.873-.5 3.494-3.634l.602-1.162c.376-.64 1.062-1.035 1.805-1.037h4.65c.731 0 1.41.383 1.787 1.011.267.512.5.968.71 1.373C16.328 13.47 16.6 14 18.216 14c.473.002.928-.186 1.262-.52.334-.33.522-.778.522-1.247V4C20 1.929 18.321.25 16.25.25zm-10.208 5h-.625c-.23 0-.417.187-.417.417v.625c0 .345-.28.625-.625.625s-.625-.28-.625-.625v-.625c0-.23-.187-.417-.417-.417h-.625c-.345 0-.625-.28-.625-.625S2.363 4 2.708 4h.625c.23 0 .417-.187.417-.417v-.625c0-.345.28-.625.625-.625s.625.28.625.625v.625c0 .23.187.417.417.417h.625c.345 0 .625.28.625.625s-.28.625-.625.625zm7.291 0c-.46 0-.833-.373-.833-.833 0-.46.373-.834.833-.834.46 0 .834.373.834.834 0 .46-.373.833-.834.833zm2.084 1.667c-.46 0-.834-.373-.834-.834 0-.46.373-.833.834-.833.46 0 .833.373.833.833 0 .46-.373.834-.833.834zm0-3.334c-.46 0-.834-.373-.834-.833 0-.46.373-.833.834-.833.46 0 .833.373.833.833 0 .46-.373.833-.833.833zM17.5 5.25c-.46 0-.833-.373-.833-.833 0-.46.373-.834.833-.834.46 0 .833.373.833.834 0 .46-.373.833-.833.833z"
    transform = "translate(0 3)" / >
    <
    /g> <
    /g> <
    /g> <
    /g> <
    /g> <
    /svg>


)
const FormateSvg = () => ( <
    svg xmlns = "http://www.w3.org/2000/svg"
    width = "20"
    height = "21"
    viewBox = "0 0 20 21" >
    <
    defs >
    <
    filter id = "lgknsodsga" >
    <
    feColorMatrix in = "SourceGraphic"
    values = "0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 1.000000 0" / >
    <
    /filter> <
    /defs> <
    g fill = "none"
    fillRule = "evenodd" >
    <
    g >
    <
    g >
    <
    g filter = "url(#lgknsodsga)"
    transform = "translate(-942 -984) translate(-1 946) translate(943 38.5)" >
    <
    g fill = "#000"
    fillRule = "nonzero" >
    <
    path d = "M19.167 6.793H.833c-.46 0-.833.373-.833.833v2.5c.003.855.529 1.62 1.326 1.93.08.031.132.108.132.194v1c0 .345.28.625.625.625.346 0 .625-.28.625-.625v-.833c0-.115.094-.209.209-.209h14.166c.115 0 .209.094.209.209v.833c0 .345.28.625.625.625s.625-.28.625-.625v-1c0-.086.052-.163.132-.194.797-.31 1.323-1.075 1.326-1.93v-2.5c0-.46-.373-.833-.833-.833zm-2.5 3.333c-.46 0-.834-.373-.834-.833 0-.46.373-.834.834-.834.46 0 .833.373.833.834 0 .46-.373.833-.833.833zM15 9.293c0 .46-.373.833-.833.833-.46 0-.834-.373-.834-.833 0-.46.373-.834.834-.834.46 0 .833.373.833.834zm-2.5 0c0 .46-.373.833-.833.833-.46 0-.834-.373-.834-.833 0-.46.373-.834.834-.834.46 0 .833.373.833.834zM.903 5.96h18.194c.34 0 .648-.208.773-.525.127-.308.055-.662-.183-.896L15.884.492C15.65.257 15.332.125 15 .126H5c-.336 0-.658.135-.893.375L.328 4.522c-.246.236-.325.597-.199.913.127.317.434.524.774.524z"
    transform = "translate(0 3)" / >
    <
    /g> <
    /g> <
    /g> <
    /g> <
    /g> <
    /svg>

)
const StatusSvg = () => ( <
    svg xmlns = "http://www.w3.org/2000/svg"
    width = "20"
    height = "21"
    viewBox = "0 0 20 21" >
    <
    defs >
    <
    filter id = "8j4s148rsa" >
    <
    feColorMatrix in = "SourceGraphic"
    values = "0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 1.000000 0" / >
    <
    /filter> <
    /defs> <
    g fill = "none"
    fillRule = "evenodd" >
    <
    g >
    <
    g >
    <
    g filter = "url(#8j4s148rsa)"
    transform = "translate(-110 -984) translate(-1 946) translate(111 38.5)" >
    <
    g fill = "#000"
    fillRule = "nonzero" >
    <
    path d = "M16.885 7.872c-.02-1.814-.753-3.547-2.04-4.825S11.807 1.07 9.994 1.11c-1.84.03-3.592.783-4.88 2.095-1.302 1.298-2.02 3.069-1.99 4.907-.002 1.795.71 3.517 1.98 4.785 1.27 1.27 2.992 1.98 4.787 1.977h.124c3.83-.041 6.902-3.173 6.87-7.002zM9.171 4.657c0-.46.373-.834.833-.834.46 0 .834.373.834.834v3.75c0 .46-.373.833-.834.833-.46 0-.833-.373-.833-.833v-3.75zm.852 7.519h-.019c-.575.005-1.045-.458-1.05-1.033-.005-.575.458-1.046 1.033-1.05h.017c.576-.005 1.046.458 1.05 1.033.005.575-.458 1.045-1.033 1.05h.002z"
    transform = "translate(0 2)" / >
    <
    path d = "M4.317 14.083C2.63 12.505 1.67 10.3 1.667 7.991c-.01-2.297.94-4.494 2.617-6.063.221-.204.316-.51.248-.802C4.464.833 4.244.6 3.956.516c-.288-.086-.6-.01-.815.199C1.127 2.597-.011 5.235 0 7.991c.004 2.772 1.155 5.42 3.18 7.314.218.203.528.274.813.187.285-.088.502-.32.568-.611.067-.29-.026-.595-.244-.798zM16.849.696c-.217-.205-.527-.28-.813-.193-.286.086-.504.318-.572.609-.067.29.026.595.244.799 1.688 1.57 2.643 3.774 2.634 6.08-.003 2.311-.963 4.518-2.651 6.097-.218.203-.311.506-.244.796.067.29.283.523.568.61.285.087.595.016.812-.187 2.026-1.888 3.178-4.532 3.182-7.301.005-2.77-1.14-5.416-3.16-7.31z"
    transform = "translate(0 2)" / >
    <
    /g> <
    /g> <
    /g> <
    /g> <
    /g> <
    /svg>
)