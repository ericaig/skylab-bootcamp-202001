import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Box from '@material-ui/core/Box'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import SettingsIcon from '@material-ui/icons/Settings'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { isLoggedIn } from '../logic'
import Logo from './Logo'

const useStyles = makeStyles(theme => ({
    toolbar: {
        // borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbarTitle: {
        flex: 1,
    },
    toolbarSecondary: {
        justifyContent: 'space-around',
        overflowX: 'auto',
    },
    toolbarLink: {
        padding: theme.spacing(1),
        flexShrink: 0,
    },
    logo: {
        width: '200px'
    },
    header: {
        backgroundColor: "#fafafa"
    },
    loggedInAvatar: {
        backgroundColor: '#999',
        cursor: 'pointer'
    }
}))

export default function Header({ handleGotoControlPanel, handleLogout }) {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = React.useState(null)

    // const sections = [
    //     { title: 'Technology', url: '/' },
    //     { title: 'Design', url: '/' },
    //     { title: 'Culture', url: '/' },
    // ]

    function openDialogMenu(event) {
        setAnchorEl(event.currentTarget)
    }

    function handleCloseDialogMenu() {
        setAnchorEl(null)
    }

    return (
        <section className={classes.header}>
            <Toolbar>
                {/* <Button size="small">Subscribe</Button> */}
                <Logo/>
                <Typography
                    component="h2"
                    variant="h5"
                    color="inherit"
                    align="center"
                    noWrap
                    className={classes.toolbarTitle}
                >
                    {/* {title} */}
                </Typography>
                {/* <Typography className={classes.root}>
                    <Link href="/login" variant="body2">Login</Link>
                    &nbsp&nbsp/&nbsp&nbsp
                    <Link href="/register" variant="body2">Sign up</Link>
                </Typography> */}
                <Box component="span">
                    {
                        isLoggedIn() ?
                            <>
                                <Avatar onClick={openDialogMenu} aria-controls="simple-menu" aria-haspopup="true" className={classes.loggedInAvatar}>
                                    <AccountCircleIcon />
                                </Avatar>

                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleCloseDialogMenu}
                                >
                                    <MenuItem onClick={handleGotoControlPanel}>
                                        <ListItemIcon>
                                            <SettingsIcon fontSize="small" />
                                        </ListItemIcon>
                                        <Typography variant="inherit">{"Control panel"}</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseDialogMenu}>
                                        <ListItemIcon>
                                            <AccountCircleIcon fontSize="small" />
                                        </ListItemIcon>
                                        <Typography variant="inherit">{"Profile"}</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <ListItemIcon>
                                            <ExitToAppIcon fontSize="small" />
                                        </ListItemIcon>
                                        <Typography variant="inherit">{"Logout"}</Typography>
                                    </MenuItem>
                                </Menu>
                            </>
                            :
                            <>
                                <Button href="/login" variant="outlined" size="small">
                                    {"Login"}
                                </Button>&nbsp;&nbsp;/&nbsp;&nbsp;
                                <Button href="/register" variant="outlined" size="small">
                                    {"Sign up"}
                                </Button>
                            </>
                    }
                </Box>
            </Toolbar>
            {/* <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
                {sections.map(section => (
                    <Link
                        color="inherit"
                        noWrap
                        key={section.title}
                        variant="body2"
                        href={section.url}
                        className={classes.toolbarLink}
                    >
                        {section.title}
                    </Link>
                ))}
            </Toolbar> */}
        </section>
    )
}

// Header.propTypes = {
//     sections: PropTypes.array,
//     title: PropTypes.string,
// }