import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Container from '@material-ui/core/Container'
import { Button, Grid, Typography } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save';
import { weekDaysUpdate, weekDaysRetrieve } from '../../logic'
import CircularProgress from '@material-ui/core/CircularProgress';
import Feedback from '../Feedback'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        // maxWidth: 500,
        backgroundColor: theme.palette.background.paper,
    },
    saveButton: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(3),
    },
    listHeader: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        marginBottom: theme.spacing(3),
    }
}))

export default function CheckboxList() {
    const classes = useStyles()
    const [circularProgress, setToggleCircularProgress] = useState(false)
    const [weekDays, setWeekDays] = useState({ monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false })
    const [feedback, setFeedback] = useState({ message: undefined, severity: undefined, watch: undefined })

    function handleListItem(day) {
        setWeekDays(JSON.parse(JSON.stringify(Object.assign(weekDays, { [day]: !weekDays[day] }))))
    }

    async function handleSubmit() {
        try {
            await weekDaysUpdate(...Object.values(weekDays))
            setFeedback({ message: "Week days updated successfully", severity: 'success', watch: Date.now() })
        } catch ({ message }) {
            setFeedback({ message, severity: 'error', watch: Date.now() })
        }
    }

    async function handleRetrieveWeekDays() {
        try {
            const _weekDays = await weekDaysRetrieve()
            const __weekDays = {}
            Object.keys(weekDays).forEach(day => __weekDays[day] = _weekDays[day])
            setWeekDays(JSON.parse(JSON.stringify(__weekDays)))
            setToggleCircularProgress(false)
        } catch ({ message }) {
            setFeedback({ message, severity: 'error', watch: Date.now() })
        }
    }

    useEffect(() => {
        setToggleCircularProgress(true)
        handleRetrieveWeekDays()
        // eslint-disable-next-line
    }, [])

    return (
        <Container maxWidth="lg">
            <List className={classes.root}>
                <Grid className={classes.listHeader} container direction="row" justify="space-between">
                    <Typography variant="h5">{"Week days"}</Typography>
                    {circularProgress && <CircularProgress hidden={true} className={classes.circularProgress} size={30} />}
                </Grid>

                {Object.keys(weekDays).map((day, index) => {
                    const labelId = `checkbox-list-label-${day}`

                    return (
                        <ListItem key={index} role={undefined} onClick={() => handleListItem(day)} divider button>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={weekDays[day]}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${day.substr(0, 1).toUpperCase().concat(day.substr(1))}`} />
                            {/* {index !== <Divider />} */}
                        </ListItem>
                    )
                })}
                <Container>
                    <Grid container direction="row" justify="flex-end" alignItems="center">
                        <Button type="button" onClick={handleSubmit} variant="contained" color="primary" size="large" className={classes.saveButton} startIcon={<SaveIcon />}>
                            {"Save"}
                        </Button>
                    </Grid>
                    <Feedback config={feedback} />
                </Container>
            </List>
        </Container>
    )
}
