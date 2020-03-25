import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import './Calendar.sass'
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import CalendarDialog from './CalendarDialog'
import { weekDaysRetrieve, eventCompanyCreate, eventCompanyRetrieve } from '../../logic'
import moment from 'moment'
//const { utils: { eventTypes } } = require('timekeeper-data')

const styles = theme => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(2),
    },
})

class Calendar extends React.Component {
    state = {
        openAddEventDialog: false,
        selectedDates: {
            start: '',
            end: ''
        },
        events: [],
        weekDays: { monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false },
        weekDaysInNumber: [],
        feedback: { message: undefined, severity: undefined, watch: undefined },
        // eventPopoverConfig: { id: null, open: false, content: '', targetElement: null }
    }

    legends = [
        { title: 'Working days', color: 'action' },
        { title: 'Public holidays', color: 'action' }
    ]

    fullCalendarOpts = () => {
        return {
            defaultView: "dayGridMonth",
            height: "parent",
            selectable: true,
            // eventLimit: true,
            // selectMirror: true,
            // selectOverlap: false,
            // eventOverlap: !false,
            header: {
                // left: 'prev,next today',
                left: '',
                center: 'title',
                // right: 'dayGridMonth,timeGridWeek'
            },
            // daysOfWeek: this.state.weekDaysInNumber,
            businessHours: {
                daysOfWeek: this.state.weekDaysInNumber,
                startTime: '08:00',
                endTime: '17:00',
            },
            select: this.handleDateSelect,
            editable: true,
            // eventDragMinDistance
            firstDay: 1,
            plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
            events: this.state.events,
            eventClick: this.handleEventClick,
            // eventRender: this.handleEventRender
        }
    }

    // handleCloseEventPopover = () => {
    //     this.setState({ eventPopoverConfig: { id: null, open: false, content: '', targetElement: null } })
    // }

    // handleEventRender = (info) => {
    //     this.setState({
    //         eventPopoverConfig: {
    //             id: info.id, open: true, content: 'POOPOVER...', targetElement: info.el
    //         }
    //     })
    // }

    // handleEventClick = ({ event: { start, end, id, title } }) => {
    //     console.log(start, end, id, title)
    // }

    handleOpenDialog = () => this.setState({ openAddEventDialog: true })
    handleCloseDialog = () => this.setState({ openAddEventDialog: false })
    handleDateSelect = ({ startStr: start, endStr: end }) => {
        const _end = moment(end, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD')
        this.setState({ selectedDates: { start, end: _end } })
        this.handleOpenDialog()
    }

    weekDaysInNumber() {
        this.setState({
            weekDaysInNumber: Object.entries(this.state.weekDays).map(([, value], index) => {
                if (value) return index + 1
            }).filter(val => val)
        })
    }

    handleRetrieveWeekDays = async () => {
        try {
            const _weekDays = await weekDaysRetrieve()
            const weekDays = {}
            Object.keys(this.state.weekDays).forEach(day => weekDays[day] = _weekDays[day])
            this.setState({ weekDays }, this.weekDaysInNumber)
        } catch ({ message }) {
            this.setState({ feedback: { message, severity: 'error', watch: Date.now() } })
        }
    }

    handleRetrieveEvents = async (start, end) => {
        if (!start || !end) return

        try {
            const startOfMonth = moment(start, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD')
            const endOfMonth = moment(start, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD')
            const events = await eventCompanyRetrieve(startOfMonth, endOfMonth)
            console.log(events)

            const fullCalendarEvents = events.map(({ id, description: title, start, end, type, state }) => {
                const pendingModifier = state === 1 ? '--pending' : ''

                return {
                    id,
                    title,
                    start: moment(start).format('YYYY-MM-DD'),
                    end: moment(end).add(1, 'days').format('YYYY-MM-DD'),
                    overlap: false,
                    // daysOfWeek: this.state.weekDaysInNumber,
                    // rendering: 'background',
                    // constraint: 'businessHours'
                    // color: type === 1 ? '#155724' : '#ff6666'
                    rendering: 'background',
                    color: type === 1 ? '#8fdf82' : '#ff9f89',
                    // classNames: [`${type === 1 ? `workingDay${pendingModifier}` : `publicHoliday${pendingModifier}`}`]
                }
            })

            // this.fullCalendarOpts.events = fullCalendarEvents
            this.setState({ events: fullCalendarEvents })
        } catch ({ message }) {
            this.setState({ feedback: { message, severity: 'error', watch: Date.now() } })
        }
    }

    handleSaveEvent = async (start, end, type, description) => {
        // not using try/catch on purpose... This will be done where this fnc is being invoked.
        await eventCompanyCreate(start, end, type, description)
        this.handleCloseDialog()
        this.handleRetrieveEvents(start, end)
    }

    componentDidMount() {
        const today = moment().format('YYYY-MM-DD')
            ; (async () => {
                await this.handleRetrieveWeekDays()
                this.handleRetrieveEvents(today, today)
            })()
    }

    render() {
        const { classes } = this.props;
        const { selectedDates, openAddEventDialog, weekDays, eventPopoverConfig } = this.state

        return (
            <>
                <Paper className={classes.content} elevation={0}>
                    <FullCalendar {...this.fullCalendarOpts()} />
                </Paper>

                <Paper className={classes.content} elevation={0}>
                    <Typography variant="h6">Legend</Typography>
                    <List>
                        {this.legends.map(({ color, title }, index) =>
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <FiberManualRecordIcon color={color} />
                                </ListItemIcon>
                                <ListItemText primary={title} />
                            </ListItem>
                        )}
                    </List>
                </Paper>

                {/* <Popover
                    id={eventPopoverConfig.id}
                    open={eventPopoverConfig.open}
                    anchorEl={eventPopoverConfig.targetElement}
                    onClose={this.handleCloseEventPopover}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <Typography className={classes.typography}>The content of the Popover.</Typography>
                </Popover> */}

                <CalendarDialog handleSaveEvent={this.handleSaveEvent} selectedDates={selectedDates} weekDays={weekDays} openAddEventDialog={openAddEventDialog} handleCloseDialog={this.handleCloseDialog} />
            </>
        )
    }
}

Calendar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Calendar)