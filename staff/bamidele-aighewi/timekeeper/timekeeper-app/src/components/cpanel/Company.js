import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, Divider, Paper, Grid, Button, Link } from '@material-ui/core'
import AlternateEmailOutlinedIcon from '@material-ui/icons/AlternateEmailOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import BusinessIcon from '@material-ui/icons/Business';
import RoomIcon from '@material-ui/icons/Room';
import LanguageIcon from '@material-ui/icons/Language';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import SendInviteDialog from './SendInviteDialog'
import { context, companyRetrieve, companyUpdate } from '../../logic'
import moment from 'moment'

const API_URL = process.env.REACT_APP_API_URL

const useStyles = makeStyles(theme => ({
    card: {
        boxShadow: '0 0 14px 0 rgba(53,64,82,.05)',
        padding: theme.spacing(2),
        // width: 300
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    details: {
        // minHeight: 200
    },
    userIcon: {
        // width: 100
        width: theme.spacing(15),
        height: theme.spacing(15),
        backgroundColor: theme.palette.background.default
    },
    wrapSubtitleIcon: {
        verticalAlign: 'middle',
        display: 'inline-flex',
        fontSize: '14px',
        marginRight: theme.spacing(1),
    },
    marginRight: {
        marginRight: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
}))

export default function ({ handleSnackbar }) {
    const classes = useStyles()
    const [emailDialogOpen, setEmailDialogOpen] = useState(false)
    const [company, setCompany] = useState({})

    function handleToggleEmailInviteDialog(visibility) {
        setEmailDialogOpen(visibility)
    }

    const handleRetrieveCompany = async () => {
        try {
            const _company = await companyRetrieve()
            setCompany(_company)
        } catch ({ message }) {
            handleSnackbar(message, 'error')
        }
    }

    const handleRetrieveTime = (target) => {
        const value = company[target]
        if (!value) return
        return moment(value, 'HH:mm').toDate()
    }

    const handleInputChange = (event, target) => {
        if (['startTime', 'endTime'].includes(target)) {
            setCompany({ ...company, [target]: event })
            return
        }

        const value = event.target.value
        setCompany({ ...company, [target]: value })
    }

    const handleUpdateCompany = async () => {
        try {
            const _company = {}
            const fields = ['name', 'cif', 'email', 'city', 'postalCode', 'address', 'web', 'startTime', 'endTime']
            fields.forEach(field => {
                if(['startTime', 'endTime'].includes(field))
                    _company[field] = moment(company[field], 'HH:mm').format('HH:mm')
                else _company[field] = company[field]
            })

            await companyUpdate(_company)
            handleSnackbar('Company updated successfully', 'success')
        } catch ({ message }) {
            handleSnackbar(message, 'error')
        }
    }

    const handleInviteLink = () => `${API_URL}/invite/${company?.invite}`

    useEffect(() => {
        handleRetrieveCompany()
    }, [])

    return <>
        <Grid container spacing={6} direction="row" justify="space-between" alignItems="flex-start">
            <Grid item lg={4} md={6} sm={12} xs={12}>
                <Paper elevation={1} className={classes.card} variant="elevation">
                    <Grid className={classes.details} container direction="column" justify="space-between">
                        <Grid item>
                            <Grid container direction="row" justify="space-between" alignItems="flex-start">
                                <Grid item>
                                    <Typography variant="h4">
                                        {company?.name || "[Name goes here]"}
                                    </Typography>

                                    <Typography variant="caption" color="textSecondary" component="div" gutterBottom>
                                        <AlternateEmailOutlinedIcon className={classes.wrapSubtitleIcon} />{company?.email || "[E-mail goes here]"}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" component="div">
                                        <LocalOfferIcon className={classes.wrapSubtitleIcon} />{company?.cif || "[CIF goes here]"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Box mt={3}>
                                <Typography variant="body1" component="h6">
                                    {(company?.owner && `${company?.owner.name} ${company?.owner.surname}`) || "[Owner's name goes here]"}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                <Box mt={3}>
                    <Paper elevation={1} className={classes.card} variant="elevation">
                        <Grid className={classes.details} container direction="column" justify="space-between">
                            <Grid item>
                                <Box mb={2}>
                                    <Typography variant="h5" component="h6">
                                        <Grid container spacing={6} direction="row" justify="space-between">
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                {"Invite link"}
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12} style={{ textAlign: 'right' }}>
                                                <Button color="primary" onClick={() => handleToggleEmailInviteDialog(true)}>
                                                    {"Invite"}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Typography>
                                    <SendInviteDialog handleSnackbar={handleSnackbar} company={context.company} open={emailDialogOpen} handleClose={() => handleToggleEmailInviteDialog(false)} />
                                </Box>
                                <Typography variant="body1" component="h6">
                                    <Link href={handleInviteLink()} onClick={(event) => event.preventDefault()}>
                                        {handleInviteLink()}
                                    </Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </Grid>
            <Grid item lg={8} md={6} sm={12} xs={12}>
                <Paper elevation={1} className={classes.card} variant="elevation">
                    <Typography variant="h6" gutterBottom>
                        {"Company"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        {"You can start editing the following information"}
                    </Typography>
                    <Divider />

                    <Box mt={3}>
                        <Grid container spacing={2} direction="row" justify="space-between" alignItems="flex-start">
                            <Grid item lg={8} md={8} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={company?.name}
                                    onChange={(event) => { handleInputChange(event, 'name') }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><BusinessIcon color="disabled" /></InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    label="CIF"
                                    value={company?.cif}
                                    onChange={(event) => { handleInputChange(event, 'cif') }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><LocalOfferIcon color="disabled" /></InputAdornment>
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} direction="row" justify="space-between" alignItems="flex-start">
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    label="E-Mail"
                                    type="email"
                                    value={company?.email}
                                    onChange={(event) => { handleInputChange(event, 'email') }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><AlternateEmailIcon color="disabled" /></InputAdornment>
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} direction="row" justify="space-between" alignItems="flex-start">
                            <Grid item lg={8} md={8} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={company?.city}
                                    onChange={(event) => { handleInputChange(event, 'city') }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><LocationCityIcon color="disabled" /></InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    label="Postal code"
                                    value={company?.postalCode}
                                    onChange={(event) => { handleInputChange(event, 'postalCode') }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><LocalOfferIcon color="disabled" /></InputAdornment>
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} direction="row" justify="space-between" alignItems="flex-start">
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    value={company?.address}
                                    onChange={(event) => { handleInputChange(event, 'address') }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><RoomIcon color="disabled" /></InputAdornment>
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} direction="row" justify="space-between" alignItems="flex-start">
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    label="Web address"
                                    value={company?.web}
                                    onChange={(event) => { handleInputChange(event, 'web') }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><LanguageIcon color="disabled" /></InputAdornment>
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} direction="row" justify="space-between" alignItems="flex-start">
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardTimePicker
                                        margin="normal"
                                        label="Start time"
                                        value={handleRetrieveTime('startTime')}
                                        onChange={(event) => { handleInputChange(event, 'startTime') }}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardTimePicker
                                        margin="normal"
                                        label="End time"
                                        value={handleRetrieveTime('endTime')}
                                        onChange={(event) => { handleInputChange(event, 'endTime') }}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>

                        <Box mt={3}><Divider /></Box>
                        <Box mt={2}>
                            <Grid container spacing={2} direction="row" justify="flex-end">
                                <Grid item>
                                    <Button onClick={handleUpdateCompany} variant="contained" color="primary" disableElevation>
                                        {"Save"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    </>
}