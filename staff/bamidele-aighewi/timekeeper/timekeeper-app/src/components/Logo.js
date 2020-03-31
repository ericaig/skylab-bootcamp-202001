import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    logo: {
        width: '200px'
    },
}))
export default function ({darkMode}) {
    const classes = useStyles()

    return <>
        <img alt="Timekeeper logo" src={darkMode ? '/logo-dark.png' : '/logo.png'} className={classes.logo} />
    </>
}