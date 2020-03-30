import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, Divider, Paper, Grid, Chip, Button, Tooltip, Backdrop, CircularProgress, LinearProgress } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import NewReleasesIcon from '@material-ui/icons/NewReleases'
import Avatar from '@material-ui/core/Avatar'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import RefreshIcon from '@material-ui/icons/Refresh'
import { dashboardAnalytics, isLoggedIn, retrieveCompany, retrieveUser, context } from '../../logic'
import moment from 'moment'
import SendInviteDialog from './SendInviteDialog'

const useStyles = makeStyles(theme => ({
    card: {
        boxShadow: '0 0 14px 0 rgba(53,64,82,.05)',
        padding: theme.spacing(2),
        // width: 300
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}))

export default function ({ handleLogout, handleSnackbar }) {
    const [user, setUser] = useState()
    const [company, setCompany] = useState()

    const classes = useStyles()
    const [analytics, setAnalytics] = useState({
        totalPendingEvents: 0,
        totalAbsences: 0,
        totalHolidays: 0,
        totalWorkers: 0,
        inactiveUsers: 0,
        activities: []
    })

    const [emailDialogOpen, setEmailDialogOpen] = useState(false)

    function handleToggleEmailInviteDialog(visibility) {
        setEmailDialogOpen(visibility)
    }

    async function handleRetrieveAnalytics() {
        try {
            const analytics = await dashboardAnalytics({ date: moment().startOf('day').format('YYYY-MM-DD') })
            setAnalytics(analytics)
            // console.log(analytics)
        } catch ({ message }) {
            handleSnackbar(message, 'error')
        }
    }

    function handleActivityEvents(events) {
        const activeTimeOutput = []
        let signinFirstTime = ''
        let signinLastTime = ''
        let pendingEvent = {}
        let totalDifference = 0

        events.forEach((event, index) => {
            let { start, end } = event
            signinFirstTime = moment(start).format('HH:mm')
            if (!index && end) signinLastTime = moment(end).format('HH:mm')

            if (!end) end = moment().toDate() // format('YYYY-MM-DD HH:mm:ss')

            if (start && end) {
                const _start = moment(start)
                const _end = moment(end)
                const difference = _end.diff(_start)
                totalDifference += difference
            } else if (start && !end) {
                pendingEvent = event
            }
        })

        if (totalDifference) {
            const duration = moment.duration(totalDifference)
            const days = duration.days(), hours = duration.hours(), minutes = duration.minutes(), seconds = duration.seconds()

            if (days) activeTimeOutput.push(`${days}day${days > 1 ? 's' : ''}`)
            if (hours) activeTimeOutput.push(`${hours}hr${hours > 1 ? 's' : ''}`)
            if (minutes) activeTimeOutput.push(`${minutes}min${minutes > 1 ? 's' : ''}`)
            if (!days && !hours && seconds) activeTimeOutput.push(`${seconds}s`)
        }

        let output = ''

        if (signinFirstTime) {
            output = `${signinFirstTime} - `

            output += signinLastTime ? `${signinLastTime}` : 'in progress'
            output = activeTimeOutput.length ? `${output} (${activeTimeOutput.join(' ')})` : output
        }

        return output
    }

    useEffect(() => {
        if (isLoggedIn())
            (async () => {
                try {
                    const _user = await retrieveUser()
                    const _company = await retrieveCompany()
                    if(Object.keys(_user).length && Object.keys(_company).length){
                        setUser(_user)
                        setCompany(_company)

                        handleRetrieveAnalytics()
                        return
                    }
                    handleLogout()
                } catch ({ message }) {
                    handleSnackbar(message, 'error')
                    // handleLogout()
                }
            })()
        else handleLogout()
    }, [])

    return <>
        {!user && <LinearProgress />}

        <Box mt={2} mb={3}>
            <Grid container direction="row" justify="space-between" alignItems="flex-start">
                <Typography variant="h5" component="span">
                    {user && `Hello, ${user.name} ${user.surname} `}
                    <Typography variant="body2" component="span">{"Welcome to your control panel"}</Typography>
                </Typography>
                <Button onClick={handleRetrieveAnalytics} color="primary" startIcon={<RefreshIcon />}>{"Refresh"}</Button>
            </Grid>
        </Box>
        <Divider />

        <Box mt={3}>
            <Grid container spacing={6} direction="row" justify="space-between" alignItems="flex-start">
                <Grid item lg={3} md={6} xs={12}>
                    <Paper elevation={1} className={classes.card} variant="elevation">
                        <Grid container direction="row" justify="space-between" alignItems="flex-start">
                            <Typography variant="h6" color="textSecondary" component="h1" gutterBottom>
                                {"Pending events"}
                            </Typography>

                            <Chip size="small" color="primary" label="All time" />
                        </Grid>
                        <Typography variant="h5" component="h5" gutterBottom>
                            <Grid container direction="row" justify="space-between" alignItems="flex-start">
                                <div>{analytics.totalPendingEvents}</div>
                                <Button href="cpanel/events" color="primary">
                                    {"View"}
                                </Button>
                            </Grid>
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item lg={3} md={6} xs={12}>
                    <Paper elevation={1} className={classes.card} variant="elevation">
                        <Grid container direction="row" justify="space-between" alignItems="flex-start">
                            <Typography variant="h6" color="secondary" component="h1" gutterBottom>
                                {"Absences"}
                            </Typography>

                            <Chip size="small" color="secondary" label="Annual" />
                        </Grid>
                        <Typography variant="h5" component="h5" color="secondary" gutterBottom>
                            {analytics.totalAbsences}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item lg={3} md={6} xs={12}>
                    <Paper elevation={1} className={classes.card} variant="elevation">
                        <Grid container direction="row" justify="space-between" alignItems="flex-start">
                            <Typography variant="h6" color="textSecondary" component="h1" gutterBottom>
                                {"Holidays"}
                            </Typography>

                            <Chip size="small" color="primary" label="Annual" />
                        </Grid>
                        <Typography variant="h5" component="h5" gutterBottom>
                            {analytics.totalHolidays}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item lg={3} md={6} xs={12}>
                    <Paper elevation={1} className={classes.card} variant="elevation">
                        <Grid container direction="row" justify="space-between" alignItems="flex-start">
                            <Typography variant="h6" color="textSecondary" component="h1" gutterBottom>
                                {"Workers"}
                            </Typography>

                            <Chip size="small" color="primary" label="All time" />
                        </Grid>
                        <Typography variant="h5" component="h5" gutterBottom>
                            <Grid container direction="row" justify="space-between" alignItems="flex-start">
                                <div>{`${analytics.totalWorkers} registered`}</div>
                                <Button color="primary" onClick={() => handleToggleEmailInviteDialog(true)}>
                                    {"Invite"}
                                </Button>
                                <SendInviteDialog handleSnackbar={handleSnackbar} company={company} open={emailDialogOpen} handleClose={() => handleToggleEmailInviteDialog(false)} />
                            </Grid>
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Box>
                <Grid container spacing={8} direction="row" justify="space-between" alignItems="flex-start">
                    <Grid item lg={8} md={12} xs={12}>
                        <Paper elevation={1} className={classes.card} variant="elevation">
                            <Grid container direction="row" justify="space-between" alignItems="flex-start">
                                <Typography variant="h6" color="textSecondary" component="h1">
                                    {"Activities"}
                                </Typography>

                                <Chip size="small" color="primary" label="Today" />
                            </Grid>
                            <List className={classes.root}>
                                {analytics.activities.map(({ id, name, surname, events }) => {
                                    // const { output: timelapse, hasPendingEvent } = handleActivityEvents(events)

                                    return <ListItem key={id}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <AccountCircleIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText color="textSecondary" primary={`${name} ${surname}`} secondary={handleActivityEvents(events)} />

                                        {events.length === 0 ?
                                            <ListItemSecondaryAction>
                                                <Tooltip title="Inactive">
                                                    <IconButton edge="end" aria-label="delete">
                                                        <NewReleasesIcon color="disabled" />
                                                    </IconButton>
                                                </Tooltip>
                                            </ListItemSecondaryAction>
                                            : ''
                                        }
                                    </ListItem>
                                })}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item lg={4} md={12} xs={12}>
                        <Paper elevation={1} className={classes.card} variant="elevation">
                            <Grid container direction="row" justify="space-between" alignItems="flex-start">
                                <Typography variant="h6" color="textSecondary" component="h1" gutterBottom>
                                    {"Inactive workers"}
                                </Typography>

                                <Chip size="small" color="primary" label="Today" />
                            </Grid>
                            <Typography variant="h5" component="h5" gutterBottom>
                                {analytics.inactiveUsers}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

        </Box>
    </>
}
