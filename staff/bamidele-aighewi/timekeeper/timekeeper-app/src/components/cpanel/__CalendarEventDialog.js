import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions} from '@material-ui/core'
import moment from 'moment'
import Feedback from '../Feedback'

const useStyles = theme => ({
    chip: {
        margin: theme.spacing(0.5),
    }
})

class CalendarEventDialog extends React.Component {

    handleDateChange = (__start, __end) => {
        this.setState({
            start: new Date(__start),
            end: new Date(__end),
        }, this.handleCalculateDaysOfRange)
    }

    handleChangeEventType = event => {
        this.setState({ eventType: event.target.value, openEventType: false })
    }
    handleOpenEventType = () => this.setState({ openEventType: true })
    handleCloseopenEventType = () => this.setState({ openEventType: false })

    handleCalculateDaysOfRange = () => {
        if (!this.state.start || !this.state.end) return

        // const _start = moment(start + '00:00', 'YYYY-MM-DD HH:mm')
        // let _end = moment(end + '23:59', 'YYYY-MM-DD HH:mm')
        const __start = moment(this.state.start, 'YYYY-MM-DD')
        let __end = moment(this.state.end, 'YYYY-MM-DD')
        let difference = moment(__end).diff(__start, 'days') //+ 1

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
        const { start, end, eventType, description } = this.state
        
        try {
            const _start = moment(start).format('YYYY-MM-DD')
            const _end = moment(end).format('YYYY-MM-DD')

            await this.props.handleSaveEvent(_start, _end, eventType, description)
            // this.setState({ feedback: { message: "Created event successfully", severity: 'success', watch: Date.now() } })
        } catch ({ message }) {
            this.setState({ feedback: { message, severity: 'error', watch: Date.now() } })
        }
    }

    UNSAFE_componentWillReceiveProps() {
        const { start: startDate, end: endDate } = this.props.selectedDates

        if (startDate && endDate) {
            this.setState({
                start: new Date(startDate), end: new Date(endDate)
            }, this.handleCalculateDaysOfRange)
        }
    }

    render() {
        // const { start, end, totalDaysSelected, eventType, description, feedback } = this.state
        const { openDialog, handleCloseDialog } = this.props
        return <>
            <Dialog onClose={handleCloseDialog} aria-labelledby="customized-dialog-title" open={openDialog}>
                <DialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
                    {"Event"}
                </DialogTitle>
                <DialogContent dividers>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        {"Close"}
                    </Button>
                    <Button onClick={this.handleSaveEvent} color="primary">
                        {"Delete this event"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    }
}

CalendarEventDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(CalendarEventDialog)