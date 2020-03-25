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
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import RefreshIcon from '@material-ui/icons/Refresh';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { eventsRetrieve, eventSignInOut } from '../../logic'
import { eventProperties } from '../../utils'
import Feedback from '../Feedback'
import moment from 'moment'
import ActionButtons from './ActionButtons'

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
            end: null, //moment().endOf('week').format('MM/DD/YYYY')
        },
        feedback: { message: undefined, severity: undefined, watch: undefined }
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
            const events = await eventsRetrieve({ type: 5, start: _start, end: _end })
            this.setState({ events })
        } catch ({ message }) {
            this.setState({ feedback: { message, severity: 'error', watch: Date.now() } })
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

    componentDidMount() {
        this.handleRetrieveEvents()
    }

    render() {
        const { classes } = this.props
        const { feedback, events, filters } = this.state

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
                <TableContainer elevation={0} component={Paper} variant="outlined">
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {/* <TableCell padding="checkbox">
                                    <Checkbox
                                        // indeterminate={numSelected > 0 && numSelected < rowCount}
                                        // checked={rowCount > 0 && numSelected === rowCount}
                                        // onChange={onSelectAllClick}
                                        inputProps={{ 'aria-label': 'select all desserts' }}
                                    />
                                </TableCell> */}
                                <TableCell component="th">{"Event"}</TableCell>
                                <TableCell>{"Start"}</TableCell>
                                <TableCell>{"End"}</TableCell>
                                <TableCell>{"Difference"}</TableCell>
                                <TableCell>{"Note"}</TableCell>
                                <TableCell>{"State"}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {events.map(({ id, type, state, description, start, end }) => (
                                <TableRow key={id}>
                                    {/* <TableCell padding="checkbox">
                                        <Checkbox
                                            // indeterminate={numSelected > 0 && numSelected < rowCount}
                                            // checked={rowCount > 0 && numSelected === rowCount}
                                            // onChange={onSelectAllClick}
                                            inputProps={{ 'aria-label': 'select all desserts' }}
                                        />
                                    </TableCell> */}
                                    <TableCell component="th" scope="row">
                                        {this.handleRetrieveEventTypeName(type)}
                                    </TableCell>
                                    <TableCell>{start && moment(start).format('DD/MM/YYYY HH:mm:ss')}</TableCell>
                                    <TableCell>{end ? moment(end).format('DD/MM/YYYY HH:mm:ss') : 'in progress'}</TableCell>
                                    <TableCell>{this.handleCalculateTimeDifference(start, end)}</TableCell>
                                    <TableCell>{description}</TableCell>
                                    <TableCell>
                                        <Typography className={classes.success}>
                                            {this.handleRetrieveEventStateName(state)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {/* <ActionButtons/> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box mt={2}><Feedback config={feedback} /></Box>
            </Box>
        </>
    }
}

Events.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(useStyles)(Events)