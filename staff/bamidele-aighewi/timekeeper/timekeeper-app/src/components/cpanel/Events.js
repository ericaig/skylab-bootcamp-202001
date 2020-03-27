import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Button, Paper, Box, TextField, IconButton, Tooltip, Typography } from '@material-ui/core'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import RefreshIcon from '@material-ui/icons/Refresh';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { weekDaysRetrieve, eventsRetrieve, eventSignInOut, eventUpdate, eventDelete } from '../../logic'
import { eventProperties } from '../../utils'
import moment from 'moment'
import ActionButtons from './ActionButtons'
import CalendarDialog from './CalendarDialog'

const useStyles = theme => ({
    table: {
        minWidth: 650,
    },
    buttonRm: {
        marginRight: theme.spacing(2),
    },
    success: {
        color: ''
    }
})

class Events extends React.Component {

    state = {
        events: [],
        filters: {
            start: moment().startOf('week').format('MM/DD/YYYY'),
            end: null, //moment().endOf('week').format('DD/MM/YYYY')
        },
        currentlyEditingEvent: undefined,
        openAddEventDialog: false,
        selectedDates: {
            start: '',
            end: ''
        },
        weekDays: { monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false },
    }

    debounce = (callback, timeout) => {
        if (typeof callback !== 'function') return

        if (this.debounceId !== 'undefined') clearTimeout(this.debounceId)
        this.debounceId = setTimeout(() => {
            callback()
            clearTimeout(this.debounceId)
        }, timeout);
    }

    handleDateChange = (start, end) => {
        start = !!start ? new Date(start) : null
        end = !!end ? new Date(end) : null

        const timeout = !start || !end ? 1000 : 0

        this.debounce(() => {
            this.setState({ filters: { start, end } }, this.handleRetrieveEvents)
        }, timeout)
    }

    handleRetrieveEventTypeName = type => eventProperties.types.names[type - 1]
    handleRetrieveEventStateName = state => eventProperties.states.names[state - 1]

    handleRetrieveEvents = async () => {
        const { start, end } = this.state.filters
        let _start, _end

        if (!!start) _start = moment(start, 'MM/DD/YYYY').format('YYYY-MM-DD')
        if (!!end) _end = moment(end, 'MM/DD/YYYY').format('YYYY-MM-DD')

        try {
            const events = await eventsRetrieve({ type: this.props.tableConfig.filters.types, start: _start, end: _end })
            console.log(events)
            this.setState({ events })
        } catch ({ message }) {
            this.props.handleSnackbar(message, 'error')
        }
    }

    handleEventSignInOut = async () => {
        try {
            await eventSignInOut()
            await this.handleRetrieveEvents()
        } catch ({ message }) {
            this.setState({ feedback: { message, severity: 'error', watch: Date.now() } })
        }
    }

    handleCalculateTimeDifference = (start, end) => {
        if (!start && !end) return ''

        start = moment(start)
        end = moment(end)
        // end = end ? moment(end) : moment()
        const difference = end.diff(start)
        const duration = moment.duration(difference)
        const days = duration.days(),
            hours = duration.hours(),
            minutes = duration.minutes(),
            seconds = duration.seconds();

        const output = []

        if (days) output.push(`${days}day${days > 1 ? 's' : ''}`)
        if (hours) output.push(`${hours}hr${hours > 1 ? 's' : ''}`)
        if (minutes) output.push(`${minutes}min${minutes > 1 ? 's' : ''}`)
        if (!days && !hours && seconds) output.push(`${seconds}s`)


        return output.join(' ')
    }

    handleRetrieveWeekDays = async () => {
        try {
            const _weekDays = await weekDaysRetrieve()
            const weekDays = {}
            Object.keys(this.state.weekDays).forEach(day => weekDays[day] = _weekDays[day])
            this.setState({ weekDays })
        } catch ({ message }) {
            this.props.handleSnackbar(message, 'error')
        }
    }

    handleToggleEventDialog = visibility => {
        this.setState({ openAddEventDialog: visibility }, () => {
            if (!visibility) this.setState({ currentlyEditingEvent: undefined })
        })
    }

    handleSaveEvent = async (start, end, type, description, state, eventId) => {
        // not using try/catch on purpose... This will be done where this fnc is being invoked.
        let dateFormat = 'YYYY-MM-DD'

        if (type === 5) dateFormat = 'YYYY-MM-DD HH:mm:ss'

        const _start = moment(start).format(dateFormat)
        const _end = moment(end).format(dateFormat)

        await eventUpdate(eventId, { start: _start, end: _end, type, description, state })
        this.handleToggleEventDialog(false)
        this.handleRetrieveEvents()

        this.props.handleSnackbar('Event updated successfully', 'success')
    }

