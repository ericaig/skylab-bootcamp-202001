import React, { useState, useEffect, useMemo } from 'react'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Logo from '../Logo'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import HomeIcon from '@material-ui/icons/Home'
import DateRangeIcon from '@material-ui/icons/DateRange'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import { useLocation } from 'react-router-dom'
import EventIcon from '@material-ui/icons/Event';
import EventNoteIcon from '@material-ui/icons/EventNote';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import { FormControlLabel, Tooltip } from '@material-ui/core'
import SignInOutWidget from './SignInOutWidget'
import { context, retrieveUser } from '../../logic'
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useHistory } from "react-router-dom";
import LocationCityIcon from '@material-ui/icons/LocationCity';
import GroupIcon from '@material-ui/icons/Group';

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    title: {
        flexGrow: 1,
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(2),
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}))

function RenderMenuItems({ items }) {
    return <>
        <Divider />
        <List>
            {items.map(({ title, icon: menuIcon, isActive, link }, index) => (
                <ListItem component="a" href={link} selected={isActive} key={index} button>
                    <ListItemIcon>{menuIcon()}</ListItemIcon>
                    <ListItemText primary={title} />
                </ListItem>
            ))}
        </List>
    </>
}

export default function ({ children, container, handleLogout, handleSnackbar }) {
    const classes = useStyles()
    let history = useHistory()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [darkThemeActive, setDarkThemeActive] = useState(false)
    const [loggedInUser, setLoggedInUser] = useState({})

    let location = useLocation();

    // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: darkThemeActive ? 'dark' : 'light',
                },
                typography: {
                    fontFamily: [
                        '-apple-system',
                        'BlinkMacSystemFont',
                        '"Segoe UI"',
                        'Roboto',
                        '"Helvetica Neue"',
                        'Arial',
                        'sans-serif',
                        '"Apple Color Emoji"',
                        '"Segoe UI Emoji"',
                        '"Segoe UI Symbol"',
                    ].join(','),
                },
            }),
        [darkThemeActive],
    );

    function sideMenuOptions(section = '*') {
        const { pathname } = location

        const { role } = loggedInUser
        const isHigherLevelUser = [2, 3].includes(role)

        const menus = [
            { title: 'Dashboard', section: 'main', link: '/cpanel', icon: () => <HomeIcon />, isActive: false, shouldShow: isHigherLevelUser },
            { title: 'Signings', section: 'main', link: '/cpanel/signings', icon: () => <AccessTimeIcon />, isActive: false, shouldShow: true },
            { title: 'Events', section: 'main', link: '/cpanel/events', icon: () => <EventNoteIcon />, isActive: false, shouldShow: true },
            { title: 'Users', section: 'main', link: '/cpanel/users', icon: () => <GroupIcon />, isActive: false, shouldShow: isHigherLevelUser },
            { title: 'Week days', section: 'company', link: '/cpanel/week-days', icon: () => <DateRangeIcon />, isActive: false, shouldShow: isHigherLevelUser },
            { title: 'Calendar', section: 'company', link: '/cpanel/calendar', icon: () => <EventIcon />, isActive: false, shouldShow: isHigherLevelUser },
            { title: 'Profile', section: 'profile', link: '/cpanel/profile', icon: () => <AccountCircleIcon />, isActive: false, shouldShow: true },
            { title: 'Company', section: 'profile', link: '/cpanel/company', icon: () => <LocationCityIcon />, isActive: false, shouldShow: isHigherLevelUser },
        ]

        // let openCompanyMenu = false

        const _menus = menus.filter(menu => {
            (menu.link === pathname && (menu.isActive = true))
            // if(menu.isActive && menu.section === 'company') openCompanyMenu = true

            return (menu.section === section || section === '*') && menu.shouldShow
        })

        // setOpenSubMenu(openCompanyMenu)

        return _menus
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleMenu = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleThemeChanger = () => {
        context.theme = !darkThemeActive ? 'dark' : 'light'
        setDarkThemeActive(!darkThemeActive)

    }

    const handleRetrieveTheme = () => {
        setDarkThemeActive(context.theme === 'dark')
    }

    // const handleOpenCompanyMenu = () => {setOpenSubMenu(!openSubMenu)}

    useEffect(() => {
        ; (async () => {
            handleRetrieveTheme()
            setLoggedInUser(await retrieveUser())
        })()
    }, [])

    const drawer = () => {
        const main = sideMenuOptions('main')
        const company = sideMenuOptions('company')
        const profile = sideMenuOptions('profile')

        return <div>
            <div className={classes.toolbar}><Logo /></div>
            {main.length ? <RenderMenuItems items={main} /> : ''}
            {company.length ? <RenderMenuItems items={company} /> : ''}
            {profile.length ? <RenderMenuItems items={profile} /> : ''}
        </div>
    }

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.title} variant="h6" noWrap>
                            {sideMenuOptions().map(({ title, isActive }) => isActive && title)}
                        </Typography>

                        <SignInOutWidget handleSnackbar={handleSnackbar} />

                        <Tooltip title="Toggle light/dark theme">
                            <IconButton
                                aria-label="theme changer"
                                aria-haspopup="true"
                                onClick={handleThemeChanger}
                                color="inherit"
                            >
                                {darkThemeActive ? <Brightness4Icon /> : <Brightness7Icon />}
                            </IconButton>
                        </Tooltip>
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => {
                                    handleClose();
                                    history.push('/cpanel/profile')
                                }}>{"Profile"}</MenuItem>
                                <MenuItem onClick={handleLogout}>{"Logout"}</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer} aria-label="mailbox folders">
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            // anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer()}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer()}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    {/* <div className={classes.toolbar} /> */}
                    {children}
                </main>
            </div>
        </ThemeProvider>
    )
}
