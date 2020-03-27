import React, { useState, useEffect } from 'react'
import IconButton from '@material-ui/core/IconButton'
import TimerIcon from '@material-ui/icons/Timer'
import TimerOffIcon from '@material-ui/icons/TimerOff'
import { Tooltip, Typography } from '@material-ui/core'
import { eventsRetrieve, eventSignInOut } from '../../logic'
import moment from 'moment'

export default function () {
    const [timerRunning, setTimerRunning] = useState(false)
    const [timerIconButtonTooltip, setTimerIconButtonTooltip] = useState('Sign in')
    const [timer, setTimer] = useState({ hour: 0, minute: 0, second: 0 })
    const [timerId, setTimerId] = useState()

    // const timerId

    function clearTimer() {
        if (timerId !== 'undefined') clearInterval(timerId)
    }

    function handleToggleSignInOutProcess() {
        const _timerRunning = !timerRunning

        setTimerIconButtonTooltip(_timerRunning ? 'Sign out' : 'Sign in')
        setTimerRunning(_timerRunning)

        if (!_timerRunning) setTimer({ hour: 0, minute: 0, second: 0 })
    }

    async function handleSignInOut() {
        try {
            await eventSignInOut()
            handleToggleSignInOutProcess()
        } catch ({message}) {
            console.log(message)
        }
    }

    function handleStartTimer() {
        setTimer({ ...timer, second: timer.second + 1 })
        updateMinutes()
    }

    function updateMinutes() {
        if (timer.second === 59) {
            setTimer({ ...timer, second: 0, minute: timer.minute + 1 })
            updateHours()
        }
    }

    function updateHours() {
        if (timer.minute === 59) {
            setTimer({ ...timer, minute: 0, hour: timer.hour + 1 })
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const [event] = await eventsRetrieve({
                    start: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                    type: [5]
                })
                
                if(!('end' in event)){
                    const start = moment(event.start)
                    const end = moment()
                    const duration = moment.duration(end.diff(start))
                    setTimer({hour: duration.hours(), minute: duration.minutes(), second: duration.seconds()})
                    handleToggleSignInOutProcess()
                }
            } catch ({ message }) {
                console.log(message)
            }
        })()
        console.log('first useeffect')
    }, [])

    useEffect(() => {
        clearTimer()
        if (timerRunning) setTimerId(setInterval(handleStartTimer, 1000))

        return () => {
            clearTimer()
        }

    }, [timerRunning, timer])

    return <>
        {timerRunning && <Typography>
            {timer.hour < 10 ? 0 : ''}{timer.hour}:
            {timer.minute < 10 ? 0 : ''}{timer.minute}:
            {timer.second < 10 ? 0 : ''}{timer.second}
        </Typography>}
        <Tooltip title={timerIconButtonTooltip}>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleSignInOut}
                color="inherit"
            >
                {!timerRunning ? <TimerIcon /> : <TimerOffIcon />}
            </IconButton>
        </Tooltip>
    </>
}