    handleDeleteResource = async ({id}) => {
        try {
            await eventDelete(id)
            this.handleRetrieveEvents()
            this.props.handleSnackbar('Event deleted successfully', 'success')
        } catch ({message}) {
            this.props.handleSnackbar(message, 'error')
        }
    }

    componentDidMount() {
        this.handleRetrieveWeekDays()
        this.handleRetrieveEvents()
    }

    render() {
        const { classes, tableConfig, calendarDialogConfig } = this.props
        const { events, filters, selectedDates, weekDays, openAddEventDialog, currentlyEditingEvent } = this.state

        return <>
            <Grid
                container
                direction="row"
                justify="space-between"
            // alignItems="center"
            >
                <div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                        // alignItems="center"
                        >
                            <KeyboardDatePicker
                                autoOk
                                disableToolbar
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="start-date"
                                label="Start"
                                value={filters.start}
                                onChange={(date) => this.handleDateChange(date, filters.end)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />

                            <KeyboardDatePicker
                                autoOk
                                disableToolbar
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="start-date"
                                label="End"
                                value={filters.end}
                                onChange={(date) => this.handleDateChange(filters.start, date)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                </div>
                <div>
                    <Tooltip title="Refresh">
                        <IconButton color="primary" aria-label="Refresh" onClick={this.handleRetrieveEvents}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Sign in/out">
                        <IconButton color="primary" aria-label="Refresh" onClick={this.handleEventSignInOut}>
                            <SettingsBackupRestoreIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </Grid>

            <Box mt={4}>
                {openAddEventDialog &&
                    <CalendarDialog
                        event={currentlyEditingEvent}
                        handleSaveEvent={this.handleSaveEvent}
                        selectedDates={selectedDates}
                        weekDays={weekDays}
                        openAddEventDialog={openAddEventDialog}
                        handleCloseDialog={() => this.handleToggleEventDialog(false)}
                        config={{ ...calendarDialogConfig }}
                    />
                }

                <TableContainer elevation={0} component={Paper} variant="outlined">
                    <Table size={'small'} className={classes.table} aria-label="events table">
                        {!events.length && <caption>{"No events found"}</caption>}
                        <TableHead>
                            <TableRow>
                                {tableConfig.name && <TableCell component="th">{"User"}</TableCell>}
                                <TableCell component="th">{"Event"}</TableCell>
                                <TableCell>{"Start"}</TableCell>
                                <TableCell>{"End"}</TableCell>
                                {tableConfig.difference && <TableCell>{"Difference"}</TableCell>}
                                <TableCell>{"Note"}</TableCell>
                                <TableCell>{"State"}</TableCell>
                                {(tableConfig.canDelete || tableConfig.canEdit) && <TableCell></TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {events.map((event, index) => {
                                const { id, type, state, description, start, end, user } = event

                                return <TableRow hover key={id}>
                                    {tableConfig.name &&
                                        <TableCell component="th" scope="row">
                                            {user && `${user.name} ${user.surname}`}
                                        </TableCell>
                                    }
                                    <TableCell component="th" scope="row">
                                        {this.handleRetrieveEventTypeName(type)}
                                    </TableCell>
                                    <TableCell>{start && moment(start).format(tableConfig.datesFormat)}</TableCell>
                                    <TableCell>{end ? moment(end).format(tableConfig.datesFormat) : 'in progress'}</TableCell>
                                    {tableConfig.difference && <TableCell>{this.handleCalculateTimeDifference(start, end)}</TableCell>}
                                    <TableCell>{description}</TableCell>
                                    <TableCell>
                                        <Typography style={{ color: state === 2 ? '#155724' : '#721c24'}}>
                                            {this.handleRetrieveEventStateName(state)}
                                        </Typography>
                                    </TableCell>
                                    {(tableConfig.canDelete || tableConfig.canEdit) &&
                                        <TableCell>
                                            <ActionButtons
                                                index={index}
                                                resource={event}
                                                handleDelete={tableConfig.canDelete && this.handleDeleteResource}
                                                handleEdit={tableConfig.canEdit && (() => {
                                                    this.setState({ currentlyEditingEvent: event }, () => this.handleToggleEventDialog(true))
                                                })}
                                            />
                                        </TableCell>
                                    }
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    }
}

Events.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(useStyles)(Events)