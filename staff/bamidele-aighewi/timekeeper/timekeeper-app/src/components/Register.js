import React, { useState, forwardRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { clientCompanyCreate } from '../logic'
import { userCreateValidate, companyCreateValidate } from '../utils'
import Feedback from './Feedback'
import Tooltip from '@material-ui/core/Tooltip';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withRouter } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.grey[0], //theme.palette.secondary,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default withRouter(function ({ history }) {
    const classes = useStyles()
    const [activeStep, setActiveStep] = useState(0)
    const [values, setValues] = useState({
        showPassword: false,
        companyEmailLabelShrink: false,
        openDialog: false,
        client: {},
        company: {}
    })

    const Transition = forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const [feedback, setFeedback] = useState({ message: undefined, severity: undefined, watch: undefined })

    function handleClickShowPassword() {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    function handleMouseDownPassword(event) {
        event.preventDefault();
    };

    function handleDialogVisibility(visibility) {
        setValues({ ...values, openDialog: visibility })
    }

    async function handleCreateAccount() {
        try {
            await clientCompanyCreate(values.client, values.company)
            history.push('/login')
            // setFeedback({ message: "Client and company created", severity: 'success', watch: Date.now() })
        } catch ({ message: _message }) {
            setFeedback({ message: _message, severity: 'error', timeout: 10000, watch: Date.now() })
        }
        handleDialogVisibility(false)
    }

    function handleClientSubmit(event) {
        try {
            event.preventDefault()
            const {
                target: {
                    name: { value: name },
                    surname: { value: surname },
                    email: { value: email },
                    password: { value: password },
                }
            } = event

            const client = { name, surname, email, password }

            userCreateValidate(...Object.values(client))
            
            setValues({ ...values, client });
            setActiveStep(1)
        } catch ({ message: _message }) {
            setFeedback({ message: _message, severity: 'warning', watch: Date.now() })
        }
    }

    function copyClientEmail() {
        const companyEmail = document.getElementById('companyEmail')
        setValues({ ...values, companyEmailLabelShrink: true })
        companyEmail.value = values.client.email
    }

    function handleCompanySubmit(event) {
        try {
            event.preventDefault()
            const {
                target: {
                    companyName: { value: name },
                    cif: { value: cif },
                    companyEmail: { value: email },
                    web: { value: web },
                    address: { value: address },
                    city: { value: city },
                    postalCode: { value: postalCode },
                }
            } = event

            const company = { name, cif, email, web, address, city, postalCode }
            console.log(company)

            companyCreateValidate(...Object.values(company))
            
            setValues({ ...values, company, openDialog: true });
            // handleDialogVisibility(true)
        } catch ({ message: _message }) {
            setFeedback({ message: _message, severity: 'warning', watch: Date.now() })
        }
    }

    return (
        <Container maxWidth="lg">
            <Stepper activeStep={activeStep} alternativeLabel>
                <Step>
                    <StepLabel>{"Client details"}</StepLabel>
                </Step>
                <Step>
                    <StepLabel>{"Company information"}</StepLabel>
                </Step>
            </Stepper>

            <Container component="section" maxWidth="xs">
                <Box mb={8} color="text.primary">
                    <div className={classes.paper}>
                        {activeStep === 0 &&
                            <>
                                <Typography component="h1" variant="h6">{"Enter client's details"}</Typography>
                                <form onSubmit={handleClientSubmit} className={classes.form} noValidate>
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
                                    <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />

                                    <Feedback config={feedback} setFeedback={setFeedback} />

                                    <Button type="submit" fullWidth variant="contained" size="large" color="primary" className={classes.submit}>
                                        {"Next"}
                                    </Button>
                                    <Grid container>
                                        <Grid item xs>
                                            <Link href="/" variant="body2">
                                                {"Forgot password?"}
                                            </Link>
                                        </Grid>
                                        <Grid item>
                                            <Link href="/login" variant="body2">
                                                {"Already have an account? Sign in"}
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </form>
                            </>
                        }

                        {activeStep === 1 &&
                            <>
                                <Tooltip title="Go back">
                                    <Avatar className={classes.avatar} onClick={() => setActiveStep(0)}>
                                        <ArrowBackIcon />
                                    </Avatar>
                                </Tooltip>
                                <Typography component="h1" variant="h6">{"Enter company's details"}</Typography>
                                <form onSubmit={handleCompanySubmit} className={classes.form} noValidate>
                                    <TextField defaultValue="Timekeeper Coorp." size="small" variant="outlined" margin="normal" required fullWidth id="companyName" label="Name" name="companyName" autoFocus />
                                    <TextField defaultValue="A89075451" size="small" variant="outlined" margin="normal" required fullWidth id="cif" label="CIF" name="cif" />
                                    <TextField
                                        InputLabelProps={{
                                            shrink: values.companyEmailLabelShrink,
                                        }}
                                        size="small" variant="outlined" margin="normal" required fullWidth id="companyEmail" label="Email Address" name="companyEmail" autoComplete="email" />
                                    <FormControlLabel control={<Checkbox onChange={copyClientEmail} color="primary" />} label="Same as my personal email" />

                                    <TextField defaultValue="http://ericaig.com" size="small" variant="outlined" margin="normal" fullWidth id="web" label="Home page URL" name="web" />
                                    <TextField defaultValue="C/ Sant Jordi" size="small" variant="outlined" margin="normal" fullWidth id="address" label="Address" name="address" />
                                    <TextField defaultValue="Manlleu" size="small" variant="outlined" margin="normal" required fullWidth id="city" label="City" name="city" />
                                    <TextField defaultValue="08560" size="small" variant="outlined" margin="normal" required fullWidth id="postalCode" label="Postal Code" name="postalCode" />

                                    <Feedback config={feedback} />

                                    <Button type="submit" fullWidth variant="contained" size="large" color="primary" className={classes.submit}>
                                        {"Continue"}
                                    </Button>
                                    <Grid container>
                                        <Grid item xs>
                                            <Link href="/" variant="body2">
                                                {"Forgot password?"}
                                            </Link>
                                        </Grid>
                                        <Grid item>
                                            <Link href="/login" variant="body2">
                                                {"Already have an account? Sign in"}
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </form>
                            </>
                        }
                    </div>
                </Box>
            </Container>

            <Dialog
                open={values.openDialog}
                TransitionComponent={Transition}
                onClose={() => handleDialogVisibility(false)}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Confirm"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {"Are you sure you want to proceed on creating a new account?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDialogVisibility(false)} color="primary">
                        {"Close"}
                    </Button>
                    <Button onClick={handleCreateAccount} color="primary">
                        {"Create account"}
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
})