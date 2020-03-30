import React, { useState, useEffect } from 'react'
import clsx from 'clsx';
import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Avatar, Box, Divider, Paper, Grid, Chip, Button, Tooltip, Backdrop, CircularProgress, FormHelperText } from '@material-ui/core'
import AlternateEmailOutlinedIcon from '@material-ui/icons/AlternateEmailOutlined';
import CategoryOutlinedIcon from '@material-ui/icons/CategoryOutlined';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from "react-router-dom";
import { retrieveUser, updateUser } from "../../logic";
import { userProperties } from "../../utils";


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
    let { id: userID } = useParams();
    const classes = useStyles()
    let history = useHistory();
    const [values, setValues] = useState({
        showOldPassword: false,
        showPassword: false,
    });

    const [user, setUser] = useState({})

    const handleShowOldPassword = () => setValues({ ...values, showOldPassword: !values.showOldPassword })
    const handleMouseDownOldPassword = event => event.preventDefault()
    const handleShowPassword = () => setValues({ ...values, showPassword: !values.showPassword })
    const handleMouseDownPassword = event => event.preventDefault()

    const handleRetrieveUser = async () => {
        try {
            const _user = await retrieveUser(userID)
            setUser(_user)
        } catch ({ message }) {
            handleSnackbar(message, 'error')
        }
    }

    const handleUpdateUser = async (goBack = false) => {
        try {
            const _user = {}
            const fields = ['name', 'surname', 'email', 'role', 'oldPassword', 'password']
            fields.forEach(field => _user[field] = user[field])

            if (!_user.oldPassword) delete _user.oldPassword
            if (!_user.password) delete _user.password

            console.log('TO UPDATE', _user)

            await updateUser(_user, userID)
            handleSnackbar('User updated successfully', 'success')

            if (goBack) history.goBack()
        } catch ({ message }) {
            handleSnackbar(message, 'error')
        }
    }

    const handleInputChange = prop => event => setUser({ ...user, [prop]: event.target.value })

    useEffect(() => {
        handleRetrieveUser()
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
                                        {(user?.name && `${user?.name} ${user?.surname}`) || "[Name goes here]"}
                                    </Typography>

                                    <Typography variant="caption" color="textSecondary" component="div" gutterBottom>
                                        <AlternateEmailOutlinedIcon className={classes.wrapSubtitleIcon} />{user?.email || "[E-mail goes here]"}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" component="div">
                                        <CategoryOutlinedIcon className={classes.wrapSubtitleIcon} />{userProperties.roles.names[user?.role - 1] || "[Role goes here]"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* <Grid item>
                            <Box mt={3}>
                                <Typography variant="body1" component="h6">
                                    {"[Company's name goes here]"}
                                </Typography>
                            </Box>
                        </Grid> */}
                    </Grid>
                </Paper>
            </Grid>
            <Grid item lg={8} md={6} sm={12} xs={12}>
                <Paper elevation={1} className={classes.card} variant="elevation">
                    <Typography variant="h6" gutterBottom>
                        {"Profile"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        {"You can start editing the following information"}
                    </Typography>
                    <Divider />

                    <Box mt={3}>
                        <Grid container spacing={2} direction="row" justify="space-between" alignItems="flex-start">
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    value={user?.name}
                                    onChange={handleInputChange('name')}
                                    label="Name"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><AccountCircleIcon color="disabled" /></InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    value={user?.surname}
                                    onChange={handleInputChange('surname')}
                                    label="Surname"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"></InputAdornment>
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} direction="row" justify="space-between" alignItems="flex-start">
                            <Grid item lg={8} md={8} sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    value={user?.email}
                                    onChange={handleInputChange('email')}
                                    label="E-Mail"
                                    type="email"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><AlternateEmailIcon color="disabled" /></InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="user-role-label">{"Role"}</InputLabel>
                                    {user.role && <Select
                                        labelId="user-role-label"
                                        id="user-role"
                                        value={user.role}
                                        onChange={handleInputChange('role')}
                                        disabled={user.role === 2}
                                    >
                                        {/* <MenuItem value={0}>{"..."}</MenuItem> */}
                                        {/* <MenuItem value={1} disabled>{"Developer"}</MenuItem> */}
                                        <MenuItem value={2} disabled>{"Client"}</MenuItem>
                                        <MenuItem value={3}>{"Administrator"}</MenuItem>
                                        <MenuItem value={4}>{"Worker"}</MenuItem>
                                        {/* <MenuItem value={5} disabled>{"Co. Owner"}</MenuItem> */}
                                    </Select>}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} direction="row" justify="space-between" alignItems="flex-start">
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <FormControl
                                    fullWidth
                                //className={clsx(classes.margin, classes.textField)}
                                >
                                    <InputLabel htmlFor="oldPassword">{"Current password"}</InputLabel>
                                    <Input
                                        id="oldPassword"
                                        type={values.showOldPassword ? 'text' : 'password'}
                                        value={user.oldPassword}
                                        onChange={handleInputChange('oldPassword')}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleShowOldPassword}
                                                    onMouseDown={handleMouseDownOldPassword}
                                                >
                                                    {values.showOldPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <FormHelperText>{"Leave blank if you wish not to change password"}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <FormControl
                                    fullWidth
                                //className={clsx(classes.margin, classes.textField)}
                                >
                                    <InputLabel htmlFor="password">{"New password"}</InputLabel>
                                    <Input
                                        id="password"
                                        type={values.showPassword ? 'text' : 'password'}
                                        value={user.password}
                                        onChange={handleInputChange('password')}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Box mt={3}><Divider /></Box>
                        <Box mt={2}>
                            <Grid container spacing={2} direction="row" justify="flex-end">
                                <Grid item>
                                    <Button onClick={() => { handleUpdateUser() }} style={{ marginRight: 10 }} variant="contained" color="primary" disableElevation>
                                        {"Save"}
                                    </Button>
                                    <Button onClick={() => { handleUpdateUser(true) }} variant="contained" color="primary" disableElevation>
                                        {"Save & Go back"}
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