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
import { weekDaysRetrieve } from '../../logic'
import moment from 'moment'

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
        weekDays: { monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false },
        feedback: { message: undefined, severity: undefined, watch: undefined }
    }

    legends = [
        { title: 'Working days', color: 'action' },
        { title: 'Public holidays', color: 'action' }
    ]

    handleOpenDialog = () => this.setState({ openAddEventDialog: true })
    handleCloseDialog = () => this.setState({ openAddEventDialog: false })
    handleDateSelect = ({ startStr: start, endStr: end }) => {
        const _end = moment(end, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD')
        this.setState({ selectedDates: { start, end: _end } })
        this.handleOpenDialog()
    }

    handleRetrieveWeekDays = async () => {
        try {
            const _weekDays = await weekDaysRetrieve()
            const weekDays = {}
            Object.keys(this.state.weekDays).forEach(day => weekDays[day] = _weekDays[day])
            this.setState({ weekDays })
        } catch ({ message }) {
            this.setState({ feedback: { message, severity: 'error', watch: Date.now() } })
        }
    }

    fullCalendarOpts = {
        defaultView: "dayGridMonth",
        height: "parent",
        selectable: true,
        selectMirror: true,
        // selectOverlap: false,
        header: {
            // left: 'prev,next today',
            left: '',
            center: 'title',
            // right: 'dayGridMonth,timeGridWeek'
        },
        businessHours: {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '10:00',
            endTime: '18:00',
        },
        // dateClick: (info) => {
        //     console.log('clicked ', info.dateStr)
        //     console.log('info ', info)
        // },
        select: this.handleDateSelect,
        editable: true,
        // eventDragMinDistance
        firstDay: 1,
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
        events: [
            { title: 'event 1', start: '2020-03-16 10:00:00', end: '2020-03-16 12:00:00' },
            { title: 'event 2', start: '2020-03-19' }
        ]
    }

    componentDidMount() {
        this.handleRetrieveWeekDays()
    }

    render() {
        const { classes } = this.props;
        const { selectedDates, openAddEventDialog, weekDays } = this.state

        return (
            <>
                <Paper className={classes.content} elevation={0}>
                    <FullCalendar {...this.fullCalendarOpts} />
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

                <CalendarDialog selectedDates={selectedDates} weekDays={weekDays} openAddEventDialog={openAddEventDialog} handleCloseDialog={this.handleCloseDialog} />
            </>
        )
    }
}

Calendar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Calendar)