import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Button, Paper, Box, TextField, IconButton, Tooltip } from '@material-ui/core'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import RefreshIcon from '@material-ui/icons/Refresh';
import { eventsRetrieve, eventSignInOut } from '../../logic'
import { eventProperties } from '../../utils'
import Feedback from '../Feedback'
import moment from 'moment'

const useStyles = theme => ({
    table: {
        minWidth: 650,
    },
    buttonRm: {
        marginRight: theme.spacing(2),
    }
})

class Events extends React.Component {
    state = {
        events: [],
        feedback: { message: undefined, severity: undefined, watch: undefined }
    }

    handleRetrieveEventTypeName = type => eventProperties.types.names[type - 1]
    handleRetrieveEventStateName = state => eventProperties.states.names[state - 1]

    handleRetrieveEvents = async () => {
        try {
            const events = await eventsRetrieve()
            console.log(events)
            this.setState({ events })
        } catch ({ message }) {
            this.setState({ feedback: { message, severity: 'error', watch: Date.now() } })
        }
    }

    componentDidMount() {
        this.handleRetrieveEvents()
    }

    render() {
        const { classes } = this.props
        const { feedback, events } = this.state

        return <>
            <Grid
                container
                direction="row"
                justify="space-between"
            // alignItems="center"
            >
                <div>
                    <TextField id="standard-basic" label="Standard" />
                </div>
                <div>
                    <Tooltip title="Refresh">
                        <IconButton color="primary" aria-label="Refresh" onClick={this.handleRetrieveEvents}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Add event">
                        <IconButton color="primary" aria-label="Refresh" onClick={this.handleRetrieveEvents}>
                            <AddAlarmIcon />
                        </IconButton>
                    </Tooltip>
                    {/* <Button color="primary" disableElevation className={classes.buttonRm} endIcon={<AddAlarmIcon />}>{"Add Event"}</Button>
                    <Button color="primary" disableElevation endIcon={<SettingsBackupRestoreIcon />}>{"Sign in / out"}</Button> */}
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
                                <TableCell>{"Note"}</TableCell>
                                <TableCell>{"State"}</TableCell>
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
                                    <TableCell>{moment(start).format('DD/MM/YYYY HH:mm')}</TableCell>
                                    <TableCell>{moment(end).format('DD/MM/YYYY HH:mm')}</TableCell>
                                    <TableCell>{description}</TableCell>
                                    <TableCell>{this.handleRetrieveEventStateName(state)}</TableCell>
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