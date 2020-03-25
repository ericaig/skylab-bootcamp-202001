import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Typography, Box, Link } from '@material-ui/core'

export default function FormDialog({ open, handleClose }) {
    const [email, setEmail] = React.useState('')

    function handleEmailChange({ target: { value: _email } }) {
        setEmail(_email)
    }

    function handleSendInvitationLink(){

    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{"Send invite link"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {"Please enter a valid email address to send an invite. You can also copy and send the below link to whomever."}

                        <Box mt={1}>
                            <Link href="https://material-ui.com/components/links/" onClick={(event) => event.preventDefault()}>
                                {"https://material-ui.com/components/links/"}
                            </Link>
                        </Box>

                        <Box mt={3}>
                            <Typography color="textSecondary" variant="subtitle2">
                                {"Note: all new registration using this link is automatically assigned the role of a 'Worker'"}
                            </Typography>
                        </Box>
                    </DialogContentText>
                    <TextField autoFocus margin="dense" value={email} onChange={handleEmailChange} label="Email Address" type="email" fullWidth />
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
