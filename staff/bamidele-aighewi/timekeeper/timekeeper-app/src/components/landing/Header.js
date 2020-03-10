import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles(theme => ({
    toolbar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
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
}))

export default function Header(props) {
    const classes = useStyles()
    const { sections, title } = props

    return (
        <React.Fragment>
            <Toolbar className={classes.toolbar}>
                {/* <Button size="small">Subscribe</Button> */}
                <Avatar alt="Timekeeper logo" src="./logo.png" className={classes.large} />
                <Typography
                    component="h2"
                    variant="h5"
                    color="inherit"
                    align="center"
                    noWrap
                    className={classes.toolbarTitle}
                >
                    {title}
                </Typography>
                {/* <Typography className={classes.root}>
                    <Link href="/login" variant="body2">Login</Link>
                    &nbsp;&nbsp;/&nbsp;&nbsp;
                    <Link href="/register" variant="body2">Sign up</Link>
                </Typography> */}
                <Box component="span">

                    <Button href="/login" variant="outlined" size="small">
                        Login
                    </Button>&nbsp;&nbsp;/&nbsp;&nbsp;
                    <Button href="/register" variant="outlined" size="small">
                        Sign up
                    </Button> 
                </Box>
            </Toolbar>
            <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
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
            </Toolbar>
        </React.Fragment>
    )
}

Header.propTypes = {
    sections: PropTypes.array,
    title: PropTypes.string,
}