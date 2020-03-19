import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import './Calendar.sass'
import {
    Paper,
    makeStyles,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@material-ui/core'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import CalendarDialog from './CalendarDialog'

// const useStyles = makeStyles(theme => ({
//     content: {
//         flexGrow: 1,
//         padding: theme.spacing(2),
//     },
// }))

export default class Calendar extends React.Component {
    constructor(props) {
        super(props)

        this.state = { openAddEventDialog: false }
    }

    classes = {} //useStyles()
    // [eventDates, setEventDates] = useState({ start: undefined, end: undefined })
    // [openAddEventDialog, setOpenAddEventDialog] = useState(false)

    legends = [
        { title: 'Working days', color: 'action' },
        { title: 'Public holidays', color: 'action' }
    ]

    handleOpenDialog = () => {
        this.setState({ openAddEventDialog: true }) //setOpenAddEventDialog(true)
        console.log('in here')
    }

    handleCloseDialog = () => {
        this.setState({ openAddEventDialog: false }) //setOpenAddEventDialog(false)
    }

    handleDateSelect = (info) => {
        console.log('selected ' + info.startStr + ' to ' + info.endStr)
        this.handleOpenDialog()
        try {

        } catch (error) {
            console.log(error)
        }
    }

    fullCalendarOpts = {
        defaultView: "dayGridMonth",
        height: "parent",
        selectable: true,
        selectMirror: true,
        selectOverlap: false,
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
        // dateClick:{(info) :> {,
        //     console.log('clicked ' + info.dateStr)
        // }}
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

    render() {
        return (
            <>
                <Paper className={this.classes.content} elevation={0}>
                    <FullCalendar {...this.fullCalendarOpts} />
                </Paper>

                <Paper className={this.classes.content} elevation={0}>
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

                <CalendarDialog openAddEventDialog={this.state.openAddEventDialog} handleCloseDialog={this.handleCloseDialog} />
            </>
        )
    }
}