import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Divider from '@material-ui/core/Divider';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

const useStyles = makeStyles(theme => ({
    footer: {
        backgroundColor: "#fafafa"
        // marginTop: theme.spacing(8),
        // padding: theme.spacing(2, 2),
        // // backgroundColor: '#ff6666',
        // position: 'absolute',
        // bottom: 0
    },
}))

export default function Footer(props) {
    const classes = useStyles()
    const { description, title } = props

    return <>
        <Container className={classes.footer} maxWidth="lg">
            <Divider />
            <footer className={classes.footer}>
                <Typography variant="h6" color="primary" align="center" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    {description}
                </Typography>
                <Copyright />
            </footer>
        </Container>
    </>
}

Footer.propTypes = {
    description: PropTypes.string,
    title: PropTypes.string,
}