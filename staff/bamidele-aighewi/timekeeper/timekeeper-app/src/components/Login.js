import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { withRouter } from 'react-router-dom'
import { login, retrieveUser } from '../logic'
import Feedback from './Feedback'

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))

export default withRouter(function ({ history }) {
    // const [state, setState] = useContext(Context)
    const classes = useStyles()
    const [feedback, setFeedback] = useState({ message: undefined, severity: undefined, watch: undefined })

    async function handleSubmit(event) {
        event.preventDefault()

        const { target: {
            email: { value: email },
            password: { value: password }
        } } = event

        try {
            await login(email, password)
            const { role } = await retrieveUser()

            if ([2, 3].includes(role))
                history.push('/cpanel')
            else
                history.push('/cpanel/signings')
        } catch ({ message }) {
            setFeedback({ message, severity: 'error', timeout: 10000, watch: Date.now() })
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box mb={8} color="text.primary">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">Sign in</Typography>
                    <form onSubmit={handleSubmit} className={classes.form} noValidate>
                        <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
                        <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
                        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />

                        <Feedback config={feedback} />

                        <Button type="submit" fullWidth variant="contained" size="large" color="primary" className={classes.submit}>
                            {"Sign In"}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/" variant="body2">
                                    {"Forgot password?"}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Box>
        </Container>
    )
})