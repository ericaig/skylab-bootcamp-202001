import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import InboxIcon from '@material-ui/icons/MoveToInbox'
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
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import StarBorder from '@material-ui/icons/StarBorder'
import Collapse from '@material-ui/core/Collapse'
import HomeIcon from '@material-ui/icons/Home'
import DateRangeIcon from '@material-ui/icons/DateRange'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import { useLocation } from 'react-router-dom'


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
        padding: theme.spacing(3),
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}))

export default function ({ children, container, handleLogout }) {
    const classes = useStyles()
    const theme = useTheme()
    const [mobileOpen, setMobileOpen] = useState(false)

    let location = useLocation();

    function sideMenuOptions() {
        const { pathname } = location

        const menus = [
            { title: 'Dashboard', link: '/cpanel', icon: () => <HomeIcon />, isActive: false },
            { title: 'Week days', link: '/cpanel/week-days', icon: () => <DateRangeIcon />, isActive: false },
            { title: 'Signings', link: '/cpanel/signings', icon: () => <AccessTimeIcon />, isActive: false },
        ]

        menus.forEach(menu => (menu.link === pathname && (menu.isActive = true)))

        return menus
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

    const [openSubMenu, setOpenSubMenu] = useState(false)

    const handleClick = () => {
        setOpenSubMenu(!openSubMenu)
    }

    // useEffect(() => {
    //     console.log(match)
    // }, [])

    const drawer = (
        <div>
            <div className={classes.toolbar}>
                <Logo />
            </div>

            <Divider />
            <List>
                {sideMenuOptions().map(({ title, icon: menuIcon, isActive, link }, index) => (
                    <ListItem component="a" href={link} selected={isActive} key={index} button>
                        <ListItemIcon>{menuIcon()}</ListItemIcon>
                        <ListItemText primary={title} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem button onClick={handleClick}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                    {openSubMenu ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button className={classes.nested}>
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary="Starred" />
                        </ListItem>
                    </List>
                </Collapse>
            </List>
        </div>
    )

    return (
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
                        {sideMenuOptions().map(({title, isActive}) => isActive && title)}
                    </Typography>

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
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
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
    )
}
