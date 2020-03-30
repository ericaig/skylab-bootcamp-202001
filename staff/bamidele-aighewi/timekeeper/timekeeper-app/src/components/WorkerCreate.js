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
import { workerRegister } from '../logic'
import Feedback from './Feedback'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useParams } from "react-router-dom";

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
    let { token } = useParams();
    const classes = useStyles()
    const [feedback, setFeedback] = useState({ message: undefined, severity: undefined, watch: undefined })
    const [values, setValues] = useState({ showPassword: false })

    function handleClickShowPassword() {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    function handleMouseDownPassword(event) {
        event.preventDefault();
    };

    async function handleSubmit(event) {
        try {
            event.preventDefault()

            const { target: {
                name: { value: name },
                surname: { value: surname },
                email: { value: email },
                password: { value: password }
            } } = event

            await workerRegister(token, name, surname, email, password)

            history.push('/login')
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
                    <Typography component="h1" variant="h5">Register</Typography>
                    <form onSubmit={handleSubmit} className={classes.form} noValidate>
                        <TextField defaultValue="Eric" size="small" variant="outlined" margin="normal" required fullWidth id="name" label="Name" name="name" autoFocus />
                        <TextField defaultValue="Aig" size="small" variant="outlined" margin="normal" required fullWidth id="surname" label="Surname" name="surname" />
                        <TextField defaultValue="eric@aig.com" size="small" variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
                        <FormControl size="small" variant="outlined" margin="normal" required fullWidth>
                            <InputLabel htmlFor="password">{"Password"}</InputLabel>
                            <OutlinedInput
                                id="password"
                                name="password"
                                defaultValue="123"
                                type={values.showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                labelWidth={80}
                            />
                        </FormControl>

                        <Feedback config={feedback} />

                        <Button type="submit" fullWidth variant="contained" size="large" color="primary" className={classes.submit}>
                            {"Register"}
                        </Button>
                        {/* <Grid container>
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
                        </Grid> */}
                    </form>
                </div>
            </Box>
        </Container>
    )
})