import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Button, Grid, TextField, Select, Box, Typography } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import Chip from '@material-ui/core/Chip';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import moment from 'moment'
import { validateSpecial } from 'timekeeper-utils'
import Feedback from '../Feedback'
import { eventProperties } from '../../utils'
import { context } from '../../logic'
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = theme => ({
    chip: {
        margin: theme.spacing(0.5),
    }
})

class CalendarDialog extends React.Component {
    state = {
        eventType: 0,
        eventState: 0,
        start: new Date,
        end: new Date,
        description: '',
        dialogTitle: 'Add event',
        totalDaysSelected: { valid: 0, of: 0 },
        showLinearProgress: false,
        feedback: { message: undefined, severity: undefined, watch: undefined }
    }

    handleDateChange = (__start, __end) => {
        this.setState({
            start: new Date(__start),
            end: new Date(__end),
        }, this.handleCalculateDaysOfRange)
    }

    handleChangeEventType = event => {
        this.setState({ eventType: event.target.value })
    }

    handleChangeEventState = event => {
        console.log('event.target.value', event.target.value)
        this.setState({ eventState: event.target.value })
    }
    // handleOpenEventType = () => this.setState({ openEventType: true })
    // handleCloseopenEventType = () => this.setState({ openEventType: false })

    handleCalculateDaysOfRange = () => {
        if (!this.state.start || !this.state.end) return

        const __start = moment(this.state.start, 'YYYY-MM-DD')
        let __end = moment(this.state.end, 'YYYY-MM-DD')
        let difference = moment(__end).diff(__start, 'days') //+ 1

        let totalDays = 0

        if (difference > 0) {
            for (let i = 0; i < difference; i++) {
                totalDays += (() => {
                    let count = 0
                    if (i === 0) {
                        // let's count the start
                        try {
                            validateSpecial.activeDayOfWeek(__start.format('YYYY-MM-DD'), this.props.weekDays)
                            count++
                        } catch ({ message }) {
                            // console.log(message)
                        }
                    }

                    try {
                        validateSpecial.activeDayOfWeek(__start.add(1, 'days').format('YYYY-MM-DD'), this.props.weekDays)
                        count++
                    } catch ({ message }) {
                        // console.log(message)
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

        // console.log('difference', difference)
        // console.log('totalDays', totalDays)
        this.setState({ totalDaysSelected: { valid: totalDays, of: (difference + 1) } })
    }

    handleDescriptionChange = event => this.setState({ description: event.target.value })

    handleSaveEvent = async () => {
        const { start, end, eventType, eventState, description } = this.state
        const { event = {} } = this.props

        try {
            this.setState({ showLinearProgress: true })

            await this.props.handleSaveEvent(start, end, eventType, description, eventState, event)
            // this.setState({ feedback: { message: "Created event successfully", severity: 'success', watch: Date.now() } })
        } catch (error) {
            console.log(error)
            const { message } = error
            this.setState({ feedback: { message, severity: 'error', watch: Date.now() }, showLinearProgress: false })
        }
    }

    get config() {
        return Object.assign({
            startEditable: true,
            endEditable: true,
            // eventEditable: true,
            typeEditable: true,
            stateEditable: false,
            stateSelector: false,
            types: [1, 2],
            datePickerFormat: 'dd/MM/yyyy'
        }, this.props.config || {})
    }

    componentWillReceiveProps() {
        const { start: startDate, end: endDate } = this.props.selectedDates

        if (startDate && endDate) {
            this.setState({
                start: new Date(startDate), end: new Date(endDate)
            }, this.handleCalculateDaysOfRange)
        }
    }

    componentDidMount() {
        const { event } = this.props

        if (event) {
            const { start, end, description } = event
            this.setState({ dialogTitle: 'Edit event', eventType: event.type, eventState: event.state, start, end, description }, this.handleCalculateDaysOfRange)
        }
    }

    componentWillUnmount() {
        // this.props = {}
        console.log('will unmount')
        this.setState({ showLinearProgress: false })
    }

    render() {
        const { start, end, totalDaysSelected, eventType, eventState, description, feedback, dialogTitle, showLinearProgress } = this.state
        const { openAddEventDialog, handleCloseDialog, weekDays, classes } = this.props

        return <>
            <Dialog onClose={handleCloseDialog} aria-labelledby="customized-dialog-title" open={openAddEventDialog}>
                <DialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>{dialogTitle}</DialogTitle>
                <DialogContent dividers>
                    {showLinearProgress && <LinearProgress />}
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-between">
                            <KeyboardDatePicker
                                disableToolbar
                                autoOk
                                variant="inline"
                                format={this.config.datePickerFormat}
                                disabled={!this.config.startEditable}
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
                                format={this.config.datePickerFormat}
                                disabled={!this.config.endEditable}
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

                    <Box mt={3}>
                        <Typography variant="subtitle2">
                            {`There ${totalDaysSelected.valid > 1 ? 'are' : 'is'} ${totalDaysSelected.valid} (of ${totalDaysSelected.of}) valid day${totalDaysSelected.valid > 1 ? 's' : ''} between the selected date range`}
                        </Typography>
                    </Box>

                    <Grid container justify="space-between">
                        <Box mt={3}>
                            <FormControl>
                                <InputLabel id="event-type">{"Event type"}</InputLabel>
                                <Select
                                    labelId="event-type"
                                    disabled={!this.config.typeEditable}
                                    onChange={this.handleChangeEventType}
                                    value={eventType}
                                    style={{ width: 200 }}
                                >
                                    <MenuItem value={0}>{"..."}</MenuItem>

                                    {eventProperties.types.names.map((type, index) => {
                                        if (this.config.types.includes((index + 1)))
                                            return <MenuItem key={index} value={index + 1}>{type}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box mt={3}>
                            <FormControl>
                                <InputLabel id="event-state">{"Event state"}</InputLabel>
                                <Select
                                    labelId="event-state"
                                    disabled={!this.config.stateEditable}
                                    onChange={this.handleChangeEventState}
                                    value={eventState}
                                    style={{ width: 200 }}
                                >
                                    <MenuItem value={0}>{"..."}</MenuItem>

                                    {eventProperties.states.names.map((stateName, index) => {
                                        return <MenuItem key={index} value={index + 1}>{stateName}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>

                    <Box mt={3}>
                        <TextField
                            fullWidth
                            label="Note"
                            multiline
                            rows="2"
                            value={description}
                            onChange={this.handleDescriptionChange}
                            variant="outlined"
                        />
                    </Box>

                    <Box mt={2}><Feedback config={feedback} /></Box>
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