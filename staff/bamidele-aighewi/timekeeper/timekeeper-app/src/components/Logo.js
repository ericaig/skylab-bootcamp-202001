import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    logo: {
        width: '200px'
    },
}))
export default function () {
    const classes = useStyles()

    return <>
        <img alt="Timekeeper logo" src="/logo.png" className={classes.logo} />
    </>
}