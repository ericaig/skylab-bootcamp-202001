import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, makeStyles, Select, Box, Typography } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import Chip from '@material-ui/core/Chip';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import moment from 'moment'
import { validateSpecial } from 'timekeeper-utils'

const useStyles = theme => ({
    chip: {
        margin: theme.spacing(0.5),
    },
    eventTypeSelect: {
        minWidth: 150
    }
})

// export default function ({ selectedDates, weekDays, openAddEventDialog, handleCloseDialog }) {
class CalendarDialog extends React.Component {
    state = {
        eventType: 0,
        start: '',
        end: '',
        openEventType: false,
        totalDaysSelected: { valid: 0, of: 0 }
    }

    // classes = useStyles();
    // [eventType, setEventType] = useState('');
    // [start, setStart] = useState('')
    // [end, setEnd] = useState('')

    // [openEventType, setOpenEventType] = useState(false);
    // [totalDaysSelected, setTotalDaysSelected] = useState({ valid: 0, of: 0 });

    handleDateChange = (__start, __end) => {
        this.setState({
            start: new Date(__start),
            end: new Date(__end),
        }, this.handleCalculateDaysOfRange)
    }

    handleChangeEventType = event => this.setState({ eventType: event.target.value })
    handleOpenEventType = () => this.setState({ eventType: true })
    handleCloseEventType = () => this.setState({ eventType: false })

    handleCalculateDaysOfRange = () => {
        if (!this.state.start || !this.state.end) return

        // const _start = moment(start + '00:00', 'YYYY-MM-DD HH:mm')
        // let _end = moment(end + '23:59', 'YYYY-MM-DD HH:mm')
        const __start = moment(this.state.start, 'YYYY-MM-DD')
        let __end = moment(this.state.end, 'YYYY-MM-DD')
        let difference = moment(__end).diff(__start, 'days') //+ 1

        console.log('difference...', difference)

        // if (difference === 0 && this.state.start === this.state.start) {
        //     __end = __start
        //     difference = moment(__end.endOf('day')).diff(__start.startOf('day'), 'days')
        // }

        let totalDays = 0

        if (difference > 0) {
            // let i = 0
            // do {
            //     let dayIncrement = __start.add(1, 'days').format('YYYY-MM-DD')
            // } while (dayIncrement !== );

            for (let i = 0; i < difference; i++) {
                totalDays += (() => {
                    let count = 0
                    if(i === 0){
                        // let's count the start
                        try {
                            validateSpecial.activeDayOfWeek(__start.format('YYYY-MM-DD'), this.props.weekDays)
                            count++
                            console.log('after first ...')
                        } catch ({ message }) {
                            console.log(message)
                        }
                    }

                    try {
                        validateSpecial.activeDayOfWeek(__start.add(1, 'days').format('YYYY-MM-DD'), this.props.weekDays)
                        console.log('after second ...')
                        count++
                    } catch ({ message }) {
                        console.log(message)
                    }

                    return count
                })()
            }
        } else {
            totalDays += (() => {
                try {
                    validateSpecial.activeDayOfWeek(__start.format('YYYY-MM-DD'), this.props.weekDays)
                    return 1
                } catch ({ message }) {
                    // console.log(message)
                    return 0
                }
            })()
        }

        console.log('difference', difference)
        console.log('totalDays', totalDays)
        this.setState({ totalDaysSelected: { valid: totalDays, of: difference } })
    }

    handleSaveEvent = () => {
        this.props.handleCloseDialog()
    }

    componentWillReceiveProps() {
        const { start: startDate, end: endDate } = this.props.selectedDates

        if (startDate && endDate) {
            this.setState({
                start: new Date(startDate), end: new Date(endDate)
            }, this.handleCalculateDaysOfRange)
        }
    }

    render() {
        const { start, end, totalDaysSelected, eventType, openEventType } = this.state
        const { openAddEventDialog, handleCloseDialog, weekDays, classes } = this.props

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
                                autoOk
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="start-date"
                                label="Start"
                                value={start}
                                onChange={(date) => this.handleDateChange(date, end)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <KeyboardDatePicker
                                disableToolbar
                                autoOk
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="end-date"
                                label="End"
                                value={end}
                                onChange={(date) => this.handleDateChange(start, date)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>

                    <Box mt={2}>
                        <Chip size="small" className={classes.chip} color={weekDays.monday ? 'primary' : 'default'} icon={weekDays.monday ? <CheckCircleIcon /> : <CancelIcon />} label="Mon" disabled={!weekDays.monday} clickable />
                        <Chip size="small" className={classes.chip} color={weekDays.tuesday ? 'primary' : 'default'} icon={weekDays.tuesday ? <CheckCircleIcon /> : <CancelIcon />} label="Tue" disabled={!weekDays.tuesday} clickable />
                        <Chip size="small" className={classes.chip} color={weekDays.wednesday ? 'primary' : 'default'} icon={weekDays.wednesday ? <CheckCircleIcon /> : <CancelIcon />} label="Wed" disabled={!weekDays.wednesday} clickable />
                        <Chip size="small" className={classes.chip} color={weekDays.thursday ? 'primary' : 'default'} icon={weekDays.thursday ? <CheckCircleIcon /> : <CancelIcon />} label="Thu" disabled={!weekDays.thursday} clickable />
                        <Chip size="small" className={classes.chip} color={weekDays.friday ? 'primary' : 'default'} icon={weekDays.friday ? <CheckCircleIcon /> : <CancelIcon />} label="Fri" disabled={!weekDays.friday} clickable />
                        <Chip size="small" className={classes.chip} color={weekDays.saturday ? 'primary' : 'default'} icon={weekDays.saturday ? <CheckCircleIcon /> : <CancelIcon />} label="Sat" disabled={!weekDays.saturday} clickable />
                        <Chip size="small" className={classes.chip} color={weekDays.sunday ? 'primary' : 'default'} icon={weekDays.sunday ? <CheckCircleIcon /> : <CancelIcon />} label="Sun" disabled={!weekDays.sunday} clickable />
                    </Box>

                    <Box mt={2}>
                        {/* <Chip size="small" variant="outlined" label={`There ${totalDaysSelected.valid > 1 ? 'are' : 'is'} ${totalDaysSelected.valid} valid date of ${totalDaysSelected.of} day${totalDaysSelected.of > 1 ? 's' : ''} selected`} /> */}
                        <Typography variant="subtitle2">
                            {`There ${totalDaysSelected.valid > 1 ? 'are' : 'is'} ${totalDaysSelected.valid} valid day${totalDaysSelected.valid > 1 ? 's' : ''} between the selected date range`}
                        </Typography>
                    </Box>

                    <Box mt={2}>
                        <Button variant="text" onClick={this.handleOpenEventType}>{"Event type"}</Button>
                        <Select
                            value={eventType}
                            open={openEventType}
                            onClose={this.handleCloseEventType}
                            onOpen={this.handleOpenEventType}
                            onChange={this.handleChangeEventType}
                            className={classes.eventTypeSelect}
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
                    <Button onClick={this.handleSaveEvent} color="primary">
                        {"Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    }
}

CalendarDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(CalendarDialog)