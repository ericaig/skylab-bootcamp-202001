import React, { useState, useEffect, useRef } from 'react'
import Alert from '@material-ui/lab/Alert'
import Collapse from '@material-ui/core/Collapse'

export default function ({ config: { message, severity, timeout = 5000, watch }, setFeedback: _setFeedback }) {
    const [feedback, setFeedback] = useState(undefined)
    const [feedBackSeverity, setFeedBackSeverity] = useState('success')
    let feedbackTimeout = useRef()

    function unsetFeedback() {
        clearTimeout(feedbackTimeout.current)
        // if (feedbackTimeout.current !== "undefined"){}
    }

    function handleFeedback(message, severity = 'success') {
        unsetFeedback()

        setFeedBackSeverity(severity)
        setFeedback(message)

        feedbackTimeout.current = setTimeout(() => {
            setFeedback()
            unsetFeedback()
            if (typeof _setFeedback === 'function') _setFeedback({ message: undefined, severity: undefined })
        }, timeout)
    }

    useEffect(() => {
        handleFeedback(message, severity)
        return () => {
            unsetFeedback()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch])

    return <Collapse in={!!feedback}>
        <Alert severity={feedBackSeverity}>
            {feedback}
        </Alert>
    </Collapse>
}