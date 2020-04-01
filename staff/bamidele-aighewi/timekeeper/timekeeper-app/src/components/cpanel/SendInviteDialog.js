import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Typography, Box, Link } from '@material-ui/core'
import { sendInviteLink } from '../../logic'
import Feedback from '../Feedback'
import LinearProgress from '@material-ui/core/LinearProgress';

const APP_URL = process.env.REACT_APP_APP_URL


export default function FormDialog({ open, handleClose, company, handleSnackbar }) {
    const [email, setEmail] = useState('')
    const [showLinearProgress, setShowLinearProgress] = useState(false)
    const [feedback, setFeedback] = useState({ message: undefined, severity: undefined, watch: undefined })

    function handleEmailChange({ target: { value: _email } }) {
        setEmail(_email)
    }

    async function handleSendInvitationLink() {
        try {
            setShowLinearProgress(true)
            await sendInviteLink([email])
            handleSnackbar('Invite link sent successfully', 'success')
            handleClose()
            setShowLinearProgress(false)
        } catch ({ message }) {
            setShowLinearProgress(false)
            setFeedback({ message, severity: 'error', watch: Date.now() })
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle>{"Send invite link"}</DialogTitle>
                <DialogContent>
                    {showLinearProgress && <LinearProgress />}
                    <DialogContentText>
                        {"Please enter a valid email address to send an invite. You can also copy and send the below link to whomever."}

                        <Box mt={1}>
                            {company && <Link href={`${APP_URL}/invite/${company.invite}`} onClick={(event) => event.preventDefault()}>
                                {`${APP_URL}/invite/${company.invite}`}
                            </Link>}
                        </Box>

                        <Box mt={3}>
                            <Typography color="textSecondary" variant="subtitle2">
                                {"Note: all new registration using this link is automatically assigned the role of a 'Worker'"}
                            </Typography>
                        </Box>
                    </DialogContentText>
                    <TextField autoFocus margin="dense" value={email} onChange={handleEmailChange} label="Email Address" type="email" fullWidth />

                    <Feedback config={feedback} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {"Cancel"}
                    </Button>
                    <Button onClick={handleSendInvitationLink} color="primary">
                        {"Send invite"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
