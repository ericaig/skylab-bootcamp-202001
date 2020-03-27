import React, { useState, useEffect } from 'react'
import IconButton from '@material-ui/core/IconButton'
import TimerIcon from '@material-ui/icons/Timer'
import TimerOffIcon from '@material-ui/icons/TimerOff'
import { Tooltip, Typography } from '@material-ui/core'

export default function () {
    const [timerRunning, setTimerRunning] = useState(false)
    const [timerIconButtonTooltip, setTimerIconButtonTooltip] = useState('Sign in')
    const [timer, setTimer] = useState({ hour: 0, minute: 0, second: 0 })
    const [timerId, setTimerId] = useState()

    // const timerId

    function clearTimer() {
        if (timerId !== 'undefined') clearInterval(timerId)
    }

    function handleSignInOut() {
        const _timerRunning = !timerRunning

        setTimerIconButtonTooltip(_timerRunning ? 'Sign out' : 'Sign in')
        setTimerRunning(_timerRunning)
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