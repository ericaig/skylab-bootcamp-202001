import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, makeStyles, Select, InputLabel, Box } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import Chip from '@material-ui/core/Chip';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';


const useStyles = makeStyles(theme => ({
    chip: {
        margin: theme.spacing(0.5),
    },
}));

export default function ({ start = new Date(), end = new Date(), openAddEventDialog, handleCloseDialog }) {
    const classes = useStyles();
    const [eventType, setEventType] = React.useState(0);
    const [openEventType, setOpenEventType] = React.useState(false);

    // const [selectedDate, setSelectedDate] = React.useState(new Date())

    const handleDateChange = (date) => {
        // setSelectedDate(date)
    }

    useEffect(() => {
        console.log('openAddEventDialog', openAddEventDialog)
    }, [openAddEventDialog])

    const handleChangeEventType = event => setEventType(event.target.value)
    const handleOpenEventType = () => setOpenEventType(true)
    const handleCloseEventType = () => setOpenEventType(false)

    return <>
        <Dialog onClose={handleCloseDialog} aria-labelledby="customized-dialog-title" open={openAddEventDialog}>
            <DialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
                {"Add event"}
            </DialogTitle>
            <DialogContent dividers>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-between">
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="start-date"
                            label="Start"
                            value={start}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="end-date"
                            label="End"
                            value={end}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>

                <Box mt={2}>
                    <Chip size="small" className={classes.chip} icon={<CheckCircleIcon />} label="Mon" clickable />
                    <Chip size="small" className={classes.chip} icon={<CheckCircleIcon />} label="Tue" clickable />
                    <Chip size="small" className={classes.chip} icon={<CheckCircleIcon />} label="Wed" clickable />
                    <Chip size="small" className={classes.chip} icon={<CheckCircleIcon />} label="Thu" clickable />
                    <Chip size="small" className={classes.chip} icon={<CheckCircleIcon />} label="Fri" clickable />
                    <Chip size="small" className={classes.chip} icon={<CancelIcon />} label="Sat" disabled clickable />
                    <Chip size="small" className={classes.chip} icon={<CancelIcon />} label="Sun" disabled clickable />
                </Box>

                <Box mt={2}>
                    <Button onClick={handleOpenEventType}>{"Event type"}</Button>
                    <Select
                        value={eventType}
                        open={openEventType}
                        onClose={handleCloseEventType}
                        onOpen={handleOpenEventType}
                        onChange={handleChangeEventType}
                    >
                        <MenuItem value={0}>{"..."}</MenuItem>
                        <MenuItem value={1}>{"Work day"}</MenuItem>
                        <MenuItem value={2}>{"Public holiday"}</MenuItem>
                    </Select>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                    {"Close"}
                </Button>
                <Button onClick={handleCloseDialog} color="primary">
                    {"Save"}
                </Button>
            </DialogActions>
        </Dialog>
    </>
}