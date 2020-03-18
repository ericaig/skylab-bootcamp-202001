import React, { useState, useEffect } from 'react'
import Alert from '@material-ui/lab/Alert'
import Collapse from '@material-ui/core/Collapse'

export default function ({ config: { message, severity, timeout = 3000, watch }, setFeedback: _setFeedback }) {
    const [feedback, setFeedback] = useState(undefined)
    const [feedBackSeverity, setFeedBackSeverity] = useState('success')
    let feedbackTimeout

    function unsetFeedback() {
        if (feedbackTimeout !== "undefined"){
            clearTimeout(feedbackTimeout)
        }
    }

    function handleFeedback(message, severity = 'success') {
        unsetFeedback()

        setFeedBackSeverity(severity)
        setFeedback(message)

        feedbackTimeout = setTimeout(() => {
            setFeedback()
            unsetFeedback()
            if (typeof _setFeedback === 'function') _setFeedback({ message: undefined, severity: undefined })
        }, timeout)
    }

    useEffect(() => {
        handleFeedback(message, severity)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch])

    return <Collapse in={!!feedback}>
        <Alert severity={feedBackSeverity}>
            {feedback}
        </Alert>
    </Collapse>
}