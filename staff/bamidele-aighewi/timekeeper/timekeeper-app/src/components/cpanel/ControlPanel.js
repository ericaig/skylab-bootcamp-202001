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
import { FormControlLabel } from '@material-ui/core'
import { context } from '../../logic'

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

export default function ({ children, container, handleLogout }) {
    const classes = useStyles()
    // const theme = useTheme()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [darkThemeActive, setDarkThemeActive] = useState(false)

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

        const menus = [
            { title: 'Dashboard', section: 'main', link: '/cpanel', icon: () => <HomeIcon />, isActive: false },
            { title: 'Signings', section: 'main', link: '/cpanel/signings', icon: () => <AccessTimeIcon />, isActive: false },
            { title: 'Events', section: 'main', link: '/cpanel/events', icon: () => <EventNoteIcon />, isActive: false },
            { title: 'Week days', section: 'company', link: '/cpanel/week-days', icon: () => <DateRangeIcon />, isActive: false },
            { title: 'Calendar', section: 'company', link: '/cpanel/calendar', icon: () => <EventIcon />, isActive: false },
        ]

        // let openCompanyMenu = false

        const _menus = menus.filter(menu => {
            (menu.link === pathname && (menu.isActive = true))
            // if(menu.isActive && menu.section === 'company') openCompanyMenu = true

            return menu.section === section || section === '*'
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

    const handleThemeChanger = event => {
        setDarkThemeActive(event.target.checked)
        context.theme = event.target.checked ? 'dark' : 'light'
    }

    const handleRetrieveTheme = () => {
        setDarkThemeActive(context.theme === 'dark')
    }

    // const handleOpenCompanyMenu = () => {setOpenSubMenu(!openSubMenu)}

    useEffect(() => {
        handleRetrieveTheme()
    }, [])

    const drawer = (
        <div>
            <div className={classes.toolbar}>
                <Logo />
            </div>

            <Divider />
            <List>
                {sideMenuOptions('main').map(({ title, icon: menuIcon, isActive, link }, index) => (
                    <ListItem component="a" href={link} selected={isActive} key={index} button>
                        <ListItemIcon>{menuIcon()}</ListItemIcon>
                        <ListItemText primary={title} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {/* <ListItem button onClick={handleOpenCompanyMenu}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                    {openSubMenu ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding> */}
                {sideMenuOptions('company').map(({ title, icon: menuIcon, isActive, link }, index) => (
                    <ListItem component="a" href={link} selected={isActive} key={index} button>
                        <ListItemIcon>{menuIcon()}</ListItemIcon>
                        <ListItemText primary={title} />
                    </ListItem>
                ))}
                {/* </List>
                </Collapse> */}
            </List>
        </div>
    )

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


                        <FormControlLabel
                            control={
                                <Switch
                                    checked={darkThemeActive}
                                    onChange={handleThemeChanger}
                                    color="default"
                                />
                            }
                            label="Dark Vader"
                            labelPlacement="top"
                        />
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
                                <MenuItem onClick={handleClose}>{"Profile"}</MenuItem>
                                <MenuItem onClick={handleClose}>{"My account"}</MenuItem>
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
                            {drawer}
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
                            {drawer}
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